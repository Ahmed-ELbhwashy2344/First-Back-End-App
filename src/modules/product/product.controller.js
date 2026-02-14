import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { productModel } from "../../../database/models/products.model.js";
import { APIFeatures } from "../../utils/APIFeatures.js";

export const createProduct = catchAsyncError(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  req.body.imgCover= req.files.imgCover[0].filename
  req.body.images= req.files.images.map(obj=> obj.filename)
  
  let result = new productModel(req.body);
  await result.save();
  res.json({ message: "success", result });
});
export const getAllProducts = catchAsyncError(async (req, res) => {
  let Filter = {};
  if (req.params.brandId) {
    Filter = { brand: req.params.brandId };
  }
  let apiFeatures = new APIFeatures(
    productModel.find(Filter),
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
export const getProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await productModel.findById(id);
  !result && next(new AppError("Product not found", 500));
  result && res.json({ message: "success", result });
  // if (result) return res.json({ message: "success", result });
  // next(new AppError("Product not found", 404));
});
export const updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) req.body.slug = slugify(req.body.title);
  let result = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (result) return res.json({ message: "success", result });
  next(new AppError("Product not found", 500));
});
export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await productModel.findByIdAndDelete(id);
  if (result) return res.json({ message: "success", result });
  next(new AppError("Product not found", 500));
});
