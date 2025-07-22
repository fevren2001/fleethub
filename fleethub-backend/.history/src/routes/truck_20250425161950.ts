import { Router } from "express";
import { getTrucks, addTruck } from "../controllers/truckController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// All truck routes require authentication
router.use(authenticate);

router.get("/", getTrucks);
router.post("/", addTruck);

export default router;
