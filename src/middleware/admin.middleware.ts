import { Request, Response, NextFunction } from "express";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user; // set by authMiddleware

  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }

  next();
};
