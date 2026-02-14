import { AppError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { APIFeatures } from "../../utils/APIFeatures.js";
import { couponModel } from "../../../database/models/coupoun.model.js";
import qrcode from "qrcode";

export const createCoupon = catchAsyncError(async (req, res, next) => {
  let result = new couponModel(req.body);
  await result.save();
  res.json({ message: "success", result });
});
export const getAllCoupons = catchAsyncError(async (req, res) => {
  let apiFeatures = new APIFeatures(
    couponModel.find(),
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
export const getCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await couponModel.findById(id);
  !result && next(new AppError("Coupon not found", 500));
  let url = await qrcode.toDataURL(result.code)
  result && res.json({ message: "success", result, url });
  // if (result) return res.json({ message: "success", result });
  // next(new AppError("Category not found", 404));
});
export const updateCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await couponModel.findByIdAndUpdate(
    id,
    req.body,
    { new: true },
  );
  if (result) return res.json({ message: "success", result });
  next(new AppError("Coupon not found or you are not authorized to this action", 500));
});
export const deleteCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await couponModel.findByIdAndDelete(id);
  if (result) return res.json({ message: "success", result });
  next(new AppError("Coupon not found", 500));
});
