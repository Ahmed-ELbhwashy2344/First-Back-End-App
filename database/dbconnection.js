import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose.connect(
    "mongodb+srv://ahmed:ahmed123@cluster0.0l907kc.mongodb.net/E-Commerce",
  );
};
