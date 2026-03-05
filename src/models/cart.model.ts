import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  name: string;
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
}

const CartItemSchema = new Schema<ICartItem>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export const CartModel = mongoose.model<ICart>("Cart", CartSchema);