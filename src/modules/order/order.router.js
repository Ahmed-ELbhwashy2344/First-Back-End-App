import express from "express";
import * as order from "./order.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const orderRouter = express.Router();
orderRouter
  .route("/")
  .get(protectedRoutes, allowedTo("user"), order.getSpecificOrder);
orderRouter.get(
  "/allorders",
  protectedRoutes,
  allowedTo("admin"),
  order.getAllOrders,
);
orderRouter
  .route("/:id")
  .post(protectedRoutes, allowedTo("user"), order.createCashOrder);
orderRouter.post(
  "/checkout/:id",
  protectedRoutes,
  allowedTo("user"),
  order.createCheckoutSession,
);
export default orderRouter;
