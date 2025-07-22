// src/pages/Trucks/CreateTruck.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/common/MainLayout';
import TruckForm from '../../components/trucks/TruckForm';
import { createTruck } from '../../api/trucks';
import { TruckFormData } from '../../types/truck';

const CreateTruck: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (data: TruckFormData) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Convert skill to a number
      const formattedData = {
        ...data,
        skill: typeof data.model === 'string' ? parseInt(data.garageId, 10) : data.skill
      };
      
      await createTruck(formattedData);
      navigate('/trucks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create truck');
      console.error('Create error:', err); // Added for debugging
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="create-truck">
        <h1>Add New Truck</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <TruckForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </MainLayout>
  );
};

export default CreateTruck;