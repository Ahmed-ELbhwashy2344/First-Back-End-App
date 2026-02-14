import mongoose from "mongoose";

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      required: [true, "coupoun is required"],
      unique: true,
    },
    discount: {
      type: Number,
      min: 0,
      required: [true, "coupoun discount is required"],
    },
    expires: {
      type: Date,
      required: [true, "coupoun date is required"],
    },
  },
  {
    timestamps: true,
  },
);
/** @type {import('mongoose').Model} */
export const couponModel = mongoose.model("coupoun", couponSchema);
