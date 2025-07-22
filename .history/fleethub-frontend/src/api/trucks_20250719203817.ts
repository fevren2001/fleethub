import apiClient from './apiClient';
import { Truck, TruckFormData } from '../types/truck';

export const getAllTrucks = async (): Promise<Truck[]> => {
  const response = await apiClient.get<Truck[]>('/trucks');
  return response.data;
};

export const getTruckById = async (id: string): Promise<Truck> => {
  const response = await apiClient.get<Truck>(`/trucks/${id}`);
  return response.data;
};

export const createTruck = async (truckData: TruckFormData): Promise<Truck> => {
  const response = await apiClient.post<Truck>('/trucks', truckData);
  return response.data;
};
export const updateTruck = async (id: number, truckData: Partial<TruckFormData>): Promise<Truck> => {
  const { model, garageId } = truckData;

  const response = await apiClient.put<Truck>(`/trucks/${id}`, { model, garageId });
  return response.data;
};

export const deleteTruck = async (id: string): Promise<void> => {
  await apiClient.delete(`/trucks/${id}`);
};

export const assignToTruck = async (truckId: string, truckId2: string): Promise<any> => {
  const response = await apiClient.post(`/trucks/${truckId}/assign/${truckId2}`);
  return response.data;
};

export const removeFromTruck = async (truckId: string): Promise<any> => {
  const response = await apiClient.delete(`/trucks/${truckId}/truck`);
  return response.data;
};

export const assignDriverToTruck = async (truckId: number, driverId: number): Promise<Truck> => {
  const response = await apiClient.post<Truck>(`/trucks/${truckId}/assign-driver`, { driverId });
  return response.data;
};