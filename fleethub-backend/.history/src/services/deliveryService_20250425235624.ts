import { prisma } from "../config/database";

export interface CreateDeliveryDTO {
  origin: string;
  destination: string;
  distanceKm: number;
  truckId?: number;
  driverId?: number;
}

// Calculate estimated completion time in minutes based on distance
export function calculateEstimatedCompletionTime(distanceKm: number): number {
  return distanceKm / 1000; // Convert km to minutes (as per requirement)
}

/** Fetch all deliveries belonging to a user */
export async function getAllDeliveries(userId: number) {
  return prisma.delivery.findMany({
    where: { userId },
    include: { truck: true, driver: true }
  });
}

/** Create a new delivery for a user */
export async function createDelivery(
  userId: number,
  data: CreateDeliveryDTO
) {
  // Check if driver is already assigned to another active delivery
  if (data.driverId) {
    const existingDelivery = await prisma.delivery.findFirst({
      where: {
        driverId: data.driverId,
        status: { in: ["pending", "in_progress"] }
      }
    });

    if (existingDelivery) {
      throw new Error("Driver is already assigned to another active delivery");
    }
  }

  // Calculate estimated completion time
  const estimatedMinutes = calculateEstimatedCompletionTime(data.distanceKm);

  return prisma.delivery.create({
    data: {
      origin: data.origin,
      destination: data.destination,
      distanceKm: data.distanceKm,
      estimatedMinutes: estimatedMinutes,
      user: { connect: { id: userId } },
      truck: data.truckId ? { connect: { id: data.truckId } } : undefined,
      driver: data.driverId ? { connect: { id: data.driverId } } : undefined,
    },
    include: { truck: true, driver: true }
  });
}

/** Get a specific delivery by ID */
export async function getDeliveryById(userId: number, deliveryId: number) {
  return prisma.delivery.findFirst({
    where: { 
      id: deliveryId,
      userId: userId // Ensure the delivery belongs to the user
    },
    include: { truck: true, driver: true }
  });
}

/** Update an existing delivery */
export async function updateDelivery(
  userId: number,
  deliveryId: number,
  data: Partial<CreateDeliveryDTO & { status?: string }>
) {
  // Check if this is assigning a new driver
  if (data.driverId) {
    const existingDelivery = await prisma.delivery.findFirst({
      where: {
        driverId: data.driverId,
        status: { in: ["pending", "in_progress"] },
        id: { not: deliveryId } // Exclude current delivery
      }
    });

    if (existingDelivery) {
      throw new Error("Driver is already assigned to another active delivery");
    }
  }

  // Create the update data object
  const updateData: any = {};
  if (data.origin !== undefined) updateData.origin = data.origin;
  if (data.destination !== undefined) updateData.destination = data.destination;
  
  // Recalculate estimated minutes if distance changed
  if (data.distanceKm !== undefined) {
    updateData.distanceKm = data.distanceKm;
    updateData.estimatedMinutes = calculateEstimatedCompletionTime(data.distanceKm);
  }
  
  if (data.status !== undefined) updateData.status = data.status;

  // Handle relations
  if (data.truckId !== undefined) {
    updateData.truck = data.truckId ? { connect: { id: data.truckId } } : { disconnect: true };
  }
  if (data.driverId !== undefined) {
    updateData.driver = data.driverId ? { connect: { id: data.driverId } } : { disconnect: true };
  }
  
  return prisma.delivery.updateMany({
    where: { 
      id: deliveryId,
      userId: userId // Ensure the delivery belongs to the user
    },
    data: updateData
  }).then(() => {
    // Return the updated delivery
    return prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: { truck: true, driver: true }
    });
  });
}

/** Delete a delivery */
export async function deleteDelivery(userId: number, deliveryId: number) {
  return prisma.delivery.deleteMany({
    where: { 
      id: deliveryId,
      userId: userId // Ensure the delivery belongs to the user
    }
  });
}

/** Start a delivery */
export async function startDelivery(userId: number, deliveryId: number) {
  // First check if the delivery has required resources (truck and driver)
  const delivery = await prisma.delivery.findFirst({
    where: { id: deliveryId, userId }
  });
  
  if (!delivery) {
    throw new Error("Delivery not found");
  }
  
  if (!delivery.truckId) {
    throw new Error("Cannot start delivery without an assigned truck");
  }
  
  if (!delivery.driverId) {
    throw new Error("Cannot start delivery without an assigned driver");
  }
  
  // Check if driver is already on another delivery
  const existingDelivery = await prisma.delivery.findFirst({
    where: {
      driverId: delivery.driverId,
      status: "in_progress",
      id: { not: deliveryId }
    }
  });

  if (existingDelivery) {
    throw new Error("Driver is already on another delivery");
  }
  
  // Update truck status
  await prisma.truck.update({
    where: { id: delivery.truckId },
    data: { status: "en route" }
  });
  
  // Calculate expected completion time
  const startTime = new Date();
  const estimatedMinutes = delivery.estimatedMinutes || calculateEstimatedCompletionTime(delivery.distanceKm);
  const expectedCompletionTime = new Date(startTime.getTime() + estimatedMinutes * 60000);
  
  // Update delivery status
  return prisma.delivery.update({
    where: { id: deliveryId },
    data: { 
      status: "in_progress",
      startTime: startTime,
      expectedCompletionTime: expectedCompletionTime
    },
    include: { truck: true, driver: true }
  });
}

/** Complete a delivery */
export async function completeDelivery(userId: number, deliveryId: number) {
  // First check if the delivery is in progress
  const delivery = await prisma.delivery.findFirst({
    where: { id: deliveryId, userId, status: "in_progress" }
  });
  
  if (!delivery) {
    throw new Error("Delivery not found or not in progress");
  }
  
  // Update truck status if available
  if (delivery.truckId) {
    await prisma.truck.update({
      where: { id: delivery.truckId },
      data: { 
        status: "idle",
        // Simulate some wear and tear on the truck
        fuel: { decrement: 20 },
        condition: { decrement: 5 }
      }
    });
  }
  
  // Update delivery status
  return prisma.delivery.update({
    where: { id: deliveryId },
    data: { 
      status: "completed",
      completionTime: new Date()
    },
    include: { truck: true, driver: true }
  });
}

/** Get delivery progress information */
export async function getDeliveryProgress(userId: number, deliveryId: number) {
  const delivery = await prisma.delivery.findFirst({
    where: { 
      id: deliveryId,
      userId: userId,
      status: "in_progress"
    },
    include: { truck: true, driver: true }
  });
  
  if (!delivery || !delivery.startTime || !delivery.expectedCompletionTime) {
    throw new Error("Delivery not found or not in progress");
  }
  
  const now = new Date();
  const startTime = new Date(delivery.startTime);
  const expectedCompletionTime = new Date(delivery.expectedCompletionTime);
  
  // Calculate total duration in milliseconds
  const totalDuration = expectedCompletionTime.getTime() - startTime.getTime();
  
  // Calculate elapsed time in milliseconds
  const elapsedTime = now.getTime() - startTime.getTime();
  
  // Calculate progress as a percentage
  const progressPercentage = Math.min(100, Math.max(0, (elapsedTime / totalDuration) * 100));
  
  // Calculate remaining time in minutes
  const remainingTimeMinutes = Math.max(0, (totalDuration - elapsedTime) / 60000);
  
  return {
    delivery,
    progress: {
      percentage: progressPercentage,
      remainingMinutes: remainingTimeMinutes,
      elapsedMinutes: elapsedTime / 60000,
      startTime,
      expectedCompletionTime
    }
  };
}