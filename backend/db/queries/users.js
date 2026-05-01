import db from "../client.js";
import bcrypt from "bcrypt";

export async function createUser(name, email, password, contact_number) {
  const sql = `
  INSERT INTO users
    (name, email, password, contact_number)
  VALUES ($1, $2, $3, $4) RETURNING *`;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [name, email, hashedPassword, contact_number]);
  return user;
}
export async function login(email, password) {
  const sql = `
  SELECT *
  FROM users
  WHERE email = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [email]);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  return user;
}
export async function getUserById(id) {
  const sql = `
  SELECT * FROM 
    users
  WHERE id = $1`;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
