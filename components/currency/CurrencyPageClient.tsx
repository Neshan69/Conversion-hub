"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Clock, BarChart3, Brain } from "lucide-react";
import { CurrencyConverter } from "@/components/currency/CurrencyConverter";
import { LearningPanel } from "@/components/currency/LearningPanel";

export function CurrencyPageClient() {
  const features = [
    { title: "180+ Currencies", description: "All major world currencies with ISO 4217 standard support" },
    { title: "Live Exchange Rates", description: "Real-time rates from trusted financial APIs, updated every 15 minutes" },
    { title: "100% Free & Accurate", description: "No hidden fees, no registration required. Bank-grade accuracy." },
    { title: "AI-Powered Insights", description: "Understand why currencies move with intelligent analysis" },
  ];

  const popularConversions = [
    { from: "USD", to: "EUR", flag: "🇺🇸→🇪🇺" },
    { from: "EUR", to: "USD", flag: "🇪🇺→🇺🇸" },
    { from: "USD", to: "INR", flag: "🇺🇸→🇮🇳" },
    { from: "GBP", to: "USD", flag: "🇬🇧→🇺🇸" },
    { from: "USD", to: "GBP", flag: "🇺🇸→🇬🇧" },
    { from: "EUR", to: "GBP", flag: "🇪🇺→🇬🇧" },
    { from: "USD", to: "JPY", flag: "🇺🇸→🇯🇵" },
    { from: "CNY", to: "USD", flag: "🇨🇳→🇺🇸" },
  ];

  const handleStartConverting = () => {
    const converterEl = document.getElementById("main-converter");
    if (converterEl) {
      converterEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-b from-muted/50 via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.06),transparent_50%)] pointer-events-none" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">💱</span>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Global Currency Converter
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Real-time exchange rates for 180+ world currencies.
              Convert instantly with live forex data, historical trends, and AI-powered insights.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Live Rates
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                🌍 180+ Currencies
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                📈 Historical Charts
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                🤖 AI Insights
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            id="main-converter"
          >
            <CurrencyConverter showCharts={true} showHistorical={true} showInsights={true} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <LearningPanel fromCurrency="USD" toCurrency="EUR" amount="1" />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Why Choose Conversion Hub?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with intelligent features to help you make informed financial decisions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {idx === 0 && <span className="text-xl">🌍</span>}
                  {idx === 1 && <TrendingUp className="w-6 h-6 text-primary" />}
                  {idx === 2 && <Shield className="w-6 h-6 text-primary" />}
                  {idx === 3 && <Brain className="w-6 h-6 text-primary" />}
                </div>
                <h3 className="font-semibold mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Conversions */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Popular Currency Conversions
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularConversions.map((pair) => (
              <Link
                key={`${pair.from}-${pair.to}`}
                href={`/currency/${pair.from.toLowerCase()}/to/${pair.to.toLowerCase()}`}
                className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200"
                prefetch={true}
              >
                <span className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {pair.from} → {pair.to}
                </span>
                <span className="text-2xl">{pair.flag}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto prose prose-slate dark:prose-invert max-w-none"
          >
            <h2>About Currency Conversion</h2>
            <p>
              Our currency converter provides real-time exchange rates for 180+ world currencies,
              using reliable data from multiple trusted financial APIs. Whether you&apos;re traveling,
              doing business internationally, or monitoring forex markets, our tools provide
              accurate conversions with historical analysis and AI-powered market insights.
            </p>

            <h3>Key Features:</h3>
            <ul>
              <li>Live rates updated every 15 minutes with automatic refresh</li>
              <li>180+ currencies with full ISO 4217 support, flags and symbols</li>
              <li>30-day interactive historical charts and trend analysis</li>
              <li>AI Currency Insights explaining market movements</li>
              <li>Offline support with locally cached rates</li>
              <li>Completely free with no registration required</li>
            </ul>

            <h3>How to Convert Currency:</h3>
            <ol>
              <li>Select your <strong>source currency</strong></li>
              <li>Select your <strong>target currency</strong></li>
              <li>Enter the <strong>amount</strong> to convert</li>
              <li>View instant conversion with live rates</li>
              <li>Check <strong>AI Insights</strong> for market context</li>
              <li>Use the <strong>historical chart</strong> to analyze trends</li>
            </ol>

            <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground mt-8">
              <strong>Disclaimer:</strong> Exchange rates fluctuate constantly. Rates are sourced from
              multiple reliable financial APIs and cached for 15 minutes. AI insights are generated
              based on known economic factors and should not be considered financial advice.
              Always verify rates before making financial decisions.
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}