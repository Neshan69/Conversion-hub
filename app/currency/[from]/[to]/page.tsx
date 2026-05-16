import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CurrencyConverter } from "@/components/currency/CurrencyConverter";
import { LearningPanel } from "@/components/currency/LearningPanel";
import { getCurrencyByCode } from "@/types/currency";
import { motion } from "framer-motion";
import Link from "next/link";
import { FAQStructuredData } from "@/components/seo/StructuredData";

interface PageProps {
  params: {
    from: string;
    to: string;
  };
  searchParams: {
    amount?: string;
  };
}

// Generate metadata for SEO with enhanced OpenGraph and JSON-LD
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

  const upperFrom = from.toUpperCase();
  const upperTo = to.toUpperCase();
  const title = `${upperFrom} to ${upperTo} Live Currency Converter | Real-Time Exchange Rates`;
  const description = `Convert ${upperFrom} to ${upperTo} using live forex rates. Get real-time ${fromCurrency.name} to ${toCurrency.name} exchange rates, historical charts, AI-powered insights, and market analysis. Updated every 15 minutes.`;

  return {
    title,
    description,
    keywords: [
      `${upperFrom} to ${upperTo}`,
      `${fromCurrency.name} to ${toCurrency.name}`,
      `${upperFrom} ${upperTo} exchange rate`,
      `${fromCurrency.country} currency`,
      `${toCurrency.country} currency`,
      "live currency converter",
      "forex calculator",
      "exchange rate today",
      `${upperFrom} ${upperTo} forecast`,
      "currency conversion tool",
    ].join(", "),
    openGraph: {
      title,
      description,
      url: `https://conversion-hub.vercel.app/currency/${upperFrom.toLowerCase()}-to-${upperTo.toLowerCase()}`,
      type: "website",
      locale: "en_US",
      siteName: "Conversion Hub",
      images: [
        {
          url: `/api/og?from=${upperFrom}&to=${upperTo}&type=currency`,
          width: 1200,
          height: 630,
          alt: `${upperFrom} to ${upperTo} Currency Converter`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og?from=${upperFrom}&to=${upperTo}&type=currency`],
    },
    alternates: {
      canonical: `https://conversion-hub.vercel.app/currency/${upperFrom.toLowerCase()}-to-${upperTo.toLowerCase()}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

// FAQ data for structured data
const getFAQData = (fromCurrency: string, toCurrency: string) => [
  {
    question: `What is the current ${fromCurrency} to ${toCurrency} exchange rate?`,
    answer: `The current ${fromCurrency} to ${toCurrency} exchange rate is updated in real-time. Check the converter above for the latest rate with live data from financial APIs.`,
  },
  {
    question: `How often are ${fromCurrency} to ${toCurrency} rates updated?`,
    answer: `Exchange rates are refreshed every 15-60 minutes from trusted financial data providers to ensure accuracy.`,
  },
  {
    question: `Can I convert ${fromCurrency} to ${toCurrency} offline?`,
    answer: `The converter caches recent rates for offline access. When offline, you'll see the last known exchange rate. Connect to the internet for current rates.`,
  },
  {
    question: `What factors affect ${fromCurrency} to ${toCurrency} exchange rates?`,
    answer: `Exchange rates are influenced by interest rates, inflation, economic indicators, political stability, and market sentiment between ${fromCurrency} and ${toCurrency} countries.`,
  },
];

// Generate static params for popular currency pairs (SSG)
export async function generateStaticParams() {
  const popularPairs = [
    ["USD", "EUR"], ["USD", "INR"], ["USD", "NPR"], ["USD", "PKR"],
    ["EUR", "USD"], ["EUR", "GBP"], ["GBP", "USD"], ["JPY", "USD"],
    ["INR", "USD"], ["PKR", "USD"], ["NPR", "USD"], ["CAD", "USD"],
    ["AUD", "USD"], ["CNY", "USD"], ["SAR", "USD"], ["AED", "USD"],
  ];

  return popularPairs.map(([from, to]) => ({
    from: from.toLowerCase(),
    to: to.toLowerCase(),
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
  const faqQuestions = getFAQData(fromCurrency.code, toCurrency.code);

  return (
    <>
      <FAQStructuredData questions={faqQuestions} />
      <div className="min-h-screen">
        {/* Breadcrumb */}
        <nav className="bg-muted/30 border-b border-border" aria-label="Breadcrumb">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/" className="hover:text-primary transition-colors" itemProp="item">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li>/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/currency" className="hover:text-primary transition-colors" itemProp="item">
                  <span itemProp="name">Currency</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <li>/</li>
              <li className="font-medium text-foreground" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
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

        {/* FAQ Section for SEO */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqQuestions.map((faq, i) => (
                    <div key={i} className="p-4 rounded-xl bg-card/50 border border-border">
                      <h3 className="font-semibold mb-2 text-primary">{faq.question}</h3>
                      <p className="text-muted-foreground text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Educational Content */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Understanding {upperFrom} to {upperTo} Exchange Rates
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p>
                    The {upperFrom} to {upperTo} exchange rate represents how much {toCurrency.name}
                    you receive for one {fromCurrency.name}. This rate fluctuates constantly based on
                    supply and demand in the global foreign exchange market.
                  </p>
                  <h3>Key Factors Affecting {upperFrom} to {upperTo}</h3>
                  <ul>
                    <li><strong>Central Bank Policy:</strong> Interest rate decisions by the {fromCurrency.country}
                    and {toCurrency.country} central banks significantly impact the exchange rate.</li>
                    <li><strong>Economic Indicators:</strong> GDP growth, inflation rates, and employment
                    data influence currency strength.</li>
                    <li><strong>Market Sentiment:</strong> Risk appetite and geopolitical events affect
                    capital flows between currencies.</li>
                    <li><strong>Trade Balances:</strong> Import/export volumes between countries impact
                    currency demand.</li>
                  </ul>
                  <h3>How Our Converter Works</h3>
                  <p>
                    Our {upperFrom} to {upperTo} converter uses real-time data from multiple financial
                    APIs to provide accurate, up-to-date exchange rates. The rates are updated every
                    15-60 minutes to ensure you get the most current conversion.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}