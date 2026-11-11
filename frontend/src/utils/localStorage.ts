import type { InventoryItem } from "../types/inventory";
import { initialInventory } from "../data/initialInventory";

const STORAGE_KEY = "jarvis-warframe-inventory";

export function loadInventory(): InventoryItem[] {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return initialInventory;
    }

    const parsedData: unknown = JSON.parse(storedData);

    if (!Array.isArray(parsedData)) {
      return initialInventory;
    }

    return parsedData as InventoryItem[];
  } catch (error) {
    console.error("Failed to load inventory:", error);
    return initialInventory;
  }
}

export function saveInventory(items: InventoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save inventory:", error);
  }
}

export function resetInventory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
