import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/user.route";
import adminUserRoutes from "./routes/admin/user.route";
import { connectDB } from "./database/mongodb";
import recipeRoutes from "./routes/recipe.route";
import adminRecipeRoutes from "./routes/admin/recipe.route";
import cartRoutes from "./routes/cart.route";
import savedRecipesRoutes from "./routes/saved-recipes.route"; // import saved recipes route

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/api/auth", authRoutes);

// Admin user management routes (separate from auth)
app.use("/api/admin/users", adminUserRoutes);

app.get("/", (_, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Public recipe routes
app.use("/api/recipes", recipeRoutes);

// Admin recipe management
app.use("/api/admin/recipes", adminRecipeRoutes);

// Register cart routes
app.use("/api/cart", cartRoutes);

// Saved recipes routes
app.use("/api/saved-recipes", savedRecipesRoutes);  // Now use the routes correctly