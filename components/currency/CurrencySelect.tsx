"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Star } from "lucide-react";
import { searchCurrencies, getPopularCurrencies, Currency, getCurrencyByCode } from "@/types/currency";
import { getRecentCurrencies, getFavoriteCurrencies, addRecentCurrency } from "@/lib/currency-utils";

interface CurrencySelectProps {
  value: string;
  onChange: (code: string) => void;
  label?: string;
  exclude?: string[]; // Exclude certain currencies (e.g., same as value)
  showPopular?: boolean;
  showRecent?: boolean;
  showFavorites?: boolean;
  placeholder?: string;
  className?: string;
}

export function CurrencySelect({
  value,
  onChange,
  label,
  exclude = [],
  showPopular = true,
  showRecent = true,
  showFavorites = true,
  placeholder = "Search currency...",
  className = "",
}: CurrencySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCurrency = useMemo(() => 
    searchCurrencies(value)[0] || null, [value]
  );

  const handleSelect = useCallback((code: string) => {
    onChange(code);
    setIsOpen(false);
    setQuery("");
    // Add to recent
    addRecentCurrency(code);
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  }, []);

  const handleContainerClick = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const clearQuery = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  // Get filtered results
  const filteredResults = useMemo(() => {
    let results = searchCurrencies(query);
    
    // Exclude specified currencies
    results = results.filter(c => !exclude.includes(c.code));
    
    // Remove selected currency
    results = results.filter(c => c.code !== value);
    
    // Deduplicate
    results = results.filter((c, i, arr) => 
      arr.findIndex(x => x.code === c.code) === i
    );
    
    return results.slice(0, 50); // Limit for performance
  }, [query, exclude, value]);

  // Build display list with sections
  const recentCodes = showRecent ? getRecentCurrencies().filter(code => !exclude.includes(code) && code !== value) : [];
  const favoriteCodes = showFavorites ? getFavoriteCurrencies().filter(code => !exclude.includes(code) && code !== value) : [];
  const popularCodes = showPopular ? getPopularCurrencies().filter(c => !exclude.includes(c.code) && c.code !== value) : [];
  const resultItems = filteredResults
    .filter(c => {
      // Exclude already shown currencies
      const shownCodes = [...recentCodes, ...favoriteCodes, ...popularCodes];
      return !shownCodes.includes(c.code);
    });

  const displaySections = useMemo(() => {
    const sections: Array<{
      type: "recent" | "favorites" | "popular" | "results";
      label: string;
      items: Currency[];
    }> = [];

    if (recentCodes.length > 0) {
      const recentItems = recentCodes
        .map(code => {
          const currency = getCurrencyByCode(code);
          return currency || null;
        })
        .filter((item): item is Currency => item !== null);
      sections.push({ type: "recent", label: "Recent", items: recentItems });
    }

    if (favoriteCodes.length > 0) {
      const favoriteItems = favoriteCodes
        .map(code => {
          const currency = getCurrencyByCode(code);
          return currency || null;
        })
        .filter((item): item is Currency => item !== null);
      sections.push({ type: "favorites", label: "Favorites", items: favoriteItems });
    }

    if (popularCodes.length > 0) {
      const popularItems = popularCodes
        .filter((item): item is Currency => item !== null);
      sections.push({ type: "popular", label: "Popular", items: popularItems });
    }

    // Always show search results if there's a query or no other sections
    if (query.trim() !== '' || sections.length === 0) {
      sections.push({ type: "results", label: "Results", items: resultItems });
    }

    return sections;
  }, [recentCodes, favoriteCodes, popularCodes, resultItems, query]);

  // Combine all items for keyboard navigation
  const allItems = useMemo(() => {
    const recentItems: Currency[] = recentCodes
      .map(code => {
        const currency = getCurrencyByCode(code);
        return currency || null;
      })
      .filter((item): item is Currency => item !== null);
    
    const favoriteItems: Currency[] = favoriteCodes
      .map(code => {
        const currency = getCurrencyByCode(code);
        return currency || null;
      })
      .filter((item): item is Currency => item !== null);
    
    const popularItems: Currency[] = popularCodes
      .filter((item): item is Currency => item !== null);
    
    const resultItemsArray: Currency[] = resultItems
      .filter((item): item is Currency => item !== null);
    
    const combined: Currency[] = [...recentItems, ...favoriteItems, ...popularItems, ...resultItemsArray];
    return combined.filter((item, index, self) => 
      index === self.findIndex(t => t.code === item.code)
    );
  }, [recentCodes, favoriteCodes, popularCodes, resultItems]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < allItems.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && allItems[highlightedIndex]) {
          handleSelect(allItems[highlightedIndex].code);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setQuery("");
        break;
      case "Backspace":
        if (query === "" && value) {
          setIsOpen(false);
        }
        break;
      }
    }, [isOpen, allItems, highlightedIndex, query, value]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [highlightedIndex]);

  // Reset highlighted index when results change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [recentCodes, favoriteCodes, popularCodes, resultItems]);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      {label && (
        <label className="block text-sm font-medium text-muted-foreground mb-1.5">
          {label}
        </label>
      )}

      {/* Selected display + Input */}
      <div
        onClick={handleContainerClick}
        className="flex items-center gap-2 p-3 rounded-xl border-2 border-border bg-background/50 cursor-pointer hover:bg-accent/5 hover:border-primary/30 transition-all group"
      >
        {/* Flag */}
        {selectedCurrency && (
          <span className="text-2xl leading-none" role="img" aria-label={selectedCurrency.code}>
            {selectedCurrency.flag}
          </span>
        )}

        {/* Currency code display when closed */}
        {!isOpen && selectedCurrency && (
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground">
              {selectedCurrency.code}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {selectedCurrency.name}
            </div>
          </div>
        )}

        {/* Search input when open */}
        {isOpen && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        )}

        {/* Clear button */}
        {isOpen && query && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); clearQuery(); }}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-xs">✕</span>
          </button>
        )}

        {/* Dropdown arrow */}
        <ChevronDown 
          className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden"
          >
            <div ref={listRef} className="max-h-[320px] overflow-y-auto overflow-x-hidden">
              {displaySections.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No currencies found</p>
                  <p className="text-sm mt-1">Try searching by code, name, or country</p>
                </div>
              ) : (
                displaySections.map((section, sectionIdx) => (
                  <div key={section.type + sectionIdx}>
                    {/* Section header */}
                    {section.label && (
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30">
                        {section.label}
                      </div>
                    )}

                    {/* Currency items */}
                    {section.items.map((currency, index) => {
                      const globalIndex = allItems.indexOf(currency);
                      const isHighlighted = globalIndex === highlightedIndex;
                      const isSelected = currency.code === value;
                      const isFavorite = getFavoriteCurrencies().includes(currency.code);

                      return (
                        <button
                          key={currency.code}
                          type="button"
                          onClick={() => handleSelect(currency.code)}
                          onMouseEnter={() => setHighlightedIndex(globalIndex)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            isHighlighted
                              ? "bg-primary/10 text-primary"
                              : isSelected
                                ? "bg-muted text-foreground"
                                : "hover:bg-accent/5"
                          }`}
                        >
                          {/* Flag */}
                          <span className="text-2xl leading-none flex-shrink-0" role="img" aria-label={currency.country}>
                            {currency.flag}
                          </span>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">
                                {currency.code}
                              </span>
                              {isFavorite && (
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {currency.name}
                            </div>
                            <div className="text-xs text-muted-foreground/70">
                              {currency.country}
                            </div>
                          </div>

                          {/* Symbol */}
                          <div className="text-sm text-muted-foreground font-mono">
                            {currency.symbol}
                          </div>

                          {/* Selected checkmark */}
                          {isSelected && (
                            <div className="w-5 h-5 flex items-center justify-center text-primary">
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}