/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { InventoryItem } from "../types/inventory";
import {
  migrateLocalInventory,
  addInventory,
  updateInventory,
  deleteInventory,
} from "../services/inventoryApi";

interface InventoryContextType {
  inventory: InventoryItem[];
  loading: boolean;
  error: string;
  addItem: (item: Omit<InventoryItem, "id" | "updatedAt">) => Promise<void>;
  updateItem: (item: InventoryItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined,
);

interface InventoryProviderProps {
  children: ReactNode;
}

export function InventoryProvider({ children }: InventoryProviderProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    migrateLocalInventory()
      .then(setInventory)
      .catch((err: unknown) => {
        console.error("Inventory initialization failed:", err);
        setError("Failed to load inventory from the database.");
      })
      .finally(() => setLoading(false));
  }, []);

  async function addItem(item: Omit<InventoryItem, "id" | "updatedAt">) {
    const savedItem = await addInventory(item);
    setInventory((current) => [...current, savedItem]);
    setError("");
  }

  async function updateItem(item: InventoryItem) {
    const savedItem = await updateInventory(item.id, {
      name: item.name,
      image: item.image,
      category: item.category,
      quantity: item.quantity,
      level: item.level,
      mastered: item.mastered,
      forma: item.forma,
      notes: item.notes,
    });

    setInventory((current) =>
      current.map((existing) =>
        existing.id === savedItem.id ? savedItem : existing,
      ),
    );
    setError("");
  }

  async function removeItem(id: string) {
    await deleteInventory(id);
    setInventory((current) => current.filter((item) => item.id !== id));
    setError("");
  }

  return (
    <InventoryContext.Provider
      value={{ inventory, loading, error, addItem, updateItem, removeItem }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error("useInventory must be used inside InventoryProvider.");
  }

  return context;
}
