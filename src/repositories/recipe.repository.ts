import { RecipeModel, IRecipe } from "../models/recipe.model";

export interface RecipeRepositoryInterface {
  createRecipe(data: Partial<IRecipe>): Promise<IRecipe>;
  getAllRecipes(skip?: number, limit?: number): Promise<IRecipe[]>;
  getRecipeById(id: string): Promise<IRecipe | null>;
  updateRecipe(id: string, data: Partial<IRecipe>): Promise<IRecipe | null>;
  deleteRecipe(id: string): Promise<IRecipe | null>;
}

export class RecipeRepository implements RecipeRepositoryInterface {
  async createRecipe(data: Partial<IRecipe>): Promise<IRecipe> {
    const recipe = new RecipeModel(data);
    return recipe.save();
  }

  async getAllRecipes(skip: number = 0, limit: number = 10): Promise<IRecipe[]> {
    return RecipeModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async getRecipeById(id: string): Promise<IRecipe | null> {
    return RecipeModel.findById(id).exec();
  }

  async updateRecipe(id: string, data: Partial<IRecipe>): Promise<IRecipe | null> {
    return RecipeModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteRecipe(id: string): Promise<IRecipe | null> {
    return RecipeModel.findByIdAndDelete(id).exec();
  }
}