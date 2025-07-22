import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Garage } from '../../types/garage';
import { getGarageById, deleteGarage } from '../../api/garages';
import MainLayout from '../../components/common/MainLayout';

const GarageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [garage, setGarage] = useState<Garage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteGarage(id);
      navigate('/garages');
    } catch (err) {
      console.error('Failed to delete garage:', err);
      setError('Failed to delete garage.');
    }
  };

  if (loading) {
    return <MainLayout><div>Loading garage details...</div></MainLayout>;
  }

  if (error) {
    return <MainLayout><div className="error-message">{error}</div></MainLayout>;
  }

  if (!garage) {
    return <MainLayout><div>Garage not found.</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="garage-detail">
        <div className="page-header">
          <h1>Garage Details</h1>
          <div className="action-buttons">
            <button 
              className="edit-button"
              onClick={() => navigate(`/garages/edit/${garage.id}`)}
            >
              Edit Garage
            </button>
            <button 
              className="delete-button"
              onClick={() => setShowConfirmDelete(true)}
            >
              Delete Garage
            </button>
          </div>
        </div>
        <div className="detail-card">
          <div className="detail-row">
            <span className="detail-label">City:</span>
            <span>{garage.location || garage.city}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Capacity:</span>
            <span>{garage.capacity}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Occupancy:</span>
            <span>{garage.occupancy} / {garage.capacity}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Created:</span>
            <span>{new Date(garage.createdAt).toLocaleString()}</span>
          </div>
        </div>
        {showConfirmDelete && (
          <div className="confirm-delete-modal">
            <div className="modal-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this garage?</p>
              <div className="modal-buttons">
                <button 
                  className="cancel-button"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-button"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <button 
          className="back-button"
          onClick={() => navigate('/garages')}
        >
          Back to Garages
        </button>
      </div>
    </MainLayout>
  );
};

export default GarageDetail;