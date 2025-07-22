import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GarageForm from '../../components/garages/GarageForm';
import { getGarageById, updateGarage } from '../../api/garages';
import { Garage, GarageFormData } from '../../types/garage';

const GarageEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [garage, setGarage] = useState<Garage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGarage = async () => {
      if (!id) return;
      
      try {
        const data = await getGarageById(id);
        setGarage(data);
      } catch (err) {
        console.error('Failed to fetch garage:', err);
        setError('Failed to load garage details.');
      } finally {
        setLoading(false);
      }
    };

    fetchGarage();
  }, [id]);

  const handleSubmit = async (data: GarageFormData) => {
    if (!id || !garage) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateGarage(parseInt(id), data);
      navigate(`/garages/${id}`);
    } catch (err) {
      console.error('Failed to update garage:', err);
      setError('Failed to update garage. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading garage details...</div>;
  }

  if (error && !isSubmitting) {
    return <div className="error-message">{error}</div>;
  }

  if (!garage) {
    return <div>Garage not found.</div>;
  }

  return (
    <div className="garage-edit-container">
      <h1>Edit Garage</h1>
      {error && <div className="error-message">{error}</div>}
      <GarageForm 
        initialData={garage} 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
      <button 
        className="back-button" 
        onClick={() => navigate(`/garages/${id}`)}
      >
        Cancel
      </button>
    </div>
  );
};

export default GarageEdit;