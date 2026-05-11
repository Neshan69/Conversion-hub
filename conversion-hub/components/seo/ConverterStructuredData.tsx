"use client";

import { useEffect } from "react";
import { getCategoryById } from "@/data/conversions";

interface ConverterStructuredDataProps {
  categoryId: string;
  initialFromUnit?: string;
  initialToUnit?: string;
}

export function ConverterStructuredData({ 
  categoryId, 
  initialFromUnit, 
  initialToUnit 
}: ConverterStructuredDataProps) {
  useEffect(() => {
    const category = getCategoryById(categoryId);
    if (!category || !initialFromUnit || !initialToUnit) return;

    const fromUnit = category.units[initialFromUnit];
    const toUnit = category.units[initialToUnit];

    if (!fromUnit || !toUnit) return;

    // Generic WebApplication schema for conversion tool
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": `${fromUnit.name} to ${toUnit.name} Converter`,
      "description": `Free online ${fromUnit.name} to ${toUnit.name} converter. Convert ${fromUnit.symbol} to ${toUnit.symbol} instantly.`,
      "url": `https://conversionhub.com/convert/${categoryId}/${initialFromUnit}-to-${initialToUnit}`,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        `Real-time ${category.name.toLowerCase()} conversion`,
        `Instant conversion from ${fromUnit.symbol} to ${toUnit.symbol}`,
        "Copy results to clipboard",
        "Accurate conversion factors"
      ]
    };

    // Add HowTo schema for conversion process
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `How to convert ${fromUnit.name} to ${toUnit.name}`,
      "description": `Learn how to convert ${fromUnit.name} to ${toUnit.name} using our free online converter.`,
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter the value in the source unit",
          "text": `Input your value in ${fromUnit.name} (${fromUnit.symbol})`
        },
        {
          "@type": "HowToStep",
          "name": "Select target unit",
          "text": `Choose ${toUnit.name} (${toUnit.symbol}) as the target unit`
        },
        {
          "@type": "HowToStep",
          "name": "Get the result",
          "text": "The converted value appears instantly"
        }
      ]
    };

    // Add both schemas
    const script1 = document.createElement("script");
    script1.type = "application/ld+json";
    script1.text = JSON.stringify(schema);
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.type = "application/ld+json";
    script2.text = JSON.stringify(howToSchema);
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [categoryId, initialFromUnit, initialToUnit]);

  return null;
}