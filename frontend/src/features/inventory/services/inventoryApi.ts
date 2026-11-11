import type { InventoryItem } from "../types/inventory";
import { saveInventory } from "../utils/localStorage";
import { getCsrfToken } from "../../../services/authApi";

const API_URL = "http://localhost:5000/api/inventory";

const STORAGE_KEY = "jarvis-warframe-inventory";
const BACKUP_KEY = "jarvis-warframe-inventory-backup";
const MIGRATION_STATE_KEY = "jarvis-inventory-migration-state";
const MIGRATION_COMPLETE_KEY = "jarvis-inventory-migration-complete";

type NewInventoryItem = Omit<InventoryItem, "id" | "updatedAt"> & {
  id?: string;
};

interface MigrationState {
  items: InventoryItem[];
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Inventory API request failed.");
  }

  return response.json();
}

export async function getInventory(): Promise<InventoryItem[]> {
  const response = await fetch(API_URL, {
    credentials: "include",
  });

  return handleResponse(response);
}

export async function addInventory(
  item: NewInventoryItem,
): Promise<InventoryItem> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken,
    },
    body: JSON.stringify(item),
  });

  return handleResponse(response);
}

export async function updateInventory(
  id: string,
  item: Omit<InventoryItem, "id" | "updatedAt">,
): Promise<InventoryItem> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken,
    },
    body: JSON.stringify(item),
  });

  return handleResponse(response);
}

export async function deleteInventory(id: string): Promise<void> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "x-csrf-token": csrfToken,
    },
  });

  await handleResponse(response);
}

function matchesOriginalItem(
  original: InventoryItem,
  saved: InventoryItem,
): boolean {
  return (
    original.id === saved.id &&
    original.name === saved.name &&
    (original.image ?? undefined) === (saved.image ?? undefined) &&
    original.category === saved.category &&
    original.quantity === saved.quantity &&
    original.level === saved.level &&
    original.mastered === saved.mastered &&
    original.forma === saved.forma &&
    (original.notes ?? "") === (saved.notes ?? "")
  );
}

export async function migrateLocalInventory(): Promise<InventoryItem[]> {
  const existingState = localStorage.getItem(MIGRATION_STATE_KEY);

  const serverInventory = await getInventory();

  if (
    existingState === null &&
    localStorage.getItem(MIGRATION_COMPLETE_KEY) === "true"
  ) {
    return serverInventory;
  }

  const localData = localStorage.getItem(STORAGE_KEY);

  if (existingState === null && localData === null) {
    localStorage.setItem(MIGRATION_COMPLETE_KEY, "true");
    return serverInventory;
  }

  if (existingState === null) {
    let originalItems: InventoryItem[];

    try {
      const parsed: unknown = JSON.parse(localData!);

      if (!Array.isArray(parsed)) {
        throw new Error("Saved inventory is not an array.");
      }

      originalItems = parsed as InventoryItem[];
    } catch {
      throw new Error(
        "Could not safely read your original inventory. Your saved data has not been changed.",
      );
    }

    if (serverInventory.length > 0) {
      const inventoriesMatch =
        serverInventory.length === originalItems.length &&
        originalItems.every((originalItem) => {
          const savedItem = serverInventory.find(
            (item) => item.id === originalItem.id,
          );

          return (
            savedItem !== undefined &&
            matchesOriginalItem(originalItem, savedItem)
          );
        });

      if (!inventoriesMatch) {
        throw new Error(
          "Browser and database inventories differ. Migration paused to protect your data.",
        );
      }

      if (localStorage.getItem(BACKUP_KEY) === null) {
        localStorage.setItem(BACKUP_KEY, localData!);
      }

      saveInventory(serverInventory);

      localStorage.setItem(MIGRATION_COMPLETE_KEY, "true");

      return serverInventory;
    }

    localStorage.setItem(BACKUP_KEY, localData!);

    const state: MigrationState = {
      items: originalItems,
    };

    localStorage.setItem(MIGRATION_STATE_KEY, JSON.stringify(state));
  }

  const savedState = localStorage.getItem(MIGRATION_STATE_KEY);

  if (savedState === null) {
    throw new Error("Migration snapshot could not be found.");
  }

  let migration: MigrationState;

  try {
    migration = JSON.parse(savedState) as MigrationState;

    if (!Array.isArray(migration.items)) {
      throw new Error("Invalid migration snapshot.");
    }
  } catch {
    throw new Error(
      "Migration snapshot is invalid. Original inventory backup is preserved.",
    );
  }

  for (const item of migration.items) {
    await addInventory({
      id: item.id,
      name: item.name,
      image: item.image,
      category: item.category,
      quantity: item.quantity,
      level: item.level,
      mastered: item.mastered,
      forma: item.forma,
      notes: item.notes,
    });
  }

  const finalInventory = await getInventory();

  for (const originalItem of migration.items) {
    const savedItem = finalInventory.find(
      (item) => item.id === originalItem.id,
    );

    if (!savedItem || !matchesOriginalItem(originalItem, savedItem)) {
      throw new Error(
        `Migration verification failed for ${originalItem.name}. Original backup is preserved.`,
      );
    }
  }

  saveInventory(finalInventory);

  localStorage.setItem(MIGRATION_COMPLETE_KEY, "true");
  localStorage.removeItem(MIGRATION_STATE_KEY);

  return finalInventory;
}
