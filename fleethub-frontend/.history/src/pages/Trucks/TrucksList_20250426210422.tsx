// src/pages/Trucks/TrucksList.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchTrucks, deleteTruck } from '../../api/trucks';
import { Truck } from '../../types/truck';

const TrucksList: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadTrucks = async () => {
    setLoading(true);
    try {
      const data = await fetchTrucks();
      setTrucks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load trucks. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrucks();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this truck?')) {
      try {
        await deleteTruck(id);
        setTrucks(trucks.filter(truck => truck.id !== id));
      } catch (err) {
        console.error('Failed to delete truck:', err);
        alert('Failed to delete truck. Please try again.');
      }
    }
  };

  const getStatusBadgeColor = (status: string) => {
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

  const getConditionColor = (condition: number) => {
    if (condition < 25) return 'text-red-600';
    if (condition < 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading trucks...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        <button
          className="ml-2 text-red-700 font-bold"
          onClick={loadTrucks}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trucks</h1>
        <Link 
          to="/trucks/new" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
        >
          Add New Truck
        </Link>
      </div>

      {trucks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No trucks available. Create your first truck!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Garage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trucks.map((truck) => (
                <tr key={truck.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {truck.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {truck.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(truck.status)}`}>
                      {truck.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${getFuelColor(truck.fuel)}`} 
                          style={{ width: `${truck.fuel}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{truck.fuel}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${getConditionColor(truck.condition)}`} 
                          style={{ width: `${truck.condition}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{truck.condition}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {truck.garageId ? `Garage #${truck.garageId}` : 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {truck.driverId ? `Driver #${truck.driverId}` : 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link 
                      to={`/trucks/${truck.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </Link>
                    <Link 
                      to={`/trucks/${truck.id}/edit`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(truck.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrucksList;