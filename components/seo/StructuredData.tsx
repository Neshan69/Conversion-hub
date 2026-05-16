interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function SiteWideStructuredData() {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Conversion Hub",
        url: "https://conversionhub.com",
        description: "Live currency converter and online unit converter for exchange rates and measurement tools.",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://conversionhub.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
        inLanguage: "en-US",
      }}
    />
  );
}

export function SoftwareApplicationStructuredData() {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Conversion Hub",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      }}
    />
  );
}

export function FAQStructuredData({ questions }: { questions: Array<{ question: string; answer: string }> }) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
          },
        })),
      }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
