"use client";

import { motion } from "framer-motion";
import { CurrencyConverter } from "@/components/currency/CurrencyConverter";

export function CurrencyPageClient() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">💱</span>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Global Currency Converter
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Real-time exchange rates for 180+ world currencies. Convert instantly with live forex data, 
              historical trends, and offline support.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold">
                🌍 180+ Currencies
              </div>
              <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold">
                ⚡ Live Rates
              </div>
              <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold">
                📈 Historical Charts
              </div>
            </div>
          </motion.div>

          {/* Main Converter */}
          <CurrencyConverter showCharts={true} showHistorical={true} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Why Choose Our Currency Converter?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="font-semibold mb-2">Reliable Data</h3>
                <p className="text-sm text-muted-foreground">
                  Aggregated from multiple trusted financial APIs for accuracy
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Cached rates for instant conversion, even offline
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold mb-2">Historical Insights</h3>
                <p className="text-sm text-muted-foreground">
                  30-day trends to help you understand currency movements
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
