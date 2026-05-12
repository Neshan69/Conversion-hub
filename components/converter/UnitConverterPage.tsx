"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Converter } from "@/components/converter/Converter";
import { getCategoryById } from "@/data/conversions";
import { RelatedConverters } from "@/components/converter/RelatedConverters";
import { ConversionTable } from "@/components/converter/ConversionTable";
import { ConversionFormula } from "@/components/converter/ConversionFormula";
import { RecentConversionsPanel } from "@/components/converter/RecentConversionsPanel";
import { ConverterStructuredData } from "@/components/seo/ConverterStructuredData";
import { ConversionCategory } from "@/types/converter";

interface UnitConverterPageProps {
  categoryId: string;
  initialFromUnit?: string;
  initialToUnit?: string;
  // Pre-fetched category from server (optional, for SSR/SSG)
  category?: ConversionCategory | null;
}

export function UnitConverterPage({ 
  categoryId, 
  initialFromUnit,
  initialToUnit,
  category: serverCategory
}: UnitConverterPageProps) {
  // Use server-provided category if available, otherwise fetch on client
  const category = useMemo(() => {
    if (serverCategory) return serverCategory;
    return getCategoryById(categoryId);
  }, [categoryId, serverCategory]);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-muted-foreground">
          The requested conversion category does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero/Converter section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">{category.icon}</span>
              <h1 className="text-3xl md:text-4xl font-bold">
                {category.name} Converter
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {category.description}. Convert between {Object.keys(category.units).join(", ")} with precision.
            </p>
          </motion.div>

          {/* Main converter */}
          <Converter 
            categoryId={categoryId} 
            initialFromUnit={initialFromUnit}
            initialToUnit={initialToUnit}
          />

          {/* Structured data for SEO */}
          <ConverterStructuredData 
            categoryId={categoryId}
            initialFromUnit={initialFromUnit}
            initialToUnit={initialToUnit}
          />

          {/* Recent Conversions */}
          <div className="mt-8">
            <RecentConversionsPanel />
          </div>
        </div>
      </section>

      {/* Conversion Formula Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <ConversionFormula category={category} />
          </div>
        </div>
      </section>

      {/* Conversion Table Section */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <ConversionTable category={category} />
          </div>
        </div>
      </section>

      {/* Related Converters */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RelatedConverters currentCategoryId={categoryId} />
        </div>
      </section>
    </div>
  );
}
