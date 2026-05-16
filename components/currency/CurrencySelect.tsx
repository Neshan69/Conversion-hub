"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, Star } from "lucide-react";
import { searchCurrencies, getPopularCurrencies, Currency, getCurrencyByCode } from "@/types/currency";
import { getRecentCurrencies, getFavoriteCurrencies, addRecentCurrency } from "@/lib/currency-utils";

interface CurrencySelectProps {
  value: string;
  onChange: (code: string) => void;
  label?: string;
  id?: string;
  exclude?: string[];
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
  id,
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
    addRecentCurrency(code);
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  }, []);

  const handleContainerClick = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  const clearQuery = useCallback(() => {
    setQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  // Get filtered results - memoized for performance
  const filteredResults = useMemo(() => {
    let results = searchCurrencies(query);
    results = results.filter(c => !exclude.includes(c.code));
    results = results.filter(c => c.code !== value);
    results = results.filter((c, i, arr) =>
      arr.findIndex(x => x.code === c.code) === i
    );
    return results.slice(0, 50);
  }, [query, exclude, value]);

  const recentCodes = showRecent ? getRecentCurrencies().filter(code => !exclude.includes(code) && code !== value) : [];
  const favoriteCodes = showFavorites ? getFavoriteCurrencies().filter(code => !exclude.includes(code) && code !== value) : [];
  const popularCodes = showPopular
    ? getPopularCurrencies().filter(c => !exclude.includes(c.code) && c.code !== value).map(c => c.code)
    : [];

  const resultItems = filteredResults
    .filter(c => {
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
        .map(code => getCurrencyByCode(code))
        .filter((item): item is Currency => item !== null);
      sections.push({ type: "recent", label: "Recent", items: recentItems });
    }

    if (favoriteCodes.length > 0) {
      const favoriteItems = favoriteCodes
        .map(code => getCurrencyByCode(code))
        .filter((item): item is Currency => item !== null);
      sections.push({ type: "favorites", label: "Favorites", items: favoriteItems });
    }

    if (popularCodes.length > 0) {
      const popularItems = popularCodes
        .map(code => getCurrencyByCode(code))
        .filter((item): item is Currency => item !== null);
      sections.push({ type: "popular", label: "Popular", items: popularItems });
    }

    if (query.trim() !== '' || sections.length === 0) {
      sections.push({ type: "results", label: "Results", items: resultItems });
    }

    return sections;
  }, [recentCodes, favoriteCodes, popularCodes, resultItems, query]);

  // Combine all items for keyboard navigation
  const allItems = useMemo(() => {
    const items: Currency[] = [];
    const seen = new Set<string>();

    for (const code of [...recentCodes, ...favoriteCodes, ...popularCodes]) {
      const currency = getCurrencyByCode(code);
      if (currency && !seen.has(currency.code)) {
        items.push(currency);
        seen.add(currency.code);
      }
    }
    for (const item of resultItems) {
      if (item && !seen.has(item.code)) {
        items.push(item);
        seen.add(item.code);
      }
    }
    return items;
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
  }, [isOpen, allItems, highlightedIndex, query, value, handleSelect]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [highlightedIndex]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [recentCodes, favoriteCodes, popularCodes, resultItems]);

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
            id={id}
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
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 w-full mt-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden"
          >
            <div ref={listRef} className="max-h-[320px] overflow-y-auto overflow-x-hidden overscroll-contain">
              {displaySections.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No currencies found</p>
                  <p className="text-sm mt-1">Try searching by code, name, or country</p>
                </div>
              ) : (
                displaySections.map((section, sectionIdx) => (
                  <div key={section.type + sectionIdx}>
                    {section.label && (
                      <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider bg-muted/30">
                        {section.label}
                      </div>
                    )}

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
                          <span className="text-2xl leading-none flex-shrink-0" role="img" aria-label={currency.country}>
                            {currency.flag}
                          </span>

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

                          <div className="text-sm text-muted-foreground font-mono flex-shrink-0">
                            {currency.symbol}
                          </div>

                          {isSelected && (
                            <div className="w-5 h-5 flex items-center justify-center text-primary flex-shrink-0">
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