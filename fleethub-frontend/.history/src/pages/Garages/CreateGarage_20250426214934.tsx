import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GarageForm from '../../components/garages/GarageForm';
import { createGarage } from '../../api/garages';
import { GarageFormData } from '../../types/garage';

const CreateGarage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: GarageFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createGarage(data);
      navigate('/garages');
    } catch (err) {
      console.error('Failed to create garage:', err);
      setError('Failed to create garage. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-garage-container">
      <h1>Create New Garage</h1>
      {error && <div className="error-message">{error}</div>}
      <GarageForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      <button 
        className="back-button" 
        onClick={() => navigate('/garages')}
      >
        Back to Garages
      </button>
    </div>
  );
};

export default CreateGarage;