import React, { useState } from 'react';
import { Garage, GarageFormData, GarageStatus } from '../../types/garage';

interface GarageFormProps {
  initialData?: Partial<Garage>;
  onSubmit: (data: GarageFormData) => void;
  isSubmitting: boolean;
}

const GarageForm: React.FC<GarageFormProps> = ({ initialData = {}, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<GarageFormData>({
    name: initialData.name || '',
    location: initialData.location || '',
    capacity: initialData.capacity || 10,
    status: initialData.status || 'active',
    occupancy: initialData.occupancy || 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'capacity' || name === 'occupancy') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!initialData.id;

  return (
    <form onSubmit={handleSubmit} className="garage-form">
      <div className="form-group">
        <label htmlFor="name">Garage Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="capacity">Capacity</label>
        <input
          id="capacity"
          name="capacity"
          type="number"
          min="1"
          value={formData.capacity}
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="under maintenance">Under Maintenance</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="occupancy">Current Occupancy</label>
            <input
              id="occupancy"
              name="occupancy"
              type="number"
              min="0"
              max={formData.capacity}
              value={formData.occupancy}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Garage' : 'Save Garage'}
      </button>
    </form>
  );
};

export default GarageForm;