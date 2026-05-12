import { Metadata } from "next";
import { conversionCategories, currencyCategory } from "@/data/conversions";
import { CategoryGrid } from "@/components/converter/CategoryGrid";

export const metadata: Metadata = {
  title: "All Converters – Unit, Currency, File & Data Converters",
  description: "Browse all conversion tools. Unit converters, currency converters, file converters, and more. Fast, accurate, and completely free.",
  keywords: [...conversionCategories.map(c => c.name.toLowerCase()), "currency", "converters", "online tools"].join(", "),
  openGraph: {
    title: "All Converters – Conversion Hub",
    description: "All conversion tools in one place",
    url: "https://conversionhub.com/convert",
    type: "website",
  },
  alternates: {
    canonical: "https://conversionhub.com/convert",
  },
};

export default function ConvertPage() {
  // Combine standard categories with currency
  const allCategories = [...conversionCategories, currencyCategory];

  return (
    <div className="min-h-screen">
      <section className="py-12 md:py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              All Converters
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Choose from our comprehensive suite of conversion tools designed for accuracy and ease of use.
            </p>
          </div>

          <div className="mt-12">
            <CategoryGrid categories={allCategories} />
          </div>
        </div>
      </section>
    </div>
  );
}