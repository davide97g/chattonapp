import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../features/auth";

// Middleware for protected routes
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!JWT_SECRET) {
    return res.status(500).json({ message: "Bad server configuration" });
  }

  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token.split(" ")[1], JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    (req as any).user = user;
    next();
  });
};
