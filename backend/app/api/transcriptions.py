from typing import Any, List, Optional
import os
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db
from app.models.transcription import Transcription, TranscriptionStatus
from app.api.auth import get_current_user
from app.schemas.auth import UserResponse
from app.schemas.transcription import TranscriptionResponse

router = APIRouter()


def _ensure_upload_dir() -> None:
    Path(settings.UPLOAD_PATH).mkdir(parents=True, exist_ok=True)


def _validate_extension(filename: str) -> None:
    ext = os.path.splitext(filename)[1].lower()
    if ext not in settings.ALLOWED_AUDIO_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Extensão de arquivo não suportada")


@router.post("/upload", response_model=TranscriptionResponse, status_code=201)
async def upload_transcription(
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
