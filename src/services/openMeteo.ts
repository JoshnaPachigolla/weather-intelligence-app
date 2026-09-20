import { GeocodingApiResponse, GeoLocationItem, ForecastApiResponse } from '../types';

export class WeatherApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

/**
 * Searches for locations matching the query using Open-Meteo Geocoding API
 */
export async function searchCities(query: string, count: number = 5, signal?: AbortSignal): Promise<GeoLocationItem[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const encodedQuery = encodeURIComponent(trimmed);
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedQuery}&count=${count}&language=en&format=json`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new WeatherApiError(`Geocoding server responded with status ${response.status}`, response.status);
    }
    const data: GeocodingApiResponse = await response.json();
    return data.results || [];
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    if (err instanceof WeatherApiError) {
      throw err;
    }
    throw new WeatherApiError(
      'Unable to connect to location service. Please verify your internet connection.',
      0
    );
  }
}

/**
 * Fetches forecast data from Open-Meteo Forecast API
 */
export async function getForecast(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<ForecastApiResponse> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new WeatherApiError(`Forecast service returned HTTP ${response.status}`, response.status);
    }
    const data: ForecastApiResponse = await response.json();
    if (!data.current || !data.daily) {
      throw new WeatherApiError('Incomplete weather forecast data received from Open-Meteo.');
    }
    return data;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    if (err instanceof WeatherApiError) {
      throw err;
    }
    throw new WeatherApiError(
      'Network error fetching weather telemetry. Please check your network connection and try again.'
    );
  }
}
