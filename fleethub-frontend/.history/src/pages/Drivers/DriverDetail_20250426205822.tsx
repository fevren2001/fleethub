import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/common/MainLayout';
import { getDriverById, deleteDriver } from '../../api/drivers';
import { Driver } from '../../types/driver';

const DriverDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchDriver = async () => {
      if (!id) return;
      
      try {
        const data = await getDriverById(id);
        setDriver(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch driver details');
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this driver?')) return;
    
    setIsDeleting(true);
    
    try {
      await deleteDriver(id);
      navigate('/drivers');
    } catch (err: any) {
      setError(err.message || 'Failed to delete driver');
      setIsDeleting(false);
    }
  };

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (error) return <MainLayout><div>Error: {error}</div></MainLayout>;
  if (!driver) return <MainLayout><div>Driver not found</div></MainLayout>;

  return (
    <MainLayout>
      <div className="driver-detail">
        <div className="page-header">
          <h1>{driver.name}</h1>
          <div className="action-buttons">
            <Link to={`/drivers/${id}/edit`} className="edit-button">Edit</Link>
            <button 
              onClick={handleDelete} 
              className="delete-button"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-row">
            <span className="detail-label">Skill:</span>
            <span>{driver.skill}</span>
          </div>
          
          {driver.status && (
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status-badge status-${driver.status.toLowerCase()}`}>
                {driver.status.replace('_', ' ')}
              </span>
            </div>
          )}
          
          {/* {driver.currentTruckId && (
            <div className="detail-row">
              <span className="detail-label">Current Truck:</span>
              <Link to={`/trucks/${driver.currentTruckId}`}>{driver.currentTruckId}</Link>
            </div>
          )} */}
          
          {driver.createdAt && (
            <div className="detail-row">
              <span className="detail-label">Created:</span>
              <span>{new Date(driver.createdAt).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DriverDetail;