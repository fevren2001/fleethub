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
  const response = await apiClient.post<Garage>('/garages', garageData);
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