// src/types/truck.ts
export interface Truck {
  id: number;
  model: string;
  status: string;
  fuel: number;
  condition: number;
  userId: number;
  garageId?: number; // Optional as it can be null
  driverId?: number; // Optional as it can be null
  driver?: {
    id: number;
    name: string;
    // Add more fields if needed
  };
  createdAt: string; // String for frontend display
  updatedAt: string; // String for frontend display
  photoUrl?: string;
}

// Form data interface for creating/updating trucks
export interface TruckFormData {
  model: string;
  status?: string; // Optional, will default to "idle"
  fuel?: number; // Optional, will default to 100
  condition?: number; // Optional, will default to 100
  garageId?: number;
  driverId?: number;
  photoUrl?: string;
}