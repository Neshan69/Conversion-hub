"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Search, Globe, Zap, Shield, Clock } from "lucide-react";
import { Converter } from "@/components/converter/Converter";
import { conversionCategories, currencyCategory } from "@/data/conversions";

export function Hero() {
  const stats = [
    { icon: Globe, value: "180+", label: "Currencies" },
    { icon: Zap, value: "8+", label: "Unit Categories" },
    { icon: Clock, value: "Real-time", label: "Rates" },
    { icon: Shield, value: "100%", label: "Free" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Enhanced background with depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/20 to-cyan-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-cyan-950/20" />
      
      {/* Animated blobs with slower, more subtle motion */}
      <motion.div
        animate={{ 
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"
      />

      {/* Grain texture overlay for premium feel (optional subtle noise) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_50%)] pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Badge and Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Exchange Rates
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {["🇺🇸", "🇪🇺", "🇬🇧", "🇯🇵", "🇮🇳", "🇦🇺"].map((flag, i) => (
                <span key={i} className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-xs bg-muted">
                  {flag}
                </span>
              ))}
            </div>
            <span>Trusted by users worldwide</span>
          </div>
        </motion.div>

        {/* Main heading with improved typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-5xl mx-auto text-center mb-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              All-in-One
            </span>
            <br />
            <span className="text-foreground">Conversion Platform</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Precision tools for units, currencies, and more. 
            Fast, accurate, and beautifully designed for professionals.
          </p>
        </motion.div>

        {/* CTA Buttons with better hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="#converter"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-2xl hover:shadow-primary/25 transition-all hover:scale-105 active:scale-95"
          >
            Start Converting
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/currency"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-border bg-background/60 backdrop-blur-sm font-semibold text-lg hover:bg-accent/10 hover:border-primary/30 transition-all"
          >
            <Globe className="w-5 h-5" />
            Currency Converter
          </Link>
        </motion.div>

        {/* Main Converter Card with glassmorphism */}
        <motion.div
          id="converter"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden">
            {/* Glow effect behind converter */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="relative p-1">
              <Converter categoryId="length" />
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-16"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-2">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Quick category links with better styling */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16"
        >
          <p className="text-center text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">
            Popular conversions
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {conversionCategories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/convert/${category.id}`}
                className="group px-5 py-2.5 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 hover:shadow-md"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary flex items-center gap-2">
                  <span className="text-base">{category.icon}</span>
                  {category.name}
                </span>
              </Link>
            ))}
            <Link
              href="/currency"
              className="group px-5 py-2.5 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/15 transition-all duration-200 hover:shadow-md"
            >
              <span className="text-sm font-medium text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-2">
                <span className="text-base">💱</span>
                Currency
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
