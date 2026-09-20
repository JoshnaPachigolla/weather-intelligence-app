import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GeoLocationItem } from '../types';
import { searchCities } from '../services/openMeteo';
import { validateCityInput } from '../utils/formatters';

interface SearchBarProps {
  onSelectCity: (city: {
    name: string;
    country: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  }) => void;
  isLoading: boolean;
}

const POPULAR_CITIES = [
  { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' },
  { name: 'London', country: 'United Kingdom', latitude: 51.5085, longitude: -0.1257, timezone: 'Europe/London' },
  { name: 'New York', country: 'United States', latitude: 40.7143, longitude: -74.006, timezone: 'America/New_York' },
  { name: 'Paris', country: 'France', latitude: 48.8534, longitude: 2.3488, timezone: 'Europe/Paris' },
  { name: 'Sydney', country: 'Australia', latitude: -33.8678, longitude: 151.2073, timezone: 'Australia/Sydney' },
  { name: 'Singapore', country: 'Singapore', latitude: 1.2897, longitude: 103.8501, timezone: 'Asia/Singapore' },
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity, isLoading: isGlobalLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Instant validation
  const validation = validateCityInput(query);
  const showValidationWarning = touched && query.length > 0 && !validation.isValid;
  const showValidationSuccess = touched && validation.isValid && !searchError;

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced auto-search for suggestions
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const trimmed = query.trim();
    if (!validation.isValid) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsSearching(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed, 5, controller.signal);
        setSuggestions(results);
        setIsDropdownOpen(true);
        setSelectedIndex(-1);
        if (results.length === 0) {
          setSearchError(`No locations found matching "${trimmed}"`);
        } else {
          setSearchError(null);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setSuggestions([]);
        setSearchError('Search failed. Please verify your connection.');
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSelectLocation = (loc: GeoLocationItem) => {
    setQuery(`${loc.name}${loc.country ? `, ${loc.country}` : ''}`);
    setIsDropdownOpen(false);
    setSuggestions([]);
    setSearchError(null);
    setTouched(false);

    onSelectCity({
      name: loc.name,
      country: loc.country || '',
      admin1: loc.admin1,
      latitude: loc.latitude,
      longitude: loc.longitude,
      timezone: loc.timezone,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || suggestions.length === 0) {
      if (e.key === 'Enter' && validation.isValid) {
        // Trigger search on enter if single result or direct
        if (suggestions.length > 0) {
          handleSelectLocation(suggestions[0]);
        }
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectLocation(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSelectLocation(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsDropdownOpen(false);
    setSearchError(null);
    setTouched(false);
    inputRef.current?.focus();
  };

  return (
    <div id="search-section" className="w-full flex flex-col items-center">
      <div ref={containerRef} className="relative w-full max-w-2xl">
        {/* Search Input Bar */}
        <div
          className={`relative flex items-center w-full rounded-2xl bg-slate-900/70 backdrop-blur-xl border transition-all shadow-xl shadow-black/25 ${
            showValidationWarning
              ? 'border-amber-500/60 ring-1 ring-amber-500/30'
              : isDropdownOpen
              ? 'border-sky-400/60 ring-2 ring-sky-500/20'
              : 'border-white/10 hover:border-white/20'
          }`}
        >
          <div className="pl-4 pr-2 text-slate-400">
            {isSearching || isGlobalLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <input
            id="city-search-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setTouched(true);
            }}
            onFocus={() => {
              if (suggestions.length > 0 || searchError) {
                setIsDropdownOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search city, region, or coordinate (e.g. Tokyo, Berlin, Seattle)..."
            aria-label="Search city or location"
            autoComplete="off"
            className="w-full py-3.5 pr-10 text-sm md:text-base bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
          />

          {/* Instant validation status indicator */}
          <div className="flex items-center gap-1.5 pr-3">
            {showValidationSuccess && (
              <span title="Valid search query" className="text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
            {showValidationWarning && (
              <span title={validation.message || 'Invalid input'} className="text-amber-400">
                <AlertCircle className="w-4 h-4" />
              </span>
            )}

            {query && (
              <button
                id="btn-clear-search"
                type="button"
                onClick={handleClear}
                aria-label="Clear search input"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Instant validation helper note below input */}
        {touched && query.length > 0 && !validation.isValid && (
          <div id="validation-error-msg" className="flex items-center gap-1.5 mt-1.5 px-3 text-xs text-amber-400">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{validation.message}</span>
          </div>
        )}

        {/* Autocomplete Dropdown */}
        {isDropdownOpen && (
          <div
            id="search-suggestions-dropdown"
            className="absolute left-0 right-0 top-full mt-2 z-40 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/60 overflow-hidden divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            {suggestions.length > 0 ? (
              <ul className="max-h-64 overflow-y-auto custom-scrollbar py-1">
                {suggestions.map((loc, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <li key={`${loc.id}-${idx}`}>
                      <button
                        type="button"
                        id={`suggestion-item-${idx}`}
                        onClick={() => handleSelectLocation(loc)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-sky-500/20 text-white' : 'text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-1.5 rounded-lg ${
                              isSelected ? 'bg-sky-500/30 text-sky-300' : 'bg-white/5 text-slate-400'
                            }`}
                          >
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-white">
                              {loc.name}
                              {loc.admin1 ? <span className="text-slate-400 font-normal">, {loc.admin1}</span> : null}
                            </div>
                            <div className="text-xs text-slate-400">
                              {loc.country || 'Unknown country'}
                              {loc.latitude && loc.longitude && (
                                <span className="ml-2 font-mono text-[11px] text-slate-500">
                                  {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {loc.country_code && (
                          <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-white/10 text-slate-300 border border-white/10">
                            {loc.country_code}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : searchError ? (
              <div className="p-4 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>{searchError}</span>
              </div>
            ) : isSearching ? (
              <div className="p-4 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                <span>Querying Open-Meteo geocoding database...</span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Quick Select Popular Cities */}
      <div id="popular-cities-bar" className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
        <span className="text-slate-400 font-medium mr-1">Trending:</span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city.name}
            type="button"
            id={`chip-city-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => {
              setQuery(city.name);
              setTouched(false);
              onSelectCity(city);
            }}
            className="px-3 py-1 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-white/10 hover:border-sky-400/40 text-slate-300 hover:text-white transition-all shadow-sm flex items-center gap-1"
          >
            <span>{city.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
