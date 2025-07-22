import { prisma } from "../config/database";

export interface CreateTruckDTO {
  model: string;
  garageId?: number;
}

/** Fetch all trucks belonging to a user */
export async function getAllTrucks(userId: number) {
  return prisma.truck.findMany({
    where: { userId },
    include: { garage: true, driver: true },
  });
}

/** Create a new truck for a user */
export async function createTruck(
  userId: number,
  data: CreateTruckDTO
) {
  
  return prisma.truck.create({
    data: {
      model: data.model,
      user: { connect: { id: userId } },
      garage: data.garageId ? { connect: { id: data.garageId } } : undefined,
    },
  });
}
