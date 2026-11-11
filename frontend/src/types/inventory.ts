export type InventoryCategory =
  | "Warframe"
  | "Primary"
  | "Secondary"
  | "Melee"
  | "Companion"
  | "Archwing"
  | "Mod"
  | "Relic"
  | "Resource";

export interface InventoryItem {
  id: string;
  name: string;
  image?: string;
  category: InventoryCategory;
  quantity: number;
  level: number;
  mastered: boolean;
  forma: number;
  notes: string;
  updatedAt: string;
}
