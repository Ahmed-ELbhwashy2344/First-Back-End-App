import { AppError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { APIFeatures } from "../../utils/APIFeatures.js";
import { reviewModel } from "../../../database/models/review.model.js";

export const createReview = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user._id;
  let isReview = await reviewModel.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (isReview) return next(new AppError("You created review before", 409));
  let result = new reviewModel(req.body);
  await result.save();
  res.json({ message: "success", result });
});
export const getAllReviews = catchAsyncError(async (req, res) => {
  let apiFeatures = new APIFeatures(
    reviewModel.find().populate('product', 'title'),
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
export const getReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await reviewModel.findById(id);
  !result && next(new AppError("Review not found", 500));
  result && res.json({ message: "success", result });
  // if (result) return res.json({ message: "success", result });
  // next(new AppError("Category not found", 404));
});
export const updateReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await reviewModel.findOneAndUpdate(
    { _id: id, user: req.user._id },
    req.body,
    { new: true },
  );
  if (result) return res.json({ message: "success", result });
  next(new AppError("Review not found or you are not authorized to this action", 500));
});
export const deleteReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await reviewModel.findByIdAndDelete(id);
  if (result) return res.json({ message: "success", result });
  next(new AppError("Review not found", 500));
});
