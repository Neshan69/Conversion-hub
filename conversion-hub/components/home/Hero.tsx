"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Converter } from "@/components/converter/Converter";
import { conversionCategories } from "@/data/conversions";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center mb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Free & Unlimited Conversions
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              All-in-One
            </span>
            <br />
            <span className="text-foreground">Conversion Platform</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Convert units, currencies, files, and more with precision. Fast, accurate, and 
            beautifully designed tools for everyone.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="#converter"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Start Converting
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-border bg-background/50 backdrop-blur-sm font-semibold text-lg hover:bg-accent/10 transition-all"
            >
              <Search className="w-5 h-5" />
              Explore All Tools
            </Link>
          </motion.div>
        </div>

        {/* Main Converter */}
        <motion.div
          id="converter"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <Converter categoryId="length" />
        </motion.div>

        {/* Quick category links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <p className="text-center text-sm text-muted-foreground mb-6">
            Popular conversions
          </p>
            <div className="flex flex-wrap justify-center gap-3">
              {conversionCategories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/convert/${category.id}`}
                className="group px-5 py-2.5 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary">
                  {category.icon} {category.name}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}