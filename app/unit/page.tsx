"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const conversionCategories = [
  { id: "length", name: "Length", icon: "📏", color: "from-blue-400 to-cyan-500" },
  { id: "weight", name: "Weight", icon: "⚖️", color: "from-purple-400 to-pink-500" },
  { id: "temperature", name: "Temperature", icon: "🌡️", color: "from-orange-400 to-red-500" },
  { id: "speed", name: "Speed", icon: "🚀", color: "from-green-400 to-emerald-500" },
  { id: "area", name: "Area", icon: "📐", color: "from-indigo-400 to-blue-500" },
  { id: "volume", name: "Volume", icon: "🧊", color: "from-cyan-400 to-blue-500" },
  { id: "time", name: "Time", icon: "⏰", color: "from-amber-400 to-orange-500" },
  { id: "storage", name: "Storage", icon: "💾", color: "from-violet-400 to-purple-500" },
];

export default function UnitPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Unit Converters
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              Fast, accurate conversions between measurement units. Length, weight, temperature, and more.
            </p>

            {/* Quick search */}
            <div className="max-w-lg mx-auto">
              <Link
                href="/search"
                className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-card border border-border hover:border-primary/30 hover:bg-accent/5 transition-all duration-200 text-left"
              >
                <SearchIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-muted-foreground">Search converters...</span>
                <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground">/</kbd>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6 mt-12"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              8 Categories
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              50+ Units
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 text-sm font-medium">
              100% Accurate
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Conversion Categories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse all available conversion tools organized by category.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {conversionCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <Link
                  href={`/unit/${category.id}`}
                  className="group block p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/15 hover:-translate-y-1.5 transition-all duration-250 active:scale-[0.98]"
                  style={{ touchAction: "manipulation" }}
                  prefetch={true}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-1.5 group-hover:text-primary transition-colors">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                    Convert between various {category.name.toLowerCase()} units with precision.
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <span className="text-[11px] text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                      Convert {category.name}
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

      {/* Popular quick conversions */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Conversions</h2>
            <p className="text-lg text-muted-foreground">Common conversions people look for</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {[
              { label: "km → mi", href: "/unit/length?from=kilometer&to=mile" },
              { label: "kg → lbs", href: "/unit/weight?from=kilogram&to=pound" },
              { label: "°C → °F", href: "/unit/temperature?from=celsius&to=fahrenheit" },
              { label: "L → gal", href: "/unit/volume?from=liter&to=gallonUS" },
              { label: "m → ft", href: "/unit/length?from=meter&to=foot" },
              { label: "GB → MB", href: "/unit/storage?from=gigabyte&to=megabyte" },
              { label: "km/h → mph", href: "/unit/speed?from=kilometerPerHour&to=milePerHour" },
              { label: "hr → min", href: "/unit/time?from=hour&to=minute" },
              { label: "m² → ft²", href: "/unit/area?from=squareMeter&to=squareFoot" },
              { label: "°F → °C", href: "/unit/temperature?from=fahrenheit&to=celsius" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent/5 transition-all text-sm font-medium text-foreground group"
                prefetch={true}
              >
                {link.label}
                <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
