"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CurrencySelect } from "@/components/currency/CurrencySelect";
import { 
  formatCurrency, 
  addRecentCurrency,
  getFavoriteCurrencies,
  toggleFavoriteCurrency
} from "@/lib/currency-utils";
import { RefreshCw, Copy, Star, Share2, TrendingUp, WifiOff } from "lucide-react";
import { getCurrencyByCode } from "@/types/currency";
import { fetchCryptoRates } from "@/lib/crypto-api";

interface CryptoConverterProps {
  initialFrom?: string;
  initialTo?: string;
  initialAmount?: string;
  showCharts?: boolean;
  compact?: boolean;
}

const CRYPTO_CURRENCIES = ["BTC", "ETH", "USDT", "USDC", "BNB", "XRP", "ADA", "DOGE", "SOL", "DOT"];
const FIAT_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR", "PKR"];

export function CryptoConverter({
  initialFrom = "BTC",
  initialTo = "USD",
  initialAmount = "1",
  showCharts = false,
  compact = false,
}: CryptoConverterProps) {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [amount, setAmount] = useState<string>(initialAmount);
  const [fromCurrency, setFromCurrency] = useState(initialFrom);
  const [toCurrency, setToCurrency] = useState<string>(initialTo);
  const numericAmount = parseFloat(amount) || 0;

  // Fetch crypto rates
  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rateData = await fetchCryptoRates(fromCurrency, toCurrency);
      setRates(rateData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rates");
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    Promise.resolve().then(() => fetchRates());
  }, [fetchRates]);

  const convertedAmount = useMemo(() => {
    if (!rates || !fromCurrency || !toCurrency) return null;

    const rate = rates[toCurrency];
    return rate ? numericAmount * rate : null;
  }, [rates, numericAmount, fromCurrency, toCurrency]);

  const swapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  const handleCopy = useCallback(async () => {
    const text = `${amount} ${fromCurrency} = ${convertedAmount?.toFixed(2) || ""} ${toCurrency}`;
    await navigator.clipboard.writeText(text);
  }, [amount, fromCurrency, convertedAmount, toCurrency]);

  const convertedFormatted = useMemo(() => {
    if (convertedAmount === null) return "";
    return formatCurrency(convertedAmount, toCurrency);
  }, [convertedAmount, toCurrency]);

  const rateFormatted = useMemo(() => {
    const rate = rates[toCurrency];
    if (!rate) return "";
    return formatCurrency(rate, toCurrency, { style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 6 });
  }, [rates, toCurrency]);

  if (loading && !rates) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading crypto prices...</p>
        </div>
      </div>
    );
  }

  if (error && !rates) {
    return (
      <div className="p-6 rounded-xl border border-border bg-destructive/5 text-destructive">
        <p className="font-medium mb-2">Unable to load crypto prices</p>
        <p className="text-sm opacity-80 mb-4">{error}</p>
        <button
          onClick={() => fetchRates()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="crypto-converter">
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
            className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-2xl font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
            min="0"
            step="any"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Cryptocurrency
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-lg font-semibold focus:border-orange-500 outline-none"
            >
              {CRYPTO_CURRENCIES.map(code => (
                <option key={code} value={code}>
                  {getCurrencyByCode(code)?.name || code} ({code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={swapCurrencies}
              className="w-full py-3 rounded-xl border-2 border-border bg-background hover:bg-accent/10 hover:border-orange-500 transition-all group"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-medium">Swap</span>
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              To Fiat
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-lg font-semibold focus:border-orange-500 outline-none"
            >
              {FIAT_CURRENCIES.map(code => (
                <option key={code} value={code}>
                  {getCurrencyByCode(code)?.name || code} ({code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <motion.div
          key={convertedAmount}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-xl bg-gradient-to-br from-orange-500/5 to-yellow-500/5 border border-orange-500/20 mb-6"
        >
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              {amount} {fromCurrency} =
            </div>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              {convertedFormatted}
            </div>

            {rateFormatted && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span>
                  1 {fromCurrency} = {rateFormatted} {toCurrency}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 font-medium transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={() => fetchRates()}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {lastUpdated && !loading && (
          <div className="mt-4 text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
