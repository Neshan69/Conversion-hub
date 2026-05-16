"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Converter } from "@/components/converter/Converter";
import { getCategoryById } from "@/data/conversions";
import { RelatedConverters } from "@/components/converter/RelatedConverters";
import { ConversionTable } from "@/components/converter/ConversionTable";
import { ConversionFormula } from "@/components/converter/ConversionFormula";
import { RecentConversionsPanel } from "@/components/converter/RecentConversionsPanel";
import { ConverterStructuredData } from "@/components/seo/ConverterStructuredData";
import { ConversionCategory } from "@/types/converter";
import { ChevronRight } from "lucide-react";

interface UnitConverterPageProps {
  categoryId: string;
  initialFromUnit?: string;
  initialToUnit?: string;
  category?: ConversionCategory | null;
}

export function UnitConverterPage({
  categoryId,
  initialFromUnit,
  initialToUnit,
  category: serverCategory,
}: UnitConverterPageProps) {
  const category = useMemo(() => {
    if (serverCategory) return serverCategory;
    return getCategoryById(categoryId);
  }, [categoryId, serverCategory]);

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Category not found</p>
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-4xl">{category.icon}</span>
              <h1 className="text-3xl md:text-4xl font-bold">
                {category.name} Converter
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {category.description}. Convert between {Object.keys(category.units).length} units with precision.
            </p>
          </motion.div>

          {/* Main converter */}
          <Converter
            key={`${categoryId}:${initialFromUnit || ""}:${initialToUnit || ""}`}
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
          <div className="mt-10">
            <RecentConversionsPanel />
          </div>
        </div>
      </section>

      {/* Conversion Formula Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <ConversionFormula category={category} />
          </div>
        </div>
      </section>

      {/* Conversion Table Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <ConversionTable category={category} />
          </div>
        </div>
      </section>

      {/* Related Converters */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <RelatedConverters currentCategoryId={categoryId} />
          </div>
        </div>
      </section>

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200"
            aria-label="Back to top"
          >
            <ChevronRight className="w-5 h-5 rotate-[-90deg]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
