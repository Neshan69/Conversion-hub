import { GetStaticPaths } from "next";
import { redirect, notFound } from "next/navigation";
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

// Generate static paths for all categories
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = conversionCategories.map((category) => ({
    params: { category: category.id },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categoryId } = params;

  // Special handling for currency
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
    };
  }

  const category = getCategoryById(categoryId);
  
  if (!category) {
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
    },
    alternates: {
      canonical: `https://conversionhub.com/convert/${categoryId}`,
    },
  };
}

export default function CategoryPage({ params, searchParams }: PageProps) {
  const { category: categoryId } = params;
  const { from, to } = searchParams;

  // Special handling for currency category
  if (categoryId === "currency") {
    // If query params provided, redirect to specific currency pair
    if (from && to) {
      redirect(`/currency/${from}/to/${to}`);
    }
    redirect("/currency");
  }

  // Redirect query-based URLs to SEO-friendly paths
  if (from && to) {
    redirect(`/convert/${categoryId}/${from}-to-${to}`);
  }

  const category = getCategoryById(categoryId);
  if (!category) {
    notFound();
  }

  return <UnitConverterPage categoryId={categoryId} />;
}