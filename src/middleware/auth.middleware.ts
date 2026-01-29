import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
  id: string;
  role: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Validate Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No Token Provided" });
  }

  const token = authHeader.split(" ")[1];

  // ✅ Support BOTH env names so you don't break other projects
  const secret = process.env.JWT_SECRET_TOKEN || process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "JWT secret not configured" });
  }

  //added

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Attach user info to request for controllers to use
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
