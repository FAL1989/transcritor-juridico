from datetime import datetime
from typing import Optional
from pydantic import BaseModel


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

    class Config:
        from_attributes = True
