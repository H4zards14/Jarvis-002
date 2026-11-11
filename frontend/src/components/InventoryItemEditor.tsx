import { useState } from "react";
import type { InventoryItem } from "../types/inventory";

interface EditInventoryItemProps {
  item: InventoryItem;
  onUpdate: (updatedItem: InventoryItem) => void;
}

function EditInventoryItem({ item, onUpdate }: EditInventoryItemProps) {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [level, setLevel] = useState(item.level);
  const [forma, setForma] = useState(item.forma);
  const [mastered, setMastered] = useState(item.mastered);
  const [notes, setNotes] = useState(item.notes);

  return (
    <div className="edit-inventory-form">
      <h3>EDIT ITEM</h3>

      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Item name"
      />
      <input
        type="number"
        value={quantity}
        min="1"
        onChange={(event) => setQuantity(Number(event.target.value))}
        placeholder="Quantity"
      />
      <input
        type="number"
        value={level}
        min="0"
        max="40"
        onChange={(event) => setLevel(Number(event.target.value))}
        placeholder="Level"
      />
      <input
        type="number"
        value={forma}
        min="0"
        onChange={(event) => setForma(Number(event.target.value))}
        placeholder="Forma"
      />
      <label className="mastered-label">
        <input
          type="checkbox"
          checked={mastered}
          onChange={(event) => setMastered(event.target.checked)}
        />
        Mastered
      </label>

      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Add notes about this item..."
      />

      <button
        type="button"
        onClick={() =>
          onUpdate({
            ...item,
            name: name.trim(),
            quantity,
            level,
            forma,
            mastered,
            notes,
            updatedAt: new Date().toISOString(),
          })
        }
      >
        SAVE CHANGES
      </button>
    </div>
  );
}

export default EditInventoryItem;
