import io
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_upload_and_list_transcriptions(client: AsyncClient):
    # Register and login
    payload = {
        "email": "uploader@example.com",
        "full_name": "Uploader User",
        "password": "StrongP@ssw0rd"
    }
    resp = await client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 201

    resp = await client.post("/api/v1/auth/login", data={"username": payload["email"], "password": payload["password"]})
    assert resp.status_code == 200
    token_data = resp.json()

    headers = {"Authorization": f"Bearer {token_data['access_token']}"}

    # Upload a small fake audio file (just bytes; extension check only)
    audio_content = b"RIFF....WAVEfmt "
    files = {
        "file": ("teste.wav", audio_content, "audio/wav"),
    }
    data = {"title": "Audiência 1"}
    resp = await client.post("/api/v1/transcriptions/upload", headers=headers, files=files, data=data)
    assert resp.status_code == 201, resp.text
    created = resp.json()
    assert created["title"] == "Audiência 1"
    assert created["original_filename"].endswith(".wav")

    # List
    resp = await client.get("/api/v1/transcriptions/", headers=headers)
    assert resp.status_code == 200
    items = resp.json()
    assert len(items) >= 1

    # Get detail
    tid = created["id"]
    resp = await client.get(f"/api/v1/transcriptions/{tid}", headers=headers)
    assert resp.status_code == 200
    detail = resp.json()
    assert detail["id"] == tid
