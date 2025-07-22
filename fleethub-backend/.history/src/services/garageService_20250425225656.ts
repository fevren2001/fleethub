import { prisma } from "../config/database";

export interface CreateTruckDTO {
  size: number;
  city?: string;
}

/** Fetch all trucks belonging to a user */
export async function getAll(userId: number) {
  return prisma.truck.findMany({
    where: { userId },
    include: { size: true, city: true },
  });
}

/** Create a new truck for a user */
export async function createGarage(
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
