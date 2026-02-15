import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose.connect(process.env.DB_MONGOOSE_CONNECTION);
};
