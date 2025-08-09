from __future__ import annotations

import asyncio
import math
import os
from pathlib import Path
from typing import List, Dict, Any, Optional

import ffmpeg  # type: ignore
import whisper  # type: ignore
from pydub import AudioSegment  # type: ignore
from sqlalchemy import select
from sqlalchemy.sql import func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models.transcription import Transcription, TranscriptionStatus, TranscriptionSegment
from app.core.queue import get_queue


def _probe_duration(path: str) -> Optional[float]:
    """Obter duração do arquivo de áudio/vídeo."""
    try:
        probe = ffmpeg.probe(path)
        for s in probe.get("streams", []):
            if s.get("codec_type") in ("audio", "video") and s.get("duration"):
                return float(s["duration"])  # seconds
        fmt = probe.get("format", {})
        if fmt.get("duration"):
            return float(fmt["duration"])  # seconds
    except Exception:
        return None
    return None


def _choose_whisper_model(duration: Optional[float]) -> str:
    """Escolher modelo Whisper baseado na duração do áudio."""
    if not duration:
        return settings.WHISPER_MODEL or "base"
    
    # Otimização: modelos maiores para áudios longos (melhor qualidade)
    # modelos menores para áudios curtos (velocidade)
    if duration < 300:  # < 5 min
        return "tiny"
    elif duration < 900:  # < 15 min
        return "base" 
    elif duration < 1800:  # < 30 min
        return "small"
    elif duration < 3600:  # < 1h
        return "medium"
    else:  # >= 1h
        return "large"


def _chunk_audio_if_needed(file_path: str, max_chunk_minutes: Optional[int] = None) -> List[str]:
    """
    Dividir áudio em chunks se for muito longo.
    Retorna lista de paths dos chunks ou [file_path] se não precisar dividir.
    """
    if max_chunk_minutes is None:
        max_chunk_minutes = settings.MAX_CHUNK_MINUTES
        
    try:
        duration = _probe_duration(file_path)
        if not duration or duration <= (max_chunk_minutes * 60):
            return [file_path]
        
        # Dividir áudio em chunks de max_chunk_minutes
        audio = AudioSegment.from_file(file_path)
        chunk_length_ms = max_chunk_minutes * 60 * 1000
        
        chunks = []
        base_path = Path(file_path)
        chunk_dir = base_path.parent / f"chunks_{base_path.stem}"
        chunk_dir.mkdir(exist_ok=True)
        
        for i in range(0, len(audio), chunk_length_ms):
            chunk = audio[i:i + chunk_length_ms]
            chunk_path = chunk_dir / f"chunk_{i//chunk_length_ms:03d}.wav"
            chunk.export(chunk_path, format="wav")
            chunks.append(str(chunk_path))
        
        return chunks
        
    except Exception:
        # Se falhar ao dividir, usar arquivo original
        return [file_path]


def _cleanup_chunks(chunk_paths: List[str], original_path: str) -> None:
    """Limpar arquivos de chunk temporários."""
    if len(chunk_paths) <= 1:
        return
        
    try:
        # Remover chunks individuais
        for chunk_path in chunk_paths:
            if chunk_path != original_path and os.path.exists(chunk_path):
                os.remove(chunk_path)
        
        # Remover diretório de chunks se vazio
        if chunk_paths:
            chunk_dir = Path(chunk_paths[0]).parent
            if chunk_dir.exists() and chunk_dir.name.startswith("chunks_"):
                try:
                    chunk_dir.rmdir()
                except OSError:
                    pass  # Diretório não vazio
                    
    except Exception:
        pass  # Ignorar erros de limpeza


async def _run_pipeline(session: AsyncSession, transcription: Transcription) -> None:
    """Pipeline completo de transcrição com chunks e segmentos."""
    transcription.status = TranscriptionStatus.PROCESSING
    await session.flush()

    try:
        # 1. Obter duração e escolher modelo otimizado
        duration = _probe_duration(transcription.file_path)
        transcription.duration = duration
        await session.flush()

        model_name = _choose_whisper_model(duration)
        model = whisper.load_model(model_name, device=settings.WHISPER_DEVICE)
        
        # 2. Dividir áudio em chunks se necessário
        chunk_paths = _chunk_audio_if_needed(transcription.file_path)
        
        all_segments = []
        full_text_parts = []
        total_offset = 0.0  # Offset cumulativo para chunks
        
        # 3. Processar cada chunk
        for chunk_idx, chunk_path in enumerate(chunk_paths):
            # Configurações otimizadas para Whisper
            whisper_options = {
                "language": settings.TRANSCRIPTION_LANGUAGE,
                "word_timestamps": settings.ENABLE_WORD_TIMESTAMPS,
                "temperature": settings.WHISPER_TEMPERATURE,
                "verbose": False
            }
            
            # Transcrever chunk com segmentos detalhados
            chunk_result = model.transcribe(chunk_path, **whisper_options)
            
            chunk_text = chunk_result.get("text", "").strip()
            full_text_parts.append(chunk_text)
            
            # 4. Processar segmentos do chunk
            for segment_data in chunk_result.get("segments", []):
                # Ajustar timestamps com offset do chunk
                start_time = segment_data["start"] + total_offset
                end_time = segment_data["end"] + total_offset
                
                segment = TranscriptionSegment(
                    transcription_id=transcription.id,
                    start_time=start_time,
                    end_time=end_time,
                    text=segment_data["text"].strip(),
                    confidence=segment_data.get("no_speech_prob", 0.0),
                    speaker=f"Speaker_{segment_data.get('id', 0) % 5}"  # Rotação básica de speakers
                )
                all_segments.append(segment)
            
            # Atualizar offset para próximo chunk
            if len(chunk_paths) > 1:
                chunk_duration = _probe_duration(chunk_path)
                if chunk_duration:
                    total_offset += chunk_duration

        # 5. Salvar resultados no banco
        transcription.full_text = " ".join(full_text_parts).strip()
        
        # Salvar todos os segmentos de uma vez
        session.add_all(all_segments)
        await session.flush()
        
        # 6. Marcar como concluído
        transcription.status = TranscriptionStatus.COMPLETED
        transcription.completed_at = func.now()
        await session.flush()
        
        # 7. Limpeza de arquivos temporários
        _cleanup_chunks(chunk_paths, transcription.file_path)
        
    except Exception as e:
        # Em caso de erro, marcar como falhado
        transcription.status = TranscriptionStatus.FAILED
        await session.flush()
        
        # Limpeza de emergência
        if 'chunk_paths' in locals():
            _cleanup_chunks(chunk_paths, transcription.file_path)
        
        # Re-raise para logging no nível superior
        raise e


def run_transcription_background(transcription_id: int) -> None:
    """Sync wrapper to run the async pipeline in background tasks."""

    async def _runner() -> None:
        async with AsyncSessionLocal() as session:
            # Em testes, use DB em memória se DATABASE_URL apontar para sqlite
            # (AsyncSessionLocal já foi criado com settings.DATABASE_URL)
            result = await session.execute(select(Transcription).where(Transcription.id == transcription_id))
            transcription: Optional[Transcription] = result.scalar_one_or_none()
            if transcription is None:
                return
            try:
                await _run_pipeline(session, transcription)
                await session.commit()
            except Exception:
                transcription.status = TranscriptionStatus.FAILED
                await session.commit()

    asyncio.run(_runner())


def enqueue_transcription_job(transcription_id: int) -> str:
    """Enqueue job on Redis RQ; returns job id."""
    q = get_queue()
    job = q.enqueue(run_transcription_background, transcription_id)
    return job.id


