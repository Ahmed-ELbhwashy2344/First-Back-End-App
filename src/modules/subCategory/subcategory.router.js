import express from "express";
import * as subCategory from "./subcategory.controller.js";
import * as subcategorySchema from "./subcategory.validation.js";
import { validation } from "../../middleware/validation.js";

const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter
  .route("/")
  .post(
    validation(subcategorySchema.createSubcategorySchema),
    subCategory.createSubCategory,
  )
  .get(subCategory.getAllSubCategories);
subCategoryRouter
  .route("/:id")
  .get(
    validation(subcategorySchema.getAndDeleteSubcategorySchema),
    subCategory.getSubCategory,
  )
  .put(
    validation(subcategorySchema.updateSubcategorySchema),
    subCategory.updateSubCategory,
  )
  .delete(
    validation(subcategorySchema.getAndDeleteSubcategorySchema),
    subCategory.deleteSubCategory,
  );

export default subCategoryRouter;
