import { Request, Response } from "express";
import * as truckService from "../services/truckService";
import { AuthRequest } from "../middlewares/authMiddleware";

/** GET /trucks */
export async function getTrucks(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const trucks = await truckService.getAllTrucks(userId);
    res.json(trucks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/** POST /trucks */
export async function addTruck(req: AuthRequest, res: Response) {
  console.log("adding truck", req.body);
  try {
    const userId = req.user!.userId;
    const { model, garageId } = req.body;
    const newTruck = await truckService.createTruck(userId, { model, garageId });
    res.status(201).json(newTruck);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

/** GET /trucks/:id */
export async function getTruckById(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const truckId = parseInt(req.params.id, 10);
    if (isNaN(truckId)) {
      return res.status(400).json({ error: 'Invalid truck id' });
    }
    const truck = await truckService.getTruckById(userId, truckId);
    if (!truck) {
      return res.status(404).json({ error: 'Truck not found' });
    }
    res.json(truck);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/** POST /trucks/:id/assign-driver */
export async function assignDriverToTruck(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const truckId = parseInt(req.params.id, 10);
    const { driverId } = req.body;
    if (isNaN(truckId) || !driverId) {
      return res.status(400).json({ error: 'Invalid truck id or driver id' });
    }
    const updatedTruck = await truckService.assignDriverToTruck(userId, truckId, driverId);
    res.json(updatedTruck);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}


