// src/routes/deliveryRoutes.ts
import { Router } from "express";
import {
  getDeliveries,
  addDelivery,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
  startDelivery,
  completeDelivery,
  getSupportedCities,
  assignDelivery
} from "../controllers/deliveryController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// Get supported cities
router.get("/cities", authenticate, getSupportedCities);

// Basic CRUD routes
router.get("/", authenticate, getDeliveries);
router.post("/", authenticate, addDelivery);
router.get("/:id", authenticate, getDeliveryById);
router.put("/:id", authenticate, updateDelivery);
router.delete("/:id", authenticate, deleteDelivery);

// Delivery status management
router.post("/:id/start", authenticate, startDelivery);
router.post("/:id/complete", authenticate, completeDelivery);
router.post("/:id/assign", authenticate, assignDelivery);

export default router; 