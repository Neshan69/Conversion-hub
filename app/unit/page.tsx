import { Metadata } from "next";
import { conversionCategories } from "@/data/conversions";
import { CategoryGrid } from "@/components/converter/CategoryGrid";

export const metadata: Metadata = {
  title: "Unit Converter – Length, Weight, Temperature, Speed, Area, Volume, Time, Storage",
  description: "Free online unit converter for all measurement types. Convert length, weight, temperature, speed, area, volume, time, and storage units with high precision.",
  keywords: "unit converter, length converter, weight converter, temperature converter, speed converter, area converter, volume converter, time converter, storage converter",
  openGraph: {
    title: "Unit Converter – All Measurement Types",
    description: "Convert any unit of measurement with our comprehensive unit converter.",
    url: "https://conversionhub.com/unit",
    type: "website",
  },
  alternates: {
    canonical: "https://conversionhub.com/unit",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function UnitPage() {
  return (
    <div className="min-h-screen">
      <section className="py-12 md:py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Unit Converter
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Choose from our comprehensive suite of unit conversion tools designed for accuracy and ease of use.
            </p>
          </div>

          <div className="mt-12">
            <CategoryGrid categories={conversionCategories} />
          </div>
        </div>
      </section>
    </div>
  );
}
