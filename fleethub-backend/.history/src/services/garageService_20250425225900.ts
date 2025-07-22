import { prisma } from "../config/database";

export interface CreateGarageDTO {
  city: string;
  capacity: number;
  level?: number;
}

/** Fetch all garages belonging to a user */
export async function getAllGarages(userId: number) {
  return prisma.garage.findMany({
    where: { userId },
    include: { trucks: true }
  });
}

/** Create a new garage for a user */
export async function createGarage(
  userId: number,
  data: CreateGarageDTO
) {
  return prisma.garage.create({
    data: {
      city: data.city,
      capacity: data.capacity,
      level: data.level || 1, // Default to level 1 if not provided
      user: { connect: { id: userId } }
    }
  });
}

/** Get a specific garage by ID */
export async function getGarageById(userId: number, garageId: number) {
  return prisma.garage.findFirst({
    where: { 
      id: garageId,
      userId: userId // Ensure the garage belongs to the user
    },
    include: { trucks: true }
  });
}

/** Update an existing garage */
export async function updateGarage(
  userId: number,
  garageId: number,
  data: Partial<CreateGarageDTO>
) {
  return prisma.garage.updateMany({
    where: { 
      id: garageId,
      userId: userId // Ensure the garage belongs to the user
    },
    data
  }).then(() => {
    // Return the updated garage
    return prisma.garage.findUnique({
      where: { id: garageId },
      include: { trucks: true }
    });
  });
}

/** Delete a garage */
export async function deleteGarage(userId: number, garageId: number) {
  // First check if there are any trucks assigned to this garage
  const trucksInGarage = await prisma.truck.count({
    where: { garageId: garageId }
  });
  
  if (trucksInGarage > 0) {
    throw new Error("Cannot delete garage with assigned trucks");
  }
  
  return prisma.garage.deleteMany({
    where: { 
      id: garageId,
      userId: userId // Ensure the garage belongs to the user
    }
  });
}