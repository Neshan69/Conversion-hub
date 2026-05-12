import { Metadata } from "next";
import { CurrencyPageClient } from "@/components/currency/CurrencyPageClient";

export const metadata: Metadata = {
  title: "Currency Converter - Live Exchange Rates | Conversion Hub",
  description: "Convert any world currency with live exchange rates. Support for 180+ currencies, historical charts, and real-time updates.",
  keywords: "currency converter, exchange rate, forex, foreign exchange, USD, EUR, GBP, INR, live rates",
  openGraph: {
    title: "Currency Converter - Live Exchange Rates",
    description: "Convert 180+ world currencies with real-time exchange rates and historical charts.",
    url: "https://conversionhub.com/currency",
    type: "website",
  },
  alternates: {
    canonical: "https://conversionhub.com/currency",
  },
};

export default function CurrencyPage() {
  return <CurrencyPageClient />;
}
