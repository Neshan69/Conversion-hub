import { Metadata } from "next";
import Link from "next/link";
import { Converter } from "@/components/converter/Converter";
import { getCategoryByUnits } from "@/data/conversions";

// Define common unit keys per category for static generation
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
  power: [
    "watt",
    "kilowatt",
    "megawatt",
    "horsepower",
  ],
  force: [
    "newton",
    "kilonewton",
    "poundForce",
  ],
  frequency: [
    "hertz",
    "kilohertz",
    "megahertz",
    "gigahertz",
  ],
  density: [
    "kilogramPerCubicMeter",
    "gramPerCubicCentimeter",
    "poundPerCubicFoot",
  ],
  torque: [
    "newtonMeter",
    "footPound",
    "inchPound",
  ],
  voltage: [
    "volt",
    "kilovolt",
    "millivolt",
    "microvolt",
  ],
  current: [
    "ampere",
    "milliampere",
    "kiloampere",
    "microampere",
  ],
  resistance: [
    "ohm",
    "kiloohm",
    "megaohm",
    "microohm",
  ],
  conductivity: [
    "siemensPerMeter",
    "microsiemensPerCentimeter",
    "millisiemensPerMeter",
  ],
  magneticFlux: [
    "weber",
    "milliweber",
    "microweber",
    "maxwell",
  ],
  angularVelocity: [
    "radianPerSecond",
    "revolutionPerSecond",
    "revolutionPerMinute",
  ],
  radiation: [
    "gray",
    "sievert",
    "rem",
    "becquerel",
  ],
  fuelEconomy: [
    "kilometerPerLiter",
    "milePerGallonUS",
    "literPer100Kilometers",
  ],
  typography: [
    "point",
    "pica",
    "pixel",
    "inch",
    "em",
  ],
  astronomy: [
    "meter",
    "kilometer",
    "astronomicalUnit",
    "lightYear",
    "parsec",
  ],
  scientificConstants: [
    "joule",
    "electronVolt",
    "hartree",
    "rydberg",
    "planckConstant",
    "boltzmannConstant",
    "avogadroConstant",
    "faradayConstant",
    "speedOfLight",
    "gravitationalConstant",
  ],
};

export const revalidate = false; // Static generation

  export function generateStaticParams() {
    const params = [];

    for (const unitKeys of Object.values(commonUnitKeysByCategory)) {
      // Generate all pairs of distinct units in this category
      for (let i = 0; i < unitKeys.length; i++) {
        for (let j = 0; j < unitKeys.length; j++) {
          if (i !== j) {
            params.push({
              from: unitKeys[i],
              to: unitKeys[j],
            });
          }
        }
      }
    }

    return params;
  }

export const metadata = async ({ params }: { params: { from: string; to: string } }) => {
  const from = params.from;
  const to = params.to;
   
  // Get category from the unit pair
  const category = getCategoryByUnits(from, to);
   
  if (!category) {
    // Fallback metadata if category not found (shouldn't happen for generated params)
    return {
      title: `${from} to ${to} Converter | Conversion Hub`,
      description: `Convert ${from} to ${to} with our online conversion tool.`,
      alternates: {
        canonical: `https://conversionhub.com/unit/${from}-${to}`,
      },
    };
  }

  const fromUnit = category.units[from];
  const toUnit = category.units[to];
   
  return {
    title: `${fromUnit.name} to ${toUnit.name} Converter – ${category.name} | Conversion Hub`,
    description: `Convert ${fromUnit.name} to ${toUnit.name} instantly with accurate ${category.name.toLowerCase()} conversion tool. Live formulas, conversion tables, and common conversions.`,
    alternates: {
      canonical: `https://conversionhub.com/unit/${from}-${to}`,
    },
    openGraph: {
      title: `${fromUnit.name} to ${toUnit.name} Converter - ${category.name} | Conversion Hub`,
      description: `Convert ${fromUnit.name} to ${toUnit.name} with our accurate ${category.name.toLowerCase()} conversion tool.`,
      url: `https://conversionhub.com/unit/${from}-${to}`,
      type: "website",
      images: [
        {
          url: `/api/og?title=${fromUnit.name}%20to%20${toUnit.name}%20Converter&subtitle=${category.name}`,
          width: 1200,
          height: 630,
          alt: `${fromUnit.name} to ${toUnit.name} Converter`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${fromUnit.name} to ${toUnit.name} Converter - ${category.name} | Conversion Hub`,
      description: `Convert ${fromUnit.name} to ${toUnit.name} with our accurate conversion tool.`,
      images: [`/api/og?title=${fromUnit.name}%20to%20${toUnit.name}%20Converter&subtitle=${category.name}`]
    }
  };
};

export default function UnitPairPage({ params }: { params: { from: string; to: string } }) {
  const { from, to } = params;
  
  // Get category from the unit pair
  const category = getCategoryByUnits(from, to);
  
  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">Conversion Not Found</h1>
           <p className="text-muted-foreground mb-6">
             The conversion from &quot;{from}&quot; to &quot;{to}&quot; is not available.
           </p>
           <Link href="/" className="btn btn-primary">
             Go to Homepage
           </Link>
      </div>
    );
  }

  return (
    <Converter
      categoryId={category.id}
      initialFromUnit={from}
      initialToUnit={to}
    />
  );
}