
from datetime import datetime
from typing import Any

from sqlalchemy import JSON, DateTime, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Session(Base):
    __tablename__ = "session"
    __table_args__ = (
        Index("IDX_session_expire", "expire"),
    )

    sid: Mapped[str] = mapped_column(
        String,
        primary_key=True,
    )

    sess: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
    )

    expire: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
    )
