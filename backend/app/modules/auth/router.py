
import hmac
from typing import Any

from fastapi import (
    APIRouter,
    Depends,
    Header,
    HTTPException,
    Request,
    Response,
    status,
)
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.csrf import generate_csrf_token
from app.modules.auth.dependencies import (
    get_auth_db,
    get_optional_current_user,
    get_request_session,
    require_csrf,
)
from app.modules.auth.schemas import (
    CurrentUserResponse,
    LoginRequest,
    LoginResponse,
    MessageResponse,
    SetupAdminRequest,
    SetupAdminResponse,
)
from app.modules.auth.service import authenticate_user
from app.modules.auth.session_service import (
    create_session,
    destroy_session,
    regenerate_session,
    save_session,
)
from app.modules.users.models import User
from app.modules.users.service import create_admin_account

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.get("/csrf-token")
def get_csrf_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_auth_db),
    session_data: dict[str, Any] | None = Depends(get_request_session),
):
    if session_data is None:
        session_data = {}

    token = generate_csrf_token(session_data)
    session_id = getattr(request.state, "session_id", None)

    if session_id is None:
        create_session(
            db=db,
            response=response,
            session_data=session_data,
        )
    else:
        save_session(
            db=db,
            session_id=session_id,
            session_data=session_data,
        )

    return {"csrfToken": token}


@router.post(
    "/setup",
    response_model=SetupAdminResponse,
    status_code=status.HTTP_201_CREATED,
)
def setup_admin(
    payload: SetupAdminRequest,
    db: Session = Depends(get_auth_db),
    setup_secret: str | None = Header(
        default=None,
        alias="x-setup-secret",
    ),
):
    if (
        not setup_secret
        or not hmac.compare_digest(
            setup_secret,
            settings.auth_setup_secret,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid setup authorization.",
        )

    try:
        user = create_admin_account(
            db=db,
            username=payload.username,
            password=payload.password,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error

    return {
        "message": "Private administrator account created successfully.",
        "user": user,
    }


@router.post(
    "/login",
    response_model=LoginResponse,
)
def login(
    payload: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_auth_db),
    _: None = Depends(require_csrf),
):
    user = authenticate_user(
        db=db,
        username=payload.username,
        password=payload.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )

    new_session_data = {
        "userId": str(user.id),
        "username": user.username,
    }

    generate_csrf_token(new_session_data)

    old_session_id = getattr(request.state, "session_id", None)

    regenerate_session(
        db=db,
        old_session_id=old_session_id,
        response=response,
        session_data=new_session_data,
    )

    return {"user": user}


@router.get(
    "/me",
    response_model=CurrentUserResponse,
)
def get_me(
    user: User | None = Depends(get_optional_current_user),
):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
        )

    return {"user": user}


@router.post(
    "/logout",
    response_model=MessageResponse,
)
def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_auth_db),
    _: None = Depends(require_csrf),
):
    session_id = getattr(request.state, "session_id", None)

    destroy_session(
        db=db,
        session_id=session_id,
        response=response,
    )

    return {
        "message": "Logged out successfully.",
    }
