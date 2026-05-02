import express from "express";
const router = express.Router();
export default router;

import { createUser, login } from "../db/queries/users.js";
import requireBody from "../middleware/requirebody.js";
import { createToken } from "../utils/jwt.js";

router.post(
  "/register",
  requireBody(["name", "email", "password", "contact_number"]),
  async (req, res) => {
    const { name, email, password, contact_number } = req.body;
    const user = await createUser(name, email, password, contact_number);
    const token = await createToken({ id: user.id });
    res.status(201).json(token);
  },
);

router.post("/login", requireBody(["email", "password"]), async (req, res) => {
  const { email, password } = req.body;
  const user = await login(email, password);
  if (!user) return res.status(401).json("Invalid email or password.");
  const token = await createToken({ id: user.id });
  res.json(token);
});
