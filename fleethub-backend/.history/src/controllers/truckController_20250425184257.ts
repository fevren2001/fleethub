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

export const getTrucks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId; // Get user ID from the request user info (set by authenticate)

    if (!userId) {
      return res.status(403).json({ error: 'User ID not found' });
    }

    const trucks = await prisma.truck.findMany({
      where: {
        userId, // Only get trucks for the authenticated user
      },
    });

    return res.status(200).json(trucks);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
