import { Router } from "express";
import { getGarages, addGarage } from "../controllers/garageController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// Apply authenticate middleware to individual routes instead of using router.use()
router.get("/", authenticate, getGarages);
router.post("/", authenticate, addTruck);

export default router;