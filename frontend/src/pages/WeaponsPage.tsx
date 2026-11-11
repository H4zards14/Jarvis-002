import { useEffect, useState } from "react";
import { getWeapons } from "../services/weaponService";
import type { Weapon } from "../services/weaponService";
import { useInventory } from "../context/InventoryContext";
import "./WeaponsPage.css";

function WeaponsPage() {
  const { inventory, addItem } = useInventory();

  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    getWeapons()
      .then((data) => setWeapons(data))
      .catch(() => setError("Failed to load Weapons."))
      .finally(() => setLoading(false));
  }, []);

  const addWeaponToInventory = async (weapon: Weapon) => {
    const categoryText = `${weapon.category} ${weapon.type}`.toLowerCase();

    const category = categoryText.includes("secondary")
      ? "Secondary"
      : categoryText.includes("melee")
        ? "Melee"
        : "Primary";

    const alreadyAdded = inventory.some(
      (item) =>
        item.name.toLowerCase() === weapon.name.toLowerCase() &&
        item.category === category,
    );

    if (alreadyAdded) {
      setNotification(`${weapon.name} is already in your inventory.`);
      return;
    }

    try {
      await addItem({
        name: weapon.name,
        image: weapon.imageName
          ? `https://cdn.warframestat.us/img/${weapon.imageName}`
          : undefined,
        category,
        quantity: 1,
        level: 0,
        mastered: false,
        forma: 0,
        notes: "",
      });

      setNotification(`${weapon.name} added to inventory!`);
    } catch (err) {
      console.error("Failed to add Weapon:", err);
      setNotification(`Failed to add ${weapon.name}. Please try again.`);
    }
  };

  const filteredWeapons = weapons.filter((weapon) =>
    weapon.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="weapons-page">
      <h2>WEAPONS</h2>

      {notification && (
        <div className="catalog-notification">
          <span>✓ {notification}</span>
          <button type="button" onClick={() => setNotification("")}>
            ✕
          </button>
        </div>
      )}

      <input
        type="text"
        placeholder="Search Weapons..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {loading && <p>Loading Weapons...</p>}
      {error && <p>{error}</p>}

      <div className="weapons-grid">
        {filteredWeapons.map((weapon) => (
          <div className="weapon-card" key={weapon.uniqueName}>
            <h3>{weapon.name}</h3>

            {weapon.imageName && (
              <img
                src={`https://cdn.warframestat.us/img/${weapon.imageName}`}
                alt={weapon.name}
                className="weapon-image"
              />
            )}

            <p>{weapon.description}</p>
            <p>Type: {weapon.type || "Unknown"}</p>
            <p>Category: {weapon.category || "Unknown"}</p>
            <p>Mastery Requirement: {weapon.masteryReq ?? "Unknown"}</p>

            <button type="button" onClick={() => addWeaponToInventory(weapon)}>
              ADD TO INVENTORY
            </button>
          </div>
        ))}
      </div>

      {!loading && !error && filteredWeapons.length === 0 && (
        <p>No Weapons found.</p>
      )}
    </div>
  );
}

export default WeaponsPage;
