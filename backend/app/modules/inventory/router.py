
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.modules.auth.dependencies import (
    get_auth_db,
    get_current_user,
    require_csrf,
)
from app.modules.inventory.schemas import (
    InventoryItemCreate,
    InventoryItemResponse,
    InventoryItemUpdate,
)
from app.modules.inventory.service import (
    create_inventory_item,
    delete_inventory_item,
    get_inventory_item,
    get_inventory_items,
    update_inventory_item,
)
from app.modules.users.models import User

router = APIRouter(tags=["Inventory"])


@router.get(
    "/inventory",
    response_model=list[InventoryItemResponse],
)
def list_inventory(
    db: Session = Depends(get_auth_db),
    current_user: User = Depends(get_current_user),
) -> list:
    return get_inventory_items(db)


@router.post(
    "/inventory",
    response_model=InventoryItemResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_csrf)],
)
def add_inventory_item(
    payload: InventoryItemCreate,
    db: Session = Depends(get_auth_db),
    current_user: User = Depends(get_current_user),
) -> InventoryItemResponse:
    if payload.id is not None:
        existing_item = get_inventory_item(db, payload.id)

        if existing_item is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An inventory item with this ID already exists.",
            )

    return create_inventory_item(db, payload)


@router.put(
    "/inventory/{item_id}",
    response_model=InventoryItemResponse,
    dependencies=[Depends(require_csrf)],
)
def edit_inventory_item(
    item_id: uuid.UUID,
    payload: InventoryItemUpdate,
    db: Session = Depends(get_auth_db),
    current_user: User = Depends(get_current_user),
) -> InventoryItemResponse:
    item = get_inventory_item(db, item_id)

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found.",
        )

    return update_inventory_item(db, item, payload)


@router.delete(
    "/inventory/{item_id}",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_csrf)],
)
def remove_inventory_item(
    item_id: uuid.UUID,
    db: Session = Depends(get_auth_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, str]:
    item = get_inventory_item(db, item_id)

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found.",
        )

    delete_inventory_item(db, item)

    return {"message": "Inventory item deleted successfully."}
