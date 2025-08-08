from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Optional

import ffmpeg  # type: ignore
import whisper  # type: ignore
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models.transcription import Transcription, TranscriptionStatus
from app.core.queue import get_queue


def _probe_duration(path: str) -> Optional[float]:
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


async def _run_pipeline(session: AsyncSession, transcription: Transcription) -> None:
    transcription.status = TranscriptionStatus.PROCESSING
    await session.flush()

    # Measure duration best-effort
    transcription.duration = _probe_duration(transcription.file_path)
    await session.flush()

    # Transcribe with Whisper (CPU). Model is downloaded on first run.
    model_name = settings.WHISPER_MODEL or "base"
    model = whisper.load_model(model_name)
    result = model.transcribe(transcription.file_path, language=settings.TRANSCRIPTION_LANGUAGE)

    # Persist results
    transcription.full_text = result.get("text", "").strip()
    transcription.status = TranscriptionStatus.COMPLETED
    await session.flush()


def run_transcription_background(transcription_id: int) -> None:
    """Sync wrapper to run the async pipeline in background tasks."""

    async def _runner() -> None:
        async with AsyncSessionLocal() as session:
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


