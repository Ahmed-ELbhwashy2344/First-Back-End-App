import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { subCategoryModel } from "../../../database/models/subcategory.model.js";

export const createSubCategory = catchAsyncError(async (req, res) => {
  const { name, category } = req.body;
  let result = new subCategoryModel({ name, category, slug: slugify(name) });
  await result.save();
  res.json({ message: "success", result });
});
export const getAllSubCategories = catchAsyncError(async (req, res) => {
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }
  let result = await subCategoryModel.find(filter);
  res.json({ message: "success", result });
});
export const getSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await subCategoryModel.findById(id);
  !result && next(new AppError("Subcategory not found", 500));
  result && res.json({ message: "success", result });
  // if (result) return res.json({ message: "success", result });
  // next(new AppError("Category not found", 404));
});
export const updateSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  let result = await subCategoryModel.findByIdAndUpdate(
    id,

    {
      name,
      category,
      slug: slugify(name),
    },
    { new: true },
  );
  if (result) return res.json({ message: "success", result });
  next(new AppError("Subcategory not found", 500));
});
export const deleteSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await subCategoryModel.findByIdAndDelete(id);
  if (result) return res.json({ message: "success", result });
  next(new AppError("Subcategory not found", 500));
});
