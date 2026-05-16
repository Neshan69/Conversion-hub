"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Calendar, Zap, ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { getCurrencyByCode } from "@/types/currency";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { useHistoricalRates } from "@/lib/currency-utils";

interface HistoricalDataPoint {
  date: string;
  rate: number;
}

interface SimulatedResult {
  fromAmount: number;
  historicalRate: number;
  currentRate: number;
  historicalValue: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

interface HistoricalChartProps {
  fromCurrency: string;
  toCurrency: string;
  days?: 7 | 30 | 90 | 180 | 365;
}

export function HistoricalChart({ fromCurrency, toCurrency, days = 30 }: HistoricalChartProps) {
  const [period, setPeriod] = useState<7 | 30 | 90 | 180 | 365>(days);
  const { data, loading } = useHistoricalRates(fromCurrency, toCurrency, period);
  const fromInfo = getCurrencyByCode(fromCurrency);
  const toInfo = getCurrencyByCode(toCurrency);

  const stats = useMemo(() => {
    if (!data || data.length < 2) return null;
    const rates = data.map(d => d.rate);
    const high = Math.max(...rates);
    const low = Math.min(...rates);
    const current = rates[rates.length - 1];
    const previous = rates[0];
    const change = ((current - previous) / previous) * 100;

    return { high, low, current, previous, change };
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Historical Rates: {fromCurrency} → {toCurrency}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {fromInfo?.name} to {toInfo?.name} over the selected period
          </p>
        </div>
        <div className="flex gap-1">
          {([7, 30, 90, 180, 365] as const).map((d) => (
            <button
              key={d}
              onClick={() => setPeriod(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === d
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              {d === 7 ? "1W" : d === 30 ? "1M" : d === 90 ? "3M" : d === 180 ? "6M" : "1Y"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-3 bg-muted/50 rounded-xl">
          <div className="text-center">
            <p className="text-[11px] text-muted-foreground">High</p>
            <p className="text-sm font-semibold text-green-600">{toInfo?.symbol}{stats.high.toFixed(4)}</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-muted-foreground">Low</p>
            <p className="text-sm font-semibold text-red-600">{toInfo?.symbol}{stats.low.toFixed(4)}</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-muted-foreground">Current</p>
            <p className="text-sm font-semibold">{toInfo?.symbol}{stats.current.toFixed(4)}</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-muted-foreground">Change</p>
            <p className={`text-sm font-semibold ${stats.change >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.change >= 0 ? "+" : ""}{stats.change.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="h-56 px-2">
          {data && data.length > 0 ? (
            <SparklineChart data={data} height={224} color="hsl(var(--primary))" strokeWidth={1.5} />
          ) : (
            <p className="text-center text-muted-foreground h-full flex items-center justify-center">
              No historical data available
            </p>
          )}
        </div>
      )}

      <div className="mt-3 text-[11px] text-muted-foreground text-center">
        Source: Exchange rate APIs • Rates cached for 15 minutes
      </div>
    </motion.div>
  );
}

/* ── "What If" Simulator ─────────────────────────────── */

interface WhatIfResult {
  originalAmount: number;
  originalCurrency: string;
  targetCurrency: string;
  historicalRate: number;
  historicalDate: string;
  currentRate: number;
  historicalValue: number;
  currentValue: number;
  difference: number;
  differencePercent: number;
  verdict: string;
}

export function WhatIfSimulator({ fromCurrency, toCurrency }: { fromCurrency: string; toCurrency: string }) {
  const [amount, setAmount] = useState<string>("100");
  const [targetDate, setTargetDate] = useState<string>("");
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const fromInfo = getCurrencyByCode(fromCurrency);
  const toInfo = getCurrencyByCode(toCurrency);

  const { data: historicalData } = useHistoricalRates(fromCurrency, toCurrency, 365);

  useEffect(() => {
    // Default to 1 year ago
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    Promise.resolve().then(() => setTargetDate(oneYearAgo.toISOString().split("T")[0]));
  }, []);

  const simulate = useCallback(() => {
    if (!historicalData || historicalData.length === 0 || !targetDate) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    // Find closest historical rate
    const closest = historicalData.reduce((prev, curr) => {
      const prevDiff = Math.abs(new Date(prev.date).getTime() - new Date(targetDate).getTime());
      const currDiff = Math.abs(new Date(curr.date).getTime() - new Date(targetDate).getTime());
      return currDiff < prevDiff ? curr : prev;
    });

    const currentRate = historicalData[historicalData.length - 1]?.rate || closest.rate;

    const historicalValue = parsedAmount * closest.rate;
    const currentValue = parsedAmount * currentRate;
    const difference = currentValue - historicalValue;
    const differencePercent = ((difference / historicalValue) * 100);

    let verdict = "";
    if (differencePercent > 5) {
      verdict = `Great news! Converting now is ${differencePercent > 15 ? "much" : ""} better than ${targetDate}.`;
    } else if (differencePercent < -5) {
      verdict = `You would have gotten a better rate on ${targetDate}. Consider timing your conversions.`;
    } else {
      verdict = `The rate is similar to ${targetDate}. Timing has minimal impact right now.`;
    }

    setResult({
      originalAmount: parsedAmount,
      originalCurrency: fromCurrency,
      targetCurrency: toCurrency,
      historicalRate: closest.rate,
      historicalDate: closest.date,
      currentRate,
      historicalValue,
      currentValue,
      difference,
      differencePercent,
      verdict,
    });

    setShowResult(true);
  }, [amount, targetDate, historicalData, fromCurrency, toCurrency]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 mt-4"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" />
        &quot;What If&quot; Converter Simulator
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        See how a conversion from the past compares to today&apos;s rate. Great for understanding currency trends!
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Amount ({fromCurrency})</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any"
            className="w-full px-4 py-2.5 rounded-xl bg-background border-2 border-border text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Compare to date</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-2.5 rounded-xl bg-background border-2 border-border text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>

        <motion.button
          onClick={simulate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium hover:shadow-lg transition-all"
        >
          Compare Rates
        </motion.button>

        <AnimatePresence>
          {showResult && result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-muted/50 border border-border space-y-3"
            >
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-[11px] text-muted-foreground">Rate on {result.historicalDate}</p>
                  <p className="text-lg font-bold">{toInfo?.symbol}{result.historicalRate.toFixed(4)}</p>
                  <p className="text-[11px] text-muted-foreground">→ {toInfo?.symbol}{result.historicalValue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Current Rate</p>
                  <p className="text-lg font-bold text-primary">{toInfo?.symbol}{result.currentRate.toFixed(4)}</p>
                  <p className="text-[11px] text-muted-foreground">→ {toInfo?.symbol}{result.currentValue.toFixed(2)}</p>
                </div>
              </div>

              <div className={`p-3 rounded-xl text-center text-sm font-medium ${
                result.difference >= 0
                  ? "bg-green-500/10 border border-green-500/20 text-green-700"
                  : "bg-red-500/10 border border-red-500/20 text-red-700"
              }`}>
                <ArrowRight className="w-4 h-4 inline mr-1" />
                {result.difference >= 0 ? "+" : ""}{toInfo?.symbol}{result.difference.toFixed(2)} ({result.differencePercent >= 0 ? "+" : ""}{result.differencePercent.toFixed(2)}%)
              </div>

              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                <Info className="w-4 h-4 inline mr-1" />
                {result.verdict}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── Timeline History ───────────────────────────────── */

const CURRENCY_HISTORY: Record<string, Array<{ year: string; event: string; rate?: string }>> = {
  USD: [
    { year: "1792", event: "US Dollar established by the Coinage Act" },
    { year: "1944", event: "Bretton Woods Agreement makes USD the world reserve currency", rate: "$1 = 1/35 oz gold" },
    { year: "1971", event: "Nixon ends gold standard, USD becomes fiat currency" },
    { year: "1999", event: "Euro introduced, first major challenge to USD dominance" },
    { year: "2008", event: "Global financial crisis, USD strengthens as safe haven" },
    { year: "2020", event: "COVID-19 pandemic triggers massive USD money printing" },
    { year: "2022-24", event: "Aggressive Fed rate hikes to combat inflation", rate: "Fed Funds: 5.25-5.50%" },
  ],
  EUR: [
    { year: "1999", event: "Euro introduced as electronic currency" },
    { year: "2002", event: "Euro banknotes and coins enter circulation" },
    { year: "2010", event: "European debt crisis weakens EUR significantly" },
    { year: "2015", event: "ECB launches quantitative easing program" },
    { year: "2022", event: "Energy crisis and rapid rate hikes by ECB" },
  ],
  JPY: [
    { year: "1871", event: "Yen introduced during Meiji Restoration" },
    { year: "1945", event: "Post-WWII, yen fixed at ¥360 per USD" },
    { year: "1971", event: "Nixon shock, yen floats freely" },
    { year: "1985", event: "Plaza Accord, yen appreciates dramatically" },
    { year: "1990s", event: "Lost decade, prolonged deflation and low rates" },
    { year: "2024", event: "BOJ exits negative interest rate policy" },
  ],
  INR: [
    { year: "1947", event: "Indian Rupee introduced at parity with GBP" },
    { year: "1966", event: "First major devaluation, ₹1 = $0.63" },
    { year: "1991", event: "Balance of payments crisis, major liberalization" },
    { year: "2000s", event: "IT boom drives sustained appreciation" },
    { year: "2013", event: "Taper tantrum causes sharp depreciation" },
    { year: "2020s", event: "₹80+ per USD, reflecting growth and inflation" },
  ],
};

export function CurrencyTimeline({ currencyCode }: { currencyCode: string }) {
  const [expanded, setExpanded] = useState(false);
  const history = CURRENCY_HISTORY[currencyCode];
  const info = getCurrencyByCode(currencyCode);

  if (!history || !info) return null;

  const visibleItems = expanded ? history : history.slice(-3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 mt-4"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        {info.flag} {info.name} ({currencyCode}) — History
      </h3>

      <div className="space-y-3 relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border/50" />

        {visibleItems.map((item, i) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="relative pl-8"
          >
            <div className="absolute left-[-15px] top-1.5 w-3 h-3 rounded-full bg-primary/60 border-2 border-background shadow-sm" />
            <div className={`p-3 rounded-xl border ${
              i % 2 === 0
                ? "bg-muted/50 border-border/50"
                : "bg-primary/5 border-primary/10"
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary">{item.year}</span>
                {item.rate && (
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                    {item.rate}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.event}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? "Show Less" : `Show All ${history.length} Events`}
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
    </motion.div>
  );
}

/* ── Historical Chart Page ──────────────────────────── */

export function HistoricalRatePage({ fromCurrency, toCurrency }: { fromCurrency: string; toCurrency: string }) {
  const fromInfo = getCurrencyByCode(fromCurrency);
  const toInfo = getCurrencyByCode(toCurrency);

  return (
    <div className="min-h-screen">
      <nav className="bg-muted/30 border-b border-border py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/currency" className="hover:text-primary transition-colors">Currency</Link></li>
            <li>/</li>
            <li className="font-medium text-foreground">
              {fromCurrency} → {toCurrency} History
            </li>
          </ol>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">{fromInfo?.flag}</span>
            <span className="text-2xl text-muted-foreground">→</span>
            <span className="text-4xl">{toInfo?.flag}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {fromCurrency} to {toCurrency} Historical Rates
          </h1>
          <p className="text-muted-foreground">
            Explore the exchange rate history between {fromInfo?.name} and {toInfo?.name}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <HistoricalChart fromCurrency={fromCurrency} toCurrency={toCurrency} days={30} />
            <WhatIfSimulator fromCurrency={fromCurrency} toCurrency={toCurrency} />
          </div>
          <div className="space-y-6">
            <CurrencyTimeline currencyCode={fromCurrency} />
            <CurrencyTimeline currencyCode={toCurrency} />
          </div>
        </div>

        {/* Educational content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
            <Info className="w-5 h-5" />
            Understanding Currency Rate History
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Exchange rates fluctuate constantly due to a complex interplay of economic factors.
            By studying historical trends, you can gain insights into currency strength,
            seasonal patterns, and the impact of major economic events.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li><strong>Interest Rates:</strong> Higher rates typically strengthen a currency</li>
            <li><strong>Inflation:</strong> Lower inflation supports currency value</li>
            <li><strong>Trade Balance:</strong> Export surplus strengthens currency</li>
            <li><strong>Political Stability:</strong> Investors prefer stable governance</li>
            <li><strong>Market Sentiment:</strong> Risk appetite drives funding flows</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
