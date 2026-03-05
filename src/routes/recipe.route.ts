import { Router } from "express";
import { RecipeController } from "../controllers/recipe.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const controller = new RecipeController();

// PUBLIC ROUTES

// GET /api/recipes
router.get("/", (req, res) => controller.getAllRecipes(req, res));

// GET /api/recipes/:id
router.get("/:id", (req, res) => controller.getRecipeById(req, res));

// ADD Review to Recipe (user can add reviews for recipes)
router.post("/review", authMiddleware, controller.addReview);

// REMOVE Review from Recipe (user can remove their reviews for recipes)
router.delete("/review/:recipeId/:reviewId", authMiddleware, controller.removeReview);


export default router;