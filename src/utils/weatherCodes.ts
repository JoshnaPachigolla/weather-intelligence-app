import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudHail,
  Wind
} from 'lucide-react';

export interface WeatherConditionInfo {
  code: number;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  accentColor: string; // for subtle gradient highlights
  badgeBg: string;
  badgeBorder: string;
  isPrecipitating: boolean;
}

export function getWeatherCondition(code: number): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: 'Clear Sky',
        description: 'Sunny and completely cloudless skies',
        icon: Sun,
        accentColor: 'from-amber-400/20 to-orange-500/10',
        badgeBg: 'bg-amber-500/15',
        badgeBorder: 'border-amber-500/30 text-amber-300',
        isPrecipitating: false,
      };
    case 1:
      return {
        code,
        label: 'Mainly Clear',
        description: 'Predominantly sunny with fleeting clear skies',
        icon: Sun,
        accentColor: 'from-amber-400/15 to-sky-400/10',
        badgeBg: 'bg-amber-400/15',
        badgeBorder: 'border-amber-400/30 text-amber-200',
        isPrecipitating: false,
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'Scattered clouds with periods of sunshine',
        icon: CloudSun,
        accentColor: 'from-sky-400/20 to-blue-500/10',
        badgeBg: 'bg-sky-500/15',
        badgeBorder: 'border-sky-400/30 text-sky-300',
        isPrecipitating: false,
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Continuous dense cloud cover',
        icon: Cloud,
        accentColor: 'from-slate-400/20 to-zinc-500/10',
        badgeBg: 'bg-slate-500/20',
        badgeBorder: 'border-slate-400/30 text-slate-300',
        isPrecipitating: false,
      };
    case 45:
    case 48:
      return {
        code,
        label: code === 48 ? 'Depositing Rime Fog' : 'Foggy Atmosphere',
        description: 'Reduced visibility due to thick atmospheric fog',
        icon: CloudFog,
        accentColor: 'from-teal-400/15 to-slate-500/10',
        badgeBg: 'bg-teal-500/15',
        badgeBorder: 'border-teal-400/30 text-teal-300',
        isPrecipitating: false,
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: code === 55 ? 'Dense Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Light Drizzle',
        description: 'Fine, gentle droplets of drizzle',
        icon: CloudDrizzle,
        accentColor: 'from-cyan-400/20 to-blue-600/10',
        badgeBg: 'bg-cyan-500/15',
        badgeBorder: 'border-cyan-400/30 text-cyan-300',
        isPrecipitating: true,
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        description: 'Sub-zero freezing drizzle with slick surfaces',
        icon: CloudHail,
        accentColor: 'from-teal-300/20 to-indigo-600/10',
        badgeBg: 'bg-teal-400/15',
        badgeBorder: 'border-teal-300/30 text-teal-200',
        isPrecipitating: true,
      };
    case 61:
      return {
        code,
        label: 'Slight Rain',
        description: 'Light continuous rain showers',
        icon: CloudRain,
        accentColor: 'from-blue-400/20 to-indigo-600/10',
        badgeBg: 'bg-blue-500/15',
        badgeBorder: 'border-blue-400/30 text-blue-300',
        isPrecipitating: true,
      };
    case 63:
      return {
        code,
        label: 'Moderate Rain',
        description: 'Steady, notable rainfall',
        icon: CloudRain,
        accentColor: 'from-blue-500/25 to-indigo-700/15',
        badgeBg: 'bg-blue-500/20',
        badgeBorder: 'border-blue-400/40 text-blue-200',
        isPrecipitating: true,
      };
    case 65:
      return {
        code,
        label: 'Heavy Rain',
        description: 'Intense, heavy downpour',
        icon: CloudRain,
        accentColor: 'from-blue-600/30 to-indigo-800/20',
        badgeBg: 'bg-blue-600/25',
        badgeBorder: 'border-blue-400/50 text-blue-200',
        isPrecipitating: true,
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        description: 'Hazardous freezing rain creating icy conditions',
        icon: CloudHail,
        accentColor: 'from-indigo-400/25 to-cyan-700/15',
        badgeBg: 'bg-indigo-500/20',
        badgeBorder: 'border-indigo-400/40 text-indigo-200',
        isPrecipitating: true,
      };
    case 71:
    case 73:
    case 75:
      return {
        code,
        label: code === 75 ? 'Heavy Snowfall' : code === 73 ? 'Moderate Snow' : 'Slight Snowfall',
        description: 'Crisp snow precipitation and winter accumulation',
        icon: CloudSnow,
        accentColor: 'from-cyan-200/20 to-blue-400/15',
        badgeBg: 'bg-cyan-400/15',
        badgeBorder: 'border-cyan-300/30 text-cyan-200',
        isPrecipitating: true,
      };
    case 77:
      return {
        code,
        label: 'Snow Grains',
        description: 'Fine ice pellets and frozen grains',
        icon: CloudSnow,
        accentColor: 'from-sky-300/20 to-slate-400/15',
        badgeBg: 'bg-sky-400/15',
        badgeBorder: 'border-sky-300/30 text-sky-200',
        isPrecipitating: true,
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: code === 82 ? 'Violent Rain Showers' : code === 81 ? 'Moderate Showers' : 'Passing Showers',
        description: 'Sporadic, gusty rain showers',
        icon: CloudRain,
        accentColor: 'from-sky-500/25 to-blue-700/15',
        badgeBg: 'bg-sky-500/20',
        badgeBorder: 'border-sky-400/40 text-sky-200',
        isPrecipitating: true,
      };
    case 85:
    case 86:
      return {
        code,
        label: code === 86 ? 'Heavy Snow Showers' : 'Snow Showers',
        description: 'Brisk passing snow squalls',
        icon: CloudSnow,
        accentColor: 'from-teal-300/20 to-blue-500/15',
        badgeBg: 'bg-teal-400/15',
        badgeBorder: 'border-teal-300/30 text-teal-200',
        isPrecipitating: true,
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Lightning, thunder, and gusty winds',
        icon: CloudLightning,
        accentColor: 'from-purple-500/30 to-amber-500/15',
        badgeBg: 'bg-purple-500/25',
        badgeBorder: 'border-purple-400/40 text-purple-200',
        isPrecipitating: true,
      };
    case 96:
    case 99:
      return {
        code,
        label: code === 99 ? 'Severe Hail Thunderstorm' : 'Thunderstorm with Hail',
        description: 'Severe electrical storm with dangerous hail',
        icon: CloudHail,
        accentColor: 'from-rose-500/30 to-purple-600/20',
        badgeBg: 'bg-rose-500/25',
        badgeBorder: 'border-rose-400/50 text-rose-200',
        isPrecipitating: true,
      };
    default:
      return {
        code,
        label: 'Variable Clouds',
        description: 'Mixed atmospheric cloud patterns',
        icon: Wind,
        accentColor: 'from-slate-400/20 to-zinc-600/10',
        badgeBg: 'bg-slate-500/20',
        badgeBorder: 'border-slate-400/30 text-slate-300',
        isPrecipitating: false,
      };
  }
}
