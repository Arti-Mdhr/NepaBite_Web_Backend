import { CartModel } from "../models/cart.model";

export class CartService {

  async addItemToCart(userId: string, name: string, quantity: number) {
    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      cart = new CartModel({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ name, quantity });
    }

    await cart.save();
    return cart;
  }

  async getCartByUserId(userId: string) {
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) return { items: [] };
    return cart;
  }

  async removeItemFromCart(userId: string, name: string) {
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter(
      (item) => item.name.toLowerCase() !== name.toLowerCase()
    );

    await cart.save();
    return cart;
  }
}