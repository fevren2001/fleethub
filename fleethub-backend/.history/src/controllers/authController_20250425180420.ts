import { Request, Response } from "express";
import * as authService from "../services/authService";

export async function register(req: Request, res: Response) {
  console.log("AUTH CONTROLLER: Registering user with email:", );

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
