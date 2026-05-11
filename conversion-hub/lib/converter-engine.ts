"use client";

import { Unit, ConversionResult, DECIMAL_PLACES } from "@/types/converter";

export class ConversionEngine {
  private units: Record<string, Unit>;
  private temperatureUnits: Set<string>;

  constructor(units: Record<string, Unit>) {
    this.units = units;
    this.temperatureUnits = new Set(["celsius", "fahrenheit", "kelvin"]);
  }

  convert(value: number, fromUnit: string, toUnit: string): ConversionResult {
    const from = this.units[fromUnit];
    const to = this.units[toUnit];

    if (!from || !to) {
      throw new Error("Invalid unit specified");
    }

    let result: number;

    // Check if this is a temperature conversion
    const isTemperatureConversion = 
      this.temperatureUnits.has(fromUnit) && this.temperatureUnits.has(toUnit);

    if (isTemperatureConversion) {
      result = this.convertTemperature(value, fromUnit, toUnit);
    } else {
      // Standard conversion using factors
      const valueInBase = value * from.factor;
      result = valueInBase / to.factor;
    }

    // Round to avoid floating point issues
    result = Math.round(result * Math.pow(10, DECIMAL_PLACES)) / Math.pow(10, DECIMAL_PLACES);

    return {
      value: result,
      unit: toUnit,
      formatted: this.formatNumber(result),
    };
  }

  private convertTemperature(value: number, fromUnit: string, toUnit: string): number {
    // Convert from source to Celsius first
    let celsius: number;

    switch (fromUnit) {
      case "celsius":
        celsius = value;
        break;
      case "fahrenheit":
        celsius = (value - 32) * (5 / 9);
        break;
      case "kelvin":
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }

    // Convert from Celsius to target
    switch (toUnit) {
      case "celsius":
        return celsius;
      case "fahrenheit":
        return celsius * (9 / 5) + 32;
      case "kelvin":
        return celsius + 273.15;
      default:
        return celsius;
    }
  }

  getUnitSymbol(unitKey: string): string {
    return this.units[unitKey]?.symbol || unitKey;
  }

  getUnitName(unitKey: string): string {
    return this.units[unitKey]?.name || unitKey;
  }

  private formatNumber(num: number): string {
    if (Number.isInteger(num)) {
      return num.toString();
    }

    // Handle very small or very large numbers
    if (Math.abs(num) < 0.000001 || Math.abs(num) >= 1e9) {
      return num.toExponential(4);
    }

    // Format with appropriate decimal places
    const str = num.toFixed(DECIMAL_PLACES);
    return str.replace(/\.?0+$/, "");
  }
}

export function createConversionEngine(units: Record<string, Unit>): ConversionEngine {
  return new ConversionEngine(units);
}