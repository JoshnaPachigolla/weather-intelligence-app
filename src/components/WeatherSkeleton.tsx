import React from 'react';

export const WeatherSkeleton: React.FC = () => {
  return (
    <div id="weather-skeleton-loading" className="w-full space-y-6 animate-pulse">
      {/* Hero Card Skeleton */}
      <div className="w-full h-80 rounded-3xl bg-slate-900/40 border border-white/[0.06] p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-2.5">
            <div className="h-8 w-48 rounded-xl bg-white/10" />
            <div className="h-4 w-32 rounded-lg bg-white/5" />
          </div>
          <div className="h-8 w-28 rounded-full bg-white/10" />
        </div>

        <div className="flex justify-between items-center my-4">
          <div className="h-20 w-44 rounded-2xl bg-white/10" />
          <div className="w-24 h-24 rounded-3xl bg-white/10" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
          <div className="h-16 rounded-xl bg-white/5" />
          <div className="h-16 rounded-xl bg-white/5" />
          <div className="h-16 rounded-xl bg-white/5" />
          <div className="h-16 rounded-xl bg-white/5" />
        </div>
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="w-full h-56 rounded-3xl bg-slate-900/40 border border-white/[0.06] p-6">
        <div className="h-5 w-48 rounded-lg bg-white/10 mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-36 h-36 rounded-2xl bg-white/5 flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Intelligence Panel Skeleton */}
      <div className="w-full h-96 rounded-3xl bg-slate-900/40 border border-white/[0.06] p-8">
        <div className="h-6 w-56 rounded-lg bg-white/10 mb-4" />
        <div className="h-20 rounded-2xl bg-white/5 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-48 rounded-2xl bg-white/5" />
          <div className="h-48 rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
  );
};
