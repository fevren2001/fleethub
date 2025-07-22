// src/pages/Drivers/DriversList.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/common/MainLayout';
import { getAllDrivers } from '../../api/drivers';
import { Driver } from '../../types/driver';

const DriversList: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getAllDrivers();
        setDrivers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch drivers');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (error) return <MainLayout><div>Error: {error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="drivers-list">
        <div className="page-header">
          <h1>Drivers</h1>
          <Link to="/drivers/new" className="add-button">Add Driver</Link>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>License #</th>
                <th>License Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map(driver => (
                <tr key={driver.id}>
                  <td>{driver.name}</td>
                  <td>
                    <span className={`status-badge status-${driver.status.toLowerCase()}`}>
                      {driver.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{driver.licenseNumber}</td>
                  <td>{new Date(driver.licenseExpiry).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/drivers/${driver.id}`} className="action-button view">View</Link>
                    <Link to={`/drivers/${driver.id}/edit`} className="action-button edit">Edit</Link>
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

export default DriversList;