import { Router } from "express";
import {
  getInventory,
  createInventoryItem,
  editInventoryItem,
  removeInventoryItem,
} from "../controllers/inventoryController.js";
import { csrfSynchronisedProtection } from "../middleware/csrf.js";

const router = Router();

router.get("/", getInventory);
router.post("/", csrfSynchronisedProtection, createInventoryItem);
router.put("/:id", csrfSynchronisedProtection, editInventoryItem);
router.delete("/:id", csrfSynchronisedProtection, removeInventoryItem);

export default router;
