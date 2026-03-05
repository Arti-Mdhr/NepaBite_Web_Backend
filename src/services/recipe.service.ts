import mongoose from "mongoose";
import { RecipeModel, IRecipe, IReview } from "../models/recipe.model";

export class RecipeService {
  async createRecipe(data: Partial<IRecipe>) {
    if (!data.title || !data.description || !data.category) {
      throw new Error("title, description and category are required");
    }
    if (!data.ingredients || data.ingredients.length === 0) {
      throw new Error("at least one ingredient is required");
    }
    if (!data.instructions || data.instructions.length === 0) {
      throw new Error("at least one instruction step is required");
    }
    const recipe = new RecipeModel(data);
    return recipe.save();
  }

  async getAllRecipes(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return RecipeModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getRecipeById(id: string): Promise<IRecipe> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid recipe id");
    }
    const recipe = await RecipeModel.findById(id);
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    return recipe;
  }

  async updateRecipe(id: string, data: Partial<IRecipe>) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid recipe id");
    }
    const recipe = await RecipeModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    return recipe;
  }

  async deleteRecipe(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid recipe id");
    }
    const result = await RecipeModel.findByIdAndDelete(id);
    if (!result) {
      throw new Error("Recipe not found");
    }
    return result;
  }

  async addReviewToRecipe(
    recipeId: string,
    userId: string,
    rating: number,
    comment: string
  ) {
    const recipe = await this.getRecipeById(recipeId);
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const newReview: IReview = {
      _id: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(userId),
      rating,
      comment,
      createdAt: new Date(),
    };

    recipe.reviews.push(newReview);

    const total = recipe.reviews.reduce((s: number, r: IReview) => s + r.rating, 0);
    recipe.averageRating = total / recipe.reviews.length;

    await recipe.save();
    return recipe;
  }

async removeReviewFromRecipe(
  recipeId: string,
  reviewId: string,
  userId: string,
  userRole: string
) {
  const recipe = await this.getRecipeById(recipeId);

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new Error("Invalid review id");
  }

  // look up the review manually since `reviews` is a plain array
  const reviewIndex = recipe.reviews.findIndex(r => r._id.toString() === reviewId);
  if (reviewIndex === -1) {
    throw new Error("Review not found");
  }

  const review = recipe.reviews[reviewIndex];

  // 🔐 Only review owner OR admin can delete
  if (
    review.userId.toString() !== userId &&
    userRole !== "admin"
  ) {
    throw new Error("Not authorized to delete this review");
  }

  // remove the review from the array
  recipe.reviews.splice(reviewIndex, 1);

  const total = recipe.reviews.reduce(
    (s: number, r: any) => s + r.rating,
    0
  );

  recipe.averageRating =
    recipe.reviews.length > 0
      ? total / recipe.reviews.length
      : 0;

  await recipe.save();
  return recipe;
}
}