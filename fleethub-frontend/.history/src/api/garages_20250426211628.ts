
 export const getAllGarages = async (): Promise<Garage[]> => {
    const response = await apiClient.get<Garage[]>('/garages');
    return response.data;
  }