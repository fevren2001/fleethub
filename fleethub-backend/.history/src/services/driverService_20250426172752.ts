import { prisma } from "../config/database";

export interface CreateDriverDTO {
  name: string;
  skill?: number;
}

/** Fetch all drivers belonging to a user */
export async function getAllDrivers(userId: number) {
  return prisma.driver.findMany({
    where: { userId },
    include: { trucks: true }
  });
}

/** Create a new driver for a user */
export async function createDriver(
  userId: number,
  data: CreateDriverDTO
) {
  return prisma.driver.create({
    data: {
      name: data.name,
      skill: data.skill || 1, // Default to skill level 1 if not provided
      status: "available",
      user: { connect: { id: userId } }
    }
  });
}

/** Get a specific driver by ID */
export async function getDriverById(userId: number, driverId: number) {
  return prisma.driver.findFirst({
    where: { 
      id: driverId,
      userId: userId // Ensure the driver belongs to the user
    },
    include: { trucks: true }
  });
}

/** Update an existing driver */
export async function updateDriver(
  userId: number,
  driverId: number,
  data: Partial<CreateDriverDTO>
) {
  return prisma.driver.updateMany({
    where: { 
      id: driverId,
      userId: userId // Ensure the driver belongs to the user
    },
    data
  }).then(() => {
    // Return the updated driver
    return prisma.driver.findUnique({
      where: { id: driverId },
      include: { trucks: true }
    });
  });
}

/** Delete a driver */
export async function deleteDriver(userId: number, driverId: number) {
  // First check if there are any trucks assigned to this driver
  const trucksWithDriver = await prisma.truck.count({
    where: { driverId: driverId }
  });
  
  if (trucksWithDriver > 0) {
    throw new Error("Cannot delete driver with assigned trucks");
  }
  
  return prisma.driver.deleteMany({
    where: { 
      id: driverId,
      userId: userId // Ensure the driver belongs to the user
    }
  });
}

/** Assign a driver to a truck */
export async function assignDriverToTruck(userId: number, driverId: number, truckId: number) {
  // First, verify that both the driver and truck belong to the user
  const driver = await prisma.driver.findFirst({
    where: { id: driverId, userId }
  });
  
  const truck = await prisma.truck.findFirst({
    where: { id: truckId, userId }
  });
  
  if (!driver || !truck) {
    throw new Error("Driver or truck not found or does not belong to user");
  }
  
  // Update the truck with the driver ID
  return prisma.truck.update({
    where: { id: truckId },
    data: { driverId: driverId }
  });
}

/** Remove a driver from a truck */
export async function removeDriverFromTruck(userId: number, truckId: number) {
  // Verify the truck belongs to the user
  const truck = await prisma.truck.findFirst({
    where: { id: truckId, userId }
  });
  
  if (!truck) {
    throw new Error("Truck not found or does not belong to user");
  }
  
  // Update the truck to remove the driver
  return prisma.truck.update({
    where: { id: truckId },
    data: { driverId: null }
  });
}