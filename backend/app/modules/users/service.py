
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.modules.users.models import User


def get_user_by_username(
    db: Session,
    username: str,
) -> User | None:
    statement = select(User).where(
        User.username == username
    )

    return db.scalar(statement)


def create_admin_account(
    db: Session,
    username: str,
    password: str,
) -> User:
    try:
        # Prevent simultaneous requests from creating multiple administrators.
        db.execute(
            text("SELECT pg_advisory_xact_lock(20261111)")
        )

        existing_user = db.scalar(
            select(User).limit(1)
        )

        if existing_user is not None:
            raise ValueError(
                "An administrator account already exists."
            )

        user = User(
            username=username,
            password_hash=hash_password(password),
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    except Exception:
        db.rollback()
        raise
