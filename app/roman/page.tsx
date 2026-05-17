import Link from "next/link";
import { Metadata } from "next";
import RomanNumeralConverter from "@/components/roman/RomanNumeralConverter";
import { RomanExtras } from "@/components/roman/RomanExtras";

export const metadata: Metadata = {
  title: "Roman Numerals — Conversion Hub",
  description: "Instant Roman numeral converter with educational rules, history, tattoo preview, and premium clock mode.",
  alternates: {
    canonical: "https://conversionhub.com/roman",
  },
  openGraph: {
    title: "Roman Numerals — Conversion Hub",
    description: "Instant Roman numeral converter with educational rules, history, tattoo preview, and premium clock mode.",
    url: "https://conversionhub.com/roman",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roman Numerals — Conversion Hub",
    description: "Instant Roman numeral converter with educational rules, history, tattoo preview, and premium clock mode.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the maximum number supported by the converter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Conversion Hub supports Roman numerals between 1 and 3999 using standard notation."
      }
    },
    {
      "@type": "Question",
      "name": "Can I convert from Roman numerals back to numbers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Enter valid Roman numerals such as XIV or MMXXV and the converter will display the numeric value instantly."
      }
    },
    {
      "@type": "Question",
      "name": "Does the converter detect invalid numerals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The system validates Roman numerals and alerts when input does not follow standard symbol order or subtraction rules."
      }
    }
  ]
};

export default function RomanLandingPage() {
  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border/70 bg-background/80 p-8 shadow-xl shadow-primary/10">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Roman Numerals</p>
              <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">
                Modern Roman numeral tools for learning, planning, and premium design.
              </h1>
              <p className="text-base leading-8 text-muted-foreground max-w-3xl">
                Conversion Hub brings Roman numeral conversion to the global utility platform with instant two-way conversion, educational rules, year generation, clock previews, and structured SEO pages.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/roman/2025-in-roman-numerals" className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                2025 in Roman
              </Link>
              <Link href="/roman/xiv-meaning" className="rounded-2xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-secondary/90">
                XIV meaning
              </Link>
              <Link href="/world-clock" className="rounded-2xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary">
                View world clock
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-lg shadow-slate-900/5">
            <h2 className="text-xl font-semibold text-foreground">Why Roman numerals matter</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>Standard historical notation for monuments, calendars, and event numbering.</li>
              <li>Ideal for premium design, tattoo concepts, and classic clock faces.</li>
              <li>Fast conversion with built-in validation and live educational context.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_0.9fr]">
        <RomanNumeralConverter />
        <RomanExtras />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  );
}
