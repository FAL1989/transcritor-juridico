from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.transcriptions import router as transcriptions_router

api_router = APIRouter()

# Include routers
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(transcriptions_router, prefix="/transcriptions", tags=["transcriptions"])