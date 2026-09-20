import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Compass,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock
} from 'lucide-react';
import { CurrentWeatherData, DailyForecastData, ActiveCity, TempUnit } from '../types';
import { getWeatherCondition } from '../utils/weatherCodes';
import { formatTemp, formatWindSpeed, formatCurrentTime, formatCurrentDate } from '../utils/formatters';

interface CurrentWeatherDisplayProps {
  current: CurrentWeatherData;
  daily: DailyForecastData;
  city: ActiveCity;
  unit: TempUnit;
}

export const CurrentWeatherDisplay: React.FC<CurrentWeatherDisplayProps> = ({
  current,
  daily,
  city,
  unit,
}) => {
  const condition = getWeatherCondition(current.weather_code);
  const IconComponent = condition.icon;

  const todayMax = daily.temperature_2m_max?.[0] ?? current.temperature_2m;
  const todayMin = daily.temperature_2m_min?.[0] ?? current.temperature_2m;
  const todayPrecip = daily.precipitation_probability_max?.[0] ?? 0;

  return (
    <div
      id="current-weather-card"
      className="relative w-full rounded-3xl bg-slate-900/50 backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl shadow-black/50 overflow-hidden"
    >
      {/* Ambient background glow matching current weather condition */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br ${condition.accentColor} blur-3xl pointer-events-none opacity-50`}
      />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      {/* Top row: City, Location, Date & Condition Badge */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="current-city-name" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {city.name}
            </h2>
            {city.country && (
              <span className="text-sm sm:text-base font-medium text-slate-400">
                {city.country}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs sm:text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {formatCurrentDate(city.timezone)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {formatCurrentTime(city.timezone)} local
            </span>
            <span className="font-mono text-slate-500 text-xs">
              {city.latitude.toFixed(2)}°N, {city.longitude.toFixed(2)}°E
            </span>
          </div>
        </div>

        {/* Condition Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div
            id="weather-condition-pill"
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold backdrop-blur-md ${condition.badgeBg} ${condition.badgeBorder}`}
          >
            <IconComponent className="w-4 h-4" />
            <span>{condition.label}</span>
          </div>
        </div>
      </div>

      {/* Center hero: Large Temperature & Condition Icon */}
      <div className="relative z-10 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-baseline gap-4">
          <div
            id="current-temp-hero"
            className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-sm font-mono"
          >
            {formatTemp(current.temperature_2m, unit)}
          </div>

          <div className="flex flex-col gap-1 text-xs sm:text-sm">
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>High: {formatTemp(todayMax, unit)}</span>
            </div>
            <div className="flex items-center gap-1 text-sky-400 font-semibold">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Low: {formatTemp(todayMin, unit)}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Weather Icon with glass glow container */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/[0.04] border border-white/10 shadow-inner p-4 text-sky-400">
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${condition.accentColor} opacity-40 blur-sm`} />
            <IconComponent className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg relative z-10 animate-pulse text-sky-300" />
          </div>
          <div className="sm:hidden">
            <p className="text-sm font-medium text-slate-200">{condition.description}</p>
          </div>
        </div>
      </div>

      <p className="hidden sm:block relative z-10 text-sm text-slate-300 mb-6 italic">
        "{condition.description}"
      </p>

      {/* Bottom Grid: Current Weather Metrics Required */}
      <div
        id="current-metrics-grid"
        className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-white/[0.06]"
      >
        {/* Metric 1: Feels Like */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1.5">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span>Feels Like</span>
          </div>
          <div id="metric-feels-like" className="text-xl sm:text-2xl font-bold text-white font-mono">
            {formatTemp(current.apparent_temperature, unit)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {current.apparent_temperature < current.temperature_2m ? 'Wind chill factor' : 'Thermal heat index'}
          </div>
        </div>

        {/* Metric 2: Humidity % */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1.5">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Humidity</span>
          </div>
          <div id="metric-humidity" className="text-xl sm:text-2xl font-bold text-white font-mono">
            {current.relative_humidity_2m}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {current.relative_humidity_2m < 40 ? 'Dry atmosphere' : current.relative_humidity_2m < 70 ? 'Comfortable level' : 'Humid air mass'}
          </div>
        </div>

        {/* Metric 3: Wind Speed (km/h) */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1.5">
            <Wind className="w-4 h-4 text-sky-400" />
            <span>Wind Speed</span>
          </div>
          <div id="metric-wind-speed" className="text-xl sm:text-2xl font-bold text-white font-mono">
            {formatWindSpeed(current.wind_speed_10m, unit)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Compass className="w-3 h-3 text-slate-500" />
            <span>10m sensor altitude</span>
          </div>
        </div>

        {/* Metric 4: Precipitation Probability */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1.5">
            <CloudRain className="w-4 h-4 text-indigo-400" />
            <span>Rain Chance</span>
          </div>
          <div id="metric-precip-chance" className="text-xl sm:text-2xl font-bold text-white font-mono">
            {todayPrecip}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {todayPrecip > 50 ? 'Rainfall probable' : todayPrecip > 20 ? 'Isolated showers' : 'Low precip risk'}
          </div>
        </div>
      </div>
    </div>
  );
};
