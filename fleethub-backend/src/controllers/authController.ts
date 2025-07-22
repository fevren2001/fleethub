import { Request, Response } from "express";
import * as authService from "../services/authService";
import { AuthRequest } from "../middlewares/authMiddleware";

export async function register(req: Request, res: Response) {
  console.log("AUTH CONTROLLER: Registering user with email:", req.body.email);

  try {
    const user = await authService.register(req.body.email, req.body.password);
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getCurrentUser(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return; // Just return (void) after sending the response
    }
    
    const user = await authService.getUserById(req.user.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return; // Just return (void) after sending the response
    }
    
    // Return user without the password hash
    const { passwordHash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}