import asyncio
from typing import AsyncGenerator, Generator
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db
from app.core.config import settings
from pathlib import Path
import tempfile
from unittest.mock import patch

# Test database URL
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Create test engine
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# Create test session
TestingSessionLocal = sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Create a test database session."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with TestingSessionLocal() as session:
        yield session
    
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create a test client."""
    async def get_test_db():
        yield db_session
    
    app.dependency_overrides[get_db] = get_test_db

    # Isola uploads em diretório temporário gravável
    tmp_upload_dir = Path(tempfile.gettempdir()) / "transcritor_uploads"
    tmp_upload_dir.mkdir(parents=True, exist_ok=True)
    settings.UPLOAD_PATH = str(tmp_upload_dir)
    transport = ASGITransport(app=app)
    # Evita uso real de Redis/Whisper/ffmpeg em testes
    with patch("app.api.transcriptions.enqueue_transcription_job") as mock_enqueue, \
         patch("app.services.transcription_pipeline.whisper.load_model") as mock_whisper_load:
        mock_enqueue.return_value = "test-job-id"
        mock_whisper_load.return_value = type("M", (), {"transcribe": lambda *_args, **_kw: {"text": ""}})()
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            yield ac
    
    app.dependency_overrides.clear()