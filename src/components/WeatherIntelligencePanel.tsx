import React from 'react';
import {
  Sparkles,
  Shirt,
  Layers,
  ShieldCheck,
  Footprints,
  Activity,
  Bike,
  Utensils,
  Car,
  AlertTriangle,
  Info,
  Thermometer,
  Droplets,
  Wind,
  CloudRain
} from 'lucide-react';
import { WeatherIntelligence } from '../types';

interface WeatherIntelligencePanelProps {
  intelligence: WeatherIntelligence;
  cityName: string;
}

export const WeatherIntelligencePanel: React.FC<WeatherIntelligencePanelProps> = ({
  intelligence,
  cityName,
}) => {
  const { headline, summary, thermalSensation, clothing, activities, highlightNotes, alertNotice } =
    intelligence;

  return (
    <div
      id="weather-intelligence-panel"
      className="w-full rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl shadow-black/40 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-400/30 text-sky-400 shadow-md shadow-sky-500/10">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Weather Intelligence Insights
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/30">
                AI Synthesis
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Heuristic lifestyle & activity advisory based on atmospheric observations for {cityName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-slate-300">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span>Feel: {thermalSensation}</span>
          </span>
        </div>
      </div>

      {/* Weather Advisory banner if active */}
      {alertNotice && (
        <div
          id="weather-intelligence-alert"
          className="relative z-10 mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-sm shadow-lg shadow-amber-500/5"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300 block mb-0.5">Atmospheric Advisory</span>
            <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">{alertNotice}</p>
          </div>
        </div>
      )}

      {/* AI Daily Briefing Box */}
      <div className="relative z-10 mt-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <div className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart Executive Briefing</span>
        </div>
        <h4 className="text-base sm:text-lg font-bold text-white mb-2">{headline}</h4>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{summary}</p>
      </div>

      {/* Telemetry Highlights Pills */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {highlightNotes.map((note) => {
          const Icon =
            note.icon === 'Thermometer'
              ? Thermometer
              : note.icon === 'Droplets'
              ? Droplets
              : note.icon === 'Wind'
              ? Wind
              : CloudRain;
          return (
            <div
              key={note.label}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <Icon className="w-3.5 h-3.5 text-sky-400" />
                <span>{note.label}</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-100 line-clamp-1">
                {note.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Core Insights Grid: 2 Columns (Clothing & Gear / Outdoor Activities) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/[0.06]">
        {/* Module 1: Clothing & Gear Advice */}
        <div
          id="clothing-recommendation-card"
          className="flex flex-col justify-between rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 sm:p-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Shirt className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  What to Wear & Gear Guide
                </h4>
                <p className="text-xs text-slate-400">Layering & protection for current apparent climate</p>
              </div>
            </div>

            {/* Primary Outfit */}
            <div className="mb-4 p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <div className="text-[11px] font-semibold text-sky-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Primary Recommendation</span>
              </div>
              <p className="text-sm font-medium text-white leading-relaxed">{clothing.primary}</p>
            </div>

            {/* Layers & Fabrics */}
            <div className="mb-4">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Recommended Layers</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {clothing.layers.map((layer, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] border border-white/10 text-slate-200"
                  >
                    {layer}
                  </span>
                ))}
              </div>
            </div>

            {/* Essential Accessories & Footwear */}
            <div>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Essential Gear & Accessories</span>
              </span>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {clothing.accessories.map((acc, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 flex items-center gap-1"
                  >
                    <span>{acc}</span>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300">
                <Footprints className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>
                  <strong className="text-slate-200">Footwear:</strong> {clothing.shoes}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Outdoor Activity Suitability */}
        <div
          id="activity-suitability-card"
          className="flex flex-col justify-between rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 sm:p-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Outdoor Activity Suitability
                </h4>
                <p className="text-xs text-slate-400">Algorithmic feasibility ratings for daily pursuits</p>
              </div>
            </div>

            {/* List of 4 activities */}
            <div className="space-y-3.5">
              {activities.map((act) => {
                const ActIcon =
                  act.id === 'running'
                    ? Footprints
                    : act.id === 'cycling'
                    ? Bike
                    : act.id === 'outdoorDining'
                    ? Utensils
                    : Car;

                return (
                  <div
                    key={act.id}
                    id={`activity-item-${act.id}`}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-white/5 text-slate-300">
                          <ActIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          {act.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-400">{act.score}/100</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${act.badgeColor}`}
                        >
                          {act.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          act.score >= 80
                            ? 'bg-emerald-500'
                            : act.score >= 60
                            ? 'bg-sky-500'
                            : act.score >= 40
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${act.score}%` }}
                      />
                    </div>

                    <p className="text-xs text-slate-300/90 leading-relaxed">{act.advice}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
