// src/services/cityService.ts
export interface City {
    name: string;
    country: string;
    coordinates: {
      longitude: number;
      latitude: number;
    };
  }
  
  // List of major EU cities with their coordinates
  export const supportedCities: City[] = [
    // France
    { name: "Paris", country: "France", coordinates: { longitude: 2.3522, latitude: 48.8566 } },
    { name: "Marseille", country: "France", coordinates: { longitude: 5.3698, latitude: 43.2965 } },
    { name: "Lyon", country: "France", coordinates: { longitude: 4.8357, latitude: 45.7640 } },
    
    // Germany
    { name: "Berlin", country: "Germany", coordinates: { longitude: 13.4050, latitude: 52.5200 } },
    { name: "Munich", country: "Germany", coordinates: { longitude: 11.5820, latitude: 48.1351 } },
    { name: "Hamburg", country: "Germany", coordinates: { longitude: 9.9937, latitude: 53.5511 } },
    
    // Spain
    { name: "Madrid", country: "Spain", coordinates: { longitude: -3.7038, latitude: 40.4168 } },
    { name: "Barcelona", country: "Spain", coordinates: { longitude: 2.1734, latitude: 41.3851 } },
    { name: "Valencia", country: "Spain", coordinates: { longitude: -0.3773, latitude: 39.4699 } },
    { name: "Seville", country: "Spain", coordinates: { longitude: -5.9845, latitude: 37.3891 } }
  ];
  
  /**
   * Get a city by name
   */
  export function getCityByName(cityName: string): City | undefined {
    return supportedCities.find(
      city => city.name.toLowerCase() === cityName.toLowerCase()
    );
  }
  
  /**
   * Get all supported cities
   */
  export function getAllCities(): City[] {
    console.log('getAllCities called');
    return supportedCities;
  }
  
  /**
   * Check if a city is supported
   */
  export function isCitySupported(cityName: string): boolean {
    return supportedCities.some(
      city => city.name.toLowerCase() === cityName.toLowerCase()
    );
  }
  
  /**
   * Get cities filtered by country
   */
  export function getCitiesByCountry(country: string): City[] {
    return supportedCities.filter(
      city => city.country.toLowerCase() === country.toLowerCase()
    );
  }