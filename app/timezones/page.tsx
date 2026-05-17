import { Metadata } from "next";
import { TimezoneSearchClient } from "@/components/world-clock/TimezoneSearchClient";

export const metadata: Metadata = {
  title: "Timezones — Conversion Hub",
  description: "Search and compare global timezones with fuzzy matching, local time preview, and recent searches.",
  alternates: {
    canonical: "https://conversionhub.com/timezones",
  },
  openGraph: {
    title: "Timezones — Conversion Hub",
    description: "Search and compare global timezones with fuzzy matching, local time preview, and recent searches.",
    url: "https://conversionhub.com/timezones",
    type: "website",
  },
};

export default function TimezonesPage() {
  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <TimezoneSearchClient />
    </section>
  );
}
