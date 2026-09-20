import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherDisplay } from './components/CurrentWeatherDisplay';
import { SevenDayForecast } from './components/SevenDayForecast';
import { WeatherIntelligencePanel } from './components/WeatherIntelligencePanel';
import { ErrorAlert } from './components/ErrorAlert';
import { WeatherSkeleton } from './components/WeatherSkeleton';
import { ActiveCity, ForecastApiResponse, TempUnit } from './types';
import { getForecast, WeatherApiError } from './services/openMeteo';
import { computeWeatherIntelligence } from './utils/weatherIntelligence';
import { Cloud, ShieldAlert } from 'lucide-react';

const DEFAULT_CITY: ActiveCity = {
  name: 'Tokyo',
  country: 'Japan',
  admin1: 'Tokyo',
  latitude: 35.6895,
  longitude: 139.6917,
  timezone: 'Asia/Tokyo',
};

export default function App() {
  const [activeCity, setActiveCity] = useState<ActiveCity>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<ForecastApiResponse | null>(null);
  const [unit, setUnit] = useState<TempUnit>('C');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Fetch forecast for city
  const loadForecast = useCallback(async (city: ActiveCity) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getForecast(city.latitude, city.longitude);
      setWeatherData(data);
      setSelectedDayIndex(0);

      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    } catch (err: unknown) {
      if (err instanceof WeatherApiError) {
        setErrorMessage(err.message);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to retrieve forecast data from Open-Meteo services.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadForecast(activeCity);
  }, [activeCity, loadForecast]);

  // Handle city selection
  const handleSelectCity = (newCity: ActiveCity) => {
    setActiveCity(newCity);
  };

  // Device geolocation handler
  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setErrorMessage('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Attempt reverse geocoding via Open-Meteo or BigDataCloud
          const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${latitude.toFixed(2)}&count=1&language=en&format=json`;
          let cityName = 'Current Location';
          let countryName = '';

          try {
            const resp = await fetch(geoUrl);
            if (resp.ok) {
              const resJson = await resp.json();
              if (resJson.results && resJson.results.length > 0) {
                cityName = resJson.results[0].name;
                countryName = resJson.results[0].country || '';
              }
            }
          } catch {
            cityName = `Lat ${latitude.toFixed(2)}°, Lon ${longitude.toFixed(2)}°`;
          }

          const detectedCity: ActiveCity = {
            name: cityName,
            country: countryName,
            latitude,
            longitude,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          };

          setActiveCity(detectedCity);
        } catch {
          setErrorMessage('Unable to determine location name from coordinates.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to access device location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please search your city manually or allow access in browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }
        setErrorMessage(msg);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Compute Weather Intelligence Insights
  const intelligence = useMemo(() => {
    if (!weatherData) return null;
    return computeWeatherIntelligence(weatherData.current, weatherData.daily, activeCity.name);
  }, [weatherData, activeCity.name]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-white relative">
      {/* Ambient background decorative light spots */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Global Navigation Header */}
      <Header
        unit={unit}
        onToggleUnit={setUnit}
        onUseCurrentLocation={handleUseCurrentLocation}
        onRefresh={() => loadForecast(activeCity)}
        isLocating={isLocating}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
        {/* Search Bar Section */}
        <section id="search-section-wrapper" aria-label="City Search">
          <SearchBar onSelectCity={handleSelectCity} isLoading={isLoading} />
        </section>

        {/* Non-intrusive Error / Network Alert */}
        {errorMessage && (
          <section id="error-section" aria-label="Alert Notice">
            <ErrorAlert
              message={errorMessage}
              onRetry={() => loadForecast(activeCity)}
              onDismiss={() => setErrorMessage(null)}
            />
          </section>
        )}

        {/* Main Weather Content */}
        {isLoading && !weatherData ? (
          <WeatherSkeleton />
        ) : weatherData && intelligence ? (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* Current Weather Display */}
            <section id="section-current-weather" aria-label="Current Weather Conditions">
              <CurrentWeatherDisplay
                current={weatherData.current}
                daily={weatherData.daily}
                city={activeCity}
                unit={unit}
              />
            </section>

            {/* 7-Day Forecast */}
            <section id="section-7day-forecast" aria-label="7-Day Synoptic Forecast">
              <SevenDayForecast
                daily={weatherData.daily}
                unit={unit}
                selectedDayIndex={selectedDayIndex}
                onSelectDay={setSelectedDayIndex}
              />
            </section>

            {/* Weather Intelligence Insights */}
            <section id="section-weather-intelligence" aria-label="Weather Intelligence Insights">
              <WeatherIntelligencePanel intelligence={intelligence} cityName={activeCity.name} />
            </section>
          </div>
        ) : !isLoading && !weatherData && !errorMessage ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl">
            <Cloud className="w-12 h-12 text-slate-500 mb-3 animate-bounce" />
            <h3 className="text-lg font-bold text-white mb-1">No Weather Data Loaded</h3>
            <p className="text-sm text-slate-400 max-w-md mb-4">
              Select a city or search for a location to view real-time meteorological conditions and smart intelligence insights.
            </p>
            <button
              type="button"
              id="btn-retry-default-city"
              onClick={() => loadForecast(DEFAULT_CITY)}
              className="px-4 py-2 rounded-xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20"
            >
              Load Tokyo Conditions
            </button>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.06] bg-slate-950/70 backdrop-blur-xl py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Meteorological data served by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Open-Meteo APIs</a></span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Non-commercial Open Database</span>
            <span>•</span>
            <span>Real-time Atmospheric Intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
