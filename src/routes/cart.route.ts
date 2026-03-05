import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const cartController = new CartController();

// Add item to cart
router.post("/", authMiddleware, (req, res) => cartController.addItemToCart(req, res));

// Get user's cart
router.get("/", authMiddleware, (req, res) => cartController.getUserCart(req, res));

router.delete("/:name", authMiddleware, (req, res) =>
  cartController.removeItemFromCart(req, res)
);
export default router;