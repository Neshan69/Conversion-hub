"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Star, TrendingUp, Trash2, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getRecentConversions,
  clearRecentConversions,
  type RecentConversion,
} from "@/lib/utils";
import {
  getFavoriteCurrencies,
  toggleFavoriteCurrency,
} from "@/lib/currency-utils";
import { getCategoryById } from "@/data/conversions";
import { cn } from "@/lib/utils";

// Trending/popular pairs for recommendation
const TRENDING_PAIRS = [
  { from: "USD", to: "EUR", label: "USD → EUR", flag: "🇺🇸→🇪🇺", trend: "stable" },
  { from: "USD", to: "INR", label: "USD → INR", flag: "🇺🇸→🇮🇳", trend: "up" },
  { from: "USD", to: "JPY", label: "USD → JPY", flag: "🇺🇸→🇯🇵", trend: "down" },
  { from: "EUR", to: "GBP", label: "EUR → GBP", flag: "🇪🇺→🇬🇧", trend: "stable" },
  { from: "GBP", to: "USD", label: "GBP → USD", flag: "🇬🇧→🇺🇸", trend: "up" },
  { from: "USD", to: "GBP", label: "USD → GBP", flag: "🇺🇸→🇬🇧", trend: "down" },
];

// Pinned currencies (persisted in localStorage)
function getPinnedCurrencies(): string[] {
  try {
    return JSON.parse(localStorage.getItem("conversion-hub-pinned") || "[]");
  } catch {
    return [];
  }
}

function togglePinned(currencyCode: string): void {
  const pinned = getPinnedCurrencies();
  const index = pinned.indexOf(currencyCode);
  if (index === -1) {
    pinned.unshift(currencyCode);
  } else {
    pinned.splice(index, 1);
  }
  localStorage.setItem("conversion-hub-pinned", JSON.stringify(pinned.slice(0, 8)));
}

export function UserDashboard() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"recent" | "favorites" | "pinned" | "trending">("recent");
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const recentConversions = useMemo(() => {
    return getRecentConversions().filter(c => !removedIds.has(c.id));
  }, [removedIds]);

  const favorites = useMemo(() => getFavoriteCurrencies(), []);
  const pinned = useMemo(() => getPinnedCurrencies(), []);

  const handleRemoveRecent = useCallback((id: string) => {
    setRemovedIds(prev => new Set([...prev, id]));
  }, []);

  const handleToggleFavorite = useCallback((code: string) => {
    toggleFavoriteCurrency(code);
    // Force re-render
    setActiveTab(prev => prev);
  }, []);

  const handleTogglePinned = useCallback((code: string) => {
    togglePinned(code);
    setActiveTab(prev => prev);
  }, []);

  const TABS = [
    {
      id: "recent" as const,
      label: "Recent",
      icon: Clock,
      count: recentConversions.length,
    },
    {
      id: "favorites" as const,
      label: "Favorites",
      icon: Star,
      count: favorites.length,
    },
    {
      id: "pinned" as const,
      label: "Pinned",
      icon: Sparkles,
      count: pinned.length,
    },
    {
      id: "trending" as const,
      label: "Trending",
      icon: TrendingUp,
      count: TRENDING_PAIRS.length,
    },
  ];

  // Don't show on search page
  if (pathname === "/search") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-none"
    >
      <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
        {/* Tab bar */}
        <div className="flex border-b border-border/50 bg-muted/30">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-2.5 px-3 text-xs font-medium transition-all flex items-center justify-center gap-1.5",
                activeTab === tab.id
                  ? "bg-background text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span className={cn(
                  "inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted-foreground/20 text-muted-foreground"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-h-64 overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait">
            {activeTab === "recent" && (
              <motion.div
                key="recent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="divide-y divide-border/50"
              >
                {recentConversions.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No recent conversions yet
                  </div>
                ) : (
                  recentConversions.map((conv) => {
                    const category = getCategoryById(conv.category);
                    if (!category) return null;
                    const fromUnit = category.units[conv.fromUnit];
                    const toUnit = category.units[conv.toUnit];
                    if (!fromUnit || !toUnit) return null;

                    return (
                      <div
                        key={conv.id}
                        className="flex items-center justify-between p-3 hover:bg-accent/5 transition-colors group"
                      >
                        <Link
                          href={`/convert/${conv.category}?from=${conv.fromUnit}&to=${conv.toUnit}`}
                          className="flex items-center gap-3 flex-1 min-w-0"
                          prefetch={true}
                        >
                          <span className="text-lg">{category.icon}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {conv.fromValue} {fromUnit.symbol} → {toUnit.symbol}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {conv.toValue.toFixed(4).replace(/\.?0+$/, "")} {toUnit.name}
                            </p>
                          </div>
                        </Link>
                        <button
                          onClick={() => handleRemoveRecent(conv.id)}
                          className="p-1 rounded-lg text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeTab === "favorites" && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="divide-y divide-border/50"
              >
                {favorites.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No favorites yet. Star currencies in the converter!
                  </div>
                ) : (
                  favorites.map((code) => {
                    const info = getCurrencyByCode(code);
                    if (!info) return null;
                    return (
                      <div
                        key={code}
                        className="flex items-center justify-between p-3 hover:bg-accent/5 transition-colors group"
                      >
                        <Link
                          href={`/currency/${code.toLowerCase()}`}
                          className="flex items-center gap-3 flex-1 min-w-0"
                          prefetch={true}
                        >
                          <span className="text-xl leading-none">{info.flag}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {code} — {info.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">{info.country}</p>
                          </div>
                        </Link>
                        <button
                          onClick={() => handleToggleFavorite(code)}
                          className="p-1 rounded-lg text-amber-500 hover:bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove favorite"
                        >
                          <Star className="w-4 h-4 fill-amber-500" />
                        </button>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeTab === "pinned" && (
              <motion.div
                key="pinned"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="divide-y divide-border/50"
              >
                {pinned.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Pin currencies you use often for quick access!
                  </div>
                ) : (
                  pinned.map((code) => {
                    const info = getCurrencyByCode(code);
                    if (!info) return null;
                    return (
                      <div
                        key={code}
                        className="flex items-center justify-between p-3 hover:bg-accent/5 transition-colors group"
                      >
                        <Link
                          href={`/currency/${code.toLowerCase()}`}
                          className="flex items-center gap-3 flex-1 min-w-0"
                          prefetch={true}
                        >
                          <span className="text-xl leading-none">{info.flag}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {code} — {info.name}
                            </p>
                          </div>
                        </Link>
                        <button
                          onClick={() => handleTogglePinned(code)}
                          className="p-1 rounded-lg text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Unpin"
                        >
                          <XIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeTab === "trending" && (
              <motion.div
                key="trending"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-2"
              >
                <p className="text-[11px] text-muted-foreground mb-3 px-3">
                  Popular pairs people are converting right now:
                </p>
                {TRENDING_PAIRS.map((pair, i) => (
                  <Link
                    key={pair.label}
                    href={`/currency/${pair.from.toLowerCase()}-to-${pair.to.toLowerCase()}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/5 transition-colors group"
                    prefetch={true}
                  >
                    <span className="text-2xl leading-none">{pair.flag}</span>
                    <span className="text-sm font-medium flex-1">{pair.label}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-medium",
                      pair.trend === "up" ? "bg-green-500/10 text-green-600" :
                      pair.trend === "down" ? "bg-red-500/10 text-red-600" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {pair.trend === "up" ? "↑" : pair.trend === "down" ? "↓" : "→"}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Close hint */}
        <div className="px-4 py-2 text-[10px] text-muted-foreground/50 text-center bg-muted/30">
          Swipe down to dismiss • Tab to switch
        </div>
      </div>
    </motion.div>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

// Inline mini dashboard for top of page
export function UserDashboardInline() {
  const [open, setOpen] = useState(false);
  const recentCount = useMemo(() => getRecentConversions().length, []);
  const favCount = useMemo(() => getFavoriteCurrencies().length, []);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors text-sm text-muted-foreground"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Clock className="w-4 h-4" />
        <span className="hidden sm:inline">Activity</span>
        {(recentCount > 0 || favCount > 0) && (
          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
            {recentCount + favCount}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="max-h-64 overflow-y-auto">
              {recentCount === 0 && favCount === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Your recent conversions and favorites will appear here.
                </div>
              ) : (
                <>
                  {favCount > 0 && (
                    <div className="p-3 border-b border-border/50">
                      <p className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Favorites</p>
                      <div className="flex flex-wrap gap-1.5">
                        {getFavoriteCurrencies().slice(0, 6).map((code) => {
                          const info = getCurrencyByCode(code);
                          return info ? (
                            <Link
                              key={code}
                              href={`/currency/${code.toLowerCase()}`}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                              onClick={() => setOpen(false)}
                              prefetch={true}
                            >
                              <span className="text-base leading-none">{info.flag}</span>
                              {code}
                            </Link>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  {recentCount > 0 && (
                    <div className="p-3">
                      <p className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Recent</p>
                      <div className="space-y-1">
                        {getRecentConversions().slice(0, 4).map((conv) => {
                          const category = getCategoryById(conv.category);
                          if (!category) return null;
                          const fromUnit = category.units[conv.fromUnit];
                          const toUnit = category.units[conv.toUnit];
                          return (
                            <Link
                              key={conv.id}
                              href={`/convert/${conv.category}?from=${conv.fromUnit}&to=${conv.toUnit}`}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/5 transition-colors"
                              onClick={() => setOpen(false)}
                              prefetch={true}
                            >
                              <span className="text-base">{category.icon}</span>
                              <span className="text-xs text-muted-foreground">
                                {fromUnit?.symbol} → {toUnit?.symbol}
                              </span>
                              <span className="text-xs font-medium ml-auto">
                                {conv.toValue.toFixed(2)}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}