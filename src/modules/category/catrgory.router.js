import express from "express";
import subCategoryRouter from "../subCategory/subcategory.router.js";
import * as Category from "./catrgory.controller.js";
import { validation } from "../../middleware/validation.js";
import {
  createCategorySchema,
  getAndDeleteCategorySchema,
  updateCategorySchema,
} from "./catrgory.validation.js";
import { uploadSingleFile } from "../../middleware/fileUpload.js";

const categoryRouter = express.Router();
categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);
categoryRouter
  .route("/")
  .post(
    uploadSingleFile("image", "category"),
    validation(createCategorySchema),
    Category.createCategory,
  )
  .get(Category.getAllCategories);
categoryRouter
  .route("/:id")
  .get(validation(getAndDeleteCategorySchema), Category.getCategory)
  .put(
    uploadSingleFile("image", "category"),
    validation(updateCategorySchema),
    Category.updateCategory,
  )
  .delete(validation(getAndDeleteCategorySchema), Category.deleteCategory);

export default categoryRouter;
