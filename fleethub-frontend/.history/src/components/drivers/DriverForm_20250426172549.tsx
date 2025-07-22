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
    skill: initialData.skill || 1,
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

      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Driver'}
      </button>
    </form>
  );
};

export default DriverForm;