"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CurrencyConverter } from "@/components/currency/CurrencyConverter";
import { CryptoConverter } from "@/components/currency/CryptoConverter";
import { Bitcoin, Coins, Shield, Clock, TrendingUp } from "lucide-react";

export default function CryptoPage() {
  const features = [
    {
      icon: Bitcoin,
      title: "Top Cryptocurrencies",
      description: "Convert BTC, ETH, USDT, USDC and other major cryptocurrencies with live rates",
    },
    {
      icon: TrendingUp,
      title: "DeFi Integration",
      description: "Accurate rates from decentralized exchanges and liquidity pools",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "No wallet connection required. All conversions happen in your browser.",
    },
    {
      icon: Clock,
      title: "Real-time Prices",
      description: "Prices updated via CoinGecko and other reliable crypto APIs",
    },
  ];

  const popularConversions = [
    { from: "BTC", to: "USD", flag: "🔶→🇺🇸" },
    { from: "ETH", to: "USD", flag: "🔷→🇺🇸" },
    { from: "USDT", to: "USD", flag: "🔵→🇺🇸" },
    { from: "BTC", to: "EUR", flag: "🔶→🇪🇺" },
    { from: "ETH", to: "EUR", flag: "🔷→🇪🇺" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-b from-muted/50 via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.03),transparent_50%)] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">🪙</span>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-primary bg-clip-text text-transparent">
                Crypto Converter
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Convert Bitcoin, Ethereum, and other cryptocurrencies to fiat currencies. 
              Live prices from DeFi protocols and centralized exchanges.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-6 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                <Bitcoin className="w-4 h-4" />
                BTC, ETH, USDT, USDC
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                🔄 Live Crypto Rates
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CryptoConverter />
          </motion.div>
        </motion.div>
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
              Crypto Conversion Made Easy
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional-grade crypto-to-fiat conversions with institutional data sources.
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
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-orange-500" />
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
              Popular Crypto Conversions
            </h2>
            <p className="text-muted-foreground">
              Quick access to the most commonly converted cryptocurrency pairs
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
            {popularConversions.map((pair, idx) => (
              <Link
                key={`${pair.from}-${pair.to}`}
                href={`/convert/crypto/${pair.from.toLowerCase()}-to-${pair.to.toLowerCase()}`}
                className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200"
              >
                <span className="text-lg font-semibold group-hover:text-orange-500 transition-colors">
                  {pair.from} → {pair.to}
                </span>
                <span className="text-2xl">{pair.flag}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}