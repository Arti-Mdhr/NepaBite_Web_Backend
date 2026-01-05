import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { registerDto, loginDto } from "../dtos/user.dto";
import z from "zod";

const service = new UserService();

export class AuthController {
  // REGISTER
  async register(req: Request, res: Response) {
    try {
      // Validate request body
      const parsed = registerDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }

      const data = parsed.data;

      // Call service
      const user = await service.register(data.email, data.password);

      // Send response (omit password)
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // LOGIN
  async login(req: Request, res: Response) {
    try {
      // Validate request body
      const parsed = loginDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }

      const data = parsed.data;

      // Call service
      const { token, user } = await service.login(data.email, data.password);

      // Send response
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: user, // user object without password
        token,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
