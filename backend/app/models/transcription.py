from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class TranscriptionStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REVIEWED = "reviewed"


class Transcription(Base):
    __tablename__ = "transcriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer)
    duration = Column(Float)  # Duration in seconds
    status = Column(Enum(TranscriptionStatus), default=TranscriptionStatus.PENDING)
    language = Column(String, default="pt")
    
    # Legal metadata
    case_number = Column(String, index=True)
    court = Column(String)
    hearing_date = Column(DateTime(timezone=True))
    participants = Column(Text)  # JSON string of participants
    
    # Relationships
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", backref="transcriptions")
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    # Content
    full_text = Column(Text)
    summary = Column(Text)
    
    # Segments relationship
    segments = relationship("TranscriptionSegment", back_populates="transcription", cascade="all, delete-orphan")


class TranscriptionSegment(Base):
    __tablename__ = "transcription_segments"
    
    id = Column(Integer, primary_key=True, index=True)
    transcription_id = Column(Integer, ForeignKey("transcriptions.id"), nullable=False)
    start_time = Column(Float, nullable=False)  # Start time in seconds
    end_time = Column(Float, nullable=False)    # End time in seconds
    text = Column(Text, nullable=False)
    speaker = Column(String)  # Speaker identification
    confidence = Column(Float)  # Confidence score
    
    # Relationship
    transcription = relationship("Transcription", back_populates="segments")
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())