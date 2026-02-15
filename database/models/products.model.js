import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      unique: [true, "product title is unique"],
      trim: true,
      required: [true, "product title is unique"],
      minLength: [2, "Too short product name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
      min: 0,
    },
    priceAfterDiscount: {
      type: Number,
      min: 0,
    },
    ratingAvg: {
      type: Number,
      min: [1, "rating must be greater than 1"],
      max: [5, "rating must be lower than 5"],
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      minLength: [5, "too short product description"],
      maxLength: [300, "too long product description"],
      required: [true, " product description is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
      required: [true, "product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    imgCover: String,
    images: [String],
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: [true, "category is required"],
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "subcategory",
      required: [true, "subcategory is required"],
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "brand",
      required: [true, "brand is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// productSchema.post("init", (doc) => {
//   doc.imgCover = process.env.IMAGR_URL + "/product/" + doc.imgCover;
//   doc.images = doc.images.map(
//     (path) => process.env.IMAGR_URL + "/product/" + path,
//   );
// });
// productSchema.post("init", (doc) => {
//   if (doc.imgCover)
//     doc.imgCover = process.env.IMAGR_URL + "/product/" + doc.imgCover;
//   if (doc.images && Array.isArray(doc.images)) {
//     doc.images = doc.images.map(
//       (path) => process.env.IMAGR_URL + "/product/" + path,
//     );
//   }
// });
productSchema.virtual("myReviews", {
  ref: "review",
  localField: "_id",
  foreignField: "product",
});
productSchema.pre(/^find/, function () {
  this.populate("category", "name")
    .populate("subCategory", "name")
    .populate("brand", "name")
    .populate("myReviews");
});

/** @type {import('mongoose').Model} */
export const productModel = mongoose.model("product", productSchema);
