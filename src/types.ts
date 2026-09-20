export interface GeoLocationItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  country_id?: number;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingApiResponse {
  results?: GeoLocationItem[];
  generationtime_ms?: number;
}

export interface CurrentWeatherUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  weather_code: string;
  wind_speed_10m: string;
}

export interface CurrentWeatherData {
  time: string;
  interval?: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface DailyForecastUnits {
  time: string;
  weather_code: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_probability_max: string;
}

export interface DailyForecastData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
}

export interface ForecastApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: CurrentWeatherUnits;
  current: CurrentWeatherData;
  daily_units?: DailyForecastUnits;
  daily: DailyForecastData;
}

export interface ActiveCity {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export type TempUnit = 'C' | 'F';

export interface ActivityScore {
  id: 'running' | 'cycling' | 'outdoorDining' | 'commute' | 'photography';
  title: string;
  score: number; // 0-100
  status: 'Ideal' | 'Good' | 'Moderate' | 'Poor';
  badgeColor: string;
  advice: string;
}

export interface ClothingGuide {
  primary: string;
  layers: string[];
  accessories: string[];
  shoes: string;
}

export interface WeatherIntelligence {
  headline: string;
  summary: string;
  thermalSensation: string;
  clothing: ClothingGuide;
  activities: ActivityScore[];
  highlightNotes: { label: string; value: string; icon: string }[];
  alertNotice?: string;
}
