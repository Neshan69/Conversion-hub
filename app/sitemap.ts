import type { MetadataRoute } from "next";
import { conversionCategories } from "@/data/conversions";
import { utilityTools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://conversionhub.com";

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/unit`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/currency`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
  ];

  // Category pages (unit category landing pages)
  const categoryPages = conversionCategories.map((category) => ({
    url: `${baseUrl}/unit/category/${category.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // Major currencies for currency pair generation
  const majorCurrencies = [
    "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "HKD", "NZD", "SGD", 
    "INR", "NPR", "AED", "SAR", "KRW", "THB", "TRY", "RUB", "BRL", "MXN"
  ];

  // Currency pair pages (using new structure: /currency/from-to)
  const currencyPairPages: Array<{ url: string; lastModified: Date; changeFrequency: "daily"; priority: number }> = [];
  for (let i = 0; i < majorCurrencies.length; i++) {
    for (let j = 0; j < majorCurrencies.length; j++) {
      if (i !== j) {
        const from = majorCurrencies[i];
        const to = majorCurrencies[j];
        currencyPairPages.push({
          url: `${baseUrl}/currency/${from.toLowerCase()}-${to.toLowerCase()}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.7,
        });
      }
    }
  }

  // Common unit keys per category for unit pair generation
  const commonUnitKeysByCategory: Record<string, string[]> = {
    length: [
      "meter",
      "kilometer",
      "centimeter",
      "millimeter",
      "mile",
      "yard",
      "foot",
      "inch",
    ],
    weight: [
      "kilogram",
      "gram",
      "milligram",
      "pound",
      "ounce",
    ],
    temperature: [
      "celsius",
      "fahrenheit",
      "kelvin",
    ],
    speed: [
      "meterPerSecond",
      "kilometerPerHour",
      "milePerHour",
      "knot",
    ],
    area: [
      "squareMeter",
      "squareKilometer",
      "squareCentimeter",
      "squareMile",
      "squareFoot",
      "squareInch",
      "hectare",
      "acre",
    ],
    volume: [
      "liter",
      "milliliter",
      "cubicMeter",
      "cubicCentimeter",
      "gallonUS",
      "gallonUK",
      "quart",
      "pint",
      "cup",
      "fluidOunce",
      "tablespoon",
      "teaspoon",
    ],
    time: [
      "second",
      "millisecond",
      "minute",
      "hour",
      "day",
      "week",
      "month",
      "year",
    ],
    storage: [
      "bit",
      "byte",
      "kilobyte",
      "megabyte",
      "gigabyte",
      "terabyte",
      "petabyte",
    ],
    pressure: [
      "pascal",
      "kilopascal",
      "megapascal",
      "bar",
      "millibar",
      "atmosphere",
      "psi",
    ],
    energy: [
      "joule",
      "kilojoule",
      "calorie",
      "kilocalorie",
      "wattHour",
      "kilowattHour",
      "btu",
    ],
  };

  // Unit pair pages (using new structure: /unit/from-to)
  const unitPairPages: Array<{ url: string; lastModified: Date; changeFrequency: "daily"; priority: number }> = [];
  for (const [categoryId, unitKeys] of Object.entries(commonUnitKeysByCategory)) {
    // Generate all pairs of distinct units in this category
    for (let i = 0; i < unitKeys.length; i++) {
      for (let j = 0; j < unitKeys.length; j++) {
        if (i !== j) {
          const from = unitKeys[i];
          const to = unitKeys[j];
          unitPairPages.push({
            url: `${baseUrl}/unit/${from}-${to}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
          });
        }
      }
    }
  }

  const extraPages = [
    { url: `${baseUrl}/roman`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/roman-numerals`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/world-clock`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/timezones`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  const romanPages = [
    "2025",
    "xiv",
    "2025-in-roman-numerals",
    "xiv-meaning",
    "1999-in-roman-numerals",
  ].map((value) => ({ url: `${baseUrl}/roman/${value}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 }));

  const clockPages = [
    "tokyo",
    "london",
    "new-york",
    "kathmandu",
    "sydney",
    "dubai",
    "paris",
    "singapore",
    "seoul",
    "beijing",
  ].map((city) => ({ url: `${baseUrl}/clock/${city}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 }));

  const toolPages = utilityTools.map((tool) => ({ url: `${baseUrl}${tool.path}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 }));

  return [...staticPages, ...categoryPages, ...currencyPairPages, ...unitPairPages, ...extraPages, ...romanPages, ...clockPages, ...toolPages];
}