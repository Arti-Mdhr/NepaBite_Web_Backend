import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { LoginUserDTO, RegisterUserDTO } from "../dtos/user.dto";

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
      return res
        .status(500)
        .json({
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

      return res
        .status(201)
        .json({
          success: true,
          message: "Login Successful",
          token: loginResult.token,
          user: loginResult.user,
        });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, message: error.message || "User Login Failed" });
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
}
