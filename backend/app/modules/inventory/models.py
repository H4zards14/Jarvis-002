
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    name: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    image: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    category: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    quantity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )

    level: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    mastered: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    forma: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    is_favorite: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )
