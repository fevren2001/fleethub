import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/common/MainLayout';
import { getAllDeliveries, Delivery } from '../../api/deliveries';
import { getAllDrivers } from '../../api/drivers';
import { assignDelivery } from '../../api/deliveries';

const DeliveriesList: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigningDeliveryId, setAssigningDeliveryId] = useState<number | null>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [assignError, setAssignError] = useState('');
  const [busyDriverIds, setBusyDriverIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'completed'>('pending');

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await getAllDeliveries();
        setDeliveries(data);
        // Find busy drivers (assigned to in_progress deliveries)
        const busyIds = data
          .filter(delivery => delivery.status === 'in_progress' && delivery.driverId)
          .map(delivery => delivery.driverId);
        setBusyDriverIds(busyIds as number[]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch deliveries');
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  const openAssign = async (deliveryId: number) => {
    setAssigningDeliveryId(deliveryId);
    setAssignError('');
    setSelectedDriverId(null);
    try {
      const allDrivers = await getAllDrivers();
      // Only show drivers with a truck assigned
      const availableDrivers = allDrivers.filter(driver => driver.trucks && driver.trucks.length > 0);
      setDrivers(availableDrivers);
    } catch (err: any) {
      setAssignError('Failed to load drivers');
    }
  };

  const handleAssign = async () => {
    if (!assigningDeliveryId || !selectedDriverId) return;
    setAssignError('');
    try {
      // Find the selected driver and their truck
      const driver = drivers.find((d: any) => d.id === selectedDriverId);
      const truckId = driver.trucks[0].id;
      await assignDelivery(assigningDeliveryId, selectedDriverId, truckId);
      // Refresh deliveries
      setLoading(true);
      const data = await getAllDeliveries();
      setDeliveries(data);
      // Update busy drivers immediately
      const busyIds = data
        .filter(delivery => delivery.status === 'in_progress' && delivery.driverId)
        .map(delivery => delivery.driverId);
      setBusyDriverIds(busyIds as number[]);
      setAssigningDeliveryId(null);
      setLoading(false);
    } catch (err: any) {
      setAssignError('Failed to assign delivery');
      setLoading(false);
    }
  };

  // Filter deliveries by tab
  const filteredDeliveries = deliveries.filter(delivery => delivery.status === activeTab);

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (error) return <MainLayout><div>Error: {error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="deliveries-list">
        <div className="page-header">
          <h1>Deliveries</h1>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <button
            className={activeTab === 'pending' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('pending')}
          >
            Available
          </button>
          <button
            className={activeTab === 'in_progress' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('in_progress')}
          >
            In Progress
          </button>
          <button
            className={activeTab === 'completed' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Distance (km)</th>
                <th>Type</th>
                <th>Status</th>
                <th>Driver</th>
                <th>Truck</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map(delivery => (
                <tr key={delivery.id}>
                  <td>{delivery.id}</td>
                  <td>{delivery.origin}</td>
                  <td>{delivery.destination}</td>
                  <td>{delivery.distanceKm}</td>
                  <td>{delivery.type}</td>
                  <td>
                    <span className={`status-badge status-${delivery.status.toLowerCase()}`}>
                      {delivery.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    {delivery.driver && delivery.driver.photoUrl && (
                      <img src={delivery.driver.photoUrl} alt="Driver" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 6, verticalAlign: 'middle' }} />
                    )}
                    {delivery.driver ? delivery.driver.name : '-'}
                  </td>
                  <td>
                    {delivery.truck && delivery.truck.photoUrl && (
                      <img src={delivery.truck.photoUrl} alt="Truck" style={{ width: 48, height: 32, borderRadius: 6, objectFit: 'cover', marginRight: 6, verticalAlign: 'middle' }} />
                    )}
                    {delivery.truck ? delivery.truck.model : '-'}
                  </td>
                  <td>{new Date(delivery.createdAt).toLocaleString()}</td>
                  <td>
                    {(!delivery.driver || !delivery.truck) && (
                      assigningDeliveryId === delivery.id ? (
                        <span>
                          <select value={selectedDriverId || ''} onChange={e => setSelectedDriverId(Number(e.target.value))}>
                            <option value="">Select Driver</option>
                            {drivers.map(driver => (
                              <option
                                key={driver.id}
                                value={driver.id}
                                style={busyDriverIds.includes(driver.id) ? { background: '#ffcccc', color: '#b00' } : {}}
                                disabled={busyDriverIds.includes(driver.id)}
                              >
                                {driver.name} {busyDriverIds.includes(driver.id) ? '(Unavailable)' : ''}
                              </option>
                            ))}
                          </select>
                          <button onClick={handleAssign} disabled={!selectedDriverId}>Assign</button>
                          <button onClick={() => setAssigningDeliveryId(null)}>Cancel</button>
                          {assignError && <div className="error-message">{assignError}</div>}
                        </span>
                      ) : (
                        <button className="assign-button" onClick={() => openAssign(delivery.id)}>Assign</button>
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

export default DeliveriesList; 