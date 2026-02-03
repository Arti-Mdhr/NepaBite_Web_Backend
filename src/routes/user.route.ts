import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadUserImage } from "../middleware/upload.middleware";

const router = Router();
const controller = new UserController();

// POST /api/auth/register
router.post("/register", (req, res) => controller.registerUser(req, res));

// POST /api/auth/login
router.post("/login", (req, res) => controller.loginUser(req, res));

// GET /api/auth/profile
router.get("/profile", authMiddleware, (req, res) => controller.getProfile(req, res));



// ...
router.post(
  "/profile/image",
  authMiddleware,
  uploadUserImage.single("image"),
  (req, res) => controller.uploadProfileImage(req, res)
);

export default router;


