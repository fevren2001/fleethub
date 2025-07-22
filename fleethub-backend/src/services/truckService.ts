import { prisma } from "../config/database";

export interface CreateTruckDTO {
  model: string;
  garageId?: number;
  photoUrl?: string;
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
  // If a garage is specified, check capacity and increment occupancy
  if (data.garageId) {
    const garage = await prisma.garage.findUnique({ where: { id: data.garageId } });
    if (!garage) throw new Error('Garage not found');
    if (garage.occupancy >= garage.capacity) throw new Error('Garage is full');
    // Increment occupancy
    await prisma.garage.update({
      where: { id: data.garageId },
      data: { occupancy: { increment: 1 } }
    });
  }
  return prisma.truck.create({
    data: {
      model: data.model,
      user: { connect: { id: userId } },
      garage: data.garageId ? { connect: { id: data.garageId } } : undefined,
      photoUrl: data.photoUrl,
    },
  });
}

/** Fetch a single truck by id and user */
export async function getTruckById(userId: number, truckId: number) {
  return prisma.truck.findFirst({
    where: { id: truckId, userId },
    include: { garage: true, driver: true },
  });
}

/** Assign a driver to a truck, ensuring the driver has only one truck at a time */
export async function assignDriverToTruck(userId: number, truckId: number, driverId: number) {
  // Unassign this driver from any other truck for this user
  await prisma.truck.updateMany({
    where: { userId, driverId },
    data: { driverId: null }
  });
  // Assign the driver to the selected truck
  return prisma.truck.update({
    where: { id: truckId, userId },
    data: { driverId }
  });
}
