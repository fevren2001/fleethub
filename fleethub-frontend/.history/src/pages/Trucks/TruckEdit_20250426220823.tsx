// src/pages/Trucks/TruckEdit.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TruckForm from '../../components/Trucks/TruckForm';
import { fetchTruckById, updateTruck } from '../../api/trucks';
import { Truck, UpdateTruckPayload } from '../../types/truck';

const TruckEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [truck, setTruck] = useState<Truck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadTruck = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await fetchTruckById(Number(id));
        setTruck(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load truck:', err);
        setError('Failed to load truck details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadTruck();
  }, [id]);

  const handleSubmit = async (values: UpdateTruckPayload) => {
    if (!id) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateTruck(Number(id), values);
      navigate(`/trucks/${id}`);
    } catch (err: any) {
      console.error('Failed to update truck:', err);
      setError(err.response?.data?.error || 'Failed to update truck. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading truck details...</div>;
  }

  if (!truck && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Truck not found or you don't have permission to edit this truck.
          <button
            className="ml-2 text-indigo-600 hover:text-indigo-800 font-bold"
            onClick={() => navigate('/trucks')}
          >
            Return to Trucks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(`/trucks/${id}`)}
          className="mr-4 text-indigo-600 hover:text-indigo-800"
        >
          &larr; Back to Truck Details
        </button>
        <h1 className="text-2xl font-bold">Edit Truck: {truck?.model}</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        {truck && (
          <TruckForm
            initialData={truck}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
        
        {isSubmitting && (
          <div className="flex justify-center mt-4">
            <p className="text-gray-500">Updating truck...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TruckEdit;