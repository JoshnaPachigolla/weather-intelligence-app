import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Droplets, CalendarDays } from 'lucide-react';
import { DailyForecastData, TempUnit } from '../types';
import { getWeatherCondition } from '../utils/weatherCodes';
import { formatTemp, formatDayLabel, formatDateShort } from '../utils/formatters';

interface SevenDayForecastProps {
  daily: DailyForecastData;
  unit: TempUnit;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({
  daily,
  unit,
  selectedDayIndex,
  onSelectDay,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Safe checks for 7 days
  const dayCount = Math.min(daily.time.length, 7);
  const days = Array.from({ length: dayCount }, (_, idx) => ({
    date: daily.time[idx],
    code: daily.weather_code[idx],
    tempMax: daily.temperature_2m_max[idx],
    tempMin: daily.temperature_2m_min[idx],
    precipProb: daily.precipitation_probability_max[idx] ?? 0,
    index: idx,
  }));

  // Overall min and max across all 7 days for relative temperature bar visualization
  const allMins = days.map((d) => d.tempMin);
  const allMaxs = days.map((d) => d.tempMax);
  const globalMin = Math.min(...allMins, 0);
  const globalMax = Math.max(...allMaxs, 35);
  const tempRange = Math.max(globalMax - globalMin, 1);

  return (
    <div
      id="seven-day-forecast-section"
      className="w-full rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-7 shadow-2xl shadow-black/40"
    >
      {/* Header with section title and scroll controls */}
      <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              7-Day Synoptic Forecast
            </h3>
            <p className="text-xs text-slate-400">Horizontal telemetry outlook & precipitation probability</p>
          </div>
        </div>

        {/* Scroll arrow buttons for desktop */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="forecast-scroll-left"
            onClick={() => scroll('left')}
            aria-label="Scroll forecast left"
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            id="forecast-scroll-right"
            onClick={() => scroll('right')}
            aria-label="Scroll forecast right"
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Cards Container */}
      <div
        ref={scrollContainerRef}
        id="forecast-cards-scroll-container"
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto custom-scrollbar pb-3 pt-1 px-1 snap-x snap-mandatory"
        tabIndex={0}
        aria-label="7-Day weather forecast cards"
      >
        {days.map((day) => {
          const condition = getWeatherCondition(day.code);
          const IconComp = condition.icon;
          const isSelected = day.index === selectedDayIndex;

          // Calculate bar positions for min/max temperature gradient bar
          const leftPercent = Math.max(0, Math.min(100, ((day.tempMin - globalMin) / tempRange) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((day.tempMax - globalMin) / tempRange) * 100));
          const barWidth = Math.max(12, rightPercent - leftPercent);

          return (
            <div
              key={day.date}
              id={`forecast-card-day-${day.index}`}
              onClick={() => onSelectDay(day.index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectDay(day.index);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              className={`flex-shrink-0 w-36 sm:w-44 snap-start cursor-pointer rounded-2xl p-4 transition-all duration-200 border flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-sky-500/15 border-sky-400/50 shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/40'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.06] hover:border-white/15'
              }`}
            >
              {/* Day title & Date */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-bold tracking-tight ${
                      isSelected ? 'text-sky-300' : 'text-white'
                    }`}
                  >
                    {formatDayLabel(day.date, day.index)}
                  </span>
                  {day.index === 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Now
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {formatDateShort(day.date)}
                </div>
              </div>

              {/* Icon & condition name */}
              <div className="my-3 flex flex-col items-center text-center">
                <div
                  className={`p-2.5 rounded-2xl mb-1.5 transition-transform ${
                    isSelected ? 'scale-110' : ''
                  } ${condition.badgeBg} text-sky-300`}
                >
                  <IconComp className="w-8 h-8" />
                </div>
                <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                  {condition.label}
                </div>
              </div>

              {/* Precipitation chance */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-cyan-400" />
                    Precip
                  </span>
                  <span
                    className={`font-semibold font-mono ${
                      day.precipProb > 40 ? 'text-cyan-300' : 'text-slate-400'
                    }`}
                  >
                    {day.precipProb}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      day.precipProb > 50
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        : 'bg-cyan-500/50'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(4, day.precipProb))}%` }}
                  />
                </div>
              </div>

              {/* Temperatures (Max / Min) with mini range bar */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="font-bold text-white text-sm">
                    {formatTemp(day.tempMax, unit)}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {formatTemp(day.tempMin, unit)}
                  </span>
                </div>

                {/* Visual temperature bar */}
                <div className="w-full h-1.5 rounded-full bg-white/[0.06] relative">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-orange-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidth}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
