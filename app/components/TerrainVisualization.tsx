import React, { useEffect, useState } from 'react';
import Terrain from './Terrain';

/**
 * Type definition for the Open-Meteo API response.
 * Only includes the temperature field we're using.
 */
interface WeatherApiResponse {
  current: {
    temperature_2m: number;
  };
}

// Configuration constants
const DEFAULT_LAT = 51.5074; // London latitude
const DEFAULT_LON = -0.1278; // London longitude

/**
 * Main component that handles weather data fetching and renders
 * the 3D terrain visualization
 */
const TerrainVisualization: React.FC = () => {
  // State management for weather data and UI states
  const [temperature, setTemperature] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches current weather data from the Open-Meteo API
   * Updates the temperature state or falls back to default value on error
   */
  const fetchWeatherData = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Open-Meteo API is free and doesn't require authentication
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${DEFAULT_LAT}&longitude=${DEFAULT_LON}&current=temperature_2m`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      
      const data: WeatherApiResponse = await response.json();
      setTemperature(data.current.temperature_2m);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      // Use a default temperature of 20°C if the API call fails
      setTemperature(20);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather data when the component mounts
  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
          <Terrain temperature={temperature} />
  );
};

export default TerrainVisualization;