"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategoryById } from "@/data/conversions";

const popularConversions = [
  { categoryId: "length", fromUnit: "kilometer", toUnit: "mile", label: "km to miles" },
  { categoryId: "weight", fromUnit: "kilogram", toUnit: "pound", label: "kg to lbs" },
  { categoryId: "temperature", fromUnit: "celsius", toUnit: "fahrenheit", label: "°C to °F" },
  { categoryId: "volume", fromUnit: "liter", toUnit: "gallonUS", label: "L to gal" },
  { categoryId: "area", fromUnit: "squareMeter", toUnit: "squareFoot", label: "m² to ft²" },
  { categoryId: "storage", fromUnit: "gigabyte", toUnit: "megabyte", label: "GB to MB" },
  { categoryId: "time", fromUnit: "hour", toUnit: "minute", label: "hrs to mins" },
  { categoryId: "speed", fromUnit: "kilometerPerHour", toUnit: "milePerHour", label: "km/h to mph" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
};

export function PopularConversions() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Popular Conversions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick access to the most commonly used conversion tools
          </p>
        </motion.div>

        {/* Popular conversions grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {popularConversions.map((conv, index) => {
            const category = getCategoryById(conv.categoryId);
            if (!category) return null;

            const fromUnit = category.units[conv.fromUnit];
            const toUnit = category.units[conv.toUnit];

            return (
              <motion.div key={index} variants={itemVariants}>
                <Link
                  href={`/convert/${conv.categoryId}?from=${conv.fromUnit}&to=${conv.toUnit}`}
                  className="group flex flex-col h-full p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
                  prefetch={true}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {category.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between flex-1">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{fromUnit.symbol}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{fromUnit.name}</p>
                    </div>

                    <div className="flex items-center gap-1 px-2">
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    <div className="flex-1 text-right">
                      <p className="text-sm font-medium text-foreground">{toUnit.symbol}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{toUnit.name}</p>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-border/40">
                    <p className="text-[11px] text-primary font-medium group-hover:underline">
                      {conv.label} →
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}