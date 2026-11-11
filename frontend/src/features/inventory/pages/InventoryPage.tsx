import { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import type { InventoryItem } from "../types/inventory";
import InventoryItemEditor from "../components/InventoryItemEditor";
import "./InventoryPage.css";

function InventoryPage() {
  const { inventory, loading, error, updateItem, removeItem } = useInventory();

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemToRemove, setItemToRemove] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMastery, setSelectedMastery] = useState("All");
  const [sortOrder, setSortOrder] = useState("Default");

  const updateInventoryItem = async (updatedItem: InventoryItem) => {
    try {
      await updateItem(updatedItem);
      setEditingItem(null);
    } catch (err) {
      console.error("Failed to update inventory item:", err);
    }
  };

  const removeInventoryItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (err) {
      console.error("Failed to remove inventory item:", err);
    }
  };

  const totalMastered = inventory.filter((item) => item.mastered).length;

  const masteryPercentage = Math.round(
    (totalMastered / (inventory.length || 1)) * 100,
  );

  const totalForma = inventory.reduce((total, item) => total + item.forma, 0);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const matchesMastery =
      selectedMastery === "All" ||
      (selectedMastery === "Mastered" ? item.mastered : !item.mastered);

    return matchesSearch && matchesCategory && matchesMastery;
  });

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    switch (sortOrder) {
      case "Name A-Z":
        return a.name.localeCompare(b.name);
      case "Name Z-A":
        return b.name.localeCompare(a.name);
      case "Quantity":
        return b.quantity - a.quantity;
      case "Level":
        return b.level - a.level;
      default:
        return 0;
    }
  });

  return (
    <section className="inventory-page">
      <h2>INVENTORY</h2>
      <p>Manage your Warframe collection.</p>

      {loading && <p>Loading your inventory...</p>}
      {error && <p className="inventory-error">{error}</p>}

      {editingItem && (
        <InventoryItemEditor
          item={editingItem}
          onUpdate={updateInventoryItem}
        />
      )}

      {itemToRemove && (
        <div className="inventory-modal-overlay">
          <div className="inventory-confirm-modal">
            <h3>CONFIRM REMOVAL</h3>

            <p>
              Are you sure you want to remove{" "}
              <strong>{itemToRemove.name}</strong> from your inventory?
            </p>

            <div className="inventory-modal-actions">
              <button type="button" onClick={() => setItemToRemove(null)}>
                CANCEL
              </button>

              <button
                type="button"
                className="inventory-confirm-remove"
                onClick={async () => {
                  await removeInventoryItem(itemToRemove.id);
                  setItemToRemove(null);
                }}
              >
                CONFIRM REMOVE
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="inventory-stats">
        <div className="inventory-stat-card">
          <span>MASTERED ITEMS</span>
          <strong>{totalMastered}</strong>
        </div>

        <div className="inventory-stat-card">
          <span>MASTERY COMPLETION</span>
          <strong>{masteryPercentage}%</strong>
          <div className="mastery-progress">
            <div
              className="mastery-progress-fill"
              style={{ width: `${masteryPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="inventory-stat-card">
          <span>TOTAL FORMA</span>
          <strong>{totalForma}</strong>
        </div>

        <div className="inventory-stat-card">
          <span>TOTAL ITEMS</span>
          <strong>{inventory.length}</strong>
        </div>
      </div>

      <div className="inventory-search-container">
        <input
          type="text"
          className="inventory-search"
          placeholder="Search your inventory..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {searchTerm && (
          <button
            className="inventory-search-clear"
            onClick={() => setSearchTerm("")}
          >
            ✕
          </button>
        )}
      </div>

      <div className="inventory-filter-row">
        <select
          className="inventory-category-filter"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          <option value="All">ALL CATEGORIES</option>
          <option value="Warframe">WARFRAMES</option>
          <option value="Primary">PRIMARY WEAPONS</option>
          <option value="Secondary">SECONDARY WEAPONS</option>
          <option value="Melee">MELEE WEAPONS</option>
          <option value="Companion">COMPANIONS</option>
          <option value="Archwing">ARCHWING</option>
          <option value="Mod">MODS</option>
          <option value="Relic">RELICS</option>
          <option value="Resource">RESOURCES</option>
        </select>

        <select
          className="inventory-category-filter"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
        >
          <option value="Default">DEFAULT ORDER</option>
          <option value="Name A-Z">NAME (A-Z)</option>
          <option value="Name Z-A">NAME (Z-A)</option>
          <option value="Quantity">QUANTITY (HIGHEST)</option>
          <option value="Level">LEVEL (HIGHEST)</option>
        </select>

        <button
          className="inventory-reset-button"
          onClick={() => {
            setSearchTerm("");
            setSelectedCategory("All");
            setSelectedMastery("All");
            setSortOrder("Default");
          }}
        >
          ↻ RESET FILTERS
        </button>
      </div>

      <select
        className="inventory-category-filter"
        value={selectedMastery}
        onChange={(event) => setSelectedMastery(event.target.value)}
      >
        <option value="All">ALL MASTERY STATUS</option>
        <option value="Mastered">MASTERED</option>
        <option value="Not Mastered">NOT MASTERED</option>
      </select>

      <p className="inventory-result-count">
        SHOWING {filteredInventory.length} OF {inventory.length} ITEMS
      </p>

      <div className="inventory-list">
        {sortedInventory.map((item, index) => (
          <div
            className="inventory-item"
            key={item.id}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="inventory-item-image"
              />
            )}

            <div className="inventory-item-top">
              <span className="inventory-symbol">◈</span>
              <span className="inventory-category">{item.category}</span>
            </div>

            <h3>{item.name}</h3>

            <div className="inventory-item-details">
              <span>QUANTITY</span>
              <strong>{item.quantity}</strong>
              <span>LEVEL</span>
              <strong>{item.level}</strong>
            </div>

            <div className="inventory-item-footer">
              <span
                className={
                  item.mastered ? "mastery-complete" : "mastery-incomplete"
                }
              >
                {item.mastered ? "✓ MASTERED" : "NOT MASTERED"}
              </span>
              <span>{item.forma} FORMA</span>
            </div>

            <button type="button" onClick={() => setEditingItem(item)}>
              EDIT
            </button>

            <button
              type="button"
              className="inventory-remove-button"
              onClick={() => setItemToRemove(item)}
            >
              REMOVE
            </button>
          </div>
        ))}

        {!loading && filteredInventory.length === 0 && (
          <div className="inventory-empty-state">
            <span>⌕</span>
            <h3>NO ITEMS FOUND</h3>
            <p>Try changing your search or filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default InventoryPage;
