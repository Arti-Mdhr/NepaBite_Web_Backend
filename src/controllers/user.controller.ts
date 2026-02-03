import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { LoginUserDTO, RegisterUserDTO } from "../dtos/user.dto";
import { AdminEditUserDTO } from "../dtos/user.dto";

const userService = new UserService();

export class UserController {
  registerUser = async (req: Request, res: Response) => {
    console.log("Register user request body:", req.body);
    try {
      const registerDetailsParsed = RegisterUserDTO.safeParse(req.body);

      if (!registerDetailsParsed.success) {
        return res
          .status(400)
          .json({ success: false, message: "Registration Failed" });
      }

      const user = await userService.createUser(registerDetailsParsed.data);

      return res
        .status(200)
        .json({ success: true, message: "User registration Successful", user });
    } catch (error: any) {
      // Handling unknown errors
      return res.status(500).json({
        success: false,
        message: error.message || "User Registration Failed",
      });
    }
  };

  loginUser = async (req: Request, res: Response) => {
    const loginDetailsParsed = LoginUserDTO.safeParse(req.body);

    try {
      if (!loginDetailsParsed.success) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid Credentials" });
      }

      const { email, password } = loginDetailsParsed.data;

      const loginResult = await userService.loginUser(email, password);

      return res.status(201).json({
        success: true,
        message: "Login Successful",
        token: loginResult.token,
        user: loginResult.user,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({
          success: false,
          message: error.message || "User Login Failed",
        });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      const user = await userService.getUserById(userId);

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || "User not found",
      });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = await (req as any).user.id;
      if (!userId) {
        return res.status(401).json({ message: "User Doesnt Exist" });
      }
      userService.deleteUser(userId);
      return res.status(200).json({ message: "User Deleted Successfully" });
    } catch (error: any) {
      return res.status(401).json({ message: "User Delete Failed" });
    }
  };

  // ADMIN: list users
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const page = req.query.page ? parseInt(String(req.query.page)) : 1;
      const limit = req.query.limit ? parseInt(String(req.query.limit)) : 10;

      const users = await userService.getAllUsers(page, limit);

      return res.status(200).json({ success: true, users, page, limit });
    } catch (error: any) {
      return res
        .status(500)
        .json({
          success: false,
          message: error.message || "Failed to fetch users",
        });
    }
  };

  //  ADMIN: get user by id (uses params.id)
  getUserById = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);

      return res.status(200).json({ success: true, user });
    } catch (error: any) {
      return res
        .status(404)
        .json({ success: false, message: error.message || "User not found" });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;

      //  Add console logs for debugging
      console.log("Update request body:", req.body);
      console.log("Update request file:", req.file);

      // Build the data object BEFORE parsing
      const updateData: any = {
        fullName: req.body.fullName,
        email: req.body.email,
        role: req.body.role,
      };

      // Add password if provided
      if (req.body.password?.trim()) {
        updateData.password = req.body.password.trim();
      }

      // Add image path if file was uploaded
      if (req.file) {
        updateData.image = `/uploads/users/${req.file.filename}`;
      }

      console.log("Final update data:", updateData);

      // ✅ Now parse the complete data
      const parsed = AdminEditUserDTO.safeParse(updateData);
      if (!parsed.success) {
        console.log("Validation errors:", parsed.error.flatten());
        return res.status(400).json({
          success: false,
          message: "Invalid update payload",
          errors: parsed.error.flatten(),
        });
      }

      const updated = await userService.updateUser(userId, parsed.data);

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updated,
      });
    } catch (error: any) {
      console.error("Update user error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Update failed",
      });
    }
  };

  // ADMIN: delete any user by id
  adminDeleteUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const result = await userService.deleteUser(userId);

      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res
        .status(400)
        .json({ success: false, message: error.message || "Delete failed" });
    }
  };

  // ADMIN: create user with optional image
  adminCreateUser = async (req: Request, res: Response) => {
    try {
      const imagePath = req.file
        ? `/uploads/users/${req.file.filename}`
        : undefined;

      const user = await userService.adminCreateUser({
        ...req.body,
        image: imagePath,
      });

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Create user failed",
      });
    }
  };

  uploadProfileImage = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Image is required" });
      }

      const imagePath = `/uploads/users/${req.file.filename}`;

      const updated = await userService.updateUser(userId, {
        image: imagePath,
      });

      return res.status(200).json({
        success: true,
        message: "Image uploaded",
        user: updated,
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ success: false, message: error.message || "Upload failed" });
    }
  };
}
