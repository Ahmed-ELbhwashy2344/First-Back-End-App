import mongoose from "mongoose";

const brandSchema = mongoose.Schema(
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
    logo: String,
  },
  {
    timestamps: true,
  },
);
// brandSchema.post("init", (doc) => {
//   if (doc.logo) doc.logo = process.env.IMAGR_URL + "/brand/" + doc.logo;
// });
/** @type {import('mongoose').Model} */
export const brandModel = mongoose.model("brand", brandSchema);
