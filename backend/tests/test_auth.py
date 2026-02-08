def test_register_user(test_client):
    response = test_client.post(
        "/auth/register",
        json={"email": "newuser@example.com", "password": "testpass123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data


def test_login_user(test_client):
    # Register first
    test_client.post(
        "/auth/register",
        json={"email": "loginuser@example.com", "password": "testpass123"},
    )
    # Login
    response = test_client.post(
        "/auth/login",
        data={"username": "loginuser@example.com", "password": "testpass123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_get_current_user(test_client, auth_headers):
    response = test_client.get("/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "testuser@example.com"
