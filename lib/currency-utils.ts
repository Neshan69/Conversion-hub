"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchLiveRates, fetchHistoricalRates, convertCurrency, clearCurrencyCache, isCacheStale } from "@/lib/currency-api";
import { ExchangeRates } from "@/lib/currency-api";
import { getCurrencyByCode } from "@/types/currency";

// Cache for recent conversions (localStorage)
const RECENT_CURRENCIES_KEY = "conversion-hub-recent-currencies";
const MAX_RECENT = 10;

// Favorites (localStorage)
const FAVORITES_KEY = "conversion-hub-favorite-currencies";

// ============================================
// HOOK: Use Live Exchange Rates
// ============================================
export function useLiveRates(baseCurrency: string = "USD") {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async (force?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLiveRates(baseCurrency, force);
      setRates(data);
      setLastUpdated(new Date(data.timestamp));
    } catch (err: any) {
      setError(err.message || "Failed to fetch rates");
    } finally {
      setLoading(false);
    }
  }, [baseCurrency]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    rates,
    loading,
    error,
    lastUpdated,
    refresh,
    isStale: rates ? isCacheStale(baseCurrency) : true,
  };
}

// ============================================
// HOOK: Use Currency Conversion
// ============================================
export function useCurrencyConverter(
  baseCurrency: string,
  rates: ExchangeRates | null
) {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState(baseCurrency);
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [result, setResult] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const numericAmount = parseFloat(amount) || 0;

  // Perform conversion when inputs change
  useEffect(() => {
    if (!rates || !fromCurrency || !toCurrency) return;

    try {
      const converted = convertCurrency(numericAmount, fromCurrency, toCurrency, rates);
      setConvertedAmount(converted);
    } catch {
      setConvertedAmount(null);
    }
  }, [rates, numericAmount, fromCurrency, toCurrency]);

  const swapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  const setFrom = useCallback((code: string) => {
    setFromCurrency(code);
  }, []);

  const setTo = useCallback((code: string) => {
    setToCurrency(code);
  }, []);

  return {
    amount,
    setAmount,
    fromCurrency,
    toCurrency,
    setFrom: setFrom,
    setTo: setTo,
    convertedAmount,
    swapCurrencies,
    numericAmount,
  };
}

// ============================================
// HOOK: Use Historical Rates
// ============================================
export function useHistoricalRates(
  baseCurrency: string,
  targetCurrency: string,
  days: number = 30
) {
  const [data, setData] = useState<{ date: string; rate: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!baseCurrency || !targetCurrency) return;

    let cancelled = false;
    setLoading(true);

    fetchHistoricalRates(baseCurrency, targetCurrency, days)
      .then(rates => {
        if (!cancelled) {
          setData(rates);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [baseCurrency, targetCurrency, days]);

  return { data, loading, error };
}

// ============================================
// RECENT CURRENCIES
// ============================================
export function getRecentCurrencies(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_CURRENCIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentCurrency(currencyCode: string): void {
  const code = currencyCode.toUpperCase();
  const recent = getRecentCurrencies().filter(c => c !== code);
  recent.unshift(code);
  const trimmed = recent.slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_CURRENCIES_KEY, JSON.stringify(trimmed));
}

export function clearRecentCurrencies(): void {
  localStorage.removeItem(RECENT_CURRENCIES_KEY);
}

// ============================================
// FAVORITES
// ============================================
export function getFavoriteCurrencies(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteCurrency(currencyCode: string): boolean {
  const code = currencyCode.toUpperCase();
  const favorites = getFavoriteCurrencies();
  const index = favorites.indexOf(code);
  
  let newFavorites: string[];
  if (index === -1) {
    newFavorites = [...favorites, code];
  } else {
    newFavorites = favorites.filter(c => c !== code);
  }
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  return index === -1; // returns true if added, false if removed
}

export function isCurrencyFavorite(currencyCode: string): boolean {
  return getFavoriteCurrencies().includes(currencyCode.toUpperCase());
}

// ============================================
// UTILITY: Format currency amount
// ============================================
export function formatCurrency(
  amount: number,
  currencyCode: string,
  options?: Intl.NumberFormatOptions
): string {
  const currency = getCurrencyByCode(currencyCode);
  const decimals = currency?.decimalPlaces ?? 2;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: decimals,
    maximumFractionDigits: Math.max(decimals, 2),
    ...options,
  }).format(amount);
}

// ============================================
// UTILITY: Get exchange rate between two currencies
// ============================================
export function getExchangeRate(
  from: string,
  to: string,
  rates: ExchangeRates
): number {
  if (from === to) return 1;
  const fromRate = rates.rates[from];
  const toRate = rates.rates[to];
  if (!fromRate || !toRate) throw new Error("Currency not found");
  return toRate / fromRate;
}

// ============================================
// AUTO-DETECT USER LOCATION (approximate)
export function detectLocalCurrency(): string {
  // Only run on client
  if (typeof window === "undefined") {
    return "USD";
  }

  // Check if user has manually set preference
  const saved = localStorage.getItem("conversion-hub-preferred-currency");
  if (saved && getCurrencyByCode(saved)) {
    return saved;
  }

  // Try to detect from browser language
  const language = navigator.language || navigator.languages?.[0] || "en-US";
  const countryCode = language.split("-")[1]?.toUpperCase() || "US";

  // Map common country codes to currencies
  const countryToCurrency: Record<string, string> = {
    US: "USD", GB: "GBP", DE: "EUR", FR: "EUR", IT: "EUR",
    ES: "EUR", JP: "JPY", AU: "AUD", CA: "CAD", CH: "CHF",
    CN: "CNY", IN: "INR", PK: "PKR", NP: "NPR", BD: "BDT",
    SA: "SAR", AE: "AED", TH: "THB", TR: "TRY", RU: "RUB",
    KR: "KRW", MX: "MXN", BR: "BRL", ZA: "ZAR", NG: "NGN",
  };

  if (countryToCurrency[countryCode]) {
    return countryToCurrency[countryCode];
  }

   return "USD"; // Default fallback
 }

// ============================================
// INITIALIZE
// ============================================
export function initializeCurrencySystem(): void {
  // Pre-fetch popular rates on initial load
  if (typeof window !== "undefined") {
    fetchLiveRates("USD").catch(() => {
      // Silent fail - will retry on user interaction
    });
  }
}
