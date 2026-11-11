import { Router } from "express";
import {
  getInventory,
  createInventoryItem,
  editInventoryItem,
  removeInventoryItem,
} from "../controllers/inventoryController.js";

const router = Router();

router.get("/", getInventory);
router.post("/", createInventoryItem);
router.put("/:id", editInventoryItem);
router.delete("/:id", removeInventoryItem);

export default router;
