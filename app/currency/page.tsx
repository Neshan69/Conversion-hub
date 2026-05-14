import { Metadata } from "next";
import { CurrencyPageClient } from "@/components/currency/CurrencyPageClient";

export const metadata: Metadata = {
  title: "Currency Converter - Live Exchange Rates | Conversion Hub",
  description: "Convert any world currency with live exchange rates. Support for 180+ currencies, historical charts, AI insights, and real-time updates.",
  keywords: "currency converter, exchange rate, forex, foreign exchange, USD, EUR, GBP, INR, live rates, AI insights",
  openGraph: {
    title: "Currency Converter - Live Exchange Rates | Conversion Hub",
    description: "Convert 180+ world currencies with real-time exchange rates, historical charts, and AI-powered insights.",
    url: "https://conversionhub.com/currency",
    type: "website",
    images: [
      {
        url: "/api/og?title=Currency+Converter&subtitle=180+%C2%A0Currencies+with+Live+Rates",
        width: 1200,
        height: 630,
        alt: "Currency Converter - Live Exchange Rates",
      },
    ],
  },
  alternates: {
    canonical: "https://conversionhub.com/currency",
  },
};

export default function CurrencyPage() {
  return <CurrencyPageClient />;
}