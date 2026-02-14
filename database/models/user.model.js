import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "username is required"],
      minLength: [1, "Too short name"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email is required"],
      minLength: 1,
      unique: [true, "email must br unique"],
    },
    password: {
      type: String,
      required: true,
      minLength: [1, "too short password"],
    },
    passwordChangedAt: Date,
    phone: {
      type: String,
      required: [true, "phone number is required"],
    },
    profilePic: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product",
      },
    ],
    addresses: [
      {
        city:String,
        street:String,
        phone:String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 8);
});

userSchema.pre("findOneAndUpdate", function () {
  if (this._update.password)
    return (this._update.password = bcrypt.hashSync(this._update.password, 8));
});

/** @type {import('mongoose').Model} */
export const userModel = mongoose.model("user", userSchema);
