import db from "../client.js";

export async function addItemsToOrder(orderId, itemId, quantity, price) {
  const sql = `
INSERT INTO order_items
  (order_id, item_id, quantity, price)
VALUES 
  ($1, $2, $3, $4) RETURNING *
`;
  const {
    rows: [order],
  } = await db.query(sql, [orderId, itemId, quantity, price]);
  return order;
}
