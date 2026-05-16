import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CurrencyConverter } from "@/components/currency/CurrencyConverter";
import { LearningPanel } from "@/components/currency/LearningPanel";
import { FAQStructuredData } from "@/components/seo/StructuredData";
import { getCurrencyByCode } from "@/types/currency";
import Link from "next/link";

interface PageProps {
  params: Promise<{ pair: string[] }>;
  searchParams: Promise<{ amount?: string }>;
}

function parseCurrencySegments(segments: string[]): { from: string; to: string; slug: string } | null {
  if (segments.length === 1) {
    const segment = segments[0].toLowerCase();
    if (segment.includes("-to-")) {
      const [from, to] = segment.split("-to-");
      if (!from || !to) return null;
      return { from: from.toUpperCase(), to: to.toUpperCase(), slug: segment };
    }

    const code = segment.toUpperCase();
    if (!getCurrencyByCode(code)) return null;
    const to = code === "USD" ? "EUR" : "USD";
    return { from: code, to, slug: `${code.toLowerCase()}-to-${to.toLowerCase()}` };
  }

  if (segments.length === 2) {
    const from = segments[0].toUpperCase();
    const to = segments[1].toUpperCase();
    return { from, to, slug: `${from.toLowerCase()}-to-${to.toLowerCase()}` };
  }

  return null;
}

function getFAQData(fromCurrency: string, toCurrency: string) {
  return [
    {
      question: `What is the current ${fromCurrency} to ${toCurrency} exchange rate?`,
      answer: `The current ${fromCurrency} to ${toCurrency} exchange rate is available in the live converter above with retry, cache, and fallback API support.`,
    },
    {
      question: `How often are ${fromCurrency} to ${toCurrency} rates updated?`,
      answer: "Live rates are cached for 15 minutes for speed and refreshed on demand using real-time exchange APIs.",
    },
    {
      question: `Can I convert ${fromCurrency} to ${toCurrency} on mobile?`,
      answer: "Yes. The converter is responsive, touch-friendly, keyboard-accessible, and optimized for Android, iPhone, tablets, and desktop screens.",
    },
  ];
}

export async function generateStaticParams() {
  const pairs = [
    ["usd", "eur"], ["usd", "inr"], ["usd", "npr"], ["usd", "gbp"],
    ["eur", "usd"], ["eur", "gbp"], ["gbp", "usd"], ["jpy", "usd"],
  ];

  return [
    ...pairs.map(([from, to]) => ({ pair: [from, to] })),
    { pair: ["usd-to-gbp"] },
    { pair: ["usd-to-npr"] },
    { pair: ["usd-to-eur"] },
    { pair: ["usd-to-inr"] },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parseCurrencySegments(pair);
  if (!parsed) return { title: "Currency Converter Not Found" };

  const fromCurrency = getCurrencyByCode(parsed.from);
  const toCurrency = getCurrencyByCode(parsed.to);
  if (!fromCurrency || !toCurrency) return { title: "Currency Converter Not Found" };

  const title = `${parsed.from} to ${parsed.to} Currency Converter | Exchange Rate Today`;
  const description = `Convert ${parsed.from} to ${parsed.to} with live exchange rates, fallback APIs, cached rates, and a fast mobile-friendly currency calculator.`;

  return {
    title,
    description,
    keywords: [
      `${parsed.from} to ${parsed.to}`,
      `${fromCurrency.name} to ${toCurrency.name}`,
      `${parsed.from} ${parsed.to} exchange rate`,
      "currency converter",
      "exchange rate today",
      "online conversion tool",
    ].join(", "),
    alternates: { canonical: `https://conversionhub.com/currency/${parsed.slug}` },
    openGraph: {
      title,
      description,
      url: `https://conversionhub.com/currency/${parsed.slug}`,
      type: "website",
      images: [{ url: `/api/og?from=${parsed.from}&to=${parsed.to}&type=currency`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og?from=${parsed.from}&to=${parsed.to}&type=currency`],
    },
  };
}

export default async function CurrencyPairPage({ params, searchParams }: PageProps) {
  const { pair } = await params;
  const { amount } = await searchParams;
  const parsed = parseCurrencySegments(pair);
  if (!parsed) notFound();

  const fromCurrency = getCurrencyByCode(parsed.from);
  const toCurrency = getCurrencyByCode(parsed.to);
  if (!fromCurrency || !toCurrency) notFound();

  const faqQuestions = getFAQData(parsed.from, parsed.to);

  return (
    <>
      <FAQStructuredData questions={faqQuestions} />
      <div className="min-h-screen">
        <nav className="bg-muted/30 border-b border-border" aria-label="Breadcrumb">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/currency" className="hover:text-primary transition-colors">Currency</Link></li>
              <li>/</li>
              <li className="font-medium text-foreground">{parsed.from} to {parsed.to}</li>
            </ol>
          </div>
        </nav>

        <section className="py-12 md:py-20 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-4xl">{fromCurrency.flag}</span>
                <span className="text-2xl text-muted-foreground">to</span>
                <span className="text-4xl">{toCurrency.flag}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                {parsed.from} to {parsed.to} Currency Converter
              </h1>
              <p className="text-muted-foreground">
                Live {fromCurrency.name} to {toCurrency.name} exchange rate today.
              </p>
            </div>

            <CurrencyConverter
              initialFrom={parsed.from}
              initialTo={parsed.to}
              initialAmount={amount || "1"}
              showCharts={true}
              showHistorical={true}
            />

            <div className="mt-8">
              <LearningPanel fromCurrency={parsed.from} toCurrency={parsed.to} amount={amount || "1"} />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqQuestions.map((faq) => (
                  <div key={faq.question} className="p-4 rounded-xl bg-card/50 border border-border">
                    <h3 className="font-semibold mb-2 text-primary">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
