import { Metadata } from "next";
import { LoveCalculator } from "@/components/calculator/LoveCalculator";

export const metadata: Metadata = {
  title: "Love Calculator — Conversion Hub",
  description: "Fun love compatibility calculator based on names. For entertainment purposes only.",
  alternates: { canonical: "https://conversionhub.com/calculator/love" },
};

export default function LovePage() {
  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6">
        <h1 className="text-3xl font-semibold">Love Calculator</h1>
        <p className="text-sm text-muted-foreground mt-2">Playful compatibility score between two names. For fun only.</p>
      </div>

      <div className="mt-6">
        <LoveCalculator />
      </div>
    </section>
  );
}
