import { Metadata } from "next";
import RomanNumeralConverterClient from "./RomanNumeralConverterClient";
import { toRoman, fromRoman, isValidRoman } from "@/lib/roman-numeral";

export const revalidate = 3600; // Revalidate every hour for static generation

export function generateStaticParams() {
  // Generate static params for common Roman numerals
  const commonNumbers = [1, 4, 5, 9, 10, 14, 40, 50, 90, 100, 400, 500, 900, 1000, 1066, 1999, 2025, 2026, 3999];
  return commonNumbers.map(num => ({ value: num.toString() }));
}

export const metadata = async ({ params }: { params: { value: string } }) => {
  const value = params.value;
  let title = "";
  let description = "";
  
  // Check if it's a number
  if (!isNaN(Number(value))) {
    const num = Number(value);
    if (Number.isInteger(num) && num >= 1 && num <= 3999) {
      const roman = toRoman(num);
      title = `${num} in Roman Numerals – ${roman} | Conversion Hub`;
      description = `${num} converted to Roman numerals is ${roman}. Learn about Roman numeral conversion, rules, and history.`;
    } else {
      title = `Invalid Number – Conversion Hub`;
      description = `Please enter a valid integer between 1 and 3999 for Roman numeral conversion.`;
    }
  } 
  // Check if it's a Roman numeral
  else if (isValidRoman(value.toUpperCase())) {
    const num = fromRoman(value.toUpperCase());
    title = `${value.toUpperCase()} Roman Numeral – ${num} | Conversion Hub`;
    description = `Roman numeral ${value.toUpperCase()} converted to number is ${num}. Learn about Roman numeral conversion, rules, and history.`;
  } else {
    title = `Roman Numeral Conversion – Conversion Hub`;
    description = `Convert between numbers and Roman numerals instantly. Supports numbers 1-3999 and standard Roman numerals.`;
  }
  
  return {
    title: title,
    description: description,
    alternates: {
      canonical: `https://conversionhub.com/roman/${value}`
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://conversionhub.com/roman/${value}`,
      type: "website",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&subtitle=Roman+Numeral+Converter`,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [`/api/og?title=${encodeURIComponent(title)}&subtitle=Roman+Numeral+Converter`]
    }
  };
};

export default function RomanValuePage({ params }: { params: { value: string } }) {
  return <RomanNumeralConverterClient initialValue={params.value} />;
}