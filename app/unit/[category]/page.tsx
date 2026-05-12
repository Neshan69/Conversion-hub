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
export async function generateStaticParams() {
  return conversionCategories.map((category) => ({
    category: category.id,
  }));
}

// Generate dynamic metadata for each category page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categoryId } = params;

  const category = getCategoryById(categoryId);

  if (!category) {
    return {
      title: "Converter Not Found",
      description: "The requested converter category is not available.",
    };
  }

  const title = `${category.name} Converter – Free Online ${category.name} Conversion Tool | Conversion Hub`;
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
      url: `https://conversionhub.com/unit/${categoryId}`,
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
      canonical: `https://conversionhub.com/unit/${categoryId}`,
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

export default async function UnitCategoryPage({ params, searchParams }: PageProps) {
  const { category: categoryId } = params;
  const { from, to } = searchParams;

  // Find the category
  const category = getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <UnitConverterPage
      category={category}
      categoryId={categoryId}
      initialFromUnit={from}
      initialToUnit={to}
    />
  );
}
