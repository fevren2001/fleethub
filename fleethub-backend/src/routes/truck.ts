import { Router } from "express";
import { getTrucks, addTruck, getTruckById, assignDriverToTruck } from "../controllers/truckController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// Apply authenticate middleware to individual routes instead of using router.use()
router.get("/", authenticate, getTrucks);
router.post("/", authenticate, addTruck);
router.get("/:id", authenticate, getTruckById);
router.post("/:id/assign-driver", authenticate, assignDriverToTruck);

export default router;