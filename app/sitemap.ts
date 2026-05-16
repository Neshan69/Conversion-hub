import type { MetadataRoute } from "next";
import { conversionCategories } from "@/data/conversions";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://conversionhub.com";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/unit`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/currency`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
  ];

  const categoryPages = conversionCategories.map((category) => ({
    url: `${baseUrl}/unit/${category.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const topCurrencies = ["USD", "EUR", "GBP", "JPY", "INR", "PKR", "NPR", "AED", "SAR", "CNY", "KRW", "THB", "TRY", "RUB", "BRL", "MXN", "CAD", "AUD", "CHF"];

  const currencyPairPages: Array<{ url: string; lastModified: Date; changeFrequency: "daily"; priority: number }> = [];

  topCurrencies.forEach((from) => {
    topCurrencies.forEach((to) => {
      if (from !== to) {
        currencyPairPages.push({
          url: `${baseUrl}/currency/${from}/${to}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.7,
        });
      }
    });
  });

  const seoCurrencyPages = ["usd-to-gbp", "usd-to-npr", "usd-to-eur", "usd-to-inr"].map((pair) => ({
    url: `${baseUrl}/currency/${pair}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  const seoUnitPages = ["kg-to-lbs", "cm-to-feet"].map((pair) => ({
    url: `${baseUrl}/unit/${pair}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  // Conversion pages
  const conversionPages: Array<{ url: string; lastModified: Date; changeFrequency: "daily"; priority: number }> = [];
  for (const category of conversionCategories) {
    const unitKeys = Object.keys(category.units);
    for (const from of unitKeys) {
      for (const to of unitKeys) {
        if (from !== to) {
          conversionPages.push({
            url: `${baseUrl}/unit/${category.id}?from=${from}&to=${to}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
          });
        }
      }
    }
  }

  return [...staticPages, ...categoryPages, ...seoCurrencyPages, ...seoUnitPages, ...currencyPairPages, ...conversionPages];
}
