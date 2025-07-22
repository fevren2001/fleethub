export type GarageStatus = 'active' | 'inactive' | 'under maintenance';

export interface Garage {
  id: number;
  name: string;
  location: string;
  capacity: number;
  status: GarageStatus;
  occupancy: number;
  createdAt: string;
  updatedAt: string;
  city: string;
}

export interface CreateGaragePayload {
  name: string;
  location: string;
  capacity: number;
  city: string;
}

export interface UpdateGaragePayload {
  name?: string;
  location?: string;
  capacity?: number;
  status?: GarageStatus;
  occupancy?: number;
}

export interface GarageFormData {
  name: string;
  location: string;
  capacity: number;
  status?: GarageStatus;
  occupancy?: number;
}