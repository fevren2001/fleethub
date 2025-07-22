// src/pages/Trucks/CreateTruck.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TruckForm from '../../components/Trucks/TruckForm';
import { createTruck } from '../../api/trucks';
import { CreateTruckPayload } from '../../types/truck';

const CreateTruck: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: CreateTruckPayload) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newTruck = await createTruck(values);
      navigate(`/trucks/${newTruck.id}`);
    } catch (err: any) {
      console.error('Failed to create truck:', err);
      setError(err.response?.data?.error || 'Failed to create truck. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/trucks')}
          className="mr-4 text-indigo-600 hover:text-indigo-800"
        >
          &larr; Back to Trucks
        </button>
        <h1 className="text-2xl font-bold">Add New Truck</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        <TruckForm 
          onSubmit={handleSubmit} 
          isEditing={false} 
        />
        
        {isSubmitting && (
          <div className="flex justify-center mt-4">
            <p className="text-gray-500">Creating truck...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTruck;