import db from "../client";

export async function createOrder(
  supplierName,
  supplierEmail,
  status,
  createdBy,
  approvedBy,
  userId,
) {
  const sql = `
  INSERT INTO orders
    (supplier_name, supplier_email, status, created_by, approved_by, user_id)
  VALUES 
    ($1, $2, $3, $4, $5, $6) RETURNING *
`;
  const {
    rows: [order],
  } = await db.query(sql, [
    supplierName,
    supplierEmail,
    status,
    createdBy,
    approvedBy,
    userId,
  ]);
  return order;
}

export async function approveOrder(approvedBy, id) {
  const sql = `
  UPDATE orders
  SET approved_by = $1
  WHERE id = $2 AND approved_by IS NULL RETURNING * `;
  const {
    rows: [order],
  } = await db.query(sql, [approvedBy, id]);
  return order;
}

export async function getOrdersByUserId(userId) {
  const sql = `
  SELECT * from orders
  WHERE user_id = $1;`;
  const { rows: orders } = await db.query(sql, [userId]);
  return orders;
}

export async function getOrderById(id, userId) {
  const sql = `
  SELECT * from orders
  WHERE id = $1 AND user_id = $2`;
  const {
    rows: [order],
  } = await db.query(sql, [id, userId]);
  return order;
}

export async function deleteOrder(id) {
  const sql = `
  DELETE FROM orders
  WHERE id = $1 RETURNING *`;
  const {
    rows: [order],
  } = await db.query(sql, [id]);
  return order;
}
