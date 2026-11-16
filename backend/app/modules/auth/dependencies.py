
import uuid
from collections.abc import Generator
from typing import Any

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.csrf import verify_csrf_token
from app.core.database import get_db
from app.modules.auth.session_service import (
    get_session_id,
    load_session,
)
from app.modules.users.models import User


def get_auth_db() -> Generator[Session]:
    yield from get_db()


def get_request_session(
    request: Request,
    db: Session = Depends(get_auth_db),
) -> dict[str, Any] | None:
    session_id = get_session_id(request)

    request.state.session_id = session_id

    if session_id is None:
        request.state.session_data = None
        return None

    session_data = load_session(db, session_id)

    request.state.session_data = session_data

    if session_data is None:
        request.state.session_id = None

    return session_data


def get_current_user(
    session_data: dict[str, Any] | None = Depends(get_request_session),
    db: Session = Depends(get_auth_db),
) -> User:
    if not session_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
        )

    user_id = session_data.get("userId")
    username = session_data.get("username")

    if not user_id or not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
        )

    try:
        parsed_user_id = uuid.UUID(str(user_id))
    except (ValueError, TypeError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication session.",
        )

    statement = select(User).where(
        User.id == parsed_user_id,
        User.username == username,
    )

    user = db.scalar(statement)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
        )

    return user


def require_csrf(
    request: Request,
    session_data: dict[str, Any] | None = Depends(get_request_session),
) -> None:
    if session_data is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing CSRF token.",
        )

    verify_csrf_token(
        request=request,
        session_data=session_data,
    )

def get_optional_current_user(
    session_data: dict[str, Any] | None = Depends(get_request_session),
    db: Session = Depends(get_auth_db),
) -> User | None:
    if not session_data:
        return None

    user_id = session_data.get("userId")
    username = session_data.get("username")

    if not user_id or not username:
        return None

    try:
        parsed_user_id = uuid.UUID(str(user_id))
    except (ValueError, TypeError, AttributeError):
        return None

    statement = select(User).where(
        User.id == parsed_user_id,
        User.username == username,
    )

    return db.scalar(statement)
