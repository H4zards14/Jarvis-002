
import base64
import hashlib
import hmac
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

from fastapi import Request, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.modules.auth.models import Session as AuthSession

COOKIE_NAME = settings.session_cookie_name
SESSION_SECRET = settings.session_secret
SESSION_MAX_AGE = settings.session_max_age_days * 24 * 60 * 60


def sign_session_id(session_id: str) -> str:
    signature = hmac.new(
        SESSION_SECRET.encode("utf-8"),
        session_id.encode("utf-8"),
        hashlib.sha256,
    ).digest()

    encoded_signature = base64.b64encode(signature).decode("ascii").rstrip("=")

    return f"s:{session_id}.{encoded_signature}"


def verify_session_cookie(cookie_value: str) -> str | None:
    if not cookie_value.startswith("s:"):
        return None

    signed_value = cookie_value[2:]

    if "." not in signed_value:
        return None

    session_id, supplied_signature = signed_value.rsplit(".", 1)

    if not session_id or not supplied_signature:
        return None

    expected_cookie = sign_session_id(session_id)
    expected_signature = expected_cookie.rsplit(".", 1)[1]

    if not hmac.compare_digest(
        supplied_signature,
        expected_signature,
    ):
        return None

    return session_id


def get_session_id(request: Request) -> str | None:
    cookie_value = request.cookies.get(COOKIE_NAME)

    if not cookie_value:
        return None

    return verify_session_cookie(cookie_value)


def load_session(
    db: Session,
    session_id: str,
) -> dict[str, Any] | None:
    statement = select(AuthSession).where(
        AuthSession.sid == session_id
    )

    session_record = db.scalar(statement)

    if session_record is None:
        return None

    now = datetime.now(UTC).replace(tzinfo=None)

    if session_record.expire <= now:
        db.delete(session_record)
        db.commit()
        return None

    return session_record.sess


def save_session(
    db: Session,
    session_id: str,
    session_data: dict[str, Any],
) -> None:
    now = datetime.now(UTC).replace(tzinfo=None)
    expiration = now + timedelta(seconds=SESSION_MAX_AGE)

    session_record = db.get(AuthSession, session_id)

    if session_record is None:
        session_record = AuthSession(
            sid=session_id,
            sess=session_data,
            expire=expiration,
        )
        db.add(session_record)
    else:
        session_record.sess = session_data
        session_record.expire = expiration

    db.commit()


def create_session(
    db: Session,
    response: Response,
    session_data: dict[str, Any] | None = None,
) -> tuple[str, dict[str, Any]]:
    session_id = secrets.token_urlsafe(24)
    data = session_data.copy() if session_data else {}

    save_session(db, session_id, data)

    response.set_cookie(
        key=COOKIE_NAME,
        value=sign_session_id(session_id),
        max_age=SESSION_MAX_AGE,
        httponly=True,
        secure=settings.app_env == "production",
        samesite="lax",
        path="/",
    )

    return session_id, data


def regenerate_session(
    db: Session,
    old_session_id: str | None,
    response: Response,
    session_data: dict[str, Any],
) -> tuple[str, dict[str, Any]]:
    if old_session_id:
        old_session = db.get(AuthSession, old_session_id)

        if old_session is not None:
            db.delete(old_session)
            db.commit()

    return create_session(
        db=db,
        response=response,
        session_data=session_data,
    )


def destroy_session(
    db: Session,
    session_id: str | None,
    response: Response,
) -> None:
    if session_id:
        session_record = db.get(AuthSession, session_id)

        if session_record is not None:
            db.delete(session_record)
            db.commit()

    response.delete_cookie(
        key=COOKIE_NAME,
        path="/",
        httponly=True,
        secure=settings.app_env == "production",
        samesite="lax",
    )
