import { useEffect, useState } from "react";
import { getRelics } from "../services/relicService";
import type { Relic } from "../services/relicService";
import { useInventory } from "../../inventory/context/InventoryContext";
import "./RelicsPage.css";

function RelicsPage() {
  const { inventory, addItem } = useInventory();

  const [relics, setRelics] = useState<Relic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    getRelics()
      .then((data) => setRelics(data))
      .catch(() => setError("Failed to load Relics."))
      .finally(() => setLoading(false));
  }, []);

  const addRelicToInventory = async (relic: Relic) => {
    const alreadyAdded = inventory.some(
      (item) =>
        item.name.toLowerCase() === relic.name.toLowerCase() &&
        item.category === "Relic",
    );

    if (alreadyAdded) {
      setFeedback({
        message: `${relic.name} is already in your inventory.`,
        type: "error",
      });
      return;
    }

    try {
      await addItem({
        name: relic.name,
        image: relic.image || undefined,
        category: "Relic",
        quantity: 1,
        level: 0,
        mastered: false,
        forma: 0,
        notes: relic.vaultInfo.vaulted ? "Vaulted" : "Not Vaulted",
      });

      setFeedback({
        message: `${relic.name} added to inventory successfully!`,
        type: "success",
      });
    } catch (err) {
      console.error("Failed to add Relic:", err);
      setFeedback({
        message: `Failed to add ${relic.name}. Please try again.`,
        type: "error",
      });
    }
  };

  const filteredRelics = relics.filter((relic) =>
    relic.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relics-page">
      <h2>RELICS</h2>

      <input
        type="text"
        placeholder="Search Relics..."
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          setFeedback(null);
        }}
      />

      {feedback && (
        <p
          role="status"
          style={{
            color: feedback.type === "success" ? "#56e0ed" : "#ff7b89",
            background:
              feedback.type === "success"
                ? "rgba(56, 189, 248, 0.08)"
                : "rgba(255, 80, 100, 0.08)",
            border: `1px solid ${
              feedback.type === "success" ? "#38bdf8" : "#ff6b7a"
            }`,
            borderRadius: "6px",
            padding: "12px 16px",
            marginBottom: "20px",
          }}
        >
          {feedback.type === "success" ? "✓ " : "!"}
          {feedback.message}
        </p>
      )}

      {loading && <p>Loading Relics...</p>}
      {error && <p>{error}</p>}

      <div className="relics-grid">
        {filteredRelics.map((relic) => (
          <div className="relic-card" key={relic.uniqueName}>
            <img
              src={relic.image}
              alt={`${relic.name} artwork`}
              className="relic-image"
            />

            <h3>{relic.name}</h3>

            <p>{relic.vaultInfo.vaulted ? "Vaulted" : "Not Vaulted"}</p>

            <button type="button" onClick={() => addRelicToInventory(relic)}>
              ADD TO INVENTORY
            </button>
          </div>
        ))}
      </div>

      {!loading && !error && filteredRelics.length === 0 && (
        <p>No Relics found.</p>
      )}
    </div>
  );
}

export default RelicsPage;
