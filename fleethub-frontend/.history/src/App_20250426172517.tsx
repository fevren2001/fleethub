// src/App.tsx (updated)
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DriversList from './pages/Drivers/DriversList';
import DriverDetail from './pages/Drivers/DriverDetail';
import CreateDriver from './pages/Drivers/CreateDriver';
// Import other pages as needed

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/drivers" element={<DriversList />} />
      <Route path="/drivers/new" element={<CreateDriver />} />
      <Route path="/drivers/:id" element={<DriverDetail />} />
      <Route path="/drivers/:id/edit" element={<DriverEdit />} />
          
          {/* Add routes for truck, garage, and delivery management */}
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;