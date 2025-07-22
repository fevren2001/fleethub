// src/components/drivers/DriverForm.tsx
import React, { useState } from 'react';
import { DriverFormData } from '../../types/driver';

interface DriverFormProps {
  initialData?: Partial<DriverFormData>;
  onSubmit: (data: DriverFormData) => void;
  isSubmitting: boolean;
}

const DriverForm: React.FC<DriverFormProps> = ({ initialData = {}, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<DriverFormData>({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    licenseNumber: initialData.licenseNumber || '',
    licenseExpiry: initialData.licenseExpiry || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <label htmlFor="name">Full Name</label>
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
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="licenseNumber">License Number</label>
        <input
          id="licenseNumber"
          name="licenseNumber"
          type="text"
          value={formData.licenseNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="licenseExpiry">License Expiry Date</label>
        <input
          id="licenseExpiry"
          name="licenseExpiry"
          type="date"
          value={formData.licenseExpiry}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Driver'}
      </button>
    </form>
  );
};

export default DriverForm;