import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../config';

export interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

// Make sure there's no undefined return type
export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing token" });
    return;
  }
  
  const token = authHeader.split(" ")[1];
  try {
    console.log("Verifying token:", token, JWT_SECRET, "userId); // Debugging line
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    console.log("error here?");
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
}