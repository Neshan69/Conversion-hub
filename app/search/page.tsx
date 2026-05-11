"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, X, ArrowRight, Keyboard } from "lucide-react";
import { conversionCategories } from "@/data/conversions";
import { cn } from "@/lib/utils";

interface SearchResult {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  unitKey: string;
  unitName: string;
  unitSymbol: string;
  type: "unit";
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

   // Build search index
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
          type: "unit" as const,
        });
      }
    }
    
    return results;
  }, []);

  // Filter results based on query
  const filteredResults = useMemo(() => {
    if (!query.trim()) return searchIndex.slice(0, 12);
    
    const lowerQuery = query.toLowerCase();
    return searchIndex
      .filter(result => 
        result.unitName.toLowerCase().includes(lowerQuery) ||
        result.unitSymbol.toLowerCase().includes(lowerQuery) ||
        result.categoryName.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 12);
  }, [query, searchIndex]);

  // Handle keyboard navigation
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
      window.location.href = `/convert/${result.categoryId}?from=${result.unitKey}&to=${Object.keys(conversionCategories.find(c => c.id === result.categoryId)!.units)[0]}`;
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, [filteredResults, selectedIndex]);

  // Reset selected index when query changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="min-h-screen py-12 md:py-20" ref={containerRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Search Converters
          </h1>
          <p className="text-lg text-muted-foreground">
            Find any conversion tool instantly
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              placeholder="Search units (e.g., kg, pounds, celsius...)"
              className={cn(
                "w-full h-14 pl-12 pr-12 rounded-2xl",
                "bg-card border border-border",
                "text-base placeholder:text-muted-foreground/60",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                "transition-all duration-200"
              )}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Keyboard hint */}
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Keyboard className="w-3 h-3" />
              ↑↓ Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Enter</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Esc</kbd>
              Close
            </span>
          </div>
        </motion.div>

        {/* Results Dropdown */}
        <AnimatePresence>
          {isOpen && query.trim() === "" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8"
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Popular Categories
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {conversionCategories.slice(0, 4).map((category) => (
                  <Link
                    key={category.id}
                    href={`/convert/${category.id}`}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent/5 transition-all"
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <p className="font-medium text-foreground">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {Object.keys(category.units).length} units
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <AnimatePresence>
          {isOpen && query.trim() !== "" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {filteredResults.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""} found
                  </p>
                  {filteredResults.map((result, index) => (
                    <motion.div
                      key={`${result.categoryId}-${result.unitKey}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link
                        href={`/convert/${result.categoryId}`}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border transition-all",
                          index === selectedIndex
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border bg-card hover:border-primary/30 hover:bg-accent/5"
                        )}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-2xl">{result.categoryIcon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {result.unitName}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono text-muted-foreground">
                              {result.unitSymbol}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {result.categoryName}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100" />
                      </Link>
                    </motion.div>
                  ))}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No converters found for &quot;{query}&quot;
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try searching for units like &quot;kg&quot;, &quot;meters&quot;, &quot;celsius&quot;, etc.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Links */}
        {!query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "kg to lbs", href: "/convert/weight?from=kilogram&to=pound" },
                { label: "°C to °F", href: "/convert/temperature?from=celsius&to=fahrenheit" },
                { label: "km to miles", href: "/convert/length?from=kilometer&to=mile" },
                { label: "L to gal", href: "/convert/volume?from=liter&to=gallonUS" },
                { label: "m to ft", href: "/convert/length?from=meter&to=foot" },
                { label: "GB to MB", href: "/convert/storage?from=gigabyte&to=megabyte" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent/5 transition-all text-sm font-medium text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}