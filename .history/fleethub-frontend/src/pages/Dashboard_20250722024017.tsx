// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import MainLayout from '../components/common/MainLayout';
import { getAllDeliveries, Delivery } from '../api/deliveries';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    drivers: 0,
    trucks: 0,
    garages: 0,
    activeDeliveries: 0
  });
  const [activeDeliveries, setActiveDeliveries] = useState<Delivery[]>([]);
  const [completedDeliveries, setCompletedDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    // Fetch dashboard stats and deliveries from your API
    const fetchData = async () => {
      // Optionally, fetch stats from a dedicated endpoint
      // For now, just count from deliveries
      const deliveries = await getAllDeliveries();
      const inProgress = deliveries.filter(d => d.status === 'in_progress');
      const completed = deliveries.filter(d => d.status === 'completed');
      setActiveDeliveries(inProgress);
      setCompletedDeliveries(completed);
      setStats({
        drivers: 0, // You can fetch real stats if you want
        trucks: 0,
        garages: 0,
        activeDeliveries: inProgress.length
      });
    };
    fetchData();
    // Optionally, poll every 10 seconds for updates
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Helper to format ETA
  const getEtaString = (delivery: Delivery) => {
    // if (!delivery.expectedCompletionTime) return '-';
    // const eta = new Date(delivery.expectedCompletionTime).getTime() - Date.now();
    // if (eta <= 0) return 'Arrived';
    // const minutes = Math.floor(eta / 60000);
    // const seconds = Math.floor((eta % 60000) / 1000);
    return '-';
  };

  return (
    <MainLayout>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="stats-container">
          <div className="stat-card">
            <h3>Active Deliveries</h3>
            <p className="stat-value">{stats.activeDeliveries}</p>
          </div>
        </div>
        <div className="recent-activity">
          <h2>Active Deliveries</h2>
          {activeDeliveries.length === 0 && <div>No active deliveries.</div>}
          {activeDeliveries.map(delivery => (
            <div key={delivery.id} className="activity-item">
              {delivery.driver && delivery.driver.photoUrl && (
                <img src={delivery.driver.photoUrl} alt="Driver" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', marginRight: 10, verticalAlign: 'middle' }} />
              )}
              <strong>{delivery.driver ? delivery.driver.name : 'Someone'}</strong> took the <strong>{delivery.type}</strong> delivery from <strong>{delivery.origin}</strong> and is on way to <strong>{delivery.destination}</strong>.<br />
              ETA: {getEtaString(delivery)}
            </div>
          ))}
          <h2 style={{ marginTop: '2rem' }}>Recently Completed</h2>
          {completedDeliveries.length === 0 && <div>No completed deliveries yet.</div>}
          {completedDeliveries.slice(-5).reverse().map(delivery => (
            <div key={delivery.id} className="activity-item">
              {delivery.driver && delivery.driver.photoUrl && (
                <img src={delivery.driver.photoUrl} alt="Driver" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', marginRight: 10, verticalAlign: 'middle' }} />
              )}
              <strong>{delivery.driver ? delivery.driver.name : 'Someone'}</strong> completed the <strong>{delivery.type}</strong> delivery from <strong>{delivery.origin}</strong> to <strong>{delivery.destination}</strong>.
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;