import express from "express";
import * as coupon from "./coupon.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const couponRouter = express.Router();
couponRouter
  .route("/")
  .post(protectedRoutes, allowedTo("admin", "user"), coupon.createCoupon)
  .get(coupon.getAllCoupons);
couponRouter
  .route("/:id")
  .get(coupon.getCoupon)
  .put(protectedRoutes, allowedTo("admin", "user"), coupon.updateCoupon)
  .delete(protectedRoutes, allowedTo("admin", "user"), coupon.deleteCoupon);

export default couponRouter;
