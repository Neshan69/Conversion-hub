import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CurrencyConverter } from "@/components/currency/CurrencyConverter";
import { LearningPanel } from "@/components/currency/LearningPanel";
import { getCurrencyByCode } from "@/types/currency";
import { motion } from "framer-motion";
import Link from "next/link";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { useHistoricalRates } from "@/lib/currency-utils";
import { formatCurrency } from "@/lib/currency-api";

interface PageProps {
  params: {
    from: string;
    to: string;
  };
  searchParams: {
    amount?: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { from, to } = params;

  if (typeof from !== 'string' || typeof to !== 'string') {
    return {
      title: "Currency Converter Not Found",
      description: "The requested currency conversion is not available.",
    };
  }

  const fromCurrency = getCurrencyByCode(from);
  const toCurrency = getCurrencyByCode(to);

  if (!fromCurrency || !toCurrency) {
    return {
      title: "Currency Not Found | Conversion Hub",
      description: "The requested currency is not available.",
    };
  }

  const title = `${from} to ${to} Live Currency Converter (${fromCurrency.name} → ${toCurrency.name}) | Conversion Hub`;
  const description = `Convert ${from} to ${to} using live exchange rates. ${fromCurrency.name} to ${toCurrency.name} converter with historical data, AI insights, and accurate rates. Free and instant.`;

  return {
    title,
    description,
    keywords: [
      `${from} to ${to}`,
      `${fromCurrency.name} to ${toCurrency.name}`,
      "currency converter",
      "exchange rate",
      "forex",
      "live rates",
      `convert ${from} to ${to}`,
      `${fromCurrency.code} ${toCurrency.code} forecast`,
    ].join(", "),
    openGraph: {
      title,
      description,
      url: `https://conversionhub.com/currency/${from}/to/${to}`,
      type: "website",
      images: [
        {
          url: `/api/og?from=${from}&to=${to}&type=currency`,
          width: 1200,
          height: 630,
          alt: `${from} to ${to} Currency Converter`,
        },
      ],
    },
    alternates: {
      canonical: `https://conversionhub.com/currency/${from}/to/${to}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "citation_title": `${fromCurrency.name} to ${toCurrency.name} Conversion`,
      "citation_author": "Conversion Hub",
    },
  };
}

// Generate static params for popular currency pairs (SSG)
export async function generateStaticParams() {
  const popularPairs = [
    ["USD", "EUR"], ["USD", "INR"], ["USD", "PKR"], ["USD", "NPR"],
    ["EUR", "USD"], ["EUR", "GBP"], ["GBP", "USD"], ["JPY", "USD"],
    ["INR", "USD"], ["PKR", "USD"], ["NPR", "USD"], ["AED", "USD"],
    ["SAR", "USD"], ["CAD", "USD"], ["AUD", "USD"], ["CNY", "USD"],
    ["THB", "USD"], ["TRY", "USD"], ["RUB", "USD"], ["BRL", "USD"],
    ["MXN", "USD"], ["ZAR", "USD"], ["NGN", "USD"], ["KRW", "USD"],
  ];

  return popularPairs.map(([from, to]) => ({
    from,
    to,
  }));
}

export default async function CurrencyPairPage({ params, searchParams }: PageProps) {
  const { from, to } = params;

  if (typeof from !== 'string' || typeof to !== 'string') {
    notFound();
  }

  const upperFrom = from.toUpperCase();
  const upperTo = to.toUpperCase();

  const fromCurrency = getCurrencyByCode(upperFrom);
  const toCurrency = getCurrencyByCode(upperTo);

  if (!fromCurrency || !toCurrency) {
    notFound();
  }

  const initialAmount = searchParams.amount || "1";

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="bg-muted/30 border-b border-border" aria-label="Breadcrumb">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemscope itemType="https://schema.org/ListItem">
              <Link href="/" className="hover:text-primary transition-colors" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li>/</li>
            <li itemProp="itemListElement" itemscope itemType="https://schema.org/ListItem">
              <Link href="/currency" className="hover:text-primary transition-colors" itemProp="item">
                <span itemProp="name">Currency</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <li>/</li>
            <li className="font-medium text-foreground" itemProp="itemListElement" itemscope itemType="https://schema.org/ListItem">
              <span itemProp="name">{upperFrom} → {upperTo}</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </div>
      </nav>

      {/* Converter Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-4xl">{fromCurrency.flag}</span>
              <span className="text-2xl text-muted-foreground">→</span>
              <span className="text-4xl">{toCurrency.flag}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              {fromCurrency.name} to {toCurrency.name} Converter
            </h1>
            <p className="text-muted-foreground">
              Live exchange rates: 1 {upperFrom} = ? {upperTo}
            </p>
          </motion.div>

          <CurrencyConverter
            initialFrom={upperFrom}
            initialTo={upperTo}
            initialAmount={initialAmount}
            showCharts={true}
            showHistorical={true}
          />

          {/* AI-Powered Learning Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <LearningPanel
              fromCurrency={upperFrom}
              toCurrency={upperTo}
              amount={initialAmount}
            />
          </motion.div>
        </div>
      </section>

      {/* Historical Comparison Info */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                About {fromCurrency.code} to {toCurrency.code} Conversion
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                  Convert {fromCurrency.name} ({fromCurrency.code}) to {toCurrency.name} ({toCurrency.code})
                  with live forex rates. Our currency converter uses real-time data from trusted financial APIs
                  to provide accurate exchange rates for {fromCurrency.country} and {toCurrency.country}.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span><strong>Live Rates:</strong> Updated every 15 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span><strong>Precision:</strong> Up to {fromCurrency.decimalPlaces} decimal places for {fromCurrency.code}, {toCurrency.decimalPlaces} for {toCurrency.code}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span><strong>Historical Data:</strong> 30-day trend chart included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span><strong>AI Insights:</strong> Understand why exchange rates change</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span><strong>Offline Support:</strong> Last known rates cached locally</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}