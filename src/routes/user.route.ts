import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();
const controller = new UserController();

// POST /api/auth/register
router.post("/register", (req, res) => controller.registerUser(req, res));

// POST /api/auth/login
router.post("/login", (req, res) => controller.loginUser(req, res));

export default router;


