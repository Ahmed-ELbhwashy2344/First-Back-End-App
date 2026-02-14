import express from "express";
import * as cart from "./cart.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const cartRouter = express.Router();
cartRouter
  .route("/")
  .post(protectedRoutes, allowedTo( "user"), cart.addProductToCart)
  .get(protectedRoutes, allowedTo( "user"), cart.getLoggedUserCart);
  cartRouter.post('/applycoupon',protectedRoutes, allowedTo( "user"), cart.applyCoupon)
cartRouter
  .route("/:id")
  .delete(protectedRoutes, allowedTo("admin", "user"), cart.removeProductFromCart)
  .put(protectedRoutes, allowedTo("admin", "user"), cart.updateQuantity)
  // .get(coupon.getCoupon)

export default cartRouter;
