import { Router } from "express";
import { UserController } from "../../controllers/user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";
import { uploadUserImage } from "../../middleware/upload.middleware";

const router = Router();
const controller = new UserController();

/**
 * Admin-only user management
 * Base: /api/admin/users
 */

// List users
router.get("/", authMiddleware, requireAdmin, (req, res) =>
  controller.getAllUsers(req, res),
);

// Get one user
router.get("/:id", authMiddleware, requireAdmin, (req, res) =>
  controller.getUserById(req, res),
);

// Update user (edit)
router.put(
  "/:id",
  authMiddleware,
  requireAdmin,
  uploadUserImage.single("image"), // 👈 Add this line
  (req, res) => controller.updateUser(req, res),
);

// Delete user
router.delete("/:id", authMiddleware, requireAdmin, (req, res) =>
  controller.adminDeleteUser(req, res),
);

router.post(
  "/",
  authMiddleware,
  requireAdmin,
  uploadUserImage.single("image"), // FormData field name
  (req, res) => controller.adminCreateUser(req, res),
);

export default router;
