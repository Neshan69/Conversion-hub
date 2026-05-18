import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scientific Calculator — Conversion Hub",
  description: "Scientific calculator with advanced functions.",
  alternates: { canonical: "https://conversionhub.com/calculator/scientific" },
};

export default function ScientificPage() {
  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6">
        <h1 className="text-3xl font-semibold">Scientific Calculator</h1>
        <p className="text-sm text-muted-foreground mt-2">Scientific calculator coming soon — basic scaffold in place.</p>
      </div>
    </section>
  );
}
