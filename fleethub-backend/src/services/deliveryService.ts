import { prisma } from "../config/database";
import { getAllCities } from "./cityService";

export interface CreateDeliveryDTO {
  origin: string;
  destination: string;
  distanceKm: number;
  truckId?: number;
  driverId?: number;
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
  return prisma.delivery.create({
    data: {
      origin: data.origin,
      destination: data.destination,
      distanceKm: data.distanceKm,
      user: { connect: { id: userId } },
      truck: data.truckId ? { connect: { id: data.truckId } } : undefined,
      driver: data.driverId ? { connect: { id: data.driverId } } : undefined,
    },
    include: { truck: true, driver: true }
  });
}

/** Get a specific delivery by ID */
export async function getDeliveryById(userId: number, deliveryId: number) {
  if (typeof deliveryId !== 'number' || isNaN(deliveryId)) {
    throw new Error('Invalid deliveryId');
  }
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
  data: Partial<CreateDeliveryDTO & { status?: string; startedAt?: Date; expectedCompletionTime?: Date }>
) {
  // Create the update data object
  const updateData: any = {};
  if (data.origin !== undefined) updateData.origin = data.origin;
  if (data.destination !== undefined) updateData.destination = data.destination;
  if (data.distanceKm !== undefined) updateData.distanceKm = data.distanceKm;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.startedAt !== undefined) updateData.startedAt = data.startedAt;
  if (data.expectedCompletionTime !== undefined) updateData.expectedCompletionTime = data.expectedCompletionTime;

  // Handle relations
  if (data.truckId !== undefined) {
    updateData.truck = data.truckId ? { connect: { id: data.truckId } } : { disconnect: true };
  }
  if (data.driverId !== undefined) {
    updateData.driver = data.driverId ? { connect: { id: data.driverId } } : { disconnect: true };
  }
  
  return prisma.delivery.update({
    where: { id: deliveryId },
    data: updateData,
    include: { truck: true, driver: true }
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

  // Prevent assigning a driver to multiple in_progress deliveries
  const activeDelivery = await prisma.delivery.findFirst({
    where: {
      driverId: delivery.driverId,
      status: 'in_progress',
      id: { not: deliveryId }
    }
  });
  if (activeDelivery) {
    throw new Error('Driver is already assigned to another active delivery.');
  }

  // Update truck status
  await prisma.truck.update({
    where: { id: delivery.truckId },
    data: { status: "en route" }
  });
  
  // Update delivery status
  return prisma.delivery.update({
    where: { id: deliveryId },
    data: { status: "in_progress" },
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
    data: { status: "completed" },
    include: { truck: true, driver: true }
  });
}

/** Mark in_progress deliveries as completed if their expectedCompletionTime has passed */
export async function completeDueDeliveries() {
  const now = new Date();
  // Find all in_progress deliveries that are overdue
  const dueDeliveries = await prisma.delivery.findMany({
    where: {
      status: 'in_progress',
      expectedCompletionTime: { lte: now }
    }
  });
  for (const delivery of dueDeliveries) {
    // Update delivery status and completedAt
    await prisma.delivery.update({
      where: { id: delivery.id },
      data: {
        status: 'completed',
        completedAt: now
      }
    });
    // Set truck status to idle if assigned
    if (delivery.truckId) {
      await prisma.truck.update({
        where: { id: delivery.truckId },
        data: { status: 'idle' }
      });
    }
  }
}

export const DELIVERY_TYPES = [
  'Cars',
  'Steel',
  'Electronics',
  'Food',
  'Furniture'
];

/** Generate random deliveries for a user, up to a max of 10 pending */
export async function generateRandomDeliveriesForUser(userId: number, maxPending: number = 10) {
  // Find all pending deliveries, ordered oldest first
  const pendingDeliveries = await prisma.delivery.findMany({
    where: { userId, status: 'pending' },
    orderBy: { createdAt: 'asc' }
  });
  // If more than maxPending, delete the oldest
  if (pendingDeliveries.length > maxPending) {
    const toDelete = pendingDeliveries.slice(0, pendingDeliveries.length - maxPending);
    const idsToDelete = toDelete.map(d => d.id);
    if (idsToDelete.length > 0) {
      await prisma.delivery.deleteMany({ where: { id: { in: idsToDelete } } });
    }
  }
  // Recount after deletion
  const currentPending = await prisma.delivery.count({ where: { userId, status: 'pending' } });
  if (currentPending >= maxPending) return;

  const cities = getAllCities();
  const deliveriesToCreate = maxPending - currentPending;
  for (let i = 0; i < deliveriesToCreate; i++) {
    // Pick two different random cities
    let originIdx = Math.floor(Math.random() * cities.length);
    let destIdx;
    do {
      destIdx = Math.floor(Math.random() * cities.length);
    } while (destIdx === originIdx);
    const origin = cities[originIdx].name;
    const destination = cities[destIdx].name;
    // For simplicity, set distanceKm to a random value (or you can use your distanceService)
    const distanceKm = Math.floor(Math.random() * 1000) + 100;
    // Pick a random delivery type
    const type = DELIVERY_TYPES[Math.floor(Math.random() * DELIVERY_TYPES.length)];
    await prisma.delivery.create({
      data: {
        origin,
        destination,
        distanceKm,
        status: 'pending',
        type,
        user: { connect: { id: userId } },
      }
    });
  }
}

export async function getActiveDeliveryForDriver(driverId: number, excludeDeliveryId?: number) {
  return prisma.delivery.findFirst({
    where: {
      driverId,
      status: 'in_progress',
      ...(excludeDeliveryId ? { id: { not: excludeDeliveryId } } : {})
    }
  });
}