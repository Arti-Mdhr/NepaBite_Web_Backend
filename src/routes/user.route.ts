import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadUserImage } from "../middleware/upload.middleware";
import { SavedRecipesController } from "../controllers/saved-recipes.controller";

const router = Router();
const controller = new UserController();
const savedRecipesController = new SavedRecipesController();

// POST /api/auth/register
router.post("/register", (req, res) => controller.registerUser(req, res));

// POST /api/auth/login
router.post("/login", (req, res) => controller.loginUser(req, res));

// GET /api/auth/profile
router.get("/profile", authMiddleware, (req, res) => controller.getProfile(req, res));



// ...
router.post(
  "/profile/image",
  authMiddleware,
  uploadUserImage.single("image"),
  (req, res) => controller.uploadProfileImage(req, res)
);

// Route to save a recipe to the user's profile
router.post("/save-recipe", authMiddleware, (req, res) => savedRecipesController.saveRecipe(req, res));

// Route to get all saved recipes for the user
router.get("/saved-recipes", authMiddleware, (req, res) => savedRecipesController.getSavedRecipes(req, res));

// Route to remove a saved recipe
router.delete("/saved-recipes/:recipeId", authMiddleware, (req, res) => savedRecipesController.removeSavedRecipe(req, res));

router.post("/forgot-password", (req,res) =>
  controller.forgotPassword(req,res)
);

router.post("/reset-password", (req,res) =>
  controller.resetPassword(req,res)
);

export default router;


