// src/api/auth.ts
import apiClient from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: any;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: any): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<any> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};