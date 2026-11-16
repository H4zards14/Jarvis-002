def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_csrf_token_endpoint(client):
    response = client.get("/api/auth/csrf-token")

    assert response.status_code == 200
    assert response.json()["csrfToken"]


def test_current_user_requires_authentication(client):
    response = client.get("/api/auth/me")

    assert response.status_code == 401
    assert response.json()["message"] == (
        "Authentication required. Please log in."
    )
