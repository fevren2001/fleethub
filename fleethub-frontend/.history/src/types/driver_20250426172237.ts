// src/types/driver.ts
export interface Driver {
  id: number; // Changed to number to match Prisma schema
  name: string;
  skill: number; // Added skill field from Prisma
  userId: number; // Added userId field from Prisma
  trucks?: Truck[]; // Optional array of trucks
  createdAt: string; // Keeping as string for frontend display
  status: string; // Optional status field
}

// You might need a Truck interface as well
export interface Truck {
  id: number;
  // Other truck properties
}

export interface DriverFormData {
  name: string;
  skill?: number; // Optional in form, will default to 1
}

// If you need to reference Delivery
export interface Delivery {
  id: number;
  // Other delivery properties
  driverId: number;
}