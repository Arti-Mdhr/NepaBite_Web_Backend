import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { registerDto, loginDto } from "../dtos/user.dto";

const service = new UserService();

export class AuthController {
  // REGISTER
  async register(req: Request, res: Response) {
    try {
      // Validate request body
      const data = registerDto.parse(req.body);

      // Call service
      const user = await service.register(data.email, data.password);

      // Send response (omit password)
      res.status(201).json({
        id: user._id,
        email: user.email,
        role: user.role,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // LOGIN
  async login(req: Request, res: Response) {
    try {
      // Validate request body
      const data = loginDto.parse(req.body);

      // Call service
      const result = await service.login(data.email, data.password);

      res.json(result); // { token: "..." }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
