import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI Calculator — Conversion Hub",
  description: "Calculate Body Mass Index (BMI).",
  alternates: { canonical: "https://conversionhub.com/calculator/bmi" },
};

export default function BMIPage() {
  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6">
        <h1 className="text-3xl font-semibold">BMI Calculator</h1>
        <p className="text-sm text-muted-foreground mt-2">BMI calculator coming soon — scaffold added.</p>
      </div>
    </section>
  );
}
