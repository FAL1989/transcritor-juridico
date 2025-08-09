from typing import Any, List, Optional
import os
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db
from app.models.transcription import Transcription, TranscriptionStatus, TranscriptionSegment
from app.api.auth import get_current_user
from app.schemas.auth import UserResponse
from app.schemas.transcription import TranscriptionResponse, TranscriptionSegmentResponse
from fastapi import BackgroundTasks
from app.services.transcription_pipeline import run_transcription_background, enqueue_transcription_job

router = APIRouter()


def _ensure_upload_dir() -> None:
    Path(settings.UPLOAD_PATH).mkdir(parents=True, exist_ok=True)


def _validate_extension(filename: str) -> None:
    ext = os.path.splitext(filename)[1].lower()
    if ext not in settings.ALLOWED_AUDIO_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Extensão de arquivo não suportada")


@router.post("/upload", response_model=TranscriptionResponse, status_code=201)
async def upload_transcription(
    background: BackgroundTasks,
    title: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
) -> Any:
    _ensure_upload_dir()

    _validate_extension(file.filename)

    # Basic size validation using SpooledTemporaryFile (if available)
    # Note: Max size enforced by server/proxy typically; we rely on settings for guidance

    dest_path = Path(settings.UPLOAD_PATH) / file.filename

    # Avoid overwrite by appending numeric suffix
    counter = 1
    base_name, ext = os.path.splitext(file.filename)
    while dest_path.exists():
        dest_path = Path(settings.UPLOAD_PATH) / f"{base_name}_{counter}{ext}"
        counter += 1

    # Save file to disk
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail="Arquivo excede o tamanho máximo permitido")

    with open(dest_path, "wb") as f:
        f.write(content)

    transcription = Transcription(
        title=title,
        original_filename=file.filename,
        file_path=str(dest_path),
        file_size=len(content),
        status=TranscriptionStatus.PENDING,
        language=settings.TRANSCRIPTION_LANGUAGE,
        user_id=int(current_user.id),
    )

    db.add(transcription)
    await db.flush()
    await db.refresh(transcription)

    # Kick off background transcription: prefer Redis RQ, fallback para BackgroundTasks
    try:
        enqueue_transcription_job(transcription.id)
    except Exception:
        background.add_task(run_transcription_background, transcription.id)

    return TranscriptionResponse.model_validate(transcription)


@router.get("/", response_model=List[TranscriptionResponse])
async def list_transcriptions(
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
) -> Any:
    result = await db.execute(
        select(Transcription).where(Transcription.user_id == int(current_user.id)).order_by(Transcription.id.desc())
    )
    items = result.scalars().all()
    return [TranscriptionResponse.model_validate(t) for t in items]


@router.get("/{transcription_id}", response_model=TranscriptionResponse)
async def get_transcription(
    transcription_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
) -> Any:
    result = await db.execute(select(Transcription).where(Transcription.id == transcription_id))
    transcription: Optional[Transcription] = result.scalar_one_or_none()
    if transcription is None or transcription.user_id != int(current_user.id):
        raise HTTPException(status_code=404, detail="Transcrição não encontrada")
    return TranscriptionResponse.model_validate(transcription)


@router.get("/{transcription_id}/segments", response_model=List[TranscriptionSegmentResponse])
async def get_transcription_segments(
    transcription_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
) -> Any:
    """Obter segmentos detalhados de uma transcrição."""
    # Verificar se transcrição existe e pertence ao usuário
    result = await db.execute(select(Transcription).where(Transcription.id == transcription_id))
    transcription: Optional[Transcription] = result.scalar_one_or_none()
    if transcription is None or transcription.user_id != int(current_user.id):
        raise HTTPException(status_code=404, detail="Transcrição não encontrada")
    
    # Buscar segmentos ordenados por tempo
    segments_result = await db.execute(
        select(TranscriptionSegment)
        .where(TranscriptionSegment.transcription_id == transcription_id)
        .order_by(TranscriptionSegment.start_time)
    )
    segments = segments_result.scalars().all()
    
    return [TranscriptionSegmentResponse.model_validate(segment) for segment in segments]


@router.get("/{transcription_id}/status")
async def get_transcription_status(
    transcription_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
) -> Any:
    """Obter status detalhado de uma transcrição (para polling do frontend)."""
    result = await db.execute(select(Transcription).where(Transcription.id == transcription_id))
    transcription: Optional[Transcription] = result.scalar_one_or_none()
    if transcription is None or transcription.user_id != int(current_user.id):
        raise HTTPException(status_code=404, detail="Transcrição não encontrada")
    
    # Calcular progresso estimado baseado no status
    progress_map = {
        TranscriptionStatus.PENDING: 0,
        TranscriptionStatus.PROCESSING: 50,  # Estimar 50% quando processando
        TranscriptionStatus.COMPLETED: 100,
        TranscriptionStatus.FAILED: 0,
        TranscriptionStatus.REVIEWED: 100,
    }
    
    return {
        "id": transcription.id,
        "status": transcription.status,
        "progress": progress_map.get(transcription.status, 0),
        "duration": transcription.duration,
        "created_at": transcription.created_at,
        "updated_at": transcription.updated_at,
        "completed_at": transcription.completed_at,
        "has_segments": len(transcription.segments or []) > 0,
        "segment_count": len(transcription.segments or [])
    }
