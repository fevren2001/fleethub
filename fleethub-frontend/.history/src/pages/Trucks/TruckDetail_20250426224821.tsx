import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/common/MainLayout';
import { getTruckById, deleteTruck } from '../../api/trucks';
import { Truck } from '../../types/truck';

const TruckDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [truck, setTruck] = useState<Truck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTruck = async () => {
      if (!id) return;
      
      try {
        const data = await getTruckById(id);
        setTruck(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch truck details');
      } finally {
        setLoading(false);
      }
    };

    fetchTruck();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this truck?')) return;
    
    setIsDeleting(true);
    
    try {
      await deleteTruck(id);
      navigate('/trucks');
    } catch (err: any) {
      setError(err.message || 'Failed to delete truck');
      setIsDeleting(false);
    }
  };

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (error) return <MainLayout><div>Error: {error}</div></MainLayout>;
  if (!truck) return <MainLayout><div>Truck not found</div></MainLayout>;

  return (
    <MainLayout>
      <div className="truck-detail">
        <div className="page-header">
          <h1>{truck.name}</h1>
          <div className="action-buttons">
            <Link to={`/trucks/${id}/edit`} className="edit-button">Edit</Link>
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
            <span>{truck.skill}</span>
          </div>
          
          {truck.status && (
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status-badge status-${truck.status.toLowerCase()}`}>
                {truck.status.replace('_', ' ')}
              </span>
            </div>
          )}
          
          {truck.createdAt && (
            <div className="detail-row">
              <span className="detail-label">Created:</span>
              <span>{new Date(truck.createdAt).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TruckDetail;