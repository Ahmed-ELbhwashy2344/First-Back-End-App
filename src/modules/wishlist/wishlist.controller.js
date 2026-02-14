import { AppError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { APIFeatures } from "../../utils/APIFeatures.js";
import { userModel } from "../../../database/models/user.model.js";

export const addToWishlist = catchAsyncError(async (req, res, next) => {
  const { product } = req.body;
  let result = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: product } },
    { new: true },
  );
  if (result) return res.json({ message: "success", result: result.wishlist });
  next(new AppError("product not found ", 500));
});
export const removeFromWishlist = catchAsyncError(async (req, res, next) => {
  let result = await userModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist:{ addresses:{_id:req.body.address}} } },
    { new: true },
  );
  if (result) return res.json({ message: "success", result: result.wishlist });
  next(new AppError("product not found", 500));
});
export const getAllUserWishlist = catchAsyncError(async (req, res, next) => {
  let result = await userModel.findOne({ _id: req.user._id }).populate('wishlist')
  if (result) return res.json({ message: "success", result: result.wishlist });
  next(new AppError("product not found", 500));
});
