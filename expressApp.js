import express from "express";
const app = express();
export default app;

import morgan from "morgan";
import getUserFromToken from "./backend/middleware/getUserFromToken.js";
import ordersRouter from "./backend/api/orders.js";
import usersRouter from "./backend/api/users.js";
// import other routers here.

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
// add other routers here.

app.use((err, req, res, next) => {
  switch (err.code) {
    // Invalid type
    case "22P02":
      return res.status(400).json(err.message);
    // Unique constraint violation
    case "23505":
      return res
        .status(400)
        .json("Entered Item already exists and can not be added again");
    // Foreign key violation
    case "23503":
      return res.status(400).json(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json("Sorry! Something went wrong.");
  next();
});
