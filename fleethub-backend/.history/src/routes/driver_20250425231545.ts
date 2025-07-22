import { Router } from "express";
import { 
  getDrivers, 
  addDriver, 
  getDriverById, 
  updateDriver, 
  deleteDriver,
  assignToTruck,
  removeFromTruck
} from "../controllers/driverController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// Basic CRUD routes
router.get("/", authenticate, getDrivers);
router.post("/", authenticate, addDriver);
router.get("/:id", authenticate, getDriverById);
router.put("/:id", authenticate, updateDriver);
router.delete("/:id", authenticate, deleteDriver);

// Assignment routes
router.post("/:driverId/assign/:truckId", authenticate, assignToTruck);
router.delete("/trucks/:truckId/driver", authenticate, removeFromTruck);

export default router;