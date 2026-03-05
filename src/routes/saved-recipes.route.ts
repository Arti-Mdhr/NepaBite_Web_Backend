// routes/saved-recipes.route.ts
import express from "express";
import { SavedRecipesController } from "../controllers/saved-recipes.controller";
import { authMiddleware } from "../middleware/auth.middleware"; // Assuming this middleware verifies JWT token

const router = express.Router();
const controller = new SavedRecipesController();

// POST /save: Save a recipe
router.post("/save", authMiddleware, (req, res) => controller.saveRecipe(req, res));

// GET /: Get all saved recipes
router.get("/", authMiddleware, (req, res) => controller.getSavedRecipes(req, res));

// DELETE /:recipeId: Remove saved recipe
router.delete("/remove/:recipeId", authMiddleware, (req, res) => controller.removeSavedRecipe(req, res));

export default router;