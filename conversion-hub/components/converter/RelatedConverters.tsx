"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { conversionCategories } from "@/data/conversions";

interface RelatedConvertersProps {
  currentCategoryId: string;
}

export const RelatedConverters = memo(function RelatedConverters({ currentCategoryId }: RelatedConvertersProps) {
  const relatedCategories = useMemo(() => {
    return conversionCategories
      .filter(cat => cat.id !== currentCategoryId)
      .slice(0, 4);
  }, [currentCategoryId]);

  const currentCategory = useMemo(() => {
    return conversionCategories.find(cat => cat.id === currentCategoryId);
  }, [currentCategoryId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Other Converters
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our other conversion tools
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {relatedCategories.map((category) => (
          <motion.div key={category.id} variants={itemVariants}>
            <Link
              href={`/convert/${category.id}`}
              className="group flex flex-col h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {category.description}
              </p>

              <div className="mt-auto flex items-center gap-2 text-sm text-primary font-medium group-hover:underline">
                Try it
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Breadcrumb navigation for SEO */}
      {currentCategory && (
        <nav className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/convert" className="hover:text-primary transition-colors">Converters</Link>
          <span>/</span>
          <Link 
            href={`/convert/${currentCategory.id}`} 
            className="hover:text-primary transition-colors"
          >
            {currentCategory.name}
          </Link>
        </nav>
      )}
    </div>
  );
});