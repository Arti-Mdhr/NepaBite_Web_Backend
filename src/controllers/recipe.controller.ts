import { Request, Response } from "express";
import { RecipeService } from "../services/recipe.service";

const recipeService = new RecipeService();

export class RecipeController {
createRecipe = async (req: Request, res: Response) => {
  try {
    
    const adminId = (req as any).user?.id;

    const imagePath = req.file
      ? `/uploads/recipes/${req.file.filename}`
      : undefined;

    let { title, description, category, ingredients, instructions } = req.body;

    // Parse JSON arrays from FormData
    try {
      if (typeof ingredients === "string") {
        ingredients = JSON.parse(ingredients);
      }

      if (typeof instructions === "string") {
        instructions = JSON.parse(instructions);
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: "Ingredients or instructions must be valid JSON arrays",
      });
    }

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({
        success: false,
        message: "Ingredients must be an array",
      });
    }

    if (!Array.isArray(instructions)) {
      return res.status(400).json({
        success: false,
        message: "Instructions must be an array",
      });
    }

    const recipe = await recipeService.createRecipe({
      title,
      description,
      category,
      ingredients,
      instructions,
      image: imagePath,
      createdBy: adminId,
    });

    return res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      recipe,
    });

  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Create recipe failed",
    });
  }
};

  // PUBLIC: Get all recipes
  getAllRecipes = async (req: Request, res: Response) => {
    try {
      const page = req.query.page ? parseInt(String(req.query.page)) : 1;
      const limit = req.query.limit ? parseInt(String(req.query.limit)) : 10;

      const recipes = await recipeService.getAllRecipes(page, limit);

      return res.status(200).json({
        success: true,
        recipes,
        page,
        limit,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch recipes",
      });
    }
  };

  // PUBLIC: Get one recipe
  getRecipeById = async (req: Request, res: Response) => {
    try {
      const recipe = await recipeService.getRecipeById(req.params.id);

      return res.status(200).json({
        success: true,
        recipe,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 404).json({
        success: false,
        message: error.message || "Recipe not found",
      });
    }
  };

updateRecipe = async (req: Request, res: Response) => {
  try {
    const imagePath = req.file
      ? `/uploads/recipes/${req.file.filename}`
      : undefined;

    let { title, description, category, ingredients, instructions } = req.body;

    // 🔥 SAFE PARSING FOR INGREDIENTS
    if (ingredients) {
      if (Array.isArray(ingredients)) {
        ingredients = ingredients;
      } else {
        try {
          ingredients = JSON.parse(ingredients);
        } catch {
          return res.status(400).json({
            success: false,
            message: "Invalid ingredients format",
          });
        }
      }
    }

    // 🔥 SAFE PARSING FOR INSTRUCTIONS
    if (instructions) {
      if (Array.isArray(instructions)) {
        instructions = instructions;
      } else {
        try {
          instructions = JSON.parse(instructions);
        } catch {
          return res.status(400).json({
            success: false,
            message: "Invalid instructions format",
          });
        }
      }
    }

    const updated = await recipeService.updateRecipe(
      req.params.id,
      {
        title,
        description,
        category,
        ingredients,
        instructions,
        ...(imagePath && { image: imagePath }),
      }
    );

    return res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      recipe: updated,
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Update failed",
    });
  }
};
  // ADMIN: Delete recipe
  deleteRecipe = async (req: Request, res: Response) => {
    try {
      const result = await recipeService.deleteRecipe(req.params.id);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Delete failed",
      });
    }
  };

  // Add Review
  addReview = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { recipeId, rating, comment } = req.body;

      // Ensure all required fields are present
      if (!recipeId || !rating || !comment) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const updatedRecipe = await recipeService.addReviewToRecipe(recipeId, userId, rating, comment);
      return res.status(200).json({ success: true, updatedRecipe });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Remove Review
removeReview = async (req: Request, res: Response) => {
  try {
    const { recipeId, reviewId } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const updatedRecipe =
      await recipeService.removeReviewFromRecipe(
        recipeId,
        reviewId,
        userId,
        userRole
      );

    return res.status(200).json({
      success: true,
      updatedRecipe,
    });
  } catch (error: any) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};
}


