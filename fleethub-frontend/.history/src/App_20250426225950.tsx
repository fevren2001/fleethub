import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Driver Pages
import DriversList from './pages/Drivers/DriversList';
import DriverDetail from './pages/Drivers/DriverDetail';
import CreateDriver from './pages/Drivers/CreateDriver';
import DriverEdit from './pages/Drivers/DriverEdit';

// Truck Pages
import TrucksList from './pages/Trucks/TrucksList';
import TruckDetail from './pages/Trucks/TruckDetail';
import CreateTruck from './pages/Trucks/CreateTruck';
import TruckEdit from './pages/Trucks/TruckEdit';

// Garage Pages
import GaragesList from './pages/Garages/GaragesList';
import GarageDetail from './pages/Garages/GarageDetail';
import CreateGarage from './pages/Garages/CreateGarage';
import GarageEdit from './pages/Garages/GarageEdit';

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
          
          {/* Driver Routes */}
          <Route path="/drivers" element={<DriversList />} />
          <Route path="/drivers/new" element={<CreateDriver />} />
          <Route path="/drivers/:id" element={<DriverDetail />} />
          <Route path="/drivers/:id/edit" element={<DriverEdit />} />
          
          {/* Truck Routes */}
          <Route path="/trucks" element={<TrucksList />} />
          {/* <Route path="/trucks/create" element={<CreateTruck />} /> */}
          <Route path="/trucks/new" element={<Truck />} />

          <Route path="/trucks/:id" element={<TruckDetail />} />
          <Route path="/trucks/edit/:id" element={<TruckEdit />} />
          
          {/* Garage Routes */}
          <Route path="/garages" element={<GaragesList />} />
          <Route path="/garages/create" element={<CreateGarage />} />
          <Route path="/garages/:id" element={<GarageDetail />} />
          <Route path="/garages/edit/:id" element={<GarageEdit />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;