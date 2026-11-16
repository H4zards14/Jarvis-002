
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Application
    app_name: str = "Jarvis-002 API"
    app_env: str = "development"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 5000

    # Frontend
    frontend_origin: str = "http://localhost:5173"

    # PostgreSQL
    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str = "postgres"
    db_password: str
    db_name: str = "Jarvis002"

    # Authentication
    session_secret: str
    auth_setup_secret: str

    # Session settings
    session_cookie_name: str = "jarvis.sid"
    session_max_age_days: int = 7


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
