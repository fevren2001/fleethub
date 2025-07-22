// src/api/trucks.ts
import axios from 'axios';
import { Truck, CreateTruckPayload, UpdateTruckPayload } from '../types/truck';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const fetchTrucks = async (): Promise<Truck[]> => {
  const response = await axios.get(`${API_URL}/trucks`, {
    withCredentials: true
  });
  return response.data;
};

export const fetchTruckById = async (id: number): Promise<Truck> => {
  const response = await axios.get(`${API_URL}/trucks/${id}`, {
    withCredentials: true
  });
  return response.data;
};

export const createTruck = async (payload: CreateTruckPayload): Promise<Truck> => {
  const response = await axios.post(`${API_URL}/trucks`, payload, {
    withCredentials: true
  });
  return response.data;
};

export const updateTruck = async (id: number, payload: UpdateTruckPayload): Promise<Truck> => {
  const response = await axios.put(`${API_URL}/trucks/${id}`, payload, {
    withCredentials: true
  });
  return response.data;
};

export const deleteTruck = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/trucks/${id}`, {
    withCredentials: true
  });
};

export const assignDriver = async (truckId: number, driverId: number): Promise<Truck> => {
  const response = await axios.put(`${API_URL}/trucks/${truckId}/assign-driver`, { driverId }, {
    withCredentials: true
  });
  return response.data;
};

export const assignGarage = async (truckId: number, garageId: number): Promise<Truck> => {
  const response = await axios.put(`${API_URL}/trucks/${truckId}/assign-garage`, { garageId }, {
    withCredentials: true
  });
  return response.data;
};