import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import { dbConnection } from "./database/dbconnection.js";
import { Routes } from "./src/modules/index.routes.js";
const app = express();
const port = 3000;
// app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
app.use(morgan("dev"));
Routes(app);
dbConnection();
app.listen(process.env.PORT||port, () => console.log(`Example app listening on port ${port}!`));
process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection", err);
});
