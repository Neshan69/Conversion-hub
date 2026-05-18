"use client";

import { useState } from "react";
import { calculateAge } from "@/lib/tools";

export function AgeCalculator() {
  const [birth, setBirth] = useState("");
  const [result, setResult] = useState<string>("");

  const handle = () => {
    const age = calculateAge(birth);
    if (!age) {
      setResult("Please enter a valid birth date.");
      return;
    }
    setResult(`${age.years} years, ${age.months} months, ${age.days} days`);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result);
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <label className="text-sm text-muted-foreground">Birth date</label>
        <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="w-full mt-2 p-2 rounded-md border bg-background" />
        <div className="mt-3 flex items-center gap-2">
          <button onClick={handle} className="px-3 py-2 rounded-lg bg-primary text-white">Calculate</button>
          <button onClick={copy} className="px-3 py-2 rounded-lg border">Copy</button>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Result</p>
          <p className="mt-2 text-lg font-medium">{result || "Results will appear here."}</p>
        </div>
      </div>
    </div>
  );
}
