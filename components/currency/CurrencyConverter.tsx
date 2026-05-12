"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CurrencySelect } from "@/components/currency/CurrencySelect";
import {
  useLiveRates,
  useCurrencyConverter,
  useHistoricalRates,
  formatCurrency,
  getExchangeRate,
  addRecentCurrency,
  getFavoriteCurrencies,
  toggleFavoriteCurrency
} from "@/lib/currency-utils";
import { RefreshCw, Copy, Star, Share2, TrendingUp, Clock, BarChart3 } from "lucide-react";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { getCurrencyByCode } from "@/types/currency";

interface CurrencyConverterProps {
  initialFrom?: string;
  initialTo?: string;
  initialAmount?: string;
  showCharts?: boolean;
  showHistorical?: boolean;
  compact?: boolean;
}

export function CurrencyConverter({
  initialFrom,
  initialTo,
  initialAmount = "1",
  showCharts = true,
  showHistorical = true,
  compact = false,
}: CurrencyConverterProps) {
  // Auto-detect local currency
  const [baseFrom] = useState(() => initialFrom || detectLocalCurrency());
  const [baseTo] = useState(() => initialTo || "USD");

  // Fetch live rates
  const { rates, loading, error, refresh, isStale } = useLiveRates(baseFrom);

  // Converter state
  const {
    amount,
    setAmount,
    fromCurrency,
    toCurrency,
    setFrom,
    setTo,
    convertedAmount,
    swapCurrencies,
    numericAmount,
  } = useCurrencyConverter(baseFrom, rates, initialTo);

  // Initialize from props
  useEffect(() => {
    if (initialFrom) setFrom(initialFrom);
    if (initialTo) setTo(initialTo);
    if (initialAmount) setAmount(initialAmount);
  }, []);

  // Add to recent when currency pair changes
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      addRecentCurrency(fromCurrency);
      addRecentCurrency(toCurrency);
    }
  }, [fromCurrency, toCurrency]);

  // Get exchange rate for display
  const rate = useMemo(() => {
    if (!rates) return null;
    try {
      return getExchangeRate(fromCurrency, toCurrency, rates);
    } catch {
      return null;
    }
  }, [rates, fromCurrency, toCurrency]);

  // Get historical data
  const { data: historicalData, loading: historicalLoading } = useHistoricalRates(
    fromCurrency,
    toCurrency,
    30
  );

  // Formatting
  const convertedFormatted = useMemo(() => {
    if (convertedAmount === null) return "";
    return formatCurrency(convertedAmount, toCurrency);
  }, [convertedAmount, toCurrency]);

  const rateFormatted = useMemo(() => {
    if (!rate) return "";
    return formatCurrency(rate, toCurrency, { style: "decimal", minimumFractionDigits: 4, maximumFractionDigits: 6 });
  }, [rate, toCurrency]);

  // Actions
  const handleCopy = useCallback(async () => {
    const text = `${amount} ${fromCurrency} = ${convertedFormatted}`;
    await navigator.clipboard.writeText(text);
  }, [amount, fromCurrency, convertedFormatted]);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/currency/${fromCurrency}-to-${toCurrency}?amount=${amount}`;
    await navigator.share?.({
      title: `Convert ${fromCurrency} to ${toCurrency}`,
      text: `${amount} ${fromCurrency} = ${convertedFormatted}`,
      url,
    });
  }, [amount, fromCurrency, toCurrency, convertedFormatted]);

  const handleSwap = useCallback(() => {
    swapCurrencies();
    // Also swap the base currency for rate fetching
    setFrom(toCurrency);
    setTo(fromCurrency);
  }, [swapCurrencies, fromCurrency, toCurrency, setFrom, setTo]);

  // Favorites
  const [favorites, setFavorites] = useState(() => getFavoriteCurrencies());
  const isFromFavorite = favorites.includes(fromCurrency);
  const isToFavorite = favorites.includes(toCurrency);

  const toggleFromFavorite = useCallback(() => {
    const newFav = toggleFavoriteCurrency(fromCurrency);
    setFavorites(getFavoriteCurrencies());
  }, [fromCurrency]);

  const toggleToFavorite = useCallback(() => {
    const newFav = toggleFavoriteCurrency(toCurrency);
    setFavorites(getFavoriteCurrencies());
  }, [toCurrency]);

  // Loading state
  if (loading && !rates) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading exchange rates...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !rates) {
    return (
      <div className="p-6 rounded-xl border border-border bg-destructive/5 text-destructive">
        <p className="font-medium mb-2">Unable to load exchange rates</p>
        <p className="text-sm opacity-80 mb-4">{error}</p>
        <button
          onClick={() => refresh()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`currency-converter ${compact ? "compact" : ""}`}>
      {/* Converter Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 shadow-lg"
      >
        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-2xl font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            min="0"
            step="any"
            autoFocus
          />
        </div>

        {/* Currency Selectors Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              From
            </label>
            <div className="relative">
              <CurrencySelect
                value={fromCurrency}
                onChange={setFrom}
                showRecent={true}
                showFavorites={true}
                showPopular={true}
              />
              {isFromFavorite && (
                <button
                  onClick={toggleFromFavorite}
                  className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:text-amber-500 transition-colors"
                  title="Remove from favorites"
                >
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </button>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-end">
            <button
              onClick={handleSwap}
              className="w-full py-3 rounded-xl border-2 border-border bg-background hover:bg-accent/10 hover:border-primary transition-all group"
              title="Swap currencies"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-medium">Swap</span>
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </button>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              To
            </label>
            <div className="relative">
              <CurrencySelect
                value={toCurrency}
                onChange={setTo}
                exclude={[fromCurrency]}
                showRecent={true}
                showFavorites={true}
                showPopular={true}
              />
              {isToFavorite && (
                <button
                  onClick={toggleToFavorite}
                  className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:text-amber-500 transition-colors"
                  title="Remove from favorites"
                >
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </button>
              )}
            </div>
          </div>

          {/* Favorite toggle */}
          <div className="flex items-end">
            <button
              onClick={toggleToFavorite}
              className={`w-full py-3 rounded-xl border-2 transition-all ${
                isToFavorite
                  ? "bg-amber-500/10 border-amber-500 text-amber-600"
                  : "bg-background border-border hover:bg-accent/10 hover:border-primary"
              }`}
              title={isToFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`w-5 h-5 mx-auto ${isToFavorite ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Result Display */}
        <motion.div
          key={convertedAmount}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 mb-6"
        >
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              {amount} {fromCurrency} =
            </div>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {convertedFormatted}
            </div>
            
            {/* Exchange rate */}
            {rate && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span>
                  1 {fromCurrency} = {rateFormatted} {toCurrency}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 font-medium transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 font-medium transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={() => refresh()}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => window.location.href = `/currency/${fromCurrency}-to-${toCurrency}`}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Details
          </button>
        </div>

        {/* Stale warning */}
        {isStale && !loading && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 text-sm">
            <Clock className="w-4 h-4 inline mr-2" />
            Rates may be outdated. Click Refresh for latest.
          </div>
        )}
      </motion.div>

      {/* Historical Chart */}
      {showHistorical && !compact && historicalData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            30-Day Trend: {fromCurrency} → {toCurrency}
          </h3>
          
          {historicalLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="h-64 px-2">
              <SparklineChart 
                data={historicalData} 
                height={250}
                color="hsl(var(--primary))"
              />
            </div>
          )}
        </motion.div>
      )}

      {compact && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Click "Details" for historical data and trends
        </div>
      )}
    </div>
  );
}

// Helper: Detect user's local currency
function detectLocalCurrency(): string {
  // Check if user has manually set preference (client-only)
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("conversion-hub-preferred-currency");
    if (saved && getCurrencyByCode(saved)) {
      return saved;
    }
  }

  // Try to detect from browser language (client-only)
  if (typeof navigator !== "undefined") {
    const lang = navigator.language || "en-US";
    const country = lang.split("-")[1]?.toUpperCase();
    const currencyMap: Record<string, string> = {
      US: "USD", GB: "GBP", DE: "EUR", FR: "EUR", IT: "EUR",
      ES: "EUR", JP: "JPY", AU: "AUD", CA: "CAD", CH: "CHF",
      CN: "CNY", IN: "INR", PK: "PKR", NP: "NPR", BD: "BDT",
      SA: "SAR", AE: "AED", TH: "THB", TR: "TRY", RU: "RUB",
      KR: "KRW", MX: "MXN", BR: "BRL", ZA: "ZAR", NG: "NGN",
    };
    if (country && currencyMap[country]) {
      return currencyMap[country];
    }
  }

  return "USD";
}
