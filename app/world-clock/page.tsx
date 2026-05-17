import { Metadata } from "next";
import { WorldClockDashboard } from "@/components/world-clock/WorldClockDashboard";

export const metadata: Metadata = {
  title: "World Clock — Conversion Hub",
  description: "Live global world clock dashboard with favorites, drag-and-drop reordering, and timezone comparisons.",
  alternates: {
    canonical: "https://conversionhub.com/world-clock",
  },
  openGraph: {
    title: "World Clock — Conversion Hub",
    description: "Live global world clock dashboard with favorites, drag-and-drop reordering, and timezone comparisons.",
    url: "https://conversionhub.com/world-clock",
    type: "website",
  },
};

export default function WorldClockPage() {
  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <WorldClockDashboard />
    </section>
  );
}
