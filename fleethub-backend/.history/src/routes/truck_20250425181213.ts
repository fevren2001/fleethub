import { Router } from "express";
import { getTrucks, addTruck } from "../controllers/truckController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// Apply authenticate middleware to individual routes instead of using router.use()
router.get("/", authenticate, getTrucks);
router.post("/", authenticate, addTruck);

export default router;