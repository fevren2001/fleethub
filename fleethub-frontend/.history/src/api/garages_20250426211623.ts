export const getAllDrivers = async (): Promise<Driver[]> => {
    const response = await apiClient.get<Driver[]>('/drivers');
    return response.data;
  };

  
  export const getAllGarages = async (): Promise<Garage[]> => {