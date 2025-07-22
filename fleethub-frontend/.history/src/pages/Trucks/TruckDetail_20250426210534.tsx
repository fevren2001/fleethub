// src/pages/Trucks/TruckDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchTruckById, deleteTruck, assignDriver, assignGarage } from '../../api/trucks';
import { Truck, TruckStatus } from '../../types/truck';
import { fetchDrivers } from '../../api/drivers'; // Assuming this exists
import { fetchGarages } from '../../api/garages'; // Assuming this exists

interface Driver {
  id: number;
  name: string;
}

interface Garage {
  id: number;
  name: string;
}

const TruckDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [truck, setTruck] = useState<Truck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [garages, setGarages] = useState<Garage[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [selectedGarageId, setSelectedGarageId] = useState<number | null>(null);
  
  const loadTruck = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [truckData, driversData, garagesData] = await Promise.all([
        fetchTruckById(Number(id)),
        fetchDrivers(),
        fetchGarages()
      ]);
      
      setTruck(truckData);
      setDrivers(driversData);
      setGarages(garagesData);
      setSelectedDriverId(truckData.driverId);
      setSelectedGarageId(truckData.garageId);
      setError(null);
    } catch (err) {
      console.error('Failed to load truck:', err);
      setError('Failed to load truck details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTruck();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !truck) return;
    
    if (window.confirm(`Are you sure you want to delete the truck ${truck.model}?`)) {
      try {
        await deleteTruck(Number(id));
        navigate('/trucks');
      } catch (err) {
        console.error('Failed to delete truck:', err);
        alert('Failed to delete truck. Please try again.');
      }
    }
  };

  const handleAssignDriver = async () => {
    if (!id || !selectedDriverId) return;
    
    try {
      const updatedTruck = await assignDriver(Number(id), selectedDriverId);
      setTruck(updatedTruck);
      alert('Driver assigned successfully!');
    } catch (err) {
      console.error('Failed to assign driver:', err);
      alert('Failed to assign driver. Please try again.');
    }
  };

  const handleAssignGarage = async () => {
    if (!id || !selectedGarageId) return;
    
    try {
      const updatedTruck = await assignGarage(Number(id), selectedGarageId);
      setTruck(updatedTruck);
      alert('Garage assigned successfully!');
    } catch (err) {
      console.error('Failed to assign garage:', err);
      alert('Failed to assign garage. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading truck details...</div>;
  }

  if (!truck && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Truck not found or you don't have permission to view this truck.
          <button
            className="ml-2 text-indigo-600 hover:text-indigo-800 font-bold"
            onClick={() => navigate('/trucks')}
          >
            Return to Trucks
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: TruckStatus) => {
    switch (status) {
      case 'idle':
        return 'bg-green-100 text-green-800';
      case 'en route':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFuelColor = (fuel: number) => {
    if (fuel < 25) return 'text-red-600';
    if (fuel < 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const get