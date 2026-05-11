"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ConversionCategory } from "@/types/converter";

interface CategoryGridProps {
  categories: ConversionCategory[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  // Group by category types if needed or just display all
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {categories.map((category) => (
        <motion.div key={category.id} variants={itemVariants}>
          <Link
            href={`/convert/${category.id}`}
            className="group block h-full"
          >
            <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {category.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {category.description}
              </p>

              {/* Unit count and common conversions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                  {Object.keys(category.units).length} units
                </span>
                <span className="text-xs text-primary font-medium group-hover:underline flex items-center gap-1">
                  Open converter
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}