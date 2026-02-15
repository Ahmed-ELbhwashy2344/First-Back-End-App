import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name must be unique"],
      trim: true,
      required: true,
      minLength: [2, "Too short name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    image: String,
  },
  {
    timestamps: true,
  },
);
// categorySchema.post("init", (doc) => {
//  if(doc.image) doc.image = process.env.IMAGR_URL + "/category/" + doc.image;
// });
/** @type {import('mongoose').Model} */
export const categoryModel = mongoose.model("category", categorySchema);
