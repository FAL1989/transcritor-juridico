from __future__ import annotations

import os
from rq import Worker  # type: ignore
from app.core.queue import get_redis_connection


if __name__ == "__main__":
    conn = get_redis_connection()
    Worker(list(map(str, ["transcriptions"])) , connection=conn).work()


