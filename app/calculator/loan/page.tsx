import { Metadata } from "next";
import { useState } from "react";

export const metadata: Metadata = {
  title: "Loan / EMI Calculator — Conversion Hub",
  description: "Calculate EMI and monthly loan payments.",
  alternates: { canonical: "https://conversionhub.com/calculator/loan" },
};

function calculateEMI(principal: number, rateAnnual: number, years: number) {
  const r = rateAnnual / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return emi;
}

export default function LoanPage() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.5);
  const [years, setYears] = useState(5);

  const emi = calculateEMI(principal, rate, years);

  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6">
        <h1 className="text-3xl font-semibold">Loan / EMI Calculator</h1>
        <p className="text-sm text-muted-foreground mt-2">Estimate monthly payments for loans and EMIs.</p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-4">
          <label className="text-sm text-muted-foreground">Principal</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full mt-2 p-2 rounded-md border" />
          <label className="text-sm text-muted-foreground mt-3">Annual rate (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full mt-2 p-2 rounded-md border" />
          <label className="text-sm text-muted-foreground mt-3">Years</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full mt-2 p-2 rounded-md border" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-sm text-muted-foreground">Monthly EMI</h3>
          <p className="text-3xl font-semibold mt-3">{isNaN(emi) ? "—" : emi.toFixed(2)}</p>
          <p className="mt-3 text-sm text-muted-foreground">Total payment: {(emi * years * 12).toFixed(2)}</p>
        </div>
      </div>
    </section>
  );
}
