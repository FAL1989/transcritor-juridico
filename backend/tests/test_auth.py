import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_and_login_flow(client: AsyncClient):
    # Register new user
    payload = {
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "StrongP@ssw0rd"
    }
    resp = await client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 201, resp.text
    data = resp.json()
    assert data["email"] == payload["email"]
    assert data["full_name"] == payload["full_name"]
    assert "id" in data

    # Login with OAuth2PasswordRequestForm format
    form = {
        "username": payload["email"],
        "password": payload["password"],
    }
    resp = await client.post("/api/v1/auth/login", data=form)
    assert resp.status_code == 200, resp.text
    token_data = resp.json()
    assert "access_token" in token_data
    assert "refresh_token" in token_data

    # Access protected route
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    resp = await client.get("/api/v1/auth/me", headers=headers)
    assert resp.status_code == 200
    me = resp.json()
    assert me["email"] == payload["email"]

    # Refresh token
    resp = await client.post("/api/v1/auth/refresh", json={"refresh_token": token_data["refresh_token"]})
    assert resp.status_code == 200
    refreshed = resp.json()
    assert "access_token" in refreshed
