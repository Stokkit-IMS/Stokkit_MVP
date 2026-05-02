import express from "express";
const router = express.Router();
export default router;

import requireUser from "../middleware/requireUser.js";
import requireBody from "../middleware/requireBody.js";
import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  deleteOrder,
  approveOrder,
} from "../db/queries/orders.js";

router.use(requireUser);

router.post(
  "/",
  requireBody(["supplier_name", "supplier_email", "status"]),
  async (req, res) => {
    const { supplier_name, supplier_email, status, approved_by } = req.body;
    const allowedStatuses = ["draft", "submitted", "received", "complete"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
        allowed: allowedStatuses,
      });
      // added this check from chatGPT in order to safeguard against unauthorized statuses
    }
    const user_id = req.user.id;
    const created_by = req.user.id;
    const createdOrder = await createOrder(
      supplier_name,
      supplier_email,
      status,
      created_by,
      approved_by || null,
      user_id,
    );
    res.status(201).json(createdOrder);
  },
);

router.get("/", async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id);
  res.json(orders);
});

router.param("id", async (req, res, next, id) => {
  try {
    const order = await getOrderById(id, req.user.id);
    if (!order) return res.status(404).json("Order not found.");
    req.order = order;
    next();
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res) => {
  res.json(req.order);
});

router.delete("/:id", async (req, res) => {
  await deleteOrder(req.order.id);
  res.status(204);
});

router.put("/:id", async (req, res) => {
  const updated = await approveOrder(req.user.id, req.order.id);
  if (!updated) return res.status(400).json("Order already approved");
  res.status(200).json(updated);
});
