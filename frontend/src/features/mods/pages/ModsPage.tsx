import { useEffect, useState } from "react";
import { getMods } from "../services/modService";
import type { Mod } from "../services/modService";
import { useInventory } from "../../inventory/context/InventoryContext";
import "./ModsPage.css";

function ModsPage() {
  const { inventory, addItem } = useInventory();

  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    getMods()
      .then((data) => setMods(data))
      .catch(() => setError("Failed to load Mods."))
      .finally(() => setLoading(false));
  }, []);

  const addModToInventory = async (mod: Mod) => {
    const alreadyAdded = inventory.some(
      (item) =>
        item.name.toLowerCase() === mod.name.toLowerCase() &&
        item.category === "Mod",
    );

    if (alreadyAdded) {
      setFeedback({
        message: `${mod.name} is already in your inventory.`,
        type: "error",
      });
      return;
    }

    try {
      await addItem({
        name: mod.name,
        image: mod.imageName
          ? `https://cdn.warframestat.us/img/${mod.imageName}`
          : undefined,
        category: "Mod",
        quantity: 1,
        level: 0,
        mastered: false,
        forma: 0,
        notes: "",
      });

      setFeedback({
        message: `${mod.name} added to inventory successfully!`,
        type: "success",
      });
    } catch (err) {
      console.error("Failed to add Mod:", err);

      setFeedback({
        message: `Failed to add ${mod.name}. Please try again.`,
        type: "error",
      });
    }
  };

  const filteredMods = mods.filter((mod) =>
    mod.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="mods-page">
      <h2>MODS</h2>

      <input
        type="text"
        placeholder="Search Mods..."
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

      {loading && <p>Loading Mods...</p>}
      {error && <p>{error}</p>}

      <div className="mods-grid">
        {filteredMods.map((mod) => (
          <div className="mod-card" key={mod.uniqueName}>
            <h3>{mod.name}</h3>

            {mod.imageName && (
              <img
                src={`https://cdn.warframestat.us/img/${mod.imageName}`}
                alt={mod.name}
                className="mod-image"
              />
            )}

            <p>{mod.description}</p>
            <p>Polarity: {mod.polarity || "Unknown"}</p>
            <p>Base Drain: {mod.baseDrain ?? "Unknown"}</p>
            <p>Maximum Rank: {mod.fusionLimit ?? "Unknown"}</p>

            <button type="button" onClick={() => addModToInventory(mod)}>
              ADD TO INVENTORY
            </button>
          </div>
        ))}
      </div>

      {!loading && !error && filteredMods.length === 0 && <p>No Mods found.</p>}
    </div>
  );
}

export default ModsPage;
