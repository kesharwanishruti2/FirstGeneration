import connectDB from "./config/db.js";
import dotenv from "dotenv";
import app from "./app/app.js";
import mongoose from "mongoose";

dotenv.config();
connectDB();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });