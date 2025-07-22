import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/common/MainLayout';
import { getAllTrucks } from '../../api/trucks';
import { Truck } from '../../types/truck';

const TrucksList: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const data = await getAllTrucks();
        setTrucks(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch trucks');
      } finally {
        setLoading(false);
      }
    };

    fetchTrucks();
  }, []);

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (error) return <MainLayout><div>Error: {error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="trucks-list">
        <div className="page-header">
          <h1>Trucks</h1>
          <Link to="/trucks/new" className="add-button">Add Truck</Link>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Garage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trucks.map(truck => (
                <tr key={truck.id}>
                  <td>{truck.model}</td>
                  <td>{truck.city}</td>
                  <td>
                    {truck.status && (
                      <span className={`status-badge status-${truck.status.toLowerCase()}`}>
                        {truck.status.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td>
                    <Link to={`/trucks/${truck.id}`} className="action-button view">View</Link>
                    <Link to={`/trucks/${truck.id}/edit`} className="action-button edit">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default TrucksList;