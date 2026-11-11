import { pool } from "../config/database.js";

export interface InventoryItem {
  id: string;
  name: string;
  image?: string;
  category: string;
  quantity: number;
  level: number;
  mastered: boolean;
  forma: number;
  notes: string;
  updatedAt: string;
}

interface InventoryRow {
  id: string;
  name: string;
  image: string | null;
  category: string;
  quantity: number;
  level: number;
  mastered: boolean;
  forma: number;
  notes: string | null;
  updated_at: Date;
}

type NewInventoryItem = Omit<InventoryItem, "id" | "updatedAt"> & {
  id?: string;
};

function formatItem(row: InventoryRow): InventoryItem {
  return {
    id: row.id,
    name: row.name,
    image: row.image ?? undefined,
    category: row.category,
    quantity: row.quantity,
    level: row.level,
    mastered: row.mastered,
    forma: row.forma,
    notes: row.notes ?? "",
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const result = await pool.query(
    "SELECT * FROM inventory_items ORDER BY name ASC",
  );

  return result.rows.map(formatItem);
}

export async function addInventoryItem(
  item: NewInventoryItem,
): Promise<InventoryItem> {
  const result = await pool.query(
    `INSERT INTO inventory_items
      (id, name, image, category, quantity, level, mastered, forma, notes)
     VALUES
      (COALESCE($1::uuid, gen_random_uuid()), $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (id) DO NOTHING
     RETURNING *`,
    [
      item.id ?? null,
      item.name,
      item.image ?? null,
      item.category,
      item.quantity,
      item.level,
      item.mastered,
      item.forma,
      item.notes,
    ],
  );

  if (result.rows.length > 0) {
    return formatItem(result.rows[0]);
  }

  if (item.id) {
    const existing = await pool.query(
      "SELECT * FROM inventory_items WHERE id = $1",
      [item.id],
    );

    if (existing.rows.length > 0) {
      return formatItem(existing.rows[0]);
    }
  }

  throw new Error("Failed to create inventory item.");
}

export async function deleteInventoryItem(id: string): Promise<boolean> {
  const result = await pool.query("DELETE FROM inventory_items WHERE id = $1", [
    id,
  ]);

  return (result.rowCount ?? 0) > 0;
}

export async function updateInventoryItem(
  id: string,
  item: Omit<InventoryItem, "id" | "updatedAt">,
): Promise<InventoryItem | null> {
  const result = await pool.query(
    `UPDATE inventory_items
     SET name = $1,
         image = $2,
         category = $3,
         quantity = $4,
         level = $5,
         mastered = $6,
         forma = $7,
         notes = $8,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $9
     RETURNING *`,
    [
      item.name,
      item.image ?? null,
      item.category,
      item.quantity,
      item.level,
      item.mastered,
      item.forma,
      item.notes,
      id,
    ],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return formatItem(result.rows[0]);
}
