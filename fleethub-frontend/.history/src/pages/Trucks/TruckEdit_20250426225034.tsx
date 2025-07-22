import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/common/MainLayout';
import TruckForm from '../../components/trucks/TruckForm';
import { TruckFormData } from '../../types/truck';
import { getTruckById, updateTruck } from '../../api/trucks';

const TruckEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const truckId = parseInt(id || '', 10);
  if (isNaN(truckId)) {
    throw new Error('Invalid truck ID');
  }
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<Partial<TruckFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTruck = async () => {
      if (!id) return;
      
      try {
        const truck = await getTruckById(id);
        setInitialData({
          model: truck.model,
          
          garageId: truck.garageId
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch truck details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTruck();
  }, [id]);

  const handleSubmit = async (data: TruckFormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Convert skill to a number
      const formattedData = {
        ...data,
        skill: typeof data.skill === 'string' ? parseInt(data.skill, 10) : data.skill
      };
      
      await updateTruck(truckId, formattedData);
      navigate(`/trucks/${id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update truck');
      console.error('Update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (error && isLoading) return <MainLayout><div>Error: {error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="truck-edit">
        <div className="page-header">
          <h1>Edit Truck</h1>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <TruckForm 
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </MainLayout>
  );
};

export default TruckEdit;