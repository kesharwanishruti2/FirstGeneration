import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import app from "./app/app.js";

const PORT = process.env.PORT || 3000;

// Connect to MongoDB first, then start Express server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
  });