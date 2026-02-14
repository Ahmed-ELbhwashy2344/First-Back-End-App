import mongoose from "mongoose";

const subcategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name must be unique"],
      trim: true,
      required: true,
      minLength: [2, "Too short subCategory"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
  },
  {
    timestamps: true,
  },
);
/** @type {import('mongoose').Model} */
export const subCategoryModel = mongoose.model(
  "subcategory",
  subcategorySchema,
);
