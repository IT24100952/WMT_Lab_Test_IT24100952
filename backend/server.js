import dotenv from "dotenv";
dotenv.config();  

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import itemRoutes from "./routes/itemRoutes.js";


console.log("MONGO_URI loaded:", process.env.MONGO_URI ? "✅ Yes" : "❌ No");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Item Manager API is running..." });
});

app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 5000;


if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  });