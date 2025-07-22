import { Request, Response } from "express";
import * as garageService from "../services/garageService";
import { AuthRequest } from "../middlewares/authMiddleware";

/** GET /garages */
export async function getGarages(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const garages = await garageService.getAllGarages(userId);
    res.json(garages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/** POST /garages */
export async function addGarage(req: AuthRequest, res: Response) {
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


