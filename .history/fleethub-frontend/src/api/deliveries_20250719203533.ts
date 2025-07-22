import apiClient from './apiClient';

export interface Delivery {
  id: number;
  origin: string;
  destination: string;
  distanceKm: number;
  status: string;
  type: string; // delivery type
  truckId?: number;
  driverId?: number;
  createdAt: string;
  updatedAt: string;
  truck?: any;
  driver?: any;
}

export const getAllDeliveries = async (): Promise<Delivery[]> => {
  const response = await apiClient.get<Delivery[]>('/deliveries');
  return response.data;
}; 