// src/pages/Drivers/CreateDriver.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/common/MainLayout';
import DriverForm from '../../components/drivers/DriverForm';
import { createDriver } from '../../api/drivers';
import { DriverFormData } from '../../types/driver';

const CreateDriver: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (data: DriverFormData) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      await createDriver(data);
      navigate('/drivers');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create driver');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="create-driver">
        <h1>Add New Driver</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <DriverForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </MainLayout>
  );
};

export default CreateDriver;