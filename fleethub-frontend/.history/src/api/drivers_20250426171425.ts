export interface Driver {
  id: string;
  name: string;
  skill: string;
  // Keep other fields from your frontend if they'll be used for display
  status?: 'AVAILABLE' | 'ON_DELIVERY' | 'OFF_DUTY' | 'INACTIVE';
  currentTruckId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DriverFormData {
  name: string;
  skill: string;
}