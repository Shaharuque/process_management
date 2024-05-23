import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import processRoute from "./routes/process.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yz2oh.mongodb.net/process_management?retryWrites=true&w=majority`);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/process", processRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: "Something Went Wrong",
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});
