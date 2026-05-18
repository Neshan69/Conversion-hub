import { Metadata } from "next";
import { AgeCalculator } from "@/components/calculator/AgeCalculator";

export const metadata: Metadata = {
  title: "Age Calculator — Conversion Hub",
  description: "Calculate exact age in years, months, and days from a birth date.",
  alternates: { canonical: "https://conversionhub.com/calculator/age" },
};

export default function AgePage() {
  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6">
        <h1 className="text-3xl font-semibold">Age Calculator</h1>
        <p className="text-sm text-muted-foreground mt-2">Calculate age from birth date with precise years, months, and days.</p>
      </div>

      <div className="mt-6">
        <AgeCalculator />
      </div>
    </section>
  );
}
