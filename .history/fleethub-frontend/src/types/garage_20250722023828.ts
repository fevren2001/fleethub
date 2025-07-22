export type GarageStatus = 'active' | 'inactive' | 'under maintenance';

export interface Garage {
  id: number;
  location: string;
  capacity: number;
  status: GarageStatus;
  occupancy: number;
  createdAt: string;
  updatedAt: string;
  city: string;
}

export interface CreateGaragePayload {
  location: string;
  capacity: number;
  city: string;
}

export interface UpdateGaragePayload {
  location?: string;
  capacity?: number;
  status?: GarageStatus;
  occupancy?: number;
  city?: string;
}

export interface GarageFormData {
  location: string;
  capacity: number;
  status?: GarageStatus;
  occupancy?: number;
  city: string;
}