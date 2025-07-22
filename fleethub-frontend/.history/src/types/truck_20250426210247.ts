// src/types/truck.ts
export interface Truck {
    id: number;
    model: string;
    status: TruckStatus;
    fuel: number;
    condition: number;
    userId: number;
    garageId: number | null;
    driverId: number | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export type TruckStatus = 'idle' | 'en route' | 'maintenance';
  
  export interface CreateTruckPayload {
    model: string;
    garageId: number | null;
  }
  
  export interface UpdateTruckPayload {
    model?: string;
    status?: TruckStatus;
    fuel?: number;
    condition?: number;
    garageId?: number | null;
    driverId?: number | null;
  }