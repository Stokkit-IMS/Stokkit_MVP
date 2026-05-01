import db from "../client.js";

export async function createItem(
  name,
  description,
  sku,
  unit,
  quantity,
  lowStockThreshold,
  itemPhoto,
  userId,
) {
  const sql = `
    INSERT INTO items
    (name, description, sku, unit, quantity, low_stock_threshold, item_photo, user_id)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
    `;

  const {
    rows: [item],
  } = await db.query(sql, [
    name,
    description,
    sku,
    unit,
    quantity,
    lowStockThreshold,
    itemPhoto,
    userId,
  ]);
  return item;
}

export async function getItems() {
  const sql = `
SELECT * FROM items
`;
  const { rows: items } = await db.query(sql);
  return items;
}

export async function getItemById(id) {
  const sql = `
    SELECT * FROM items WHERE id = $1
    `;
  const {
    rows: [item],
  } = await db.query(sql, [id]);
  return item;
}
