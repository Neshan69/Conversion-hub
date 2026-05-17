"use client";

import { CurrencyConverter } from "@/components/currency/CurrencyConverter";

interface CurrencyConverterPairProps {
  from: string;
  to: string;
}

export function CurrencyConverterPair({ from, to }: CurrencyConverterPairProps) {
  return (
    <CurrencyConverter
      initialFrom={from}
      initialTo={to}
      initialAmount="1"
      showCharts={true}
      showHistorical={true}
      showInsights={false}
      compact={false}
    />
  );
}