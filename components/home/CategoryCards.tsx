"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { conversionCategories, currencyCategory } from "@/data/conversions";

export function CategoryCards() {
  const router = useRouter();

  // Prefetch routes on mount for instant navigation
  useEffect(() => {
    const prefetchRoutes = async () => {
      // Prefetch all category pages
      const routes = ["/currency", ...conversionCategories.map(c => `/unit/${c.id}`)];
      routes.forEach(route => router.prefetch(route));
    };
    prefetchRoutes();
  }, [router]);

  const extraCategories = [
    {
      id: "roman",
      name: "Roman Numerals",
      description: "Instant Roman numeral conversion, history, and premium clock previews.",
      icon: "📜",
      color: "from-amber-400 to-orange-500",
      units: {},
    },
    {
      id: "world-clock",
      name: "World Clock",
      description: "Live global clock dashboard, time zone comparison, and favorites.",
      icon: "🕒",
      color: "from-cyan-400 to-blue-500",
      units: {},
    },
  ];

  const allCategories = [currencyCategory, ...extraCategories, ...conversionCategories];

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Conversion Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive suite of conversion tools designed for accuracy and ease of use
          </p>
        </motion.div>

{/* Category grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
           {allCategories.map((category, index) => {
             const href =
               category.id === "currency"
                 ? "/currency"
                 : category.id === "roman"
                 ? "/roman"
                 : category.id === "world-clock"
                 ? "/world-clock"
                 : `/unit/${category.id}`;
             return (
               <motion.div
                 key={category.id}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-60px" }}
                 transition={{ duration: 0.35, delay: index * 0.04 }}
               >
                 <Link
                   href={href}
                   prefetch={true}
                   scroll={true}
                   className="group block h-full w-full text-left p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/15 hover:-translate-y-1.5 transition-all duration-250 active:scale-[0.98]"
                   style={{ touchAction: "manipulation" }}
                 >
                   {/* Icon and color accent */}
                   <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-xl mb-4 group-hover:scale-105 transition-transform duration-250 shadow-md`}>
                     {category.icon}
                   </div>

                   {/* Content */}
                   <h3 className="text-lg font-bold mb-1.5 group-hover:text-primary transition-colors flex items-center gap-2">
                     {category.name}
                     {category.id === "currency" && (
                       <span className="ml-1 text-[10px] px-2 py-0.5 bg-gradient-to-r from-primary/20 to-accent/20 text-primary rounded-full font-normal border border-primary/10">
                         POPULAR
                       </span>
                     )}
                   </h3>
                   <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                     {category.description}
                   </p>

                   {/* Unit count with icon */}
                   <div className="mt-auto pt-3 border-t border-border/30 flex items-center justify-between">
                     <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                       {category.id === "currency" ? "🌍 180+ currencies" : `${Object.keys(category.units).length} units`}
                     </span>
                     <span className="text-[11px] text-primary font-medium group-hover:underline flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                       Open
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                       </svg>
                     </span>
                   </div>
                 </Link>
               </motion.div>
             );
           })}
         </div>

          {/* More categories CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-12 text-center"
          >
            <Link
              href="/unit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary font-semibold hover:bg-primary/20 transition-all duration-200 hover:shadow-md"
            >
              View All Unit Converters
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
      </div>
    </section>
  );
}
