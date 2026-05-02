import db from "../client.js";

export async function getLedger() {
  const sql = `
  SELECT * FROM 
    inventory_transactions`;
  const { rows: transactions } = await db.query(sql);
  return transactions;
}

export async function getTransactionById(id) {
  const sql = `
  SELECT * FROM
    inventory_transactions
  WHERE id = $1`;
  const {
    rows: [transaction],
  } = await db.query(sql, [id]);
  return transaction;
}

export async function executeStockAdjustment(
  itemId,
  quantityChange,
  reason,
  userId,
) {
  const sql = `
  INSERT INTO
    inventory_transactions
    (item_id, quantity_change, reason, user_id)
  VALUES
    ($1, $2, $3, $4) RETURNING *`;
  const {
    rows: [transaction],
  } = await db.query(sql, [itemId, quantityChange, reason, userId]);
  return transaction;
}
