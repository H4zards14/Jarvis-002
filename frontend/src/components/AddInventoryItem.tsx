import { useState } from "react";
import type { InventoryItem, InventoryCategory } from "../types/inventory";

interface AddInventoryItemProps {
  onAdd: (newItem: InventoryItem) => void;
}

function AddInventoryItem({ onAdd }: AddInventoryItemProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<InventoryCategory>("Warframe");
  const [quantity, setQuantity] = useState(1);
  const [level, setLevel] = useState(0);
  const [forma, setForma] = useState(0);
  const [mastered, setMastered] = useState(false);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }

    const newItem: InventoryItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      quantity,
      level,
      mastered,
      forma,
      notes,
      updatedAt: new Date().toISOString(),
    };

    onAdd(newItem);
  };

  return (
    <div className="add-inventory-form">
      <h3>ADD NEW ITEM</h3>

      <input
        type="text"
        placeholder="Enter item name..."
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <select
        value={category}
        onChange={(event) =>
          setCategory(event.target.value as InventoryCategory)
        }
      >
        <option value="Warframe">Warframe</option>
        <option value="Primary">Primary Weapon</option>
        <option value="Secondary">Secondary Weapon</option>
        <option value="Melee">Melee Weapon</option>
        <option value="Companion">Companion</option>
        <option value="Archwing">Archwing</option>
        <option value="Relic">Relic</option>
        <option value="Resource">Resource</option>
      </select>

      <input
        type="number"
        placeholder="Quantity"
        min="1"
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
        id="item-quantity"
      />

      <input
        type="number"
        placeholder="Level"
        min="0"
        max="40"
        value={level}
        onChange={(event) => setLevel(Number(event.target.value))}
        id="item-level"
      />

      <input
        type="number"
        placeholder="Forma"
        min="0"
        value={forma}
        onChange={(event) => setForma(Number(event.target.value))}
        id="item-forma"
      />

      <label>
        <input
          type="checkbox"
          checked={mastered}
          onChange={(event) => setMastered(event.target.checked)}
          id="item-mastered"
        />
        Mastered
      </label>

      <textarea
        placeholder="Add notes about this item..."
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        id="item-notes"
      />

      <button type="button" onClick={handleSubmit}>
        ADD ITEM
      </button>
    </div>
  );
}

export default AddInventoryItem;
