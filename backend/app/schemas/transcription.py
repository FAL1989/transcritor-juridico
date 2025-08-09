from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class TranscriptionSegmentResponse(BaseModel):
    """Schema para segmentos de transcrição."""
    id: int
    start_time: float
    end_time: float
    text: str
    speaker: Optional[str] = None
    confidence: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TranscriptionResponse(BaseModel):
    id: int
    title: str
    original_filename: str
    file_path: str
    file_size: Optional[int] = None
    duration: Optional[float] = None
    status: str
    language: str
    case_number: Optional[str] = None
    court: Optional[str] = None
    hearing_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    full_text: Optional[str] = None
    summary: Optional[str] = None

    class Config:
        from_attributes = True


class TranscriptionWithSegmentsResponse(TranscriptionResponse):
    """Schema para transcrição completa com segmentos."""
    segments: List[TranscriptionSegmentResponse] = []
