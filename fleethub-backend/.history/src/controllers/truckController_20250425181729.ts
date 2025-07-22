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
  
  try {
    const userId = req.user!.userId;
    const { model, garageId } = req.body;
    const newTruck = await truckService.createTruck(userId, { model, garageId });
    res.status(201).json(newTruck);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
