import { getCurrencyByCode } from "@/types/currency";

export interface JokeComment {
  id: string;
  type: "joke" | "funfact" | "trivia" | "tip";
  content: string;
  currencyPair?: string;
  timestamp: number;
}

// Free joke APIs (no auth required)
const JOKE_APIS = [
  "https://v2.jokeapi.dev/joke/Any?type=single",
  "https://official-joke-api.appspot.com/random_joke",
  "https://geek-jokes.sameerkumar.website/api?format=json",
];

// Currency-specific jokes (contextual humor)
const currencyJokes: Record<string, string[]> = {
  USD: ["Why did the dollar go to therapy? It had too many issues!", "USD: The world's favorite currency to argue about!"],
  EUR: ["Why is Euro like a good song? It's got great harmony across Europe!", "Euro: Making Europeans argue about money since 2002!"],
  GBP: ["Why did the Pound cross the road? To get away from Brexit negotiations!", "GBP: British for 'I'm not cheap, I'm just well-calculated'!"],
  JPY: ["What do you call 100 yen? Still not enough for lunch in Tokyo!", "JPY: The only currency where a million feels like pocket change!"],
  INR: ["Why is Indian Rupee like Bollywood? Full of drama and always entertaining!", "INR: Making every paisa count since 1950!"],
  PKR: ["PKR: Strong enough to buy biryani, gentle enough for chai!", "Why did PKR break up with USD? Too many fluctuations!"],
  default: [
    "Why don't currencies ever get cold? They always have exchange rates!",
    "What did the zero say to the eight? Nice belt! (currency joke)",
    "Money talks... but does it have good exchange rate?",
    "I told my wife she was drawing her eyebrows too high. She looked surprised!",
    "Why did the scarecrow win an award? He was outstanding in his field!",
  ]
};

// Educational trivia for currency pairs
const currencyTrivia: Record<string, string> = {
  "USD-EUR": "The EUR/USD is the most traded currency pair in the world, accounting for ~24% of all forex trading!",
  "USD-JPY": "The USD/JPY pair is known as 'the gopher' and is heavily influenced by US-Japan interest rate differentials.",
  "GBP-USD": "Before EUR, GBP/USD (aka 'cable') was the top traded pair. It's named after the transatlantic cable!",
  "USD-INR": "The Indian Rupee was historically pegged to the Pound Sterling before moving to a managed float in 1971.",
  "USD-PKR": "Pakistan Rupee has depreciated over 90% against USD since 1947 partition!",
};

// Get contextual currency jokes
export function getCurrencyJoke(fromCurrency: string, toCurrency: string): JokeComment {
  const pairKey = `${fromCurrency}-${toCurrency}`;
  const jokes = currencyJokes[fromCurrency] || currencyJokes.default;
  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  
  return {
    id: `joke-${Date.now()}`,
    type: "joke",
    content: joke,
    currencyPair: pairKey,
    timestamp: Date.now(),
  };
}

// Get trivia for currency pair
export function getCurrencyTrivia(fromCurrency: string, toCurrency: string): JokeComment {
  const key = `${fromCurrency}-${toCurrency}`;
  const trivia = currencyTrivia[key] || 
    `Did you know? ${getCurrencyByCode(fromCurrency)?.name} and ${getCurrencyByCode(toCurrency)?.name} have different inflation rates that affect this exchange rate daily!`;
  
  return {
    id: `trivia-${Date.now()}`,
    type: "trivia",
    content: trivia,
    currencyPair: key,
    timestamp: Date.now(),
  };
}

// Fetch joke from free API
export async function fetchRandomJoke(): Promise<JokeComment> {
  try {
    const response = await fetch(JOKE_APIS[0], { signal: AbortSignal.timeout(5000) });
    if (response.ok) {
      const data = await response.json();
      return {
        id: `api-joke-${Date.now()}`,
        type: "joke",
        content: data.joke || data.setup + " " + data.punchline,
        timestamp: Date.now(),
      };
    }
  } catch {
    // Fallback to local jokes
  }
  
  const fallback = currencyJokes.default[Math.floor(Math.random() * currencyJokes.default.length)];
  return {
    id: `local-joke-${Date.now()}`,
    type: "joke",
    content: fallback,
    timestamp: Date.now(),
  };
}

// Get learning tip based on currencies
export function getLearningTip(fromCurrency: string, toCurrency: string): JokeComment {
  const from = getCurrencyByCode(fromCurrency);
  const to = getCurrencyByCode(toCurrency);
  
  const tips = [
    `Exchange tip: Check mid-market rates. The mid-market rate is the fairest rate you should expect - any spread above this is the provider's fee.`,
    `Currency insight: ${from?.name} has ${from?.decimalPlaces || 2} decimal places, while ${to?.name} uses ${to?.decimalPlaces || 2}. This affects rounding!`,
    `Travel hack: Converting money at airports typically has the worst rates. Use local ATMs or order foreign currency online beforehand.`,
    `Economic fact: When reading exchange rate charts, upward movement means ${toCurrency} is strengthening against ${fromCurrency}.`,
    `Forex basics: Currency pairs move in pips. One pip is typically 0.0001, but for JPY pairs it's 0.01.`,
  ];
  
  const tip = tips[Math.floor(Math.random() * tips.length)];
  
  return {
    id: `tip-${Date.now()}`,
    type: "tip",
    content: tip,
    currencyPair: `${fromCurrency}-${toCurrency}`,
    timestamp: Date.now(),
  };
}

// Get fun fact about a currency
export function getFunFact(currencyCode: string): JokeComment {
  const currency = getCurrencyByCode(currencyCode);
  if (!currency) {
    return {
      id: `fact-${Date.now()}`,
      type: "funfact",
      content: "Currency not found in our database!",
      timestamp: Date.now(),
    };
  }
  
  const facts = [
    `${currency.name} (${currency.code}) is used in ${currency.country}.`,
    `The ${currency.country} ${currency.name} has been around since ${currency.introduced || 'ancient times'}!`,
    `${currency.code} uses ${currency.decimalPlaces} decimal place${currency.decimalPlaces !== 1 ? 's' : ''} for most transactions.`,
    `${currency.region} currencies often have similar economic patterns due to regional trade relationships.`,
  ];
  
  const fact = facts[Math.floor(Math.random() * facts.length)];
  
  return {
    id: `fact-${Date.now()}`,
    type: "funfact",
    content: fact,
    timestamp: Date.now(),
  };
}

// Save comment to localStorage
const COMMENTS_KEY = "conversion-hub-joke-comments";
export function saveComment(comment: JokeComment): void {
  try {
    const existing = getComments();
    existing.unshift(comment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(existing.slice(0, 50)));
  } catch {
    // Silent fail
  }
}

// Get saved comments
export function getComments(): JokeComment[] {
  try {
    return JSON.parse(localStorage.getItem(COMMENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

// Clear comments
export function clearComments(): void {
  localStorage.removeItem(COMMENTS_KEY);
}