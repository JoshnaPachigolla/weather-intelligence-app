import { TempUnit } from '../types';

export function formatTemp(celsius: number, unit: TempUnit): string {
  if (unit === 'F') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTempNumber(celsius: number, unit: TempUnit): number {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWindSpeed(kmh: number, unit: TempUnit): string {
  if (unit === 'F') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatDayLabel(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';

  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatCurrentTime(timezone?: string): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone && timezone !== 'auto' ? timezone : undefined,
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date());
  } catch {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
}

export function formatCurrentDate(timezone?: string): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: timezone && timezone !== 'auto' ? timezone : undefined,
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date());
  } catch {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  }
}

/**
 * Instant search input validation
 */
export function validateCityInput(query: string): { isValid: boolean; message: string | null } {
  const trimmed = query.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Please enter a city or location name' };
  }
  if (trimmed.length < 2) {
    return { isValid: false, message: 'City name must be at least 2 characters' };
  }
  if (trimmed.length > 60) {
    return { isValid: false, message: 'Location name is too long' };
  }
  // Allow letters, numbers, spaces, hyphens, periods, commas, apostrophes, international unicode letters
  const validRegex = /^[\p{L}\p{N}\s\-\.,']+$/u;
  if (!validRegex.test(trimmed)) {
    return { isValid: false, message: 'Contains unsupported special characters' };
  }
  return { isValid: true, message: null };
}
