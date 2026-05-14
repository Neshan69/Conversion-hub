"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { conversionCategories } from "@/data/conversions";
import { cn } from "@/lib/utils";
import { currencies, searchCurrencies, getCurrencyByCode } from "@/types/currency";

interface SearchResult {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  unitKey: string;
  unitName: string;
  unitSymbol: string;
  type: "unit" | "currency";
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchIndex = useMemo(() => {
    const results: SearchResult[] = [];

    for (const category of conversionCategories) {
      for (const [unitKey, unit] of Object.entries(category.units)) {
        results.push({
          categoryId: category.id,
          categoryName: category.name,
          categoryIcon: category.icon,
          unitKey,
          unitName: unit.name,
          unitSymbol: unit.symbol,
          type: "unit",
        });
      }
    }

    for (const currency of currencies) {
      results.push({
        categoryId: "currency",
        categoryName: "Currency",
        categoryIcon: "💱",
        unitKey: currency.code,
        unitName: currency.name,
        unitSymbol: currency.symbol,
        type: "currency",
      });
    }

    return results;
  }, []);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return searchIndex.slice(0, 15);

    const lowerQuery = query.toLowerCase().trim();
    return searchIndex
      .filter(result =>
        result.unitName.toLowerCase().includes(lowerQuery) ||
        result.unitSymbol.toLowerCase().includes(lowerQuery) ||
        result.categoryName.toLowerCase().includes(lowerQuery) ||
        result.unitKey.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 15);
  }, [query, searchIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
      e.preventDefault();
      const result = filteredResults[selectedIndex];
      if (result.type === "currency") {
        window.location.href = `/currency/${result.unitKey.toLowerCase()}`;
      } else {
        window.location.href = `/convert/${result.categoryId}?from=${result.unitKey}`;
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, [filteredResults, selectedIndex]);

  useEffect(() => { setSelectedIndex(0); }, [query]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Search</h1>
          <p className="text-lg text-muted-foreground">
            Find any currency or converter instantly
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              placeholder="Search currencies, units, converters..."
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-card border-2 border-border text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              autoComplete="off"
              aria-label="Search converters and currencies"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted transition-colors" aria-label="Clear search">
                <XIcon className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="flex justify-center mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Keyboard className="w-3 h-3" />
              ↑↓ Navigate
            </span>
            <span className="mx-2">•</span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Enter</kbd> Select
            <span className="mx-2">•</span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Esc</kbd> Close
          </div>

          <AnimatePresence>
            {isOpen && query.trim() === "" && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="mt-3">
                <h3 className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Popular Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {conversionCategories.slice(0, 6).map((category) => (
                    <Link key={category.id} href={`/convert/${category.id}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent/5 transition-all">
                      <span className="text-xl">{category.icon}</span>
                      <div>
                        <p className="font-medium text-sm text-foreground">{category.name}</p>
                        <p className="text-[10px] text-muted-foreground">{Object.keys(category.units).length} units</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <h3 className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2 mt-4">Popular Currencies</h3>
                <div className="grid grid-cols-3 gap-2">
                  {["USD", "EUR", "GBP", "JPY", "INR", "AUD"].map((code) => {
                    const info = getCurrencyByCode(code);
                    return (
                      <Link key={code} href={`/currency/${code.toLowerCase()}`} onClick={() => setIsOpen(false)} className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent/5 transition-all">
                        <span className="text-lg">{info?.flag}</span>
                        <span className="text-sm font-medium">{code}</span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {isOpen && query.trim() !== "" && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-1 mt-1 max-h-[60vh] overflow-y-auto overscroll-contain">
                {filteredResults.length > 0 ? (
                  <>
                    <p className="text-[11px] text-muted-foreground px-1 mb-1">
                      {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
                    </p>
                    {filteredResults.map((result, index) => (
                      <motion.div key={`${result.categoryId}-${result.unitKey}`} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.02 }}>
                        <Link
                          href={result.type === "currency" ? `/currency/${result.unitKey.toLowerCase()}` : `/convert/${result.categoryId}`}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border transition-all",
                            index === selectedIndex ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-primary/30 hover:bg-accent/5"
                          )}
                        >
                          <span className="text-xl">
                            {result.type === "currency"
                              ? getCurrencyByCode(result.unitKey)?.flag
                              : result.categoryIcon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{result.unitName}</span>
                              <span className="text-[10px] bg-muted px-1 py-0.3 rounded font-mono text-muted-foreground">{result.unitSymbol}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate">{result.categoryName}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                        </Link>
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No results for "{query}"</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {!query && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-16">
            <h3 className="text-lg font-semibold mb-5">Quick Access</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "kg → lbs", href: "/convert/weight?from=kilogram&to=pound" },
                { label: "°C → °F", href: "/convert/temperature?from=celsius&to=fahrenheit" },
                { label: "km → mi", href: "/convert/length?from=kilometer&to=mile" },
                { label: "L → gal", href: "/convert/volume?from=liter&to=gallonUS" },
                { label: "m → ft", href: "/convert/length?from=meter&to=foot" },
                { label: "GB → MB", href: "/convert/storage?from=gigabyte&to=megabyte" },
                { label: "USD → EUR", href: "/currency/usd/to/eur" },
                { label: "USD → INR", href: "/currency/usd/to/inr" },
                { label: "EUR → GBP", href: "/currency/eur/to/gbp" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="p-3.5 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent/5 transition-all text-sm font-medium text-foreground flex items-center gap-2">
                  {link.label}
                  <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}