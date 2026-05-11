import { GetStaticPaths, GetStaticProps } from "next";
import { notFound } from "next/navigation";
import { UnitConverterPage } from "@/components/converter/UnitConverterPage";
import { getCategoryById, conversionCategories } from "@/data/conversions";
import { Metadata } from "next";

interface PageProps {
  params: {
    category: string;
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

export default function CategoryPage({ params }: PageProps) {
  const { category } = params;
  
  return (
    <UnitConverterPage 
      categoryId={category}
    />
  );
}