import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/common/MainLayout';
import { getAllDeliveries, Delivery } from '../../api/deliveries';

const DeliveriesList: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await getAllDeliveries();
        setDeliveries(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch deliveries');
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (error) return <MainLayout><div>Error: {error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="deliveries-list">
        <div className="page-header">
          <h1>Deliveries</h1>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Distance (km)</th>
                <th>Status</th>
                <th>Driver</th>
                <th>Truck</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map(delivery => (
                <tr key={delivery.id}>
                  <td>{delivery.id}</td>
                  <td>{delivery.origin}</td>
                  <td>{delivery.destination}</td>
                  <td>{delivery.distanceKm}</td>
                  <td>
                    <span className={`status-badge status-${delivery.status.toLowerCase()}`}>
                      {delivery.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{delivery.driver ? delivery.driver.name : '-'}</td>
                  <td>{delivery.truck ? delivery.truck.model : '-'}</td>
                  <td>{new Date(delivery.createdAt).toLocaleString()}</td>
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