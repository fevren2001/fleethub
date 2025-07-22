import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Garage } from '../../types/garage';
import { getGarageById, deleteGarage } from '../../api/garages';

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
    return <div>Loading garage details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!garage) {
    return <div>Garage not found.</div>;
  }

  return (
    <div className="garage-detail-container">
      <h1>Garage Details</h1>
      
      <div className="garage-info">
        <div className="info-row">
          <span className="label">Name:</span>
          <span className="value">{garage.name}</span>
        </div>
        
        <div className="info-row">
          <span className="label">Location:</span>
          <span className="value">{garage.location}</span>
        </div>
        
        <div className="info-row">
          <span className="label">Capacity:</span>
          <span className="value">{garage.capacity}</span>
        </div>
        
        <div className="info-row">
          <span className="label">Status:</span>
          <span className="value status-badge">{garage.status}</span>
        </div>
        
        <div className="info-row">
          <span className="label">Occupancy:</span>
          <span className="value">{garage.occupancy} / {garage.capacity}</span>
        </div>
        
        <div className="info-row">
          <span className="label">Created:</span>
          <span className="value">{new Date(garage.createdAt).toLocaleString()}</span>
        </div>
        
        <div className="info-row">
          <span className="label">Last Updated:</span>
          <span className="value">{new Date(garage.updatedAt).toLocaleString()}</span>
        </div>
      </div>
      
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
  );
};

export default GarageDetail;