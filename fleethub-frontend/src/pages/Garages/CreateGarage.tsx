import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GarageForm from '../../components/garages/GarageForm';
import { createGarage } from '../../api/garages';
import { GarageFormData } from '../../types/garage';
import MainLayout from '../../components/common/MainLayout';

const CreateGarage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: GarageFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createGarage({ ...data, city: data.city || data.location });
      navigate('/garages');
    } catch (err) {
      console.error('Failed to create garage:', err);
      setError('Failed to create garage. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="create-garage-container">
        <h1>Create New Garage</h1>
        {error && <div className="error-message">{error}</div>}
        <GarageForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </MainLayout>
  );
};

export default CreateGarage;