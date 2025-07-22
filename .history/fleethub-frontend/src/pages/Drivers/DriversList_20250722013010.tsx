import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/common/MainLayout';
import { getAllDrivers } from '../../api/drivers';
import { Driver } from '../../types/driver';

const DriversList: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'list' | 'card'>('list');

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
        <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1>Drivers</h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              style={view === 'list' ? { background: '#3498db', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer' } : { background: '#e5e7eb', color: '#888', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer' }}
              onClick={() => setView('list')}
            >
              List View
            </button>
            <button
              style={view === 'card' ? { background: '#3498db', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer' } : { background: '#e5e7eb', color: '#888', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer' }}
              onClick={() => setView('card')}
            >
              Card View
            </button>
            <Link to="/drivers/new" className="add-button">Add Driver</Link>
          </div>
        </div>

        {view === 'list' ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Skill</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map(driver => (
                  <tr key={driver.id}>
                    <td>{driver.name}</td>
                    <td>{driver.skill}</td>
                    <td>
                      {driver.status && (
                        <span className={`status-badge status-${driver.status.toLowerCase()}`}>
                          {driver.status.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td>
                      <Link to={`/drivers/${driver.id}`} className="action-button view">View</Link>
                      <Link to={`/drivers/${driver.id}/edit`} className="action-button edit">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="drivers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            {drivers.map(driver => (
              <div key={driver.id} className="driver-card" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {driver.photoUrl && (
                  <img
                    src={driver.photoUrl}
                    alt="Driver"
                    style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', marginBottom: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }}
                  />
                )}
                <h2 style={{ margin: '0 0 8px 0', fontSize: 22 }}>{driver.name}</h2>
                <div style={{ marginBottom: 8, color: '#555' }}>
                  <strong>Skill:</strong> {driver.skill}
                </div>
                <div style={{ marginBottom: 8, color: '#555' }}>
                  <strong>Status:</strong> <span className={`status-badge status-${driver.status?.toLowerCase()}`}>{driver.status?.replace('_', ' ')}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <Link to={`/drivers/${driver.id}`} className="action-button view">View</Link>
                  <Link to={`/drivers/${driver.id}/edit`} className="action-button edit">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DriversList;