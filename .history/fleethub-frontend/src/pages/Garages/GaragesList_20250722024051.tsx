import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Garage } from '../../types/garage';
import { getAllGarages } from '../../api/garages';
import MainLayout from '../../components/common/MainLayout';

const GaragesList: React.FC = () => {
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
    return <MainLayout><div>Loading garages...</div></MainLayout>;
  }

  if (error) {
    return <MainLayout><div className="error-message">{error}</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="garages-list">
        <div className="page-header">
          <h1>Garages</h1>
          <Link to="/garages/create" className="add-button">Add Garage</Link>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>City</th>
                <th>Capacity</th>
                <th>Occupancy</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {garages.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center' }}>
                    No garages found. Click the button above to add a new garage.
                  </td>
                </tr>
              ) : (
                garages.map((garage) => (
                  <tr key={garage.id}>
                    <td>{garage.location || garage.city}</td>
                    <td>{garage.capacity}</td>
                    <td>{garage.occupancy}</td>
                    <td>
                      <Link to={`/garages/${garage.id}`} className="action-button view">View</Link>
                      <Link to={`/garages/edit/${garage.id}`} className="action-button edit">Edit</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default GaragesList;