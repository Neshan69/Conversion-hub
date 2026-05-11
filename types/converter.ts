export interface Unit {
  name: string;
  symbol: string;
  factor: number;
  offset?: number; // For temperature conversions
}

export interface ConversionCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  units: Record<string, Unit>;
  baseUnit: string;
}

export interface ConversionResult {
  value: number;
  unit: string;
  formatted: string;
}

export interface RecentConversion {
  id: string;
  category: string;
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
  timestamp: number;
}

export const DECIMAL_PLACES = 6;
export const MAX_PRECISION = 10;