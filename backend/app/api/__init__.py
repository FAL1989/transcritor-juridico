from fastapi import APIRouter

api_router = APIRouter()

# Import and include routers here as they are created
# Example:
# from app.api.auth import router as auth_router
# api_router.include_router(auth_router, prefix="/auth", tags=["auth"])