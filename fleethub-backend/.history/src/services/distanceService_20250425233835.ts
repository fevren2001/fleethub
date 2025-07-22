// src/services/distanceService.ts
import axios from 'axios';
import { City, getCityByName } from './cityService';

// OpenRouteService API configuration
const ORS_API_KEY = '5b3ce3597851110001cf62483a6456283adb4811ab469ec1d8e5fee6';
const ORS_API_URL = 'https://api.openrouteservice.org/v2/directions/driving-car';

export interface DistanceResult {
  distanceKm: number;
  durationMinutes: number;
}

/**
 * Calculate distance between two cities using OpenRouteService API
 */
export async function calculateDistance(originCity: string, destinationCity: string): Promise<DistanceResult> {
  const origin = getCityByName(originCity);
  const destination = getCityByName(destinationCity);
  
  if (!origin || !destination) {
    throw new Error(
      `One or both cities not supported. Please use one of our supported major EU cities.`
    );
  }
  
  try {
    const response = await axios.get(ORS_API_URL, {
      params: {
        api_key: ORS_API_KEY,
        start: `${origin.coordinates.longitude},${origin.coordinates.latitude}`,
        end: `${destination.coordinates.longitude},${destination.coordinates.latitude}`
      },
      headers: {
        'Accept': 'application/json, application/geo+json, application/gpx+xml',
        'Content-Type': 'application/json'
      }
    });
    
    const route = response.data.features[0].properties;
    
    return {
      distanceKm: Math.round((route.segments[0].distance / 1000) * 10) / 10, // Convert to km and round to 1 decimal
      durationMinutes: Math.round(route.segments[0].duration / 60) // Convert to minutes and round
    };
  } catch (error: any) {
    console.error('Error calculating distance:', error.response?.data || error.message);
    throw new Error('Failed to calculate distance between cities');
  }
}

/**
 * Validate that both cities are supported
 */
export function validateCities(originCity: string, destinationCity: string): void {
  const origin = getCityByName(originCity);
  const destination = getCityByName(destinationCity);
  
  if (!origin) {
    throw new Error(`Origin city "${originCity}" is not supported. Please use one of our supported major EU cities.`);
  }
  
  if (!destination) {
    throw new Error(`Destination city "${destinationCity}" is not supported. Please use one of our supported major EU cities.`);
  }
  
  if (originCity.toLowerCase() === destinationCity.toLowerCase()) {
    throw new Error('Origin and destination cities cannot be the same');
  }
}