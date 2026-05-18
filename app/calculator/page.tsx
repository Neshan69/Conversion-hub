import { Metadata } from "next";
import { BasicCalculator } from "@/components/calculator/BasicCalculator";

export const metadata: Metadata = {
  title: "Calculator — Conversion Hub",
  description: "Basic and advanced calculators — BMI, Scientific, Loan, EMI, Percentage and more.",
  alternates: { canonical: "https://conversionhub.com/calculator" },
};

export default function CalculatorIndex() {
  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6">
          <h1 className="text-3xl font-semibold">Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2">Basic and advanced calculators for common tasks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold">Basic</h3>
            <p className="text-sm text-muted-foreground">Simple arithmetic calculator with history.</p>
            <a href="/calculator" className="text-primary text-sm mt-2 inline-block">Open basic calculator</a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold">Scientific</h3>
            <p className="text-sm text-muted-foreground">Advanced operations and functions.</p>
            <a href="/calculator/scientific" className="text-primary text-sm mt-2 inline-block">Open scientific</a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold">BMI</h3>
            <p className="text-sm text-muted-foreground">Body mass index calculator.</p>
            <a href="/calculator/bmi" className="text-primary text-sm mt-2 inline-block">Open BMI</a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold">Age</h3>
            <p className="text-sm text-muted-foreground">Calculate precise age from birthdate.</p>
            <a href="/calculator/age" className="text-primary text-sm mt-2 inline-block">Open age calculator</a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold">Love</h3>
            <p className="text-sm text-muted-foreground">Playful compatibility score between two names.</p>
            <a href="/calculator/love" className="text-primary text-sm mt-2 inline-block">Open love calculator</a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold">Loan / EMI</h3>
            <p className="text-sm text-muted-foreground">Calculate monthly payments and amortization.</p>
            <a href="/calculator/loan" className="text-primary text-sm mt-2 inline-block">Open EMI calculator</a>
          </div>
        </div>

        <div className="mt-6">
          <BasicCalculator />
        </div>
      </div>
    </section>
  );
}
