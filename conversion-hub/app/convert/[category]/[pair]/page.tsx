import { GetStaticPaths, GetStaticProps } from "next";
import { notFound } from "next/navigation";
import { UnitConverterPage } from "@/components/converter/UnitConverterPage";
import { getCategoryByUnits, getCategoryById, conversionCategories } from "@/data/conversions";
import { Metadata } from "next";

interface PageProps {
  params: {
    category: string;
    pair: string;
  };
}

// Generate static paths for all unit pair combinations within categories
export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { category: string; pair: string } }[] = [];
  
  for (const category of conversionCategories) {
    const unitKeys = Object.keys(category.units);
    
    for (const from of unitKeys) {
      for (const to of unitKeys) {
        if (from !== to) {
          paths.push({
            params: { 
              category: category.id, 
              pair: `${from}-to-${to}` 
            },
          });
        }
      }
    }
  }

  return {
    paths,
    fallback: "blocking",
  };
};

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categoryId, pair } = params;
  const [fromUnit, toUnit] = pair.split("-to-");
  
  if (!fromUnit || !toUnit) {
    return {
      title: "Converter Not Found",
      description: "The requested unit conversion is not available.",
    };
  }

  const category = getCategoryById(categoryId);
  
  if (!category) {
    return {
      title: "Converter Not Found",
      description: "The requested converter category is not available.",
    };
  }

  const fromUnitData = category.units[fromUnit];
  const toUnitData = category.units[toUnit];

  if (!fromUnitData || !toUnitData) {
    return {
      title: "Converter Not Found",
      description: "The requested unit conversion is not available.",
    };
  }

  const title = `${fromUnitData.name} to ${toUnitData.name} Converter (${fromUnitData.symbol} → ${toUnitData.symbol}) – Fast & Accurate`;
  const description = `Convert ${fromUnitData.name} to ${toUnitData.name} instantly. Free online ${fromUnitData.symbol} to ${toUnitData.symbol} converter with accurate results and easy copy function.`;

  return {
    title,
    description,
    keywords: [
      `${fromUnit} to ${toUnit}`,
      `${fromUnitData.symbol} to ${toUnitData.symbol}`,
      `${fromUnitData.name} to ${toUnitData.name} converter`,
      `${category.name.toLowerCase()} converter`,
      "online converter",
      "free conversion tool",
    ].join(", "),
    openGraph: {
      title,
      description,
      url: `https://conversionhub.com/convert/${categoryId}/${pair}`,
      type: "website",
      images: [
        {
          url: `/og-image?category=${categoryId}&from=${fromUnit}&to=${toUnit}`,
          width: 1200,
          height: 630,
          alt: `${fromUnitData.name} to ${toUnitData.name} converter`,
        },
      ],
    },
    alternates: {
      canonical: `https://conversionhub.com/convert/${categoryId}/${pair}`,
    },
  };
}

export default function ConverterPage({ params }: PageProps) {
  const { category: categoryId, pair } = params;
  const [fromUnit, toUnit] = pair.split("-to-");

  if (!fromUnit || !toUnit) {
    notFound();
  }

  const category = getCategoryByUnits(fromUnit, toUnit);

  if (!category || category.id !== categoryId) {
    notFound();
  }

  return (
    <UnitConverterPage
      categoryId={category.id}
      initialFromUnit={fromUnit}
      initialToUnit={toUnit}
    />
  );
}