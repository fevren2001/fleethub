import React, { useState, useEffect } from 'react';
import { Truck, CreateTruckPayload, UpdateTruckPayload, TruckStatus } from '../../types/truck';
import { fetchGarages } from '../../api/garages';
import { getAllDrivers } from '../../api/drivers';

interface Garage {
  id: number;
  name: string;
}

interface Driver {
  id: number;
  name: string;
}

interface TruckFormProps {
  initialData?: Partial<Truck>;
  onSubmit: (data: CreateTruckPayload | UpdateTruckPayload) => void;
  isSubmitting: boolean;
}

const TruckForm: React.FC<TruckFormProps> = ({ initialData = {}, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    model: initialData.model || '',
    status: initialData.status || 'idle' as TruckStatus,
    fuel: initialData.fuel || 100,
    condition: initialData.condition || 100,
    garageId: initialData.garageId || null as number | null,
    driverId: initialData.driverId || null as number | null
  });
  
  const [garages, setGarages] = useState<Garage[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [garagesData, driversData] = await Promise.all([
          fetchGarages(),
          fetchDrivers()
        ]);
        setGarages(garagesData);
        setDrivers(driversData);
      } catch (error) {
        console.error('Failed to load form data:', error);
      }
    };

    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'range') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else if (name === 'garageId' || name === 'driverId') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value ? Number(value) : null 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (initialData.id) {
      // Edit mode
      const updatePayload: UpdateTruckPayload = {
        model: formData.model,
        status: formData.status,
        fuel: formData.fuel,
        condition: formData.condition,
        garageId: formData.garageId,
        driverId: formData.driverId
      };
      onSubmit(updatePayload);
    } else {
      // Create mode
      const createPayload: CreateTruckPayload = {
        model: formData.model,
        garageId: formData.garageId
      };
      onSubmit(createPayload);
    }
  };

  const isEditing = !!initialData.id;

  return (
    <form onSubmit={handleSubmit} className="truck-form">
      <div className="form-group">
        <label htmlFor="model">Model</label>
        <input
          id="model"
          name="model"
          type="text"
          value={formData.model}
          onChange={handleChange}
          required
        />
      </div>

      {isEditing && (
        <>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="idle">Idle</option>
              <option value="en route">En Route</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fuel">Fuel ({formData.fuel}%)</label>
            <input
              type="range"
              id="fuel"
              name="fuel"
              min="0"
              max="100"
              value={formData.fuel}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="condition">Condition ({formData.condition}%)</label>
            <input
              type="range"
              id="condition"
              name="condition"
              min="0"
              max="100"
              value={formData.condition}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label htmlFor="garageId">Garage</label>
        <select
          id="garageId"
          name="garageId"
          value={formData.garageId || ''}
          onChange={handleChange}
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
        <div className="form-group">
          <label htmlFor="driverId">Driver</label>
          <select
            id="driverId"
            name="driverId"
            value={formData.driverId || ''}
            onChange={handleChange}
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

      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Truck' : 'Save Truck'}
      </button>
    </form>
  );
};

export default TruckForm;