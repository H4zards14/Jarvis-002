
import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.inventory.models import InventoryItem
from app.modules.inventory.schemas import (
    InventoryItemCreate,
    InventoryItemUpdate,
)


def get_inventory_items(db: Session) -> list[InventoryItem]:
    statement = select(InventoryItem).order_by(InventoryItem.name.asc())
    return list(db.scalars(statement).all())


def get_inventory_item(
    db: Session,
    item_id: uuid.UUID,
) -> InventoryItem | None:
    return db.get(InventoryItem, item_id)


def create_inventory_item(
    db: Session,
    payload: InventoryItemCreate,
) -> InventoryItem:
    item_data = payload.model_dump(
        exclude={"id"},
        by_alias=False,
    )

    item = InventoryItem(
        id=payload.id or uuid.uuid4(),
        **item_data,
        updated_at=datetime.now(UTC),
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


def update_inventory_item(
    db: Session,
    item: InventoryItem,
    payload: InventoryItemUpdate,
) -> InventoryItem:
    item_data = payload.model_dump(by_alias=False)

    for field, value in item_data.items():
        setattr(item, field, value)

    item.updated_at = datetime.now(UTC)

    db.commit()
    db.refresh(item)

    return item


def delete_inventory_item(
    db: Session,
    item: InventoryItem,
) -> None:
    db.delete(item)
    db.commit()
