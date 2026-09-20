import React from 'react';
import { CloudLightning, LocateFixed, RefreshCw, Sparkles } from 'lucide-react';
import { TempUnit } from '../types';

interface HeaderProps {
  unit: TempUnit;
  onToggleUnit: (newUnit: TempUnit) => void;
  onUseCurrentLocation: () => void;
  onRefresh: () => void;
  isLocating: boolean;
  isLoading: boolean;
  lastUpdated: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onUseCurrentLocation,
  onRefresh,
  isLocating,
  isLoading,
  lastUpdated,
}) => {
  return (
    <header id="app-header" className="w-full border-b border-white/[0.08] bg-slate-950/60 backdrop-blur-xl sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-400/30 text-sky-400 shadow-lg shadow-sky-500/10">
            <CloudLightning className="w-5 h-5 text-sky-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">Weather Intelligence</h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-500/15 text-sky-300 border border-sky-500/30">
                <Sparkles className="w-3 h-3 text-sky-400" />
                Open-Meteo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {lastUpdated ? `Telemetry synced at ${lastUpdated}` : 'Real-time meteorological intelligence'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2.5">
          {/* Temperature unit switch */}
          <div
            id="unit-toggle-group"
            className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-semibold"
          >
            <button
              id="unit-btn-celsius"
              type="button"
              onClick={() => onToggleUnit('C')}
              aria-label="Display in Celsius"
              className={`px-2.5 py-1 rounded-lg transition-all ${
                unit === 'C'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              id="unit-btn-fahrenheit"
              type="button"
              onClick={() => onToggleUnit('F')}
              aria-label="Display in Fahrenheit"
              className={`px-2.5 py-1 rounded-lg transition-all ${
                unit === 'F'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>

          {/* Current location button */}
          <button
            id="btn-use-location"
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            title="Use device geolocation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-white text-xs font-medium transition-all shadow-sm disabled:opacity-50"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-sky-400' : 'text-sky-400'}`} />
            <span className="hidden md:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
          </button>

          {/* Refresh button */}
          <button
            id="btn-refresh-weather"
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh current forecast"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
