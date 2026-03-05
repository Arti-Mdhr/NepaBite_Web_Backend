import { Router } from "express";
import { RecipeController } from "../../controllers/recipe.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";
import { uploadRecipeImage } from "../../middleware/recipe-upload.middleware";

const router = Router();
const controller = new RecipeController();

/**
 * Base: /api/admin/recipes
 */

// Create recipe
router.post(
  "/",
  authMiddleware,
  requireAdmin,
  uploadRecipeImage.single("image"), // 👈 add this
  (req, res) => controller.createRecipe(req, res)
);

router.put(
  "/:id",
  authMiddleware,
  requireAdmin,
  uploadRecipeImage.single("image"),  // ✅ ADD THIS
  (req, res) => controller.updateRecipe(req, res)
);

// Delete recipe
router.delete(
  "/:id",
  authMiddleware,
  requireAdmin,
  (req, res) => controller.deleteRecipe(req, res)
);



export default router;