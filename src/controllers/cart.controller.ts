import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

const cartService = new CartService();

export class CartController {
   addItemToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, quantity } = req.body;

    if (!name || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Missing ingredient name or quantity",
      });
    }

    const updatedCart = await cartService.addItemToCart(
      userId,
      name,
      quantity
    );

    return res.status(200).json({ success: true, updatedCart });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

    getUserCart = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const cart = await cartService.getCartByUserId(userId);

            return res.status(200).json({ success: true, cart });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    };

removeItemFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Missing ingredient name",
      });
    }

    const updatedCart = await cartService.removeItemFromCart(
      userId,
      name
    );

    return res.status(200).json({ success: true, updatedCart });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
}