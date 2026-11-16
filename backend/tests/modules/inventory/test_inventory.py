import pytest

from app.core.config import settings


@pytest.fixture
def authenticated_client(client):
    csrf_response = client.get("/api/auth/csrf-token")
    assert csrf_response.status_code == 200

    initial_csrf_token = csrf_response.json()["csrfToken"]

    setup_response = client.post(
        "/api/auth/setup",
        headers={"x-setup-secret": settings.auth_setup_secret},
        json={
            "username": "test_admin",
            "password": "TestPassword123!",
        },
    )
    assert setup_response.status_code == 201

    login_response = client.post(
        "/api/auth/login",
        headers={"x-csrf-token": initial_csrf_token},
        json={
            "username": "test_admin",
            "password": "TestPassword123!",
        },
    )
    assert login_response.status_code == 200

    refreshed_csrf_response = client.get("/api/auth/csrf-token")
    assert refreshed_csrf_response.status_code == 200

    csrf_token = refreshed_csrf_response.json()["csrfToken"]

    return client, csrf_token


def test_inventory_requires_authentication(client):
    response = client.get("/api/inventory")

    assert response.status_code == 401
    assert response.json()["message"] == (
        "Authentication required. Please log in."
    )


def test_inventory_creation_requires_csrf(client):
    response = client.post(
        "/api/inventory",
        json={
            "name": "Test Warframe",
            "category": "Warframe",
        },
    )

    assert response.status_code == 403
    assert response.json()["message"] == (
        "Invalid or missing CSRF token."
    )


def test_create_and_read_inventory_item(authenticated_client):
    client, csrf_token = authenticated_client

    create_response = client.post(
        "/api/inventory",
        headers={"x-csrf-token": csrf_token},
        json={
            "name": "Test Warframe",
            "category": "Warframe",
            "quantity": 1,
            "level": 30,
            "mastered": True,
            "isFavorite": True,
            "forma": 2,
            "notes": "Automated test item",
        },
    )

    assert create_response.status_code == 201

    created_item = create_response.json()

    assert created_item["name"] == "Test Warframe"
    assert created_item["isFavorite"] is True

    inventory_response = client.get("/api/inventory")

    assert inventory_response.status_code == 200

    inventory = inventory_response.json()

    assert any(
        item["id"] == created_item["id"]
        for item in inventory
    )


def test_update_inventory_item(authenticated_client):
    client, csrf_token = authenticated_client

    create_response = client.post(
        "/api/inventory",
        headers={"x-csrf-token": csrf_token},
        json={
            "name": "Update Test Warframe",
            "category": "Warframe",
        },
    )

    assert create_response.status_code == 201

    item_id = create_response.json()["id"]

    update_response = client.put(
        f"/api/inventory/{item_id}",
        headers={"x-csrf-token": csrf_token},
        json={
            "name": "Updated Warframe",
            "category": "Warframe",
            "quantity": 3,
            "level": 30,
            "mastered": True,
            "isFavorite": True,
            "forma": 2,
            "notes": "Updated by automated test",
        },
    )

    assert update_response.status_code == 200
    assert update_response.json()["name"] == "Updated Warframe"
    assert update_response.json()["quantity"] == 3
    assert update_response.json()["isFavorite"] is True


def test_delete_inventory_item(authenticated_client):
    client, csrf_token = authenticated_client

    create_response = client.post(
        "/api/inventory",
        headers={"x-csrf-token": csrf_token},
        json={
            "name": "Delete Test Warframe",
            "category": "Warframe",
        },
    )

    assert create_response.status_code == 201

    item_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/api/inventory/{item_id}",
        headers={"x-csrf-token": csrf_token},
    )

    assert delete_response.status_code == 200

    inventory_response = client.get("/api/inventory")

    assert all(
        item["id"] != item_id
        for item in inventory_response.json()
    )
