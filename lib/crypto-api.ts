// Free crypto APIs (no auth required)
const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";
const COINCAP_API = "https://api.coincap.io/v2/assets";

interface CryptoRates {
  [currency: string]: number;
}

const CACHE_TTL = 60 * 1000; // 1 minute for crypto (more volatile)
let cache: { data: CryptoRates; timestamp: number } | null = null;

// Map our codes to CoinGecko IDs
const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  USDC: "usd-coin",
  BNB: "binancecoin",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  SOL: "solana",
  DOT: "polkadot",
};

export async function fetchCryptoRates(
  fromCurrency: string,
  toCurrency: string = "USD"
): Promise<CryptoRates> {
  const now = Date.now();
  
  // Check cache
  if (cache && now - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  const coinId = COINGECKO_IDS[fromCurrency];
  if (!coinId) {
    throw new Error(`Unsupported cryptocurrency: ${fromCurrency}`);
  }

  // Fetch from CoinGecko
  const url = `${COINGECKO_API}?ids=${coinId}&vs_currencies=usd,eur,gbp,jpy,cad,aud,inr,pkr`;
  
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) throw new Error("Failed to fetch from CoinGecko");

    const data = await response.json();
    const rates = data[coinId] || {};

    // Convert to our format
    const result: CryptoRates = {
      USD: rates.usd || 0,
      EUR: rates.eur || 0,
      GBP: rates.gbp || 0,
      JPY: rates.jpy || 0,
      CAD: rates.cad || 0,
      AUD: rates.aud || 0,
      INR: rates.inr || 0,
      PKR: rates.pkr || 0,
    };

    // Cache the result
    cache = { data: result, timestamp: now };
    return result;
  } catch (error) {
    // Fallback to CoinCap
    try {
      const response = await fetch(`${COINCAP_API}/${coinId}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok) {
        const data = await response.json();
        const price = parseFloat(data.data?.priceUsd || "0");
        const result: CryptoRates = {
          USD: price,
          EUR: price * 0.92,
          GBP: price * 0.79,
          JPY: price * 149,
          CAD: price * 1.36,
          AUD: price * 1.53,
          INR: price * 83.5,
          PKR: price * 278,
        };
        cache = { data: result, timestamp: now };
        return result;
      }
    } catch {
      // Final fallback
    }

    throw error;
  }
}

export function clearCryptoCache(): void {
  cache = null;
}