import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/common/MainLayout';
import { getAllTrucks } from '../../api/trucks';
import { Truck } from '../../types/truck';
import { getAllDrivers } from '../../api/drivers';
import { assignDriverToTruck } from '../../api/trucks';

const TrucksList: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigningTruckId, setAssigningTruckId] = useState<number | null>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [assignError, setAssignError] = useState('');

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

  const openAssignDriver = async (truckId: number) => {
    setAssigningTruckId(truckId);
    setAssignError('');
    setSelectedDriverId(null);
    try {
      const allDrivers = await getAllDrivers();
      // Only show drivers not already assigned to a truck
      const availableDrivers = allDrivers.filter(driver => !trucks.some(truck => truck.driverId === driver.id));
      setDrivers(availableDrivers);
    } catch (err: any) {
      setAssignError('Failed to load drivers');
    }
  };

  const handleAssign = async () => {
    if (!assigningTruckId || !selectedDriverId) return;
    setAssignError('');
    try {
      await assignDriverToTruck(assigningTruckId, selectedDriverId);
      setLoading(true);
      const data = await getAllTrucks();
      setTrucks(data);
      setAssigningTruckId(null);
      setLoading(false);
    } catch (err: any) {
      setAssignError('Failed to assign driver');
      setLoading(false);
    }
  };

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (error) return <MainLayout><div>Error: {error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="trucks-list">
        <div className="page-header">
          <h1>Trucks</h1>
          <Link to="/trucks/new" className="add-button">Add Truck</Link>
        </div>
        <div className="trucks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          {trucks.map(truck => {
            let cardBg = '#fff';
            if (truck.driverId) {
              cardBg = '#e6ffe6'; // green for assigned
            } else if (truck.status && (truck.status.toLowerCase() === 'maintenance' || truck.status.toLowerCase() === 'en route')) {
              cardBg = '#ffe6e6'; // red for not available
            }
            return (
              <div
                key={truck.id}
                className="truck-card"
                style={{
                  background: cardBg,
                  borderRadius: 16,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <img
                  src={truck.photoUrl}
                  alt="Truck"
                  style={{ width: 180, height: 120, borderRadius: 12, objectFit: 'cover', marginBottom: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }}
                />
                {/* Removed truck model/name and status badge */}
                <div style={{ marginBottom: 8, color: '#555' }}>
                  <strong>Garage:</strong> {truck.garageId ? truck.garageId : '-'}
                </div>
                <div style={{ marginBottom: 8, color: '#555', display: 'flex', alignItems: 'center' }}>
                  <strong>Driver:</strong>&nbsp;
                  {truck.driver && truck.driver.photoUrl && (
                    <img src={truck.driver.photoUrl} alt="Driver" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 6, verticalAlign: 'middle' }} />
                  )}
                  {truck.driver ? truck.driver.name : '-'}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <Link to={`/trucks/${truck.id}`} className="action-button view">View</Link>
                  <Link to={`/trucks/${truck.id}/edit`} className="action-button edit">Edit</Link>
                  {!truck.driverId && (
                    assigningTruckId === truck.id ? (
                      <span>
                        <select value={selectedDriverId || ''} onChange={e => setSelectedDriverId(Number(e.target.value))}>
                          <option value="">Select Driver</option>
                          {drivers.map(driver => (
                            <option key={driver.id} value={driver.id}>{driver.name}</option>
                          ))}
                        </select>
                        <button onClick={handleAssign} disabled={!selectedDriverId}>Assign</button>
                        <button onClick={() => setAssigningTruckId(null)}>Cancel</button>
                        {assignError && <div className="error-message">{assignError}</div>}
                      </span>
                    ) : (
                      <button onClick={() => openAssignDriver(truck.id)}>Assign Driver</button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default TrucksList;