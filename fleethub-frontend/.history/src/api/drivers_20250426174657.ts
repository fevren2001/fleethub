import apiClient from './apiClient';
import { Driver, DriverFormData } from '../types/driver';

export const getAllDrivers = async (): Promise<Driver[]> => {
  const response = await apiClient.get<Driver[]>('/drivers');
  return response.data;
};

export const getDriverById = async (id: string): Promise<Driver> => {
  const response = await apiClient.get<Driver>(`/drivers/${id}`);
  return response.data;
};

export const createDriver = async (driverData: DriverFormData): Promise<Driver> => {
  const response = await apiClient.post<Driver>('/drivers', driverData);
  return response.data;
};
export const updateDriver = async (id: string, driverData: Partial<DriverFormData>): Promise<Driver> => {
  // Make sure we're sending the exact fields the backend expects
  const { name, skill } = driverData;
  
  const response = await apiClient.put<Driver>(`/drivers/${id}`, { name, skill });
  return response.data;
};

export const deleteDriver = async (id: string): Promise<void> => {
  await apiClient.delete(`/drivers/${id}`);
};

export const assignToTruck = async (driverId: string, truckId: string): Promise<any> => {
  const response = await apiClient.post(`/drivers/${driverId}/assign/${truckId}`);
  return response.data;
};

export const removeFromTruck = async (truckId: string): Promise<any> => {
  const response = await apiClient.delete(`/trucks/${truckId}/driver`);
  return response.data;
};