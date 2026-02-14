import express from "express";
import * as wishlist from "./wishlist.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const wishlistRouter = express.Router();
wishlistRouter
  .route("/")
  .patch(protectedRoutes, allowedTo("user"), wishlist.addToWishlist)
  .delete(protectedRoutes, allowedTo("user"), wishlist.removeFromWishlist)
  .get(protectedRoutes, allowedTo("user"), wishlist.getAllUserWishlist)

export default wishlistRouter;
