
import requests

BASE_URL = "http://localhost:5000"


def test_backend_health():
    response = requests.get(f"{BASE_URL}/api/health", timeout=5)

    assert response.status_code == 200
    assert response.json()["success"] is True


def test_inventory_requires_authentication():
    response = requests.get(
        f"{BASE_URL}/api/inventory",
        timeout=5
    )

    assert response.status_code == 401
    assert response.json()["message"] == (
        "Authentication required. Please log in."
    )


def test_invalid_login_is_rejected():
    session = requests.Session()

    response = session.get(
        f"{BASE_URL}/api/auth/csrf-token",
        timeout=5
    )

    assert response.status_code == 200

    csrf_token = response.json()["csrfToken"]

    login_response = session.post(
        f"{BASE_URL}/api/auth/login",
        json={
            "username": "invalid_test_user",
            "password": "WrongPassword123!"
        },
        headers={
            "X-CSRF-Token": csrf_token
        },
        timeout=5
    )

    assert login_response.status_code == 401
    assert login_response.json()["message"] == (
        "Invalid username or password."
    )
