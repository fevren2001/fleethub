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
      setLoading(false); // Fix: reset loading after refresh
    } catch (err: any) {
      setAssignError('Failed to assign driver');
      setLoading(false); // Fix: reset loading on error
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

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Photo</th>
                <th>Garage</th>
                <th>Status</th>
                <th>Driver</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trucks.map(truck => (
                <tr key={truck.id}>
                  <td>
                    {truck.photoUrl && <img src={truck.photoUrl} alt="Truck" style={{ width: 64, height: 48, borderRadius: 8, objectFit: 'cover', marginRight: 8 }} />}
                    {truck.model}
                  </td>
                  <td>{truck.garageId}</td>
                  <td>
                    {truck.status && (
                      <span className={`status-badge status-${truck.status.toLowerCase()}`}>
                        {truck.status.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td>
                    {truck.driver && truck.driver.photoUrl && (
                      <img src={truck.driver.photoUrl} alt="Driver" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 6, verticalAlign: 'middle' }} />
                    )}
                    {truck.driver ? truck.driver.name : '-'}
                  </td>
                  <td>
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