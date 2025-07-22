// src/types/driver.ts
export interface Driver {
    id: string;
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    licenseExpiry: string;
    status: 'AVAILABLE' | 'ON_DELIVERY' | 'OFF_DUTY' | 'INACTIVE';
    currentTruckId?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface DriverFormData {
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    licenseExpiry: string;
  }