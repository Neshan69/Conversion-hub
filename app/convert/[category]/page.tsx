import { GetStaticPaths } from "next";
import { notFound } from "next/navigation";
import { UnitConverterPage } from "@/components/converter/UnitConverterPage";
import { getCategoryById, conversionCategories } from "@/data/conversions";
import { Metadata } from "next";

interface PageProps {
  params: {
    category: string;
  };
  searchParams: {
    from?: string;
    to?: string;
  };
}

// Generate static paths for all categories at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = conversionCategories.map((category) => ({
    params: { category: category.id },
  }));

  return {
    paths,
    fallback: "blocking", // Render on-demand if not pre-generated
  };
};

// Generate dynamic metadata for each category page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categoryId } = params;

  // Special handling for currency (redirects to separate section)
  if (categoryId === "currency") {
    return {
      title: "Currency Converter - Live Exchange Rates | Conversion Hub",
      description: "Convert 180+ world currencies with live forex rates, historical charts, and accurate conversions.",
      openGraph: {
        title: "Global Currency Converter",
        description: "Real-time currency conversion for all major world currencies.",
        type: "website",
        url: "https://conversionhub.com/currency",
      },
      alternates: {
        canonical: "https://conversionhub.com/currency",
      },
      robots: { index: false, follow: false }, // Prevent indexing duplicate currency page
    };
  }

  const category = getCategoryById(categoryId);

  if (!category) {
    // Let Next.js handle 404
    return {
      title: "Converter Not Found",
      description: "The requested converter category is not available.",
    };
  }

  const title = `${category.name} Converter – Free Online ${category.name} Conversion Tool`;
  const description = `Free online ${category.name.toLowerCase()} converter. Convert between ${Object.keys(category.units).join(", ")} instantly with high precision. ${category.description}`;

  return {
    title,
    description,
    keywords: [
      category.name.toLowerCase(),
      `${category.name} converter`,
      ...Object.values(category.units).map(u => u.name),
      ...Object.values(category.units).map(u => u.symbol),
      "online converter",
      "free tool",
    ].join(", "),
    openGraph: {
      title,
      description,
      url: `https://conversionhub.com/convert/${categoryId}`,
      type: "website",
      images: [
        {
          url: `/og-image?category=${categoryId}`,
          width: 1200,
          height: 630,
          alt: `${category.name} Converter`,
        },
      ],
    },
    alternates: {
      canonical: `https://conversionhub.com/convert/${categoryId}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category: categoryId } = params;
  const { from, to } = searchParams;

  // Find the category
  const category = getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  // Pass category data to client component to avoid hydration mismatch
  return (
    <UnitConverterPage
      category={category}
      categoryId={categoryId}
      initialFromUnit={from}
      initialToUnit={to}
    />
  );
}
