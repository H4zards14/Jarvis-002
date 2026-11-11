import { useEffect, useState } from "react";
import { getResources } from "../services/resourceService";
import type { Resource } from "../services/resourceService";
import { useInventory } from "../../inventory/context/InventoryContext";
import "./ResourcesPage.css";

function ResourcesPage() {
  const { inventory, addItem } = useInventory();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    getResources()
      .then((data) => setResources(data))
      .catch(() => setError("Failed to load Resources."))
      .finally(() => setLoading(false));
  }, []);

  const addResourceToInventory = async (resource: Resource) => {
    const alreadyAdded = inventory.some(
      (item) =>
        item.name.toLowerCase() === resource.name.toLowerCase() &&
        item.category === "Resource",
    );

    if (alreadyAdded) {
      setFeedback({
        message: `${resource.name} is already in your inventory.`,
        type: "error",
      });
      return;
    }

    try {
      await addItem({
        name: resource.name,
        image: resource.imageName
          ? `https://cdn.warframestat.us/img/${resource.imageName}`
          : undefined,
        category: "Resource",
        quantity: 1,
        level: 0,
        mastered: false,
        forma: 0,
        notes: "",
      });

      setFeedback({
        message: `${resource.name} added to inventory successfully!`,
        type: "success",
      });
    } catch (err) {
      console.error("Failed to add Resource:", err);
      setFeedback({
        message: `Failed to add ${resource.name}. Please try again.`,
        type: "error",
      });
    }
  };

  const filteredResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="resources-page">
      <h2>RESOURCES</h2>

      <input
        type="text"
        placeholder="Search Resources..."
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

      {loading && <p>Loading Resources...</p>}
      {error && <p>{error}</p>}

      <div className="resources-grid">
        {filteredResources.map((resource) => (
          <div className="resource-card" key={resource.uniqueName}>
            <h3>{resource.name}</h3>

            {resource.imageName && (
              <img
                src={`https://cdn.warframestat.us/img/${resource.imageName}`}
                alt={resource.name}
                className="resource-image"
              />
            )}

            <p>{resource.description}</p>

            <button
              type="button"
              onClick={() => addResourceToInventory(resource)}
            >
              ADD TO INVENTORY
            </button>
          </div>
        ))}
      </div>

      {!loading && !error && filteredResources.length === 0 && (
        <p>No Resources found.</p>
      )}
    </div>
  );
}

export default ResourcesPage;
