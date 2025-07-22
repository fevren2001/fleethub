import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/common/MainLayout';
import DriverForm from '../../components/drivers/DriverForm';
import { DriverFormData } from '../../types/driver';
import { getDriverById, updateDriver } from '../../api/drivers';

const DriverEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<Partial<DriverFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDriver = async () => {
      if (!id) return;
      
      try {
        const driver = await getDriverById(id);
        setInitialData({
          name: driver.name,
          skill: driver.skill
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch driver details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDriver();
  }, [id]);

  const handleSubmit = async (data: DriverFormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await updateDriver(id, data);
      navigate(`/drivers/${id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update driver');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (error && isLoading) return <MainLayout><div>Error: {error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="driver-edit">
        <div className="page-header">
          <h1>Edit Driver</h1>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <DriverForm 
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </MainLayout>
  );
};

export default DriverEdit;