"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CurrencySelect } from "@/components/currency/CurrencySelect";
import {
  useLiveRates,
  formatCurrency,
  getExchangeRate,
  addRecentCurrency,
  getFavoriteCurrencies,
  toggleFavoriteCurrency,
  useHistoricalRates
} from "@/lib/currency-utils";
import { RefreshCw, Copy, Star, Share2, TrendingUp, Clock, BarChart3, WifiOff, ArrowUpDown } from "lucide-react";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { getCurrencyByCode } from "@/types/currency";
import { isOnline as checkOnline } from "@/lib/currency-api";

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
  // State for inputs - managed locally for reliable updates
  const [amount, setAmount] = useState(initialAmount);
  const [fromCurrency, setFromCurrency] = useState(() => initialFrom || detectLocalCurrency());
  const [toCurrency, setToCurrency] = useState(() => initialTo || "USD");

  // Fetch live rates for base currency
  const { rates, loading, error, refresh, isStale, lastUpdated } = useLiveRates(fromCurrency);

  // State for online status
  const [onlineStatus, setOnlineStatus] = useState(true);
  
  useEffect(() => {
    const updateOnlineStatus = () => setOnlineStatus(checkOnline());
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Calculate conversion
  const numericAmount = useMemo(() => {
    const parsed = parseFloat(amount);
    return isNaN(parsed) ? 0 : parsed;
  }, [amount]);

  const convertedAmount = useMemo(() => {
    if (!rates || !fromCurrency || !toCurrency || numericAmount === 0) {
      return null;
    }
    try {
      const fromRate = rates.rates[fromCurrency];
      const toRate = rates.rates[toCurrency];
      if (!fromRate || !toRate) return null;
      
      const baseAmount = numericAmount / fromRate;
      return baseAmount * toRate;
    } catch {
      return null;
    }
  }, [rates, numericAmount, fromCurrency, toCurrency]);

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
    if (convertedAmount === null) return "—";
    const formatted = formatCurrency(convertedAmount, toCurrency);
    return formatted;
  }, [convertedAmount, toCurrency]);

  const rateFormatted = useMemo(() => {
    if (!rate) return "—";
    return formatCurrency(rate, toCurrency, { style: "decimal", minimumFractionDigits: 4, maximumFractionDigits: 6 });
  }, [rate, toCurrency]);

  const inverseRate = useMemo(() => {
    if (!rate || rate === 0) return null;
    return 1 / rate;
  }, [rate]);

  const inverseRateFormatted = useMemo(() => {
    if (!inverseRate) return "—";
    return formatCurrency(inverseRate, fromCurrency, { style: "decimal", minimumFractionDigits: 4, maximumFractionDigits: 6 });
  }, [inverseRate, fromCurrency]);

  const lastUpdatedFormatted = useMemo(() => {
    if (!lastUpdated) return "";
    return lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [lastUpdated]);

  // Track recent currencies
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      addRecentCurrency(fromCurrency);
      addRecentCurrency(toCurrency);
    }
  }, [fromCurrency, toCurrency]);

  // Swap currencies
  const handleSwap = useCallback(() => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  }, [fromCurrency, toCurrency]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    if (convertedAmount === null) return;
    const text = `${amount} ${fromCurrency} = ${convertedFormatted}`;
    await navigator.clipboard.writeText(text);
  }, [amount, fromCurrency, convertedFormatted, convertedAmount]);

  // Share
  const handleShare = useCallback(async () => {
    if (convertedAmount === null) return;
    const url = `${window.location.origin}/currency/${fromCurrency.toLowerCase()}-to-${toCurrency.toLowerCase()}?amount=${amount}`;
    await navigator.share?.({
      title: `Convert ${fromCurrency} to ${toCurrency}`,
      text: `${amount} ${fromCurrency} = ${convertedFormatted}`,
      url,
    });
  }, [amount, fromCurrency, toCurrency, convertedFormatted, convertedAmount]);

  // Favorites
  const [favorites] = useState(() => getFavoriteCurrencies());
  const isFromFavorite = favorites.includes(fromCurrency);
  const isToFavorite = favorites.includes(toCurrency);

  const toggleFromFavorite = useCallback(() => {
    toggleFavoriteCurrency(fromCurrency);
  }, [fromCurrency]);

  const toggleToFavorite = useCallback(() => {
    toggleFavoriteCurrency(toCurrency);
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

  const fromInfo = getCurrencyByCode(fromCurrency);
  const toInfo = getCurrencyByCode(toCurrency);

  return (
    <div className={`currency-converter ${compact ? "compact" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 shadow-lg"
      >
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
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              From
            </label>
            <div className="relative">
              <CurrencySelect
                value={fromCurrency}
                onChange={setFromCurrency}
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

          <div className="flex items-end">
            <button
              onClick={handleSwap}
              className="w-full py-3 rounded-xl border-2 border-border bg-background hover:bg-accent/10 hover:border-primary transition-all group"
              title="Swap currencies"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-medium">Swap</span>
                <ArrowUpDown className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
              </div>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              To
            </label>
            <div className="relative">
              <CurrencySelect
                value={toCurrency}
                onChange={setToCurrency}
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
        </div>

        <motion.div
          key={convertedAmount}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 mb-6"
        >
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              {fromInfo?.flag && <span className="mr-1">{fromInfo.flag}</span>}
              {amount} {fromCurrency} =
            </div>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {toInfo?.flag && <span className="mr-1">{toInfo.flag}</span>}
              {convertedFormatted}
            </div>
            
            {rate && (
              <div className="mt-4 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span>
                    1 {fromCurrency} = {rateFormatted} {toCurrency}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  1 {toCurrency} = {inverseRateFormatted} {fromCurrency}
                </div>
              </div>
            )}
            
            {lastUpdated && (
              <div className="mt-3 text-xs text-muted-foreground">
                Last updated: {lastUpdatedFormatted}
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={handleCopy}
            disabled={convertedAmount === null}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 font-medium transition-colors disabled:opacity-50"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={handleShare}
            disabled={convertedAmount === null}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 font-medium transition-colors disabled:opacity-50"
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
            onClick={() => window.location.href = `/currency/${fromCurrency.toLowerCase()}-to-${toCurrency.toLowerCase()}`}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Details
          </button>
        </div>

        {isStale && !loading && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 text-sm">
            <Clock className="w-4 h-4 inline mr-2" />
            Rates may be outdated. Click Refresh for latest.
          </div>
        )}

        {!onlineStatus && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            <WifiOff className="w-4 h-4 inline mr-2" />
            You&apos;re offline. Showing cached rates.
          </div>
        )}
      </motion.div>

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
    </div>
  );
}

// Helper: Detect user's local currency
function detectLocalCurrency(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("conversion-hub-preferred-currency");
    if (saved && getCurrencyByCode(saved)) {
      return saved;
    }
  }

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