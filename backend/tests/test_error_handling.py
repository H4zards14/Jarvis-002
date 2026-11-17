
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.main import unexpected_exception_handler


def test_unexpected_exception_returns_generic_error():
    test_app = FastAPI(debug=False)

    test_app.add_exception_handler(
        Exception,
        unexpected_exception_handler,
    )

    @test_app.get("/test-error")
    def trigger_error():
        raise RuntimeError("Sensitive internal error details")

    with TestClient(
        test_app,
        raise_server_exceptions=False,
    ) as test_client:
        response = test_client.get("/test-error")

    assert response.status_code == 500

    assert response.json() == {
        "message": "An unexpected server error occurred."
    }

    assert "Sensitive internal error details" not in response.text

