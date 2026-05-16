"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ArrowUpDown, WifiOff, Clock, TrendingUp, BarChart3, Copy, Share2, Star } from "lucide-react";
import Link from "next/link";
import { CurrencySelect } from "@/components/currency/CurrencySelect";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { EconomyComparison, PurchasingPowerComparison } from "@/components/currency/EconomyComparison";
import { LearningPanel } from "@/components/currency/LearningPanel";
import {
  useLiveRates,
  formatCurrency,
  getExchangeRate,
  addRecentCurrency,
  getFavoriteCurrencies,
  toggleFavoriteCurrency,
  useHistoricalRates,
  detectLocalCurrency,
} from "@/lib/currency-utils";
import { getCurrencyByCode } from "@/types/currency";
import { convertCurrency, isOnline as checkOnline } from "@/lib/currency-api";

export function CurrencyConverter({
  initialFrom,
  initialTo,
  initialAmount = "1",
  showCharts = true,
  showHistorical = true,
  showInsights = false,
  compact = false,
}: {
  initialFrom?: string;
  initialTo?: string;
  initialAmount?: string;
  showCharts?: boolean;
  showHistorical?: boolean;
  showInsights?: boolean;
  compact?: boolean;
}) {
  const [amount, setAmount] = useState(initialAmount);
  const [debouncedAmount, setDebouncedAmount] = useState(initialAmount);
  const [fromCurrency, setFromCurrency] = useState(() => initialFrom || detectLocalCurrency());
  const [toCurrency, setToCurrency] = useState(() => initialTo || "USD");

  const { rates, loading, error, refresh, isStale, lastUpdated } = useLiveRates(fromCurrency);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => setOnlineStatus(checkOnline());
    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const handleAmountInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || value === "-" || value === "." || /^-?\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  }, []);

  const numericAmount = useMemo(() => {
    const parsed = parseFloat(debouncedAmount);
    return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
  }, [debouncedAmount]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedAmount(amount), 120);
    return () => window.clearTimeout(timeout);
  }, [amount]);

  const convertedAmount = useMemo(() => {
    if (!rates || !fromCurrency || !toCurrency) return null;
    try {
      const result = convertCurrency(numericAmount, fromCurrency, toCurrency, rates);
      if (!isFinite(result)) return null;
      return result;
    } catch {
      return null;
    }
  }, [rates, numericAmount, fromCurrency, toCurrency]);

  const rate = useMemo(() => {
    if (!rates) return null;
    try {
      return getExchangeRate(fromCurrency, toCurrency, rates);
    } catch {
      return null;
    }
  }, [rates, fromCurrency, toCurrency]);

  const { data: historicalData, loading: historicalLoading } = useHistoricalRates(fromCurrency, toCurrency, showHistorical ? 30 : 7);

  const convertedFormatted = useMemo(() => {
    if (convertedAmount === null) return "-";
    return formatCurrency(convertedAmount, toCurrency);
  }, [convertedAmount, toCurrency]);

  const amountFormatted = useMemo(() => {
    if (!debouncedAmount || isNaN(parseFloat(debouncedAmount))) return "-";
    return formatCurrency(numericAmount, fromCurrency);
  }, [debouncedAmount, numericAmount, fromCurrency]);

  const rateFormatted = useMemo(() => {
    if (!rate) return "-";
    return formatCurrency(rate, toCurrency, { style: "decimal", minimumFractionDigits: 4, maximumFractionDigits: 6 });
  }, [rate, toCurrency]);

  const inverseRate = useMemo(() => (rate ? 1 / rate : null), [rate]);
  const inverseRateFormatted = useMemo(() => {
    if (!inverseRate) return "-";
    return formatCurrency(inverseRate, fromCurrency, { style: "decimal", minimumFractionDigits: 4, maximumFractionDigits: 6 });
  }, [inverseRate, fromCurrency]);

  const lastUpdatedFormatted = useMemo(() => {
    if (!lastUpdated) return "";
    return lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [lastUpdated]);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      addRecentCurrency(fromCurrency);
      addRecentCurrency(toCurrency);
    }
  }, [fromCurrency, toCurrency]);

  const handleSwap = useCallback(() => {
    setIsSwapping(true);
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setTimeout(() => setIsSwapping(false), 400);
  }, [fromCurrency, toCurrency]);

  const handleCopy = useCallback(async () => {
    if (convertedAmount === null) return;
    const text = `${amount} ${fromCurrency} = ${convertedFormatted}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  }, [amount, fromCurrency, convertedFormatted, convertedAmount]);

  const handleShare = useCallback(async () => {
    if (convertedAmount === null) return;
    const url = `${window.location.origin}/currency/${fromCurrency.toLowerCase()}-to-${toCurrency.toLowerCase()}?amount=${amount}`;
    const shareData = { title: `Convert ${fromCurrency} to ${toCurrency}`, text: `${amount} ${fromCurrency} = ${convertedFormatted}`, url };
    if (navigator.canShare?.(shareData)) {
      await navigator.share(shareData);
    } else {
      await handleCopy();
    }
  }, [amount, fromCurrency, toCurrency, convertedFormatted, convertedAmount, handleCopy]);

  const [favorites] = useState(() => getFavoriteCurrencies());
  const isFromFavorite = favorites.includes(fromCurrency);
  const isToFavorite = favorites.includes(toCurrency);
  const toggleFromFavorite = useCallback(() => toggleFavoriteCurrency(fromCurrency), [fromCurrency]);
  const toggleToFavorite = useCallback(() => toggleFavoriteCurrency(toCurrency), [toCurrency]);

  // Refresh polling — check every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (checkOnline()) refresh(true);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (loading && !rates) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading exchange rates...</p>
        </div>
      </div>
    );
  }

  if (error && !rates) {
    return (
      <div className="p-6 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive">
        <p className="font-medium mb-2">Unable to load exchange rates</p>
        <p className="text-sm opacity-80 mb-4">{error}</p>
        <button onClick={() => refresh()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">Retry</button>
      </div>
    );
  }

  const fromInfo = getCurrencyByCode(fromCurrency);
  const toInfo = getCurrencyByCode(toCurrency);

  return (
    <div className={`currency-converter ${compact ? "compact" : ""}`}>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-card/70 backdrop-blur-xl border border-border/70 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-primary/5">
        <div className="mb-5">
          <label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="amount-input">Amount</label>
          <input id="amount-input" type="text" inputMode="decimal" value={amount} onChange={handleAmountInput} placeholder="Enter amount" className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-2xl font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="from-select">From</label>
            <div className="relative">
              <CurrencySelect value={fromCurrency} onChange={setFromCurrency} id="from-select" showRecent showFavorites showPopular />
              {isFromFavorite && <button onClick={toggleFromFavorite} className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:text-amber-500 transition-colors" title="Remove from favorites"><Star className="w-4 h-4 fill-amber-500 text-amber-500" /></button>}
            </div>
          </div>

          <div className="flex items-end">
            <motion.button onClick={handleSwap} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`w-full py-3 rounded-xl border-2 border-border bg-background hover:bg-accent/10 hover:border-primary transition-all group ${isSwapping ? "rotate-180" : ""}`} style={{ transition: isSwapping ? "transform 0.4s ease" : "all 0.2s" }} title="Swap currencies" aria-label="Swap currencies">
              <div className="flex items-center justify-center gap-2">
                <ArrowUpDown className={`w-5 h-5 group-hover:animate-bounce transition-transform ${isSwapping ? "rotate-180" : ""}`} />
                <span className="text-sm font-medium">Swap</span>
              </div>
            </motion.button>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="to-select">To</label>
            <div className="relative">
              <CurrencySelect value={toCurrency} onChange={setToCurrency} id="to-select" exclude={[fromCurrency]} showRecent showFavorites showPopular />
              {isToFavorite && <button onClick={toggleToFavorite} className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:text-amber-500 transition-colors" title="Remove from favorites"><Star className="w-4 h-4 fill-amber-500 text-amber-500" /></button>}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={convertedAmount} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.05, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 mb-6 select-none">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                {fromInfo?.flag && <span className="mr-1">{fromInfo.flag}</span>}
                <span className="font-mono">{amountFormatted}</span>
                {" "}{fromCurrency} =
              </div>
              <motion.div key={convertedFormatted} className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                {toInfo?.flag && <span className="mr-1">{toInfo.flag}</span>}
                {convertedFormatted}
              </motion.div>

              {rate && (
                <motion.div className="mt-4 space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span>1 {fromCurrency} = {rateFormatted} {toCurrency}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">1 {toCurrency} = {inverseRateFormatted} {fromCurrency}</div>
                </motion.div>
              )}

              {lastUpdated && (
                <div className="mt-3 text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> {rates?.source || "live"} • Last updated: {lastUpdatedFormatted}
                  {isStale && <span className="ml-2 text-amber-600">⚠ May be outdated</span>}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={handleCopy} disabled={convertedAmount === null} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 font-medium transition-colors disabled:opacity-50 group"><Copy className="w-4 h-4 group-hover:scale-110 transition-transform" /> Copy</button>
          <button onClick={handleShare} disabled={convertedAmount === null} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 font-medium transition-colors disabled:opacity-50 group"><Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Share</button>
          <button onClick={() => refresh()} disabled={loading} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 font-medium transition-colors disabled:opacity-50 group"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : "group-hover:rotate-180"} transition-transform`} /> Refresh</button>
          <Link href={`/currency/${fromCurrency.toLowerCase()}-to-${toCurrency.toLowerCase()}`} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium transition-all hover:shadow-lg group" prefetch={true}><BarChart3 className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /> Details</Link>
        </div>

        {isStale && !loading && <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 text-sm flex items-center gap-2"><Clock className="w-4 h-4 flex-shrink-0" />Rates may be outdated. Click Refresh for latest.</div>}
        {!onlineStatus && <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2"><WifiOff className="w-4 h-4 flex-shrink-0" />You&apos;re offline. Showing cached rates.</div>}
      </motion.div>

      {(showCharts && showHistorical && historicalData.length > 0) && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="mt-8 bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" />30-Day Trend: {fromCurrency} → {toCurrency}</h3>
          {historicalLoading ? (<div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>) : (
            <div className="h-64 px-2"><SparklineChart data={historicalData} height={250} color="hsl(var(--primary))" /></div>
          )}
        </motion.div>
      )}

      {(showInsights && fromInfo && toInfo) && (
        <>
          <LearningPanel fromCurrency={fromCurrency} toCurrency={toCurrency} amount={amount} convertedAmount={convertedFormatted} rate={rate} />
          <EconomyComparison fromCurrency={fromCurrency} toCurrency={toCurrency} />
          <PurchasingPowerComparison fromCurrency={fromCurrency} toCurrency={toCurrency} />
        </>
      )}
    </div>
  );
}
