import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Garage } from '../../types/garage';
import { getAllGarages } from '../../api/garages';

const GaragesList: React.FC = () => {
  const navigate = useNavigate();
  const [garages, setGarages] = useState<Garage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const data = await getAllGarages();
        setGarages(data);
      } catch (err) {
        console.error('Failed to fetch garages:', err);
        setError('Failed to load garages.');
      } finally {
        setLoading(false);
      }
    };

    fetchGarages();
  }, []);

  if (loading) {
    return <div>Loading garages...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="garages-list-container">
      <div className="header-actions">
        <h1>Garages</h1>
        <button 
          className="create-button"
          onClick={() => navigate('/garages/create')}
        >
          Add New Garage
        </button>
      </div>

      {garages.length === 0 ? (
        <div className="no-garages-message">
          <p>No garages found. Click the button above to add a new garage.</p>
        </div>
      ) : (
        <div className="garages-grid">
          {garages.map((garage) => (
            <div key={garage.id} className="garage-card">
              <div className="garage-card-header">
                <h3>{garage.name}</h3>
                <span className={`status-badge ${garage.status}`}>{garage.status}</span>
              </div>
              <div className="garage-card-body">
                <p><strong>Location:</strong> {garage.location}</p>
                <p><strong>Capacity:</strong> {garage.capacity}</p>
                <p><strong>Occupancy:</strong> {garage.occupancy} vehicles</p>
              </div>
              <div className="garage-card-footer">
                <Link to={`/garages/${garage.id}`} className="view-button">
                  View Details
                </Link>
                <Link to={`/garages/edit/${garage.id}`} className="edit-button">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GaragesList;