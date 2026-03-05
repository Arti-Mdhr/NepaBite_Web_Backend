import mongoose, { Document, Schema } from "mongoose";

export interface IIngredient {
  name: string;
  quantity: string;
}

export interface IReview {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;        // rating out of 5
  comment: string;
  createdAt: Date;
}

export interface IRecipe extends Document {
  title: string;
  description: string;
  image?: string;
  category: string;
  ingredients: IIngredient[];
  instructions: string[];
  reviews: IReview[];
  createdBy: mongoose.Types.ObjectId;
  averageRating: number;
}

const IngredientSchema = new Schema<IIngredient>(
  {
    name: { type: String, required: true },
    quantity: { type: String, required: true },
  },
  { _id: false }
);

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }
  // default _id behaviour – each sub‑document gets an ObjectId
);

const RecipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    category: { type: String, required: true },
    ingredients: { type: [IngredientSchema], required: true },
    instructions: { type: [String], required: true },
    reviews: { type: [ReviewSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const RecipeModel = mongoose.model<IRecipe>("Recipe", RecipeSchema);