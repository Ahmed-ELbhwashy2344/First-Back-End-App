import { AppError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { userModel } from "../../../database/models/user.model.js";

export const addAddress = catchAsyncError(async (req, res, next) => {
  let result = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    { new: true },
  );
  if (result) return res.json({ message: "success", result: result.addresses });
  next(new AppError("product not found ", 500));
});
export const removeAddress = catchAsyncError(async (req, res, next) => {
  let result = await userModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.body.address } } },
    { new: true },
  );
  if (result) return res.json({ message: "success", result: result.addresses });
  next(new AppError("product not found", 500));
});
export const getAllAddresses= catchAsyncError(async (req, res, next) => {
  let result = await userModel.findOne({ _id: req.user._id });

  if (result) return res.json({ message: "success", result: result.addresses });
  next(new AppError("product not found", 500));
});
