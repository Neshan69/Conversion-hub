"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { conversionCategories } from "@/data/conversions";
import { usePathname } from "next/navigation";

interface RelatedConvertersProps {
  currentCategoryId: string;
}

export const RelatedConverters = function RelatedConverters({ currentCategoryId }: RelatedConvertersProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const relatedCategories = useMemo(() => {
    return conversionCategories
      .filter(cat => cat.id !== currentCategoryId)
      .slice(0, 8);
  }, [currentCategoryId]);

  const currentCategory = useMemo(() => {
    return conversionCategories.find(cat => cat.id === currentCategoryId);
  }, [currentCategoryId]);

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) return null;

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Other Converters
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our other conversion tools
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href={`/convert/${category.id}`}
              className="group flex flex-col h-full p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 hover:shadow-lg"
              prefetch={true}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-base font-bold group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
                {category.description}
              </p>

              <div className="mt-auto flex items-center gap-2 text-sm text-primary font-medium group-hover:underline">
                Try it
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Accordion sections for detailed browsing */}
      <div className="mt-12 space-y-4">
        {conversionCategories.map((category) => (
          <div key={category.id}>
            <button
              onClick={() => toggleSection(category.id)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {Object.keys(category.units).length} units
                </span>
              </div>
              {openSections[category.id] ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>

            <AnimatePresence>
              {openSections[category.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {Object.entries(category.units).map(([key, unit]) => (
                      <Link
                        key={key}
                        href={`/convert/${category.id}?from=${key}`}
                        className="p-2 rounded-lg bg-muted/50 hover:bg-primary/10 text-sm text-muted-foreground hover:text-primary transition-colors text-center"
                      >
                        {unit.symbol} - {unit.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Breadcrumb */}
      {currentCategory && (
        <nav className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronDown className="w-3 h-3" />
          <Link href="/convert" className="hover:text-primary transition-colors">Converters</Link>
          <ChevronDown className="w-3 h-3" />
          <Link
            href={`/convert/${currentCategory.id}`}
            className="hover:text-primary transition-colors font-medium"
          >
            {currentCategory.name}
          </Link>
        </nav>
      )}
    </div>
  );
};