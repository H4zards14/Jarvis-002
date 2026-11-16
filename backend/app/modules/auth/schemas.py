
import uuid

from pydantic import BaseModel, ConfigDict, Field, field_validator


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=1)


class SetupAdminRequest(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=30,
        pattern=r"^[a-zA-Z0-9_.-]{3,30}$",
    )
    password: str = Field(min_length=12)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str) -> str:
        return value.strip()

    @field_validator("password")
    @classmethod
    def validate_password_bytes(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must not exceed 72 UTF-8 bytes.")
        return value


class AuthUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    username: str


class LoginResponse(BaseModel):
    user: AuthUserResponse


class SetupAdminResponse(BaseModel):
    message: str
    user: AuthUserResponse


class CurrentUserResponse(BaseModel):
    user: AuthUserResponse | None


class CsrfTokenResponse(BaseModel):
    csrfToken: str


class MessageResponse(BaseModel):
    message: str
