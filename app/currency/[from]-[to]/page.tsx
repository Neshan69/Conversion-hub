import { Metadata } from "next";
import { CurrencyConverterPair } from "@/components/currency/CurrencyConverterPair";

export const revalidate = 3600; // Revalidate every hour

export function generateStaticParams() {
  const majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 'SGD', 'INR', 'NPR'];
  const pairs = [];
  for (let i = 0; i < majorCurrencies.length; i++) {
    for (let j = 0; j < majorCurrencies.length; j++) {
      if (i !== j) {
        pairs.push({
          from: majorCurrencies[i].toLowerCase(),
          to: majorCurrencies[j].toLowerCase()
        });
      }
    }
  }
  return pairs;
}

export const metadata = async ({ params }: { params: { from: string; to: string } }) => {
  const from = params.from.toUpperCase();
  const to = params.to.toUpperCase();
  return {
    title: `${from} to ${to} Converter (Live) – ${from} to ${to} Today`,
    description: `Convert ${from} to ${to} instantly with live exchange rates, historical charts, and accurate currency conversion tools.`,
    alternates: {
      canonical: `https://conversionhub.com/currency/${params.from}-${params.to}`
    },
    openGraph: {
      title: `${from} to ${to} Converter - Live Exchange Rates | Conversion Hub`,
      description: `Convert ${from} to ${to} with live exchange rates, historical data, and AI insights.`,
      url: `https://conversionhub.com/currency/${params.from}-${params.to}`,
      type: "website",
      images: [
        {
          url: `/api/og?title=${from}%20to%20${to}%20Converter&subtitle=Live+Exchange+Rates`,
          width: 1200,
          height: 630,
          alt: `${from} to ${to} Converter`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${from} to ${to} Converter - Live Exchange Rates | Conversion Hub`,
      description: `Convert ${from} to ${to} with live exchange rates and accurate conversion tools.`,
      images: [`/api/og?title=${from}%20to%20${to}%20Converter&subtitle=Live+Exchange+Rates`]
    }
  };
};

export default function CurrencyPairPage({ params }: { params: { from: string; to: string } }) {
  const { from, to } = params;
  return <CurrencyConverterPair from={from.toUpperCase()} to={to.toUpperCase()} />;
}