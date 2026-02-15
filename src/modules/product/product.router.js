import express from "express";
import * as Product from "./product.controller.js";
import * as productSchema from "./product.validation.js";
import { validation } from "../../middleware/validation.js";
import { uploadArrayOfFiles } from "../../middleware/fileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
let fieldsArray = [
  { name: "imgCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
];
const productRouter = express.Router({ mergeParams: true });
productRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin", 'user'),
    uploadArrayOfFiles(fieldsArray),
    validation(productSchema.createProductSchema),
    Product.createProduct,
  )
  .get( Product.getAllProducts);
productRouter
  .route("/:id")
  .get( validation(productSchema.getAndDeleteProductSchema), Product.getProduct)
  .put(
    protectedRoutes,
    allowedTo("admin"),
    validation(productSchema.updateProductSchema),
    Product.updateProduct,
  )
  .delete(
    protectedRoutes,
    allowedTo("admin"),
    validation(productSchema.getAndDeleteProductSchema),
    Product.deleteProduct,
  );

export default productRouter;
