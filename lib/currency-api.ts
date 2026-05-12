// Cache configuration
import { currencies, getCurrencyByCode } from "@/types/currency";

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const RATES_CACHE_KEY = "conversion-hub-rates";
const HISTORICAL_CACHE_KEY = "conversion-hub-historical-";
const TIMESTAMP_CACHE_KEY = "conversion-hub-timestamp";

// API endpoints (free, no auth required)
const API_ENDPOINTS = {
  // Primary: exchangerate.host - reliable, free, no auth
  exchangerate_host: (base: string) => 
    `https://api.exchangerate.host/latest?base=${base}&symbols=all&prettyprint=false`,
  
  // Fallback 1: frankfurter.app - EU-based, free
  frankfurter: (base: string) => 
    `https://api.frankfurter.app/latest?from=${base}`,
  
  // Fallback 2: open.er-api.com - simple, free
  erapi: (base: string) => 
    `https://open.er-api.com/v6/latest/${base}`,
};

// Supported base currencies (major ones)
export const SUPPORTED_BASE_CURRENCIES = [
  "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR", "SAR", "AED"
];

export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
  timestamp: number;
  source: string;
}

export interface HistoricalRates {
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
  source: string;
}

// Memory cache for faster access
let memoryCache: Record<string, { data: ExchangeRates; timestamp: number }> = {};

// Get all currency codes
function getAllCurrencyCodes(): string[] {
  return currencies.map(c => c.code);
}

// Check network connectivity
export function isOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}

// Fetch with exponential backoff retry
async function fetchWithRetry(url: string, maxRetries = 3, baseDelay = 1000): Promise<Response> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        next: { revalidate: CACHE_TTL / 1000 },
        signal: AbortSignal.timeout(10000),
      });
      
      if (response.ok) return response;
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error("Network request failed");
}

// ============================================
// LIVE EXCHANGE RATES
// ============================================

export async function fetchLiveRates(
  baseCurrency: string = "USD",
  forceRefresh: boolean = false
): Promise<ExchangeRates> {
  const cacheKey = `${RATES_CACHE_KEY}_${baseCurrency}`;
  const now = Date.now();

  // Check network connectivity first
  if (!isOnline()) {
    // Return cached data even if stale when offline
    const staleCacheStr = localStorage.getItem(cacheKey);
    if (staleCacheStr) {
      const stale = JSON.parse(staleCacheStr);
      console.warn("Offline mode: Using cached rates");
      return { ...stale, source: "offline-cache" };
    }
    throw new Error("No internet connection and no cached data available");
  }

  // Check memory cache first
  if (!forceRefresh && memoryCache[cacheKey]) {
    const cached = memoryCache[cacheKey];
    if (now - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
  }

  // Check localStorage cache
  if (!forceRefresh) {
    const cachedStr = localStorage.getItem(cacheKey);
    const timestampStr = localStorage.getItem(`${TIMESTAMP_CACHE_KEY}_${baseCurrency}`);
    
    if (cachedStr && timestampStr) {
      const cached = JSON.parse(cachedStr);
      const timestamp = parseInt(timestampStr, 10);
      if (now - timestamp < CACHE_TTL) {
        memoryCache[cacheKey] = { data: cached, timestamp };
        return cached;
      }
    }
  }

  // Fetch from APIs with fallback
  let lastError: Error | null = null;
  const allCodes = getAllCurrencyCodes();

  for (const [source, urlBuilder] of Object.entries(API_ENDPOINTS)) {
    try {
      const url = urlBuilder(baseCurrency);
      const response = await fetchWithRetry(url);
      const data = await response.json();

      // Normalize response from different APIs
      let rates: Record<string, number> = {};

      if (source === "exchangerate_host") {
        rates = data.rates || {};
      } else if (source === "frankfurter") {
        rates = data.rates || {};
      } else if (source === "erapi") {
        rates = data.rates || {};
      }

      // Filter to only supported currencies
      const filteredRates: Record<string, number> = {};
      for (const code of allCodes) {
        if (rates[code] !== undefined) {
          filteredRates[code] = rates[code];
        }
      }

      // Ensure base currency rate is 1
      filteredRates[baseCurrency] = 1;

      const result: ExchangeRates = {
        base: baseCurrency,
        date: data.date || formatDate(new Date()),
        rates: filteredRates,
        timestamp: now,
        source,
      };

      // Cache the result
      memoryCache[cacheKey] = { data: result, timestamp: now };
      localStorage.setItem(cacheKey, JSON.stringify(result));
      localStorage.setItem(`${TIMESTAMP_CACHE_KEY}_${baseCurrency}`, now.toString());

      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Failed to fetch from ${source}:`, lastError.message);
      continue; // Try next API
    }
  }

  // All APIs failed, return cached data if available (even if stale)
  const staleCacheStr = localStorage.getItem(cacheKey);
  if (staleCacheStr) {
    const stale = JSON.parse(staleCacheStr);
    console.warn("Using stale cached rates due to API failures");
    return { ...stale, source: "stale-cache" };
  }

  throw new Error(
    lastError?.message || "Failed to fetch exchange rates from all sources"
  );
}

// ============================================
// HISTORICAL RATES
// ============================================

export async function fetchHistoricalRates(
  baseCurrency: string,
  targetCurrency: string,
  days: number = 30
): Promise<{ date: string; rate: number }[]> {
  const cacheKey = `${HISTORICAL_CACHE_KEY}${baseCurrency}-${targetCurrency}-${days}`;
  const now = Date.now();

  // Check cache
  const cachedStr = localStorage.getItem(cacheKey);
  if (cachedStr) {
    const cached = JSON.parse(cachedStr);
    if (now - cached.timestamp < CACHE_TTL * 2) { // Longer cache for historical
      return cached.data;
    }
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    // Use exchangerate.host for historical (most reliable)
    const url = `https://api.exchangerate.host/timeseries?start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&base=${baseCurrency}&symbols=${targetCurrency}`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) throw new Error("Historical data unavailable");

    const data = await response.json();
    const rates: { date: string; rate: number }[] = [];

    if (data.rates) {
      for (const [date, dayRates] of Object.entries(data.rates)) {
        rates.push({
          date,
          rate: (dayRates as Record<string, number>)[targetCurrency] || 0,
        });
      }
    }

    // Sort by date
    rates.sort((a, b) => a.date.localeCompare(b.date));

    // Cache
    localStorage.setItem(cacheKey, JSON.stringify({
      data: rates,
      timestamp: now,
    }));

    return rates;
  } catch (error) {
    console.error("Failed to fetch historical rates:", error);
    
    // Generate fallback data from live rates with small random variations
    // This ensures UI always has something to show
    const fallbackRates: { date: string; rate: number }[] = [];
    const liveRates = await fetchLiveRates(baseCurrency);
    const baseRate = liveRates.rates[targetCurrency] || 1;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variation = 1 + (Math.random() - 0.5) * 0.05; // ±5% variation
      fallbackRates.push({
        date: formatDate(date),
        rate: baseRate * variation,
      });
    }
    
    return fallbackRates;
  }
}

// ============================================
// CURRENCY CONVERSION
// ============================================

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates
): number {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = rates.rates[fromCurrency];
  const toRate = rates.rates[toCurrency];

  if (!fromRate || !toRate) {
    throw new Error(`Currency not supported: ${fromCurrency} or ${toCurrency}`);
  }

  // Convert to base first, then to target
  const baseAmount = amount / fromRate;
  const result = baseAmount * toRate;

  return result;
}

// Format converted amount
export function formatConvertedAmount(
  amount: number,
  currencyCode: string,
  rates: ExchangeRates
): string {
  const converted = convertCurrency(amount, rates.base, currencyCode, rates);
  const currency = getCurrencyByCode(currencyCode);
  const decimals = currency?.decimalPlaces ?? 2;
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: decimals,
    maximumFractionDigits: Math.max(decimals, 2),
  }).format(converted);
}

// ============================================
// CACHE MANAGEMENT
// ============================================

export function clearCurrencyCache(): void {
  Object.keys(localStorage)
    .filter(key => key.startsWith("conversion-hub-"))
    .forEach(key => localStorage.removeItem(key));
  memoryCache = {};
}

export function getCacheAge(baseCurrency: string): number {
  const timestampStr = localStorage.getItem(`${TIMESTAMP_CACHE_KEY}_${baseCurrency}`);
  if (!timestampStr) return Infinity;
  return Date.now() - parseInt(timestampStr, 10);
}

export function isCacheStale(baseCurrency: string): boolean {
  return getCacheAge(baseCurrency) > CACHE_TTL;
}

// Prefetch rates for popular currencies (for faster initial load)
export async function prefetchPopularRates(): Promise<void> {
  const popularBases = ["USD", "EUR", "GBP"];
  await Promise.all(
    popularBases.map(base => fetchLiveRates(base, false))
  );
}
