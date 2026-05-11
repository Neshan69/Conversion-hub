import { MetadataRoute } from "next";
import { conversionCategories } from "@/data/conversions";

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
  ];

  const categoryPages = conversionCategories.map((category) => ({
    url: `${baseUrl}/convert/${category.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

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

  return [...staticPages, ...categoryPages, ...conversionPages];
}