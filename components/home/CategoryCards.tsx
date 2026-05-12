"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { conversionCategories, currencyCategory } from "@/data/conversions";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export function CategoryCards() {
  // Combine standard conversion categories with currency as a special category
  const allCategories = [...conversionCategories, currencyCategory];

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Conversion Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive suite of conversion tools designed for accuracy and ease of use
          </p>
        </motion.div>

        {/* Category grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {allCategories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                href={category.id === "currency" ? "/currency" : `/convert/${category.id}`}
                className="group block h-full"
              >
                <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 group">
                  {/* Icon and color accent */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                    {category.id === "currency" && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full font-normal">
                        NEW
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>

                  {/* Unit count */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-1 rounded-lg bg-muted">
                      {category.id === "currency" ? "180+ currencies" : `${Object.keys(category.units).length} units`}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* More categories CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/convert"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary font-semibold hover:bg-primary/20 transition-all"
          >
            View All Converters
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}