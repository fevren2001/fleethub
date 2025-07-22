import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/common/MainLayout';
import { fetchTruckById, deleteTruck, updateTruck } from '../../api/trucks';
import { Truck } from '../../types/truck';

const TruckDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [truck, setTruck] = useState<Truck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    const fetchTruck = async () => {
      if (!id) return;
      
      try {
        const data = await fetchTruckById(parseInt(id, 10));
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
      await deleteTruck(parseInt(id, 10));
      navigate('/trucks');
    } catch (err: any) {
      setError(err.message || 'Failed to delete truck');
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id || !truck) return;
    
    setStatusUpdating(true);
    
    try {
      await updateTruck(parseInt(id, 10), newStatus);
      setTruck({...truck, status: newStatus});
    } catch (err: any) {
      setError(err.message || 'Failed to update truck status');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (error) return <MainLayout><div>Error: {error}</div></MainLayout>;
  if (!truck) return <MainLayout><div>Truck not found</div></MainLayout>;

  return (
    <MainLayout>
      <div className="truck-detail">
        <div className="page-header">
          <h1>{truck.model}</h1>
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
            <span className="detail-label">Status:</span>
            <span className={`status-badge status-${truck.status.toLowerCase()}`}>
              {truck.status}
            </span>
            <select
              value={truck.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="status-select"
              disabled={statusUpdating}
            >
              <option value="idle">Idle</option>
              <option value="en route">En Route</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {truck.garage && (
            <div className="detail-row">
              <span className="detail-label">Garage:</span>
              <span>{truck.garage.name}</span>
            </div>
          )}

          {truck.driver && (
            <div className="detail-row">
              <span className="detail-label">Driver:</span>
              <Link to={`/drivers/${truck.driver.id}`}>{truck.driver.name}</Link>
            </div>
          )}
          
          <div className="detail-row">
            <span className="detail-label">Fuel Level:</span>
            <div className="progress-bar-container">
              <div 
                className="progress-bar fuel-level" 
                style={{ width: `${truck.fuel}%` }}
              ></div>
              <span className="progress-value">{truck.fuel}%</span>
            </div>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Condition:</span>
            <div className="progress-bar-container">
              <div 
                className={`progress-bar condition-level condition-${
                  truck.condition > 70 ? 'good' : truck.condition > 40 ? 'fair' : 'poor'
                }`}
                style={{ width: `${truck.condition}%` }}
              ></div>
              <span className="progress-value">{truck.condition}%</span>
            </div>
          </div>
          
          {truck.createdAt && (
            <div className="detail-row">
              <span className="detail-label">Created:</span>
              <span>{new Date(truck.createdAt).toLocaleString()}</span>
            </div>
          )}
          
          {truck.updatedAt && (
            <div className="detail-row">
              <span className="detail-label">Updated:</span>
              <span>{new Date(truck.updatedAt).toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="detail-section">
          <h2>Recent Deliveries</h2>
          <p className="empty-state">No recent deliveries found</p>
          {/* You could add a delivery list component here */}
        </div>
      </div>
    </MainLayout>
  );
};

export default TruckDetail;