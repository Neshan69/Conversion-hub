import { Metadata } from "next";
import { CityClockClient } from "@/components/world-clock/CityClockClient";
import { findCityBySlug } from "@/lib/timezone-utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { city: "tokyo" },
    { city: "london" },
    { city: "new-york" },
    { city: "kathmandu" },
    { city: "sydney" },
    { city: "dubai" },
    { city: "paris" },
    { city: "singapore" },
    { city: "seoul" },
    { city: "beijing" },
  ];
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cityData = findCityBySlug(params.city);
  if (!cityData) {
    return {
      title: "Clock — Conversion Hub",
      description: "Global clock not found.",
    };
  }

  return {
    title: `${cityData.city} Clock — Conversion Hub`,
    description: `Live digital and analog world clock for ${cityData.city}, including timezone offset and sunrise / sunset guidance.`,
    alternates: {
      canonical: `https://conversionhub.com/clock/${params.city}`,
    },
    openGraph: {
      title: `${cityData.city} Clock — Conversion Hub`,
      description: `Live digital and analog world clock for ${cityData.city}, including timezone offset and sunrise / sunset guidance.`,
      url: `https://conversionhub.com/clock/${params.city}`,
      type: "website",
    },
  };
}

export default function CityClockPage({ params }: { params: { city: string } }) {
  const cityData = findCityBySlug(params.city);

  if (!cityData) {
    return (
      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border/70 bg-card/80 p-10 text-center">
          <h1 className="text-3xl font-semibold text-foreground">City not found</h1>
          <p className="mt-4 text-sm text-muted-foreground">Try a supported city like Tokyo, London, New York, or Kathmandu.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <CityClockClient
        city={cityData.city}
        country={cityData.country}
        timeZone={cityData.timezone}
        latitude={cityData.latitude}
        longitude={cityData.longitude}
      />
    </section>
  );
}
