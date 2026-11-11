import type { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    res.status(401).json({
      message: "Authentication required. Please log in.",
    });
    return;
  }

  next();
}
