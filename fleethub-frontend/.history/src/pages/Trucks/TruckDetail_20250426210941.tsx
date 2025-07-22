import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import TruckForm from '../../components/Trucks/TruckForm';

interface Truck {
  id: number;
  model: string;
  status: string;
  fuel: number;
  condition: number;
  garageId?: number;
  driverId?: number;
  createdAt: string;
  updatedAt: string;
  garage?: {
    id: number;
    name: string;
  };
  driver?: {
    id: number;
    name: string;
  };
}

const TruckDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  // Fetch truck details
  const { data: truck, isLoading, isError } = useQuery<Truck>(
    ['truck', id],
    async () => {
      const response = await axios.get(`/api/trucks/${id}`);
      return response.data;
    }
  );

  // Update truck mutation
  const updateTruckMutation = useMutation(
    async (truckData: { model: string; garageId?: number }) => {
      const response = await axios.put(`/api/trucks/${id}`, truckData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['truck', id]);
        setIsEditing(false);
        setError('');
      },
      onError: (err: any) => {
        setError(err.response?.data?.error || 'An error occurred while updating the truck');
      },
    }
  );

  // Handle truck status update
  const updateStatusMutation = useMutation(
    async (status: string) => {
      const response = await axios.patch(`/api/trucks/${id}/status`, { status });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['truck', id]);
      },
      onError: (err: any) => {
        setError(err.response?.data?.error || 'Error updating truck status');
      },
    }
  );

  const handleUpdateTruck = (values: { model: string; garageId?: number }) => {
    updateTruckMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading truck details...</div>
      </div>
    );
  }

  if (isError || !truck) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading truck details. The truck may have been deleted or you don't have permission to view it.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Truck' : `Truck: ${truck.model}`}
        </h1>
        <div className="flex space-x-2">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => navigate('/trucks')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to List
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white shadow rounded-lg p-6">
          <TruckForm
            initialValues={{
              model: truck.model,
              garageId: truck.garageId,
            }}
            onSubmit={handleUpdateTruck}
            isSubmitting={updateTruckMutation.isLoading}
          />
          <button
            onClick={() => setIsEditing(false)}
            className="mt-4 text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${
                      truck.status === 'idle'
                        ? 'bg-green-100 text-green-800'
                        : truck.status === 'en route'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                >
                  {truck.status}
                </span>
                {truck.garage && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Garage: {truck.garage.name}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <select
                  value={truck.status}
                  onChange={(e) => updateStatusMutation.mutate(e.target.value)}
                  className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  disabled={updateStatusMutation.isLoading}
                >
                  <option value="idle">Idle</option>
                  <option value="en route">En Route</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Truck Details</h3>
                <dl className="mt-2 text-sm text-gray-600">
                  <div className="mt-1">
                    <dt className="inline font-medium text-gray-500">ID:</dt>
                    <dd className="inline ml-1">{truck.id}</dd>
                  </div>
                  <div className="mt-1">
                    <dt className="inline font-medium text-gray-500">Model:</dt>
                    <dd className="inline ml-1">{truck.model}</dd>
                  </div>
                  <div className="mt-1">
                    <dt className="inline font-medium text-gray-500">Added:</dt>
                    <dd className="inline ml-1">{new Date(truck.createdAt).toLocaleDateString()}</dd>
                  </div>
                  <div className="mt-1">
                    <dt className="inline font-medium text-gray-500">Last Updated:</dt>
                    <dd className="inline ml-1">{new Date(truck.updatedAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Status</h3>
                <dl className="mt-2 text-sm text-gray-600">
                  <div className="mt-1">
                    <dt className="font-medium text-gray-500">Fuel Level:</dt>
                    <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${truck.fuel}%` }}
                      ></div>
                    </div>
                    <dd className="text-right text-xs mt-1">{truck.fuel}%</dd>
                  </div>
                  <div className="mt-3">
                    <dt className="font-medium text-gray-500">Condition:</dt>
                    <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          truck.condition > 70
                            ? 'bg-green-500'
                            : truck.condition > 40
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${truck.condition}%` }}
                      ></div>
                    </div>
                    <dd className="text-right text-xs mt-1">{truck.condition}%</dd>
                  </div>
                </dl>
              </div>
            </div>

            {truck.driver && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900">Assigned Driver</h3>
                <p className="mt-1 text-sm text-gray-600">{truck.driver.name}</p>
              </div>
            )}

            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Deliveries</h3>
              <p className="mt-1 text-sm text-gray-600">No recent deliveries found</p>
              {/* You could add a delivery list component here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TruckDetail;