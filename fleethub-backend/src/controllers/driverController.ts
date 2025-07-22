import { Response } from "express";
import * as driverService from "../services/driverService";
import { AuthRequest } from "../middlewares/authMiddleware";

/** GET /drivers */
export async function getDrivers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const drivers = await driverService.getAllDrivers(userId);
    res.json(drivers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/** POST /drivers */
export async function addDriver(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { name, skill, photoUrl } = req.body;
    const newDriver = await driverService.createDriver(userId, { name, skill, photoUrl });
    res.status(201).json(newDriver);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

/** GET /drivers/:id */
export async function getDriverById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const driverId = parseInt(req.params.id);
    const driver = await driverService.getDriverById(userId, driverId);
    
    if (!driver) {
      res.status(404).json({ error: "Driver not found" });
      return;
    }
    
    res.json(driver);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/** PUT /drivers/:id */
export async function updateDriver(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const driverId = parseInt(req.params.id);
    const { name, skill, photoUrl } = req.body;
    
    const updatedDriver = await driverService.updateDriver(
      userId, 
      driverId, 
      { name, skill, photoUrl }
    );
    
    if (!updatedDriver) {
      res.status(404).json({ error: "Driver not found" });
      return;
    }
    
    res.json(updatedDriver);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

/** DELETE /drivers/:id */
export async function deleteDriver(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const driverId = parseInt(req.params.id);
    
    await driverService.deleteDriver(userId, driverId);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

/** POST /drivers/:driverId/assign/:truckId */
export async function assignToTruck(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const driverId = parseInt(req.params.driverId);
    const truckId = parseInt(req.params.truckId);
    
    const updatedTruck = await driverService.assignDriverToTruck(userId, driverId, truckId);
    res.json(updatedTruck);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

/** DELETE /trucks/:truckId/driver */
export async function removeFromTruck(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const truckId = parseInt(req.params.truckId);
    
    const updatedTruck = await driverService.removeDriverFromTruck(userId, truckId);
    res.json(updatedTruck);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}