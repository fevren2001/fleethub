import { Router } from "express";
import { getGarages, addGarage, getGarageById, updateGarage, deleteGarage } from "../controllers/garageController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// Apply authenticate middleware to individual routes
router.get("/", authenticate, getGarages);
router.post("/", authenticate, addGarage);
router.get("/:id", authenticate, getGarageById);
router.put("/:id", authenticate, updateGarage);
router.delete("/:id", authenticate, deleteGarage);

export default router;