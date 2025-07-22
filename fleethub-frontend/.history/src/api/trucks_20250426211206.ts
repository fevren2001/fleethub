import apiClient from './apiClient';
import { Truck, CreateTruckPayload, UpdateTruckPayload } from '../types/truck';

export const fetchTrucks = async (): Promise<Truck[]> => {
  const response = await apiClient.get<Truck[]>('/trucks');
  return response.data;
};

export const fetchTruckById = async (id: number): Promise<Truck> => {
  const response = await apiClient.get<Truck>(`/trucks/${id}`);
  return response.data;
};

export const createTruck = async (payload: CreateTruckPayload): Promise<Truck> => {
  const response = await apiClient.post<Truck>('/trucks', payload);
  return response.data;
};

export const updateTruck = async (id: number, payload: UpdateTruckPayload): Promise<Truck> => {
  const response = await apiClient.put<Truck>(`/trucks/${id}`, payload);
  return response.data;
};

export const deleteTruck = async (id: number): Promise<void> => {
  await apiClient.delete(`/trucks/${id}`);
};

export const assignDriver = async (truckId: number, driverId: number): Promise<Truck> => {
  const response = await apiClient.put<Truck>(`/trucks/${truckId}/assign-driver`, { driverId });
  return response.data;
};

export const assignGarage = async (truckId: number, garageId: number): Promise<Truck> => {
  const response = await apiClient.put<Truck>(`/trucks/${truckId}/assign-garage`, { garageId });
  return response.data;
};