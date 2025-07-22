// src/components/drivers/TruckForm.tsx
import React, { useState, useEffect } from 'react';
import { Truck, CreateTruckPayload, UpdateTruckPayload, TruckStatus } from '../../types/truck';
import { fetchGarages } from '../../api/garages'; // Assuming this exists
import { fetchDrivers } from '../../api/drivers'; // Assuming this exists

interface Garage {
  id: number;
  name: string;
}

interface Driver {
  id: number;
  name: string;
}

interface TruckFormProps {
  initialValues?: Partial<Truck>;
  onSubmit: (values: CreateTruckPayload | UpdateTruckPayload) => void;
  isEditing?: boolean;
}

const TruckForm: React.FC<TruckFormProps> = ({ 
  initialValues = {}, 
  onSubmit,
  isEditing = false 
}) => {
  const [model, setModel] = useState(initialValues.model || '');
  const [status, setStatus] = useState<TruckStatus>(initialValues.status || 'idle');
  const [fuel, setFuel] = useState(initialValues.fuel || 100);
  const [condition, setCondition] = useState(initialValues.condition || 100);
  const [garageId, setGarageId] = useState<number | null>(initialValues.garageId || null);
  const [driverId, setDriverId] = useState<number | null>(initialValues.driverId || null);
  
  const [garages, setGarages] = useState<Garage[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [garagesData, driversData] = await Promise.all([
          fetchGarages(),
          fetchDrivers()
        ]);
        setGarages(garagesData);
        setDrivers(driversData);
      } catch (error) {
        console.error('Failed to load form data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      const updatePayload: UpdateTruckPayload = {
        model,
        status,
        fuel,
        condition,
        garageId,
        driverId
      };
      onSubmit(updatePayload);
    } else {
      const createPayload: CreateTruckPayload = {
        model,
        garageId
      };
      onSubmit(createPayload);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700">
          Model
        </label>
        <input
          type="text"
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      {isEditing && (
        <>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TruckStatus)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="idle">Idle</option>
              <option value="en route">En Route</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label htmlFor="fuel" className="block text-sm font-medium text-gray-700">
              Fuel ({fuel}%)
            </label>
            <input
              type="range"
              id="fuel"
              min="0"
              max="100"
              value={fuel}
              onChange={(e) => setFuel(Number(e.target.value))}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
              Condition ({condition}%)
            </label>
            <input
              type="range"
              id="condition"
              min="0"
              max="100"
              value={condition}
              onChange={(e) => setCondition(Number(e.target.value))}
              className="mt-1 block w-full"
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="garage" className="block text-sm font-medium text-gray-700">
          Garage
        </label>
        <select
          id="garage"
          value={garageId || ''}
          onChange={(e) => setGarageId(e.target.value ? Number(e.target.value) : null)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select Garage</option>
          {garages.map((garage) => (
            <option key={garage.id} value={garage.id}>
              {garage.name}
            </option>
          ))}
        </select>
      </div>

      {isEditing && (
        <div>
          <label htmlFor="driver" className="block text-sm font-medium text-gray-700">
            Driver
          </label>
          <select
            id="driver"
            value={driverId || ''}
            onChange={(e) => setDriverId(e.target.value ? Number(e.target.value) : null)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? 'Update Truck' : 'Create Truck'}
        </button>
      </div>
    </form>
  );
};

export default TruckForm;