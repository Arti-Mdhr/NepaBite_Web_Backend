import express from "express";
import cors from "cors";
import authRoutes from "./routes/user.route";
import adminUserRoutes from "./routes/admin/user.route";
import recipeRoutes from "./routes/recipe.route";
import adminRecipeRoutes from "./routes/admin/recipe.route";
import cartRoutes from "./routes/cart.route";
import savedRecipesRoutes from "./routes/saved-recipes.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/admin/recipes", adminRecipeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/saved-recipes", savedRecipesRoutes);

app.get("/", (_, res) => {
  res.send("API running");
});

export default app;