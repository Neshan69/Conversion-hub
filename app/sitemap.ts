import type { MetadataRoute } from "next";
import { conversionCategories } from "@/data/conversions";
import { currencies, getPopularCurrencies } from "@/types/currency";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://conversionhub.com";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/convert`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/currency`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  const categoryPages = conversionCategories.map((category) => ({
    url: `${baseUrl}/convert/${category.id}`,
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
          url: `${baseUrl}/currency/${from}/to/${to}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.7,
        });
      }
    });
  });

  // Conversion pages
  const conversionPages: Array<{ url: string; lastModified: Date; changeFrequency: "daily"; priority: number }> = [];
  for (const category of conversionCategories) {
    const unitKeys = Object.keys(category.units);
    for (const from of unitKeys) {
      for (const to of unitKeys) {
        if (from !== to) {
          conversionPages.push({
            url: `${baseUrl}/convert/${category.id}/${from}-to-${to}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
          });
        }
      }
    }
  }

  return [...staticPages, ...categoryPages, ...currencyPairPages, ...conversionPages];
}