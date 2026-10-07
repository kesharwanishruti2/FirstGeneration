import mongoose from "mongoose";
import dns from "node:dns";

// Fix for Windows & ISP querySrv ECONNREFUSED DNS resolution on MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // Ignore if not supported in environment
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/internet_basics";
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes("127.0.0.1")) {
      console.error("👉 Tip: For Render/Cloud deployment, please add 'MONGO_URI' (MongoDB Atlas connection string) to your Render Environment Variables.");
    }
  }
};

export default connectDB;