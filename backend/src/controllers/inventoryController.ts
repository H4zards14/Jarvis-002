import type { Request, Response } from "express";
import {
  getInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../services/inventoryService.js";

export async function getInventory(_req: Request, res: Response) {
  try {
    const items = await getInventoryItems();
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ message: "Failed to fetch inventory." });
  }
}

export async function createInventoryItem(req: Request, res: Response) {
  try {
    const item = await addInventoryItem(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating inventory item:", error);
    res.status(500).json({ message: "Failed to create inventory item." });
  }
}

export async function editInventoryItem(req: Request, res: Response) {
  try {
    const item = await updateInventoryItem(String(req.params.id), req.body);

    if (!item) {
      res.status(404).json({ message: "Inventory item not found." });
      return;
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Error updating inventory item:", error);
    res.status(500).json({ message: "Failed to update inventory item." });
  }
}

export async function removeInventoryItem(req: Request, res: Response) {
  try {
    const deleted = await deleteInventoryItem(String(req.params.id));

    if (!deleted) {
      res.status(404).json({ message: "Inventory item not found." });
      return;
    }

    res.status(200).json({ message: "Inventory item deleted successfully." });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    res.status(500).json({ message: "Failed to delete inventory item." });
  }
}
