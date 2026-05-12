import { MetadataRoute } from "next";
import { conversionCategories } from "@/data/conversions";
import { currencies, getPopularCurrencies } from "@/types/currency";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://conversionhub.com";
  
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/convert`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/currency`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  const categoryPages = conversionCategories.map((category) => ({
    url: `${baseUrl}/convert/${category.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // Currency main page
  const currencyPages = [
    {
      url: `${baseUrl}/currency`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }
  ];

  // Generate popular currency pair pages (limit to prevent sitemap bloat)
  const popularCurrencies = getPopularCurrencies();
  const popularPairs: Array<{ from: string; to: string }> = [];

  // Top 15 currencies, generate pairs with USD and major ones
  const topCurrencies = ["USD", "EUR", "GBP", "JPY", "INR", "PKR", "NPR", "AED", "SAR", "CNY", "KRW", "THB", "TRY", "RUB", "BRL", "MXN", "CAD", "AUD", "CHF"];
  
  topCurrencies.forEach((from) => {
    topCurrencies.forEach((to) => {
      if (from !== to) {
        popularPairs.push({ from, to });
      }
    });
  });

  // Add cross with USD for all other popular currencies
  popularCurrencies.forEach((currency) => {
    if (!topCurrencies.includes(currency.code)) {
      popularPairs.push({ from: "USD", to: currency.code });
      popularPairs.push({ from: currency.code, to: "USD" });
    }
  });

  const currencyPairPages = popularPairs.map((pair) => ({
    url: `${baseUrl}/currency/${pair.from}/to/${pair.to}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Generate conversion pages for unit converters (existing)
  const conversionPages = [];
  
  for (const category of conversionCategories) {
    const unitKeys = Object.keys(category.units);
    
    for (const from of unitKeys) {
      for (const to of unitKeys) {
        if (from !== to) {
          conversionPages.push({
            url: `${baseUrl}/convert/${category.id}/${from}-to-${to}`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
          });
        }
      }
    }
  }

  return [...staticPages, ...categoryPages, ...currencyPages, ...currencyPairPages, ...conversionPages];
}
