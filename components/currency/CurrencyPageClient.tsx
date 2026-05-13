"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CurrencyConverter } from "@/components/currency/CurrencyConverter";
import { Globe, TrendingUp, Shield, Clock, BarChart3 } from "lucide-react";

export function CurrencyPageClient() {
  const features = [
    {
      icon: Globe,
      title: "180+ Currencies",
      description: "All major world currencies including USD, EUR, GBP, INR, JPY, CNY, and more",
    },
    {
      icon: TrendingUp,
      title: "Live Exchange Rates",
      description: "Real-time rates from trusted financial APIs, updated continuously",
    },
    {
      icon: Shield,
      title: "100% Free & Accurate",
      description: "No hidden fees, no registration required. Bank-grade accuracy.",
    },
    {
      icon: Clock,
      title: "Historical Charts",
      description: "30-day trend analysis to understand currency movements",
    },
  ];

  const popularConversions = [
    { from: "USD", to: "EUR", flag: "🇺🇸→🇪🇺" },
    { from: "EUR", to: "USD", flag: "🇪🇺→🇺🇸" },
    { from: "USD", to: "INR", flag: "🇺🇸→🇮🇳" },
    { from: "GBP", to: "USD", flag: "🇬🇧→🇺🇸" },
    { from: "USD", to: "GBP", flag: "🇺🇸→🇬🇧" },
    { from: "EUR", to: "GBP", flag: "🇪🇺→🇬🇧" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-b from-muted/50 via-primary/5 to-background overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.06),transparent_50%)] pointer-events-none" />
        
        <motion.div
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/8 rounded-full blur-3xl"
        />
        
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
              Convert instantly with live forex data, historical trends, and offline support.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Live Rates
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                🌍 180+ Currencies
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                📈 Historical Charts
              </div>
            </div>
          </motion.div>

          {/* Main Converter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CurrencyConverter showCharts={true} showHistorical={true} />
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
              Why Choose Our Currency Converter?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for professionals who need accurate, real-time exchange rates with a premium user experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
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
            <p className="text-muted-foreground">
              Quick access to the most commonly used currency pairs
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
            {popularConversions.map((pair, idx) => (
              <Link
                key={`${pair.from}-${pair.to}`}
                href={`/currency/${pair.from.toLowerCase()}/to/${pair.to.toLowerCase()}`}
                className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200"
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

      {/* SEO Content Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                About Currency Conversion
              </h2>
              
              <div className="prose prose-slate dark:prose-invert max-w-none">
                 <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                   Our currency converter provides real-time exchange rates for 180+ world currencies, 
                   using reliable data from multiple trusted financial APIs. Whether you&apos;re traveling, 
                   doing business internationally, or monitoring forex markets, our tool gives you 
                   accurate conversions with historical trend analysis.
                 </p>

                <h3 className="text-xl font-semibold mb-4">Key Features:</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <div>
                      <strong>Live Exchange Rates:</strong> Updated every 15 minutes with automatic refresh
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <div>
                      <strong>180+ Currencies:</strong> Full ISO 4217 support with flags and symbols
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <div>
                      <strong>Historical Charts:</strong> 30-day trend visualization for each currency pair
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <div>
                      <strong>Offline Support:</strong> Cached rates continue working without internet
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <div>
                      <strong>No Registration:</strong> 100% free with no sign-up required
                    </div>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">How to Convert Currency:</h3>
                <ol className="space-y-3 mb-8 list-decimal list-inside">
                  <li>Select your <strong>source currency</strong> (the currency you have)</li>
                  <li>Select your <strong>target currency</strong> (the currency you want)</li>
                  <li>Enter the <strong>amount</strong> you want to convert</li>
                  <li>View instant conversion with live exchange rate</li>
                  <li>Use the <strong>historical chart</strong> to analyze trends</li>
                </ol>

                <p className="text-sm text-muted-foreground border-t border-border pt-6">
                  <strong>Note:</strong> Exchange rates fluctuate constantly throughout the trading day. 
                  Our rates are sourced from multiple reliable financial APIs and cached for 15 minutes 
                  to ensure optimal performance while maintaining accuracy.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

