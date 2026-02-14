import { categoryModel } from "../../../database/models/category.model.js";
import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { APIFeatures } from "../../utils/APIFeatures.js";

export const createCategory = catchAsyncError(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;
  let result = new categoryModel(req.body);
  await result.save();
  res.json({ message: "success", result });
});
export const getAllCategories = catchAsyncError(async (req, res) => {
  let apiFeatures = new APIFeatures(
    categoryModel.find(),
    req.query,
    req._parsedUrl.query,
  )
    .paginate()
    .filter()
    .sort()
    .search()
    .fields();
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "success", PageNumber: apiFeatures.page, result });
});
export const getCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await categoryModel.findById(id);
  !result && next(new AppError("Category not found", 500));
  result && res.json({ message: "success", result });
  // if (result) return res.json({ message: "success", result });
  // next(new AppError("Category not found", 404));
});
export const updateCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;
  let result = await categoryModel.findByIdAndUpdate(
    id,
    req.body,
    { new: true },
  );
  if (result) return res.json({ message: "success", result });
  next(new AppError("Category not found", 500));
});
export const deleteCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await categoryModel.findByIdAndDelete(id);
  if (result) return res.json({ message: "success", result });
  next(new AppError("Category not found", 500));
});
