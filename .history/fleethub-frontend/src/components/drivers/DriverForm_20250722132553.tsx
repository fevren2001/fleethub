import React, { useState } from 'react';
import { DriverFormData } from '../../types/driver';

interface DriverFormProps {
  initialData?: Partial<DriverFormData>;
  onSubmit: (data: DriverFormData) => void;
  isSubmitting: boolean;
}

const DRIVER_PHOTOS = [
  '/driver_photos/driver1.webp',
  '/driver_photos/driver2.webp',
  '/driver_photos/driver3.webp',
];

const DriverForm: React.FC<DriverFormProps> = ({ initialData = {}, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<DriverFormData>({
    name: initialData.name || '',
    skill: initialData.skill || 1, // Default skill to 1 if not provided
    photoUrl: initialData.photoUrl || DRIVER_PHOTOS[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="driver-form">
      <div className="form-group">
        <label htmlFor="name">Driver Name</label>
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
        <label htmlFor="skill">Driver Skill</label>
        <input
          id="skill"
          name="skill"
          type="text"
          value={formData.skill}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Driver Photo</label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {DRIVER_PHOTOS.map(photo => (
            <label key={photo} style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="photoUrl"
                value={photo}
                checked={formData.photoUrl === photo}
                onChange={() => setFormData(prev => ({ ...prev, photoUrl: photo }))}
                style={{ display: 'none' }}
              />
              <img
                src={photo}
                alt="Driver"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 12,
                  border: formData.photoUrl === photo ? '3px solid #3498db' : '2px solid #ccc',
                  boxShadow: formData.photoUrl === photo ? '0 0 8px #3498db' : 'none',
                  objectFit: 'cover',
                }}
              />
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Driver'}
      </button>
    </form>
  );
};

export default DriverForm;