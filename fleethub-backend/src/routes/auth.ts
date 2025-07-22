// Updated auth.ts router
import { Router } from "express";
import { register, login, getCurrentUser } from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getCurrentUser); // Add this new route

export default router;