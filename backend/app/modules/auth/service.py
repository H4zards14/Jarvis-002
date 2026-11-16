
from sqlalchemy.orm import Session

from app.core.security import verify_password
from app.modules.users.models import User
from app.modules.users.service import get_user_by_username


def authenticate_user(
    db: Session,
    username: str,
    password: str,
) -> User | None:
    user = get_user_by_username(
        db=db,
        username=username.strip(),
    )

    if user is None:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
        return None

    return user
