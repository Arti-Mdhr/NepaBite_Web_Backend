import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const controller = new AuthController();

// POST /api/auth/register
router.post("/register", (req, res) => controller.register(req, res));

// POST /api/auth/login
router.post("/login", (req, res) => controller.login(req, res));

export default router;
