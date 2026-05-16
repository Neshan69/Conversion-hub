"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";
import { conversionCategories } from "@/data/conversions";

const quickLinks = [
  { label: "km to mi", href: "/unit/length?from=kilometer&to=mile" },
  { label: "kg to lbs", href: "/unit/weight?from=kilogram&to=pound" },
  { label: "C to F", href: "/unit/temperature?from=celsius&to=fahrenheit" },
  { label: "L to gal", href: "/unit/volume?from=liter&to=gallonUS" },
  { label: "cm to feet", href: "/unit/cm-to-feet" },
  { label: "GB to MB", href: "/unit/storage?from=gigabyte&to=megabyte" },
  { label: "psi to kPa", href: "/unit/pressure?from=psi&to=kilopascal" },
  { label: "kWh to J", href: "/unit/energy?from=kilowattHour&to=joule" },
  { label: "km/h to mph", href: "/unit/speed?from=kilometerPerHour&to=milePerHour" },
  { label: "hr to min", href: "/unit/time?from=hour&to=minute" },
];

export default function UnitPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <section className="relative py-14 md:py-24 bg-gradient-to-b from-muted/50 to-background">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-30" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Unit Converter
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              Convert length, weight, temperature, area, pressure, energy, data storage, and more with instant precision.
            </p>

            <Link
              href="/search"
              className="mx-auto max-w-lg group flex items-center gap-3 px-6 py-3 rounded-2xl bg-card/80 border border-border hover:border-primary/30 hover:bg-accent/5 transition-all duration-200 text-left"
            >
              <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-muted-foreground">Search converters...</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mt-10"
          >
            {["10 Categories", "70+ Units", "Mobile Ready", "Instant Results"].map((label) => (
              <div key={label} className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Conversion Categories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse the complete toolkit, tuned for keyboard, touch, and fast repeated use.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {conversionCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
              >
                <Link
                  href={`/unit/${category.id}`}
                  className="group block h-full p-5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/15 hover:-translate-y-1 transition-all active:scale-[0.98]"
                  prefetch={true}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-sm font-bold text-white mb-4 shadow-lg`}>
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-1.5 group-hover:text-primary transition-colors">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{category.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <span className="text-[11px] text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                      {Object.keys(category.units).length} units
                    </span>
                    <span className="text-[11px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      Open <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Conversions</h2>
            <p className="text-lg text-muted-foreground">SEO-friendly routes for common searches.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent/5 transition-all text-sm font-medium text-foreground group"
                prefetch={true}
              >
                <span className="truncate">{link.label}</span>
                <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
