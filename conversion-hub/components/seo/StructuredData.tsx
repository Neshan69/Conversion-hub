"use client";

import { useEffect } from "react";

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);

  return null;
}

export function SiteWideStructuredData() {
  const siteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Conversion Hub",
    "url": "https://conversionhub.com",
    "description": "All-in-one conversion platform for units, currencies, files, and more",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://conversionhub.com/convert?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-US"
  };

  return <StructuredData data={siteData} />;
}

export function SoftwareApplicationStructuredData() {
  const appData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Conversion Hub",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "156"
    }
  };

  return <StructuredData data={appData} />;
}

export function FAQStructuredData({ questions }: { questions: Array<{question: string; answer: string}> }) {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };

  return <StructuredData data={faqData} />;
}

export function BreadcrumbStructuredData({ items }: { items: Array<{name: string; url: string}> }) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return <StructuredData data={breadcrumbData} />;
}