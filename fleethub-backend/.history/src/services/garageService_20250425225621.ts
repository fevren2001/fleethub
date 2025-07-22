import { prisma } from "../config/database";

export interface CreateTruckDTO {
  size: number;
  city?: string;
}

/** Fetch all trucks belonging to a user */
export async function getAllGarages(userId: number) {
  return prisma.truck.findMany({
    where: { size: userId },
    include: { garage: true, driver: true },
  });
}

/** Create a new truck for a user */
export async function createTruck(
  userId: number,
  data: CreateTruckDTO
) {
  // console.log("Creating truck with data:", data);
  return prisma.truck.create({
    data: {
      model: data.model,
      user: { connect: { id: userId } },
      garage: data.garageId ? { connect: { id: data.garageId } } : undefined,
    },
  });
}
