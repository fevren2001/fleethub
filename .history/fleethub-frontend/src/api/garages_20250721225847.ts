import apiClient from './apiClient';
import { Garage, CreateGaragePayload, UpdateGaragePayload } from '../types/garage';

export const getAllGarages = async (): Promise<Garage[]> => {
  const response = await apiClient.get<Garage[]>('/garages');
  return response.data;
};

export const getGarageById = async (id: string): Promise<Garage> => {
  const response = await apiClient.get<Garage>(`/garages/${id}`);
  return response.data;
};

export const createGarage = async (garageData: CreateGaragePayload): Promise<Garage> => {
  // Ensure city is set from location if not provided
  const payload = {
    ...garageData,
    city: garageData.city || garageData.location
  };
  const response = await apiClient.post<Garage>('/garages', payload);
  return response.data;
};

export const updateGarage = async (id: number, garageData: UpdateGaragePayload): Promise<Garage> => {
  const response = await apiClient.put<Garage>(`/garages/${id}`, garageData);
  return response.data;
};

export const deleteGarage = async (id: string): Promise<void> => {
  await apiClient.delete(`/garages/${id}`);
};

export const fetchGarages = getAllGarages; // Alias for compatibility

export const getSupportedCities = async (): Promise<{ name: string }[]> => {
  const response = await apiClient.get('/deliveries/cities');
  return response.data;
};