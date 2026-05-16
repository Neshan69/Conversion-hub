"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { conversionCategories, currencyCategory } from "@/data/conversions";

export function CategoryGrid({ categories }: { categories: typeof conversionCategories }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      {categories.map((category) => (
        <motion.div key={category.id} variants={itemVariants}>
          <Link
            href={`/unit/${category.id}`}
            prefetch={true}
            className="group w-full h-full text-left p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/15 hover:-translate-y-1.5 transition-all duration-250 active:scale-[0.98]"
            style={{ touchAction: "manipulation" }}
            aria-label={`Navigate to ${category.name} converter`}
          >
            {/* Icon */}
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-250 shadow-lg`}>
              {category.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-1.5 group-hover:text-primary transition-colors flex items-center gap-2">
              {category.name}
              {category.id === "currency" && (
                <span className="ml-1 text-[10px] px-2 py-0.5 bg-gradient-to-r from-primary/20 to-accent/20 text-primary rounded-full font-normal border border-primary/10">
                  NEW
                </span>
              )}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {category.description}
            </p>

            {/* Unit count with icon */}
            <div className="flex items-center justify-between pt-3 border-t border-border/30">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                {category.id === "currency" ? "🌍 180+ currencies" : `${Object.keys(category.units).length} units`}
              </span>
              <span className="text-[11px] text-primary font-medium group-hover:underline flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Open
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}