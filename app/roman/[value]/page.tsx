import { Metadata } from "next";
import RomanNumeralConverter from "@/components/roman/RomanNumeralConverter";
import { fromRoman, isValidRoman, toRoman } from "@/lib/roman-numeral";

const humanizeRoman = (value: string) => value.toUpperCase().replace(/-/g, " ");

export function generateStaticParams() {
  return [
    { value: "2025" },
    { value: "xiv" },
    { value: "2025-in-roman-numerals" },
    { value: "xviii-meaning" },
    { value: "1999-in-roman-numerals" },
    { value: "mmxxiv" },
  ];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: { value: string } }): Promise<Metadata> {
  const value = params.value.trim();
  const lower = value.toLowerCase();
  let title = "Roman Numeral Conversion — Conversion Hub";
  let description = "Convert between numbers and Roman numerals instantly. Supports numbers 1-3999.";

  if (/^\d+$/.test(lower)) {
    const num = Number(lower);
    if (Number.isInteger(num) && num >= 1 && num <= 3999) {
      const roman = toRoman(num);
      title = `${num} in Roman Numerals — ${roman} | Conversion Hub`;
      description = `${num} converted to Roman numerals is ${roman}. Learn Roman numeral rules, subtraction logic, and historical uses.`;
    } else {
      title = `Invalid Roman Conversion — Conversion Hub`;
      description = `Please enter an integer between 1 and 3999 for Roman numeral conversion.`;
    }
  } else if (/^[ivxlcdm]+$/.test(lower) && isValidRoman(lower.toUpperCase())) {
    const num = fromRoman(lower.toUpperCase());
    title = `${lower.toUpperCase()} Roman Numeral — ${num} | Conversion Hub`;
    description = `${lower.toUpperCase()} converts to ${num}. Learn Roman numeral validation, meaning, and modern uses.`;
  } else if (/^(\d+)-in-roman-numerals$/.test(lower)) {
    const match = lower.match(/^(\d+)-in-roman-numerals$/);
    if (match) {
      const num = Number(match[1]);
      const roman = Number.isInteger(num) && num >= 1 && num <= 3999 ? toRoman(num) : "invalid";
      title = roman !== "invalid" ? `${num} in Roman Numerals — ${roman} | Conversion Hub` : `Invalid Roman Conversion — Conversion Hub`;
      description = roman !== "invalid" ? `Discover how ${num} becomes ${roman} in Roman numerals with rules and examples.` : `Enter a valid integer between 1 and 3999.`;
    }
  } else if (/^[ivxlcdm]+-meaning$/.test(lower)) {
    const match = lower.match(/^([ivxlcdm]+)-meaning$/);
    if (match) {
      const roman = match[1].toUpperCase();
      if (isValidRoman(roman)) {
        const num = fromRoman(roman);
        title = `${roman} Meaning — ${num} | Conversion Hub`;
        description = `Learn the meaning of Roman numeral ${roman} and how it converts to the number ${num}.`;
      } else {
        title = `Invalid Roman Numeral — Conversion Hub`;
        description = `Check the Roman numeral format and try again.`;
      }
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: `https://conversionhub.com/roman/${value}`,
    },
    openGraph: {
      title,
      description,
      url: `https://conversionhub.com/roman/${value}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function RomanValuePage({ params }: { params: { value: string } }) {
  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-primary">Roman numeral deep link</p>
        <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">Roman conversion for {humanizeRoman(params.value)}</h1>
        <p className="max-w-3xl mx-auto text-sm leading-7 text-muted-foreground">
          Explore Roman numeral conversion with live validation, educational meaning, and fast sharing. Use the converter below to refine the result.
        </p>
      </div>
      <RomanNumeralConverter initialValue={params.value} />
    </section>
  );
}
