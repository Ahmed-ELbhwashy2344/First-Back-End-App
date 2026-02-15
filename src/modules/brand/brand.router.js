import express from "express";
import * as brand from "./brand.controller.js";
import { validation } from "../../middleware/validation.js";
import {
  createBrandySchema,
  getAndDeleteBrandySchema,
  updateBrandySchema,
} from "./brand.validation.js";
import { getAndDeleteCategorySchema } from "../category/catrgory.validation.js";
import { uploadSingleFile } from "../../middleware/fileUpload.js";
import productRouter from "../product/product.router.js";

const brandRouter = express.Router();
brandRouter.use("/:brandId/products", productRouter);
brandRouter
  .route("/")
  .post(
    uploadSingleFile("logo"),
    validation(createBrandySchema),
    brand.createBrand,
  )
  .get(brand.getAllBrands);
brandRouter
  .route("/:id")
  .get(validation(getAndDeleteBrandySchema), brand.getBrand)
  .put(
    uploadSingleFile("logo"),
    validation(updateBrandySchema),
    brand.updateBrand,
  )
  .delete(validation(getAndDeleteCategorySchema), brand.deleteBrand);

export default brandRouter;
