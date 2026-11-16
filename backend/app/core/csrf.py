
import secrets

from fastapi import HTTPException, Request, status

CSRF_SESSION_KEY = "csrfToken"
CSRF_HEADER_NAME = "x-csrf-token"


def generate_csrf_token(session_data: dict) -> str:
    token = session_data.get(CSRF_SESSION_KEY)

    if not isinstance(token, str) or not token:
        token = secrets.token_urlsafe(32)
        session_data[CSRF_SESSION_KEY] = token

    return token


def verify_csrf_token(
    request: Request,
    session_data: dict,
) -> None:
    supplied_token = request.headers.get(CSRF_HEADER_NAME)
    expected_token = session_data.get(CSRF_SESSION_KEY)

    if (
        not isinstance(supplied_token, str)
        or not isinstance(expected_token, str)
        or not secrets.compare_digest(
            supplied_token,
            expected_token,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing CSRF token.",
        )
