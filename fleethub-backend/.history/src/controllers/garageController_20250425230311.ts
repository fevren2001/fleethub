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
  try {
    const userId = req.user!.userId;
    const { city, capacity, level } = req.body;
    const newGarage = await garageService.createGarage(userId, { city, capacity, level });
    res.status(201).json(newGarage);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

/** GET /garages/:id */
export async function getGarageById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const garageId = parseInt(req.params.id);
      const garage = await garageService.getGarageById(userId, garageId);
      
      if (!garage) {
        res.status(404).json({ error: "Garage not found" });
        return;
      }
      
      res.json(garage);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

/** PUT /garages/:id */
export async function updateGarage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const garageId = parseInt(req.params.id);
      const { city, capacity, level } = req.body;
      
      const updatedGarage = await garageService.updateGarage(
        userId, 
        garageId, 
        { city, capacity, level }
      );
      
      if (!updatedGarage) {
        res.status(404).json({ error: "Garage not found" });
        return;
      }
      
      res.json(updatedGarage);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

/** DELETE /garages/:id */
export async function deleteGarage(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const garageId = parseInt(req.params.id);
    
    await garageService.deleteGarage(userId, garageId);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}