// src/controllers/deliveryController.ts
import { Response } from "express";
import * as deliveryService from "../services/deliveryService";
import { calculateDistance, validateCities } from "../services/distanceService";
import { getAllCities } from "../services/cityService";
import { AuthRequest } from "../middlewares/authMiddleware";

/** GET /deliveries */
export async function getDeliveries(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const deliveries = await deliveryService.getAllDeliveries(userId);
    res.json(deliveries);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/** POST /deliveries */
export async function addDelivery(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { origin, destination, truckId, driverId } = req.body;
    
    // Validate cities and calculate distance
    validateCities(origin, destination);
    const distanceResult = await calculateDistance(origin, destination);
    
    const newDelivery = await deliveryService.createDelivery(userId, {
      origin,
      destination,
      distanceKm: distanceResult.distanceKm,
      truckId,
      driverId
    });
    
    // Add estimated duration to the response
    res.status(201).json({
      ...newDelivery,
      estimatedDurationMinutes: distanceResult.durationMinutes
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

/** GET /deliveries/:id */
export async function getDeliveryById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const deliveryId = parseInt(req.params.id);
    const delivery = await deliveryService.getDeliveryById(userId, deliveryId);
   
    if (!delivery) {
      res.status(404).json({ error: "Delivery not found" });
      return;
    }
   
    res.json(delivery);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/** PUT /deliveries/:id */
export async function updateDelivery(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const deliveryId = parseInt(req.params.id);
    const { origin, destination, status, truckId, driverId } = req.body;
    
    let distanceKm;
    
    // If origin or destination changed, recalculate distance
    if (origin !== undefined && destination !== undefined) {
      validateCities(origin, destination);
      const distanceResult = await calculateDistance(origin, destination);
      distanceKm = distanceResult.distanceKm;
    }
   
    const updatedDelivery = await deliveryService.updateDelivery(
      userId,
      deliveryId,
      { origin, destination, distanceKm, status, truckId, driverId }
    );
   
    if (!updatedDelivery) {
      res.status(404).json({ error: "Delivery not found" });
      return;
    }
   
    res.json(updatedDelivery);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

/** DELETE /deliveries/:id */
export async function deleteDelivery(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const deliveryId = parseInt(req.params.id);
   
    await deliveryService.deleteDelivery(userId, deliveryId);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

/** POST /deliveries/:id/start */
export async function startDelivery(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const deliveryId = parseInt(req.params.id);
   
    const updatedDelivery = await deliveryService.startDelivery(userId, deliveryId);
    res.json(updatedDelivery);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

/** POST /deliveries/:id/complete */
export async function completeDelivery(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const deliveryId = parseInt(req.params.id);
   
    const updatedDelivery = await deliveryService.completeDelivery(userId, deliveryId);
    res.json(updatedDelivery);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

/** GET /cities */
export async function getSupportedCities(req: AuthRequest, res: Response): Promise<void> {
  try {
    const cities = getAllCities();
    res.json(cities);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}