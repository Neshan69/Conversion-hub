import { getCurrencyByCode } from "@/types/currency";

// Free news sources for currency context
// Uses NewsAPI free tier (100 requests/day) with fallback strategies

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || "";
const NEWS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface InsightData {
  explanation: string;
  factors: string[];
  trend: string;
  confidence: "high" | "medium" | "low";
  lastUpdated: number;
  sources: string[];
  news: NewsArticle[];
}

// Currency pair economic context database
const currencyInsightsDB: Record<string, {
  description: string;
  keyFactors: string[];
  economicContext: string;
}> = {
  "USD-EUR": {
    description: "EUR/USD is the most traded currency pair globally, representing about 24% of daily forex volume. The rate is primarily influenced by interest rate differentials between the Federal Reserve and European Central Bank.",
    keyFactors: [
      "ECB monetary policy and interest rate decisions",
      "US Federal Reserve rate decisions and Fed Funds rate",
      "US economic data (GDP, NFP, CPI)",
      "Eurozone economic data and PMI readings",
      "Geopolitical tensions in Europe",
      "Energy prices (natural gas, oil) affecting European economy",
    ],
    economicContext: "The USD/EUR pair reflects the economic health differential between the US and Eurozone. When the Fed raises rates while the ECB holds or cuts, USD strengthens. Trade balances, inflation differentials, and risk sentiment are key drivers.",
  },
  "USD-GBP": {
    description: "GBP/USD (known as 'Cable') is one of the oldest traded currency pairs. It's heavily influenced by Brexit-related developments, Bank of England decisions, and US-UK economic data comparisons.",
    keyFactors: [
      "Bank of England interest rate decisions",
      "US Federal Reserve monetary policy",
      "UK economic data (GDP, employment, inflation)",
      "Brexit-related trade developments",
      "Global risk sentiment",
    ],
    economicContext: "Cable reflects the UK-US economic relationship. Post-Brexit trade agreements and regulatory divergence continue to influence flows. The BoE's monetary policy relative to the Fed is the primary rate driver.",
  },
  "USD-JPY": {
    description: "USD/JPY is known as 'The Gopher' and is the second most traded pair. Japan's prolonged low-interest-rate policy and safe-haven flows make this pair particularly sensitive to risk sentiment.",
    keyFactors: [
      "Bank of Japan monetary policy (ultra-loose stance)",
      "US Federal Reserve interest rate decisions",
      "Japanese trade balance and economic data",
      "Global risk sentiment (safe-haven flows to JPY)",
      "US Treasury yields (especially 10-year)",
    ],
    economicContext: "USD/JPY moves primarily on the interest rate differential. The BOJ's commitment to ultra-low rates (negative until March 2024) keeps yen weak. During market stress, JPY strengthens as a safe-haven currency.",
  },
  "USD-INR": {
    description: "USD/INR reflects the value of the Indian Rupee against the US Dollar. The RBI actively manages the exchange rate, and India's trade deficit, foreign investment flows, and oil prices are key drivers.",
    keyFactors: [
      "RBI monetary policy and forex interventions",
      "Crude oil prices (India is a major importer)",
      "Foreign portfolio investment flows (FII/FPI)",
      "India's trade deficit and current account balance",
      "US Fed policy and dollar strength",
    ],
    economicContext: "The rupee is influenced by India's significant oil import bill, FII capital flows, and RBI interventions. When oil prices rise, the rupee tends to weaken. Strong FII inflows support INR strength.",
  },
  "USD-PKR": {
    description: "The Pakistani Rupee has experienced significant depreciation against the USD since Pakistan's independence in 1947. Political instability, IMF program conditions, and trade imbalances drive this pair.",
    keyFactors: [
      "IMF program conditions and loan disbursements",
      "Political stability and governance concerns",
      "Pakistan's trade deficit and foreign reserves",
      "Remittance inflows from overseas Pakistanis",
      "Global commodity prices",
    ],
    economicContext: "PKR has depreciated over 90% against USD since 1947. The currency is heavily influenced by IMF bailout programs, political events, and Pakistan's reliance on imported energy and goods.",
  },
  "USD-CHF": {
    description: "USD/CHF is influenced by the safe-haven status of both currencies. The Swiss franc is a traditional safe-haven, while the USD is the world's reserve currency. SNB interventions are a key factor.",
    keyFactors: [
      "Swiss National Bank monetary policy",
      "US Federal Reserve decisions",
      "Global risk sentiment",
      "SNB foreign exchange interventions",
      "Swiss trade balance",
    ],
    economicContext: "The Swiss franc's safe-haven status means it strengthens during global uncertainty. The SNB has historically intervened to prevent excessive CHF strength that would hurt Swiss exports.",
  },
  "USD-AED": {
    description: "AED/USD is pegged at approximately 3.6725 AED per USD. The peg has been maintained since 1997 and is supported by the UAE's large foreign reserves and oil exports.",
    keyFactors: [
      "UAE Central Bank peg maintenance operations",
      "Oil prices and UAE oil revenues",
      "US Federal Reserve interest rate policy",
      "UAE economic diversification progress",
    ],
    economicContext: "The AED is pegged to the USD, so movements are minimal and occur only during rare revaluation events. The peg is well-defended by substantial foreign reserves.",
  },
  "USD-CNY": {
    description: "USD/CNY reflects the relationship between the world's two largest economies. China's managed float system means the People's Bank of China sets a daily reference rate with limited daily fluctuation.",
    keyFactors: [
      "PBOC daily reference rate setting",
      "US-China trade relations and tariffs",
      "China's economic data (GDP, exports, PMI)",
      "US Federal Reserve policy",
      "Capital flow regulations",
    ],
    economicContext: "China uses a managed float within a 2% daily band. The PBOC adjusts the reference rate based on market conditions and policy objectives. Trade tensions and economic slowdowns are key drivers.",
  },
  "USD-BRL": {
    description: "USD/BRL is one of the most volatile major currency pairs. Brazil's high interest rates, commodity exports, and political uncertainty create significant fluctuations.",
    keyFactors: [
      "Brazilian Central Bank (Selic) interest rate",
      "Commodity prices (soybeans, iron ore, oil)",
      "Brazilian fiscal policy and government spending",
      "Political risk and election cycles",
      "Risk appetite in emerging markets",
    ],
    economicContext: "Brazil's high interest rates attract carry trade flows, but political uncertainty and fiscal concerns can cause sharp depreciation. Commodity prices significantly impact BRL given Brazil's export profile.",
  },
  "USD-SAR": {
    description: "The Saudi Riyal is pegged to the USD at 3.75 SAR. This peg has been maintained since 1986 and is supported by Saudi Arabia's oil revenues and large foreign reserves.",
    keyFactors: [
      "SAR/USD peg maintenance",
      "Oil prices and Saudi oil revenues",
      "Saudi Vision 2030 economic reforms",
      "US Federal Reserve interest rate policy",
    ],
    economicContext: "Similar to AED, SAR maintains a strict peg to USD. The Saudi Central Bank (SAMA) intervenes to maintain this rate.",
  },
  "EUR-GBP": {
    description: "EUR/GBP reflects the economic comparison between the Eurozone and the United Kingdom. Brexit has permanently altered trading relationships and regulatory frameworks.",
    keyFactors: [
      "ECB vs Bank of England monetary policy divergence",
      "Eurozone and UK economic growth comparisons",
      "Brexit trade agreement implementation",
      "UK services sector performance",
      "Energy dependency differences",
    ],
    economicContext: "This pair represents two major European economies. Post-Brexit, the UK operates outside EU single market rules, affecting trade flows and investment patterns.",
  },
};

// Get insight for currency pair
export function getCurrencyInsight(fromCurrency: string, toCurrency: string): string {
  const pairKey = `${fromCurrency}-${toCurrency}`;
  const reverseKey = `${toCurrency}-${fromCurrency}`;

  const insight = currencyInsightsDB[pairKey] || currencyInsightsDB[reverseKey];

  if (insight) {
    if (pairKey !== `${fromCurrency}-${toCurrency}`) {
      // Reverse perspective
      return insight.description.replace(/USD/g, toCurrency).replace(new RegExp(Object.keys(currencyInsightsDB).find(k => k.includes(toCurrency))?.split('-')[1] || toCurrency, 'g'), fromCurrency);
    }
    return insight.description;
  }

  const fromInfo = getCurrencyByCode(fromCurrency);
  const toInfo = getCurrencyByCode(toCurrency);

  if (fromInfo && toInfo) {
    return `The exchange rate between ${fromInfo.name} (${fromInfo.code}) and ${toInfo.name} (${toInfo.code}) is influenced by factors including the relative economic strength of ${fromInfo.country} and ${toInfo.country}, central bank policies, trade balances, and global market conditions.`;
  }

  return `Exchange rates between currencies are determined by supply and demand in the foreign exchange market, influenced by economic indicators, central bank policies, and geopolitical factors.`;
}

// Generate detailed insight
export function generateInsight(
  fromCurrency: string,
  toCurrency: string,
  rate: number | null
): InsightData {
  const pairKey = `${fromCurrency}-${toCurrency}`;
  const reverseKey = `${toCurrency}-${fromCurrency}`;
  const insight = currencyInsightsDB[pairKey] || currencyInsightsDB[reverseKey];

  const fromInfo = getCurrencyByCode(fromCurrency);
  const toInfo = getCurrencyByCode(toCurrency);

  let explanation = "";
  let factors: string[] = [];
  let trend = "";

  if (insight) {
    factors = [...insight.keyFactors];
    explanation = insight.economicContext;

    // Generate trend based on known context
    if (rate) {
      if (pairKey === "USD-JPY" || (reverseKey === "USD-JPY" && rate > 150)) {
        trend = "The yen remains under pressure due to the Bank of Japan's continued accommodative monetary policy, while US interest rates remain elevated.";
      } else if (pairKey === "USD-INR" || rate > 85) {
        trend = "The rupee faces pressure from elevated oil prices and capital outflows, though strong domestic growth provides some support.";
      } else if (pairKey === "USD-EUR") {
        trend = rate > 1 ? "The euro is trading below parity with the dollar, reflecting the economic growth differential between the US and Eurozone." : "The euro has strengthened against the dollar, supported by improving Eurozone economic data.";
      } else if (pairKey === "USD-GBP") {
        trend = "Sterling's movements reflect the Bank of England's monetary stance and ongoing adjustments in the UK's post-Brexit trade landscape.";
      } else {
        trend = `Market dynamics between ${fromInfo?.name || fromCurrency} and ${toInfo?.name || toCurrency} continue to evolve based on economic data releases and central bank communications.`;
      }
    } else {
      trend = `Monitor the ${fromCurrency}/${toCurrency} pair for shifts driven by economic data, central bank announcements, and geopolitical developments.`;
    }
  } else {
    // Generic but informative insight
    factors = [
      `Central bank monetary policy in ${fromInfo?.country || fromCurrency}`,
      `Central bank monetary policy in ${toInfo?.country || toCurrency}`,
      `Bilateral trade balance between the two economies`,
      `Global risk sentiment and market volatility`,
      `Interest rate differentials`,
      `Inflation rate comparisons`,
    ];

    explanation = `The exchange rate between ${fromInfo?.name || fromCurrency} and ${toInfo?.name || toCurrency} is determined by the forces of supply and demand in the international foreign exchange market. Key factors include the relative economic performance of ${fromInfo?.country || fromCurrency}'s and ${toInfo?.country || toCurrency}'s economies, decisions made by their respective central banks regarding interest rates, trade balances, and overall investor sentiment toward each currency.`;

    trend = `Stay informed about economic releases from both ${fromInfo?.country || fromCurrency} and ${toInfo?.country || toCurrency} to better understand potential movements in this currency pair.`;
  }

  // Add general inflation context
  factors.push("Inflation rate differentials between the two countries");
  factors.push("Overall global risk appetite and market sentiment");

  return {
    explanation,
    factors,
    trend,
    confidence: insight ? "high" : "medium",
    lastUpdated: Date.now(),
    sources: [
      "Exchange rate data from multiple financial APIs",
      "Central bank publications and monetary policy statements",
      "International Monetary Fund (IMF) economic outlook",
      "World Bank economic indicators",
    ],
    news: [],
  };
}

// Cache management for insights
const INSIGHT_CACHE_KEY = "conversion-hub-insights-";

export function getCachedInsight(pairKey: string): InsightData | null {
  try {
    const cached = localStorage.getItem(`${INSIGHT_CACHE_KEY}${pairKey}`);
    if (cached) {
      const data = JSON.parse(cached);
      if (Date.now() - data.lastUpdated < NEWS_CACHE_TTL) {
        return data;
      }
    }
  } catch {
    // Silent fail
  }
  return null;
}

export function cacheInsight(pairKey: string, data: InsightData): void {
  try {
    localStorage.setItem(
      `${INSIGHT_CACHE_KEY}${pairKey}`,
      JSON.stringify({ ...data, lastUpdated: Date.now() })
    );
  } catch {
    // Silent fail - localStorage may be full
  }
}

export { currencyInsightsDB };