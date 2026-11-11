import { useEffect, useState } from "react";
import { getWarframes } from "../services/warframeService";
import type { Warframe } from "../services/warframeService";
import { useInventory } from "../context/InventoryContext";
import "./WarframesPage.css";

function WarframesPage() {
  const { inventory, addItem } = useInventory();

  const [warframes, setWarframes] = useState<Warframe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    getWarframes()
      .then((data) => setWarframes(data))
      .catch(() => setError("Failed to load Warframes."))
      .finally(() => setLoading(false));
  }, []);

  const addWarframeToInventory = async (warframe: Warframe) => {
    const alreadyAdded = inventory.some(
      (item) =>
        item.name.toLowerCase() === warframe.name.toLowerCase() &&
        item.category === "Warframe",
    );

    if (alreadyAdded) {
      setNotification(`${warframe.name} is already in your inventory.`);
      return;
    }

    try {
      await addItem({
        name: warframe.name,
        image: warframe.imageName
          ? `https://cdn.warframestat.us/img/${warframe.imageName}`
          : undefined,
        category: "Warframe",
        quantity: 1,
        level: 0,
        mastered: false,
        forma: 0,
        notes: "",
      });

      setNotification(`${warframe.name} added to inventory!`);
    } catch (err) {
      console.error("Failed to add Warframe:", err);
      setNotification(`Failed to add ${warframe.name}. Please try again.`);
    }
  };

  return (
    <div className="warframes-page">
      <h2>WARFRAMES</h2>

      {notification && (
        <div className="catalog-notification">
          <span>✓ {notification}</span>
          <button type="button" onClick={() => setNotification("")}>
            ✕
          </button>
        </div>
      )}

      <input
        className="warframes-search"
        type="text"
        placeholder="Search Warframes..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {loading && <p>Loading Warframes...</p>}

      {error && <p>{error}</p>}

      <div className="warframes-grid">
        {warframes
          .filter(
            (warframe) =>
              !["Helminth", "Orion & Sirius"].includes(warframe.name),
          )
          .filter((warframe) =>
            warframe.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((warframe) => (
            <div className="warframe-card" key={warframe.uniqueName}>
              <h3>{warframe.name}</h3>

              <img
                src={
                  warframe.imageName
                    ? `https://cdn.warframestat.us/img/${warframe.imageName}`
                    : ""
                }
                alt={warframe.name}
                width="120"
              />

              <p>{warframe.description}</p>
              <p>Mastery Rank Required: {warframe.masteryReq}</p>
              <p>Health: {warframe.health}</p>
              <p>Shields: {warframe.shield}</p>
              <p>Armor: {warframe.armor}</p>

              <button
                type="button"
                onClick={() => addWarframeToInventory(warframe)}
              >
                ADD TO INVENTORY
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default WarframesPage;
