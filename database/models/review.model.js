import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: [true, "comment is required"],
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.pre(/^find/, function () {
  this.populate('user', 'name')

});

/** @type {import('mongoose').Model} */
export const reviewModel = mongoose.model("review", reviewSchema);
