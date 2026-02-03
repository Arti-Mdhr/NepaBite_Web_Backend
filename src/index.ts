import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/user.route";
import adminUserRoutes from "./routes/admin/user.route";
import { connectDB } from "./database/mongodb";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/api/auth", authRoutes);



// ✅ NEW: Admin user management routes (separate from auth)
app.use("/api/admin/users", adminUserRoutes);

app.get("/", (_, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/test", (req, res) => {
  res.json({ message: "Test route working" });
});
