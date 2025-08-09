from __future__ import annotations

import os
from redis import Redis  # type: ignore
from rq import Queue  # type: ignore
from app.core.config import settings


def get_redis_connection() -> Redis:
    url = settings.REDIS_URL
    # Expected format redis://host:port/db
    return Redis.from_url(url)


def get_queue(name: str = "transcriptions") -> Queue:
    # Aumentar timeout para 4h para áudios longos
    return Queue(name, connection=get_redis_connection(), default_timeout=4 * 60 * 60)


