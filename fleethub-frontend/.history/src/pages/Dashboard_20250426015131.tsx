// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import MainLayout from '../components/common/MainLayout';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    drivers: 0,
    trucks: 0,
    garages: 0,
    activeDeliveries: 0
  });

  useEffect(() => {
    // Fetch dashboard stats from your API
    // Example:
    // const fetchStats = async () => {
    //   const response = await apiClient.get('/dashboard/stats');
    //   setStats(response.data);
    // };
    // fetchStats();
    
    // For now, using placeholder data
    setStats({
      drivers: 24,
      trucks: 18,
      garages: 5,
      activeDeliveries: 12
    });
  }, []);

  return (
    <MainLayout>
      <div className="dashboard">
        <h1>Dashboard</h1>
        
        <div className="stats-container">
          <div className="stat-card">
            <h3>Drivers</h3>
            <p className="stat-value">{stats.drivers}</p>
          </div>
          
          <div className="stat-card">
            <h3>Trucks</h3>
            <p className="stat-value">{stats.trucks}</p>
          </div>
          
          <div className="stat-card">
            <h3>Garages</h3>
            <p className="stat-value">{stats.garages}</p>
          </div>
          
          <div className="stat-card">
            <h3>Active Deliveries</h3>
            <p className="stat-value">{stats.activeDeliveries}</p>
          </div>
        </div>
        
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          {/* Placeholder for recent activity list */}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;