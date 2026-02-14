import { AppError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { userModel } from "../../../database/models/user.model.js";
import { APIFeatures } from "../../utils/APIFeatures.js";

export const createUser = catchAsyncError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) return next(new AppError("Email is exist", 409));
  let result = new userModel(req.body);
  await result.save();
  res.json({ message: "success", result });
});
export const getAllUsers = catchAsyncError(async (req, res) => {
  let apiFeatures = new APIFeatures(
    userModel.find(),
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
export const getUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await userModel.findById(id);
  !result && next(new AppError("User not found", 500));
  result && res.json({ message: "success", result });
  // if (result) return res.json({ message: "success", result });
  // next(new AppError("Category not found", 404));
});
export const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await userModel.findByIdAndUpdate(id, req.body, { new: true });
  if (result) return res.json({ message: "success", result });
  next(new AppError("User not found", 500));
});
export const changeUserPassword = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.passwordChangedAt = Date.now();
  let result = await userModel.findByIdAndUpdate(id, req.body, { new: true });
  if (result) return res.json({ message: "success", result });
  next(new AppError("User not found", 500));
});
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await userModel.findByIdAndDelete(id);
  if (result) return res.json({ message: "success", result });
  next(new AppError("User not found", 500));
});
