import { ConversionCategory } from "@/types/converter";

export const conversionCategories: ConversionCategory[] = [
  {
    id: "length",
    name: "Length",
    description: "Convert between meters, feet, miles, and more",
    icon: "📏",
    color: "from-blue-400 to-cyan-500",
    baseUnit: "meter",
    units: {
      meter: { name: "Meter", symbol: "m", factor: 1 },
      kilometer: { name: "Kilometer", symbol: "km", factor: 1000 },
      centimeter: { name: "Centimeter", symbol: "cm", factor: 0.01 },
      millimeter: { name: "Millimeter", symbol: "mm", factor: 0.001 },
      mile: { name: "Mile", symbol: "mi", factor: 1609.344 },
      yard: { name: "Yard", symbol: "yd", factor: 0.9144 },
      foot: { name: "Foot", symbol: "ft", factor: 0.3048 },
      inch: { name: "Inch", symbol: "in", factor: 0.0254 },
      nauticalMile: { name: "Nautical Mile", symbol: "nmi", factor: 1852 },
    },
  },
  {
    id: "weight",
    name: "Weight",
    description: "Convert between kilograms, pounds, ounces, and more",
    icon: "⚖️",
    color: "from-purple-400 to-pink-500",
    baseUnit: "kilogram",
    units: {
      kilogram: { name: "Kilogram", symbol: "kg", factor: 1 },
      gram: { name: "Gram", symbol: "g", factor: 0.001 },
      milligram: { name: "Milligram", symbol: "mg", factor: 0.000001 },
      metricTon: { name: "Metric Ton", symbol: "t", factor: 1000 },
      pound: { name: "Pound", symbol: "lb", factor: 0.453592 },
      ounce: { name: "Ounce", symbol: "oz", factor: 0.0283495 },
      carat: { name: "Carat", symbol: "ct", factor: 0.0002 },
      stone: { name: "Stone", symbol: "st", factor: 6.35029 },
    },
  },
  {
    id: "temperature",
    name: "Temperature",
    description: "Convert between Celsius, Fahrenheit, and Kelvin",
    icon: "🌡️",
    color: "from-orange-400 to-red-500",
    baseUnit: "celsius",
    units: {
      celsius: { name: "Celsius", symbol: "°C", factor: 1, offset: 0 },
      fahrenheit: { name: "Fahrenheit", symbol: "°F", factor: 1.8, offset: 32 },
      kelvin: { name: "Kelvin", symbol: "K", factor: 1, offset: 273.15 },
    },
  },
  {
    id: "speed",
    name: "Speed",
    description: "Convert between km/h, mph, m/s, and more",
    icon: "🚀",
    color: "from-green-400 to-emerald-500",
    baseUnit: "meterPerSecond",
    units: {
      meterPerSecond: { name: "Meters per second", symbol: "m/s", factor: 1 },
      kilometerPerHour: { name: "Kilometers per hour", symbol: "km/h", factor: 0.277778 },
      milePerHour: { name: "Miles per hour", symbol: "mph", factor: 0.44704 },
      knot: { name: "Knot", symbol: "kn", factor: 0.514444 },
      mach: { name: "Mach", symbol: "Ma", factor: 340.29 },
    },
  },
  {
    id: "area",
    name: "Area",
    description: "Convert between square meters, acres, hectares, and more",
    icon: "📐",
    color: "from-indigo-400 to-blue-500",
    baseUnit: "squareMeter",
    units: {
      squareMeter: { name: "Square meter", symbol: "m²", factor: 1 },
      squareKilometer: { name: "Square kilometer", symbol: "km²", factor: 1000000 },
      squareCentimeter: { name: "Square centimeter", symbol: "cm²", factor: 0.0001 },
      squareMile: { name: "Square mile", symbol: "mi²", factor: 2589988.11 },
      squareFoot: { name: "Square foot", symbol: "ft²", factor: 0.092903 },
      squareInch: { name: "Square inch", symbol: "in²", factor: 0.00064516 },
      hectare: { name: "Hectare", symbol: "ha", factor: 10000 },
      acre: { name: "Acre", symbol: "ac", factor: 4046.86 },
    },
  },
  {
    id: "volume",
    name: "Volume",
    description: "Convert between liters, gallons, cups, and more",
    icon: "🧊",
    color: "from-cyan-400 to-blue-500",
    baseUnit: "liter",
    units: {
      liter: { name: "Liter", symbol: "L", factor: 1 },
      milliliter: { name: "Milliliter", symbol: "mL", factor: 0.001 },
      cubicMeter: { name: "Cubic meter", symbol: "m³", factor: 1000 },
      cubicCentimeter: { name: "Cubic centimeter", symbol: "cm³", factor: 0.001 },
      gallonUS: { name: "Gallon (US)", symbol: "gal (US)", factor: 3.78541 },
      gallonUK: { name: "Gallon (UK)", symbol: "gal (UK)", factor: 4.54609 },
      quart: { name: "Quart", symbol: "qt", factor: 0.946353 },
      pint: { name: "Pint", symbol: "pt", factor: 0.473176 },
      cup: { name: "Cup", symbol: "cup", factor: 0.236588 },
      fluidOunce: { name: "Fluid ounce", symbol: "fl oz", factor: 0.0295735 },
      tablespoon: { name: "Tablespoon", symbol: "tbsp", factor: 0.0147868 },
      teaspoon: { name: "Teaspoon", symbol: "tsp", factor: 0.00492892 },
    },
  },
  {
    id: "time",
    name: "Time",
    description: "Convert between seconds, minutes, hours, days, and more",
    icon: "⏰",
    color: "from-amber-400 to-orange-500",
    baseUnit: "second",
    units: {
      second: { name: "Second", symbol: "s", factor: 1 },
      millisecond: { name: "Millisecond", symbol: "ms", factor: 0.001 },
      minute: { name: "Minute", symbol: "min", factor: 60 },
      hour: { name: "Hour", symbol: "h", factor: 3600 },
      day: { name: "Day", symbol: "d", factor: 86400 },
      week: { name: "Week", symbol: "wk", factor: 604800 },
      month: { name: "Month", symbol: "mo", factor: 2628000 },
      year: { name: "Year", symbol: "yr", factor: 31536000 },
      decade: { name: "Decade", symbol: "dec", factor: 315360000 },
      century: { name: "Century", symbol: "cen", factor: 3153600000 },
    },
  },
  {
    id: "storage",
    name: "Data Storage",
    description: "Convert between bytes, kilobytes, megabytes, and more",
    icon: "💾",
    color: "from-violet-400 to-purple-500",
    baseUnit: "byte",
    units: {
      bit: { name: "Bit", symbol: "b", factor: 0.125 },
      byte: { name: "Byte", symbol: "B", factor: 1 },
      kilobyte: { name: "Kilobyte", symbol: "KB", factor: 1024 },
      megabyte: { name: "Megabyte", symbol: "MB", factor: 1048576 },
      gigabyte: { name: "Gigabyte", symbol: "GB", factor: 1073741824 },
      terabyte: { name: "Terabyte", symbol: "TB", factor: 1099511627776 },
      petabyte: { name: "Petabyte", symbol: "PB", factor: 1125899906842624 },
    },
  },
  {
    id: "pressure",
    name: "Pressure",
    description: "Convert between pascals, bar, PSI, atmospheres, and more",
    icon: "PSI",
    color: "from-sky-400 to-blue-600",
    baseUnit: "pascal",
    units: {
      pascal: { name: "Pascal", symbol: "Pa", factor: 1 },
      kilopascal: { name: "Kilopascal", symbol: "kPa", factor: 1000 },
      megapascal: { name: "Megapascal", symbol: "MPa", factor: 1000000 },
      bar: { name: "Bar", symbol: "bar", factor: 100000 },
      millibar: { name: "Millibar", symbol: "mbar", factor: 100 },
      atmosphere: { name: "Atmosphere", symbol: "atm", factor: 101325 },
      psi: { name: "Pound per square inch", symbol: "psi", factor: 6894.757 },
      torr: { name: "Torr", symbol: "Torr", factor: 133.322 },
    },
  },
  {
    id: "energy",
    name: "Energy",
    description: "Convert between joules, calories, watt-hours, BTU, and more",
    icon: "kWh",
    color: "from-lime-400 to-emerald-600",
    baseUnit: "joule",
    units: {
      joule: { name: "Joule", symbol: "J", factor: 1 },
      kilojoule: { name: "Kilojoule", symbol: "kJ", factor: 1000 },
      calorie: { name: "Calorie", symbol: "cal", factor: 4.184 },
      kilocalorie: { name: "Kilocalorie", symbol: "kcal", factor: 4184 },
      wattHour: { name: "Watt-hour", symbol: "Wh", factor: 3600 },
      kilowattHour: { name: "Kilowatt-hour", symbol: "kWh", factor: 3600000 },
      btu: { name: "British thermal unit", symbol: "BTU", factor: 1055.056 },
      electronvolt: { name: "Electronvolt", symbol: "eV", factor: 1.602176634e-19 },
    },
  },
];

export const unitAliases: Record<string, string> = {
  kg: "kilogram",
  kilogram: "kilogram",
  lbs: "pound",
  lb: "pound",
  pound: "pound",
  cm: "centimeter",
  centimeter: "centimeter",
  feet: "foot",
  ft: "foot",
  foot: "foot",
  meter: "meter",
  m: "meter",
  km: "kilometer",
  mi: "mile",
  c: "celsius",
  f: "fahrenheit",
  pa: "pascal",
  kpa: "kilopascal",
  psi: "psi",
  j: "joule",
  kj: "kilojoule",
  wh: "wattHour",
  kwh: "kilowattHour",
};

// Currency is a separate category, not in the standard unit converters list
export const currencyCategory = {
  id: "currency",
  name: "Currency",
  description: "Convert between 180+ world currencies with live exchange rates",
  icon: "💱",
  color: "from-emerald-400 to-teal-500",
  baseUnit: "USD",
  units: { USD: { name: "US Dollar", symbol: "$", factor: 1 } },
};

export const getCategoryById = (id: string): ConversionCategory | undefined => {
  // Special case for currency - redirect concept
  if (id === "currency") {
    return undefined; // Will be handled by separate route
  }
  return conversionCategories.find((cat) => cat.id === id);
};

export const getUnitKeys = (categoryId: string): string[] => {
  const category = getCategoryById(categoryId);
  return category ? Object.keys(category.units) : [];
};

export const getCategoryByUnits = (fromUnit: string, toUnit: string): ConversionCategory | undefined => {
  for (const category of conversionCategories) {
    if (category.units[fromUnit] && category.units[toUnit]) {
      return category;
    }
  }
  return undefined;
};

export function normalizeUnitSlug(slug: string): string {
  return unitAliases[slug] || slug;
}

export function parseUnitPairSlug(slug?: string): { fromUnit: string; toUnit: string; category: ConversionCategory } | null {
  if (!slug || typeof slug !== "string" || !slug.includes("-to-")) return null;
  const [rawFrom, rawTo] = slug.split("-to-");
  if (!rawFrom || !rawTo) return null;

  const fromUnit = normalizeUnitSlug(rawFrom);
  const toUnit = normalizeUnitSlug(rawTo);
  const category = getCategoryByUnits(fromUnit, toUnit);

  if (!category) return null;
  return { fromUnit, toUnit, category };
}
