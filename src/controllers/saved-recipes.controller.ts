// controllers/saved-recipes.controller.ts
import { Request, Response } from "express";
import { UserService } from "../services/user.service";  // Assuming UserService exists

const userService = new UserService();

export class SavedRecipesController {
  saveRecipe = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { recipeId } = req.body;

      if (!recipeId) {
        return res.status(400).json({ success: false, message: "recipeId is required" });
      }

      const savedRecipes = await userService.saveRecipeToUser(userId, recipeId);
      return res.status(200).json({ success: true, savedRecipes });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  getSavedRecipes = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const savedRecipes = await userService.getSavedRecipes(userId);
      return res.status(200).json({ success: true, savedRecipes });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  removeSavedRecipe = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { recipeId } = req.params;

      const savedRecipes = await userService.removeSavedRecipe(userId, recipeId);
      return res.status(200).json({ success: true, savedRecipes });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}