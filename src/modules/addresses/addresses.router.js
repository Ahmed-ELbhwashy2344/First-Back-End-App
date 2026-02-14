import express from "express";
import * as address from "./addresses.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const addressRouter = express.Router();
addressRouter
  .route("/")
  .patch(protectedRoutes, allowedTo("user"), address.addAddress)
  .delete(protectedRoutes, allowedTo("user"), address.removeAddress)
  .get(protectedRoutes, allowedTo("user"), address.getAllAddresses);

export default addressRouter;
