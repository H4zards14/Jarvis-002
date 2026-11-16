
import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class InventoryCategory(str, Enum):
    WARFRAME = "Warframe"
    PRIMARY = "Primary"
    SECONDARY = "Secondary"
    MELEE = "Melee"
    COMPANION = "Companion"
    ARCHWING = "Archwing"
    MOD = "Mod"
    RELIC = "Relic"
    RESOURCE = "Resource"


class InventoryItemBase(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        str_strip_whitespace=True,
    )

    name: str = Field(min_length=1, max_length=255)
    image: str | None = None
    category: InventoryCategory
    quantity: int = Field(default=1, ge=0)
    level: int = Field(default=0, ge=0)
    mastered: bool = False
    is_favorite: bool = Field(
        default=False,
        alias="isFavorite",
    )
    forma: int = Field(default=0, ge=0)
    notes: str = ""


class InventoryItemCreate(InventoryItemBase):
    id: uuid.UUID | None = None


class InventoryItemUpdate(InventoryItemBase):
    pass


class InventoryItemResponse(InventoryItemBase):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

    id: uuid.UUID
    updated_at: datetime | None = Field(
        default=None,
        alias="updatedAt",
    )
