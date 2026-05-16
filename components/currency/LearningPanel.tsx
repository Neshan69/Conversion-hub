"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Lightbulb, Brain, Sparkles, Info, TrendingUp, Shield, AlertTriangle, Clock } from "lucide-react";
import {
  getCurrencyJoke,
  getCurrencyTrivia,
  getLearningTip,
  getFunFact,
  saveComment,
} from "@/lib/ai-jokes";
import {
  generateInsight,
  getCachedInsight,
  cacheInsight,
  InsightData,
} from "@/lib/insights-engine";
import { getCurrencyByCode } from "@/types/currency";

interface LearningPanelProps {
  fromCurrency: string;
  toCurrency: string;
  amount?: string;
  convertedAmount?: string | null;
  rate?: number | null;
}

export function LearningPanel({
  fromCurrency,
  toCurrency,
  amount,
  convertedAmount,
  rate,
}: LearningPanelProps) {
  const [activeTab, setActiveTab] = useState<"joke" | "trivia" | "tip" | "fact" | "insights">("insights");
  const [loading, setLoading] = useState(false);
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  const [insightError, setInsightError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const from = getCurrencyByCode(fromCurrency);
  const to = getCurrencyByCode(toCurrency);
  const pairKey = `${fromCurrency}-${toCurrency}`;

  // Load AI insights
  useEffect(() => {
    async function loadInsights() {
      setLoading(true);
      setInsightError(null);

      try {
        // Check cache first
        const cached = getCachedInsight(pairKey);
        if (cached) {
          setInsightData(cached);
          setLoading(false);
          return;
        }

        // Generate fresh insight
        const data = generateInsight(fromCurrency, toCurrency, rate ?? null);

        // Fetch latest news (best effort - non-blocking)
        const news = await fetchCurrencyNews(fromCurrency, toCurrency).catch(() => []);

        const insightWithNews = {
          ...data,
          news,
          lastUpdated: Date.now(),
        };

        setInsightData(insightWithNews);
        cacheInsight(pairKey, insightWithNews);
      } catch (err) {
        // Still show cached or generated data
        const fallback = generateInsight(fromCurrency, toCurrency, rate ?? null);
        setInsightData(fallback);
        setInsightError("Could not fetch latest news. Showing general analysis.");
      } finally {
        setLoading(false);
      }
    }

    if (activeTab === "insights") {
      loadInsights();
    }
  }, [activeTab, fromCurrency, toCurrency, rate, pairKey]);

  const content = useMemo(() => {
    switch (activeTab) {
      case "joke":
        return getCurrencyJoke(fromCurrency, toCurrency);
      case "trivia":
        return getCurrencyTrivia(fromCurrency, toCurrency);
      case "tip":
        return getLearningTip(fromCurrency, toCurrency);
      case "fact":
        return getFunFact(fromCurrency || "USD");
      default:
        return null;
    }
  }, [activeTab, fromCurrency, toCurrency]);

  const handleNewContent = useCallback(() => {
    setLoading(true);
    const newContent = generateInsight(fromCurrency, toCurrency, rate ?? null);
    if (activeTab === "insights") {
      setInsightData(newContent);
      cacheInsight(pairKey, newContent);
    }
    if (content) {
      saveComment(content);
    }
    setLoading(false);
  }, [activeTab, content, fromCurrency, toCurrency, rate, pairKey]);

  const tabs = [
    { id: "insights" as const, label: "AI Insights", icon: Brain },
    { id: "joke" as const, label: "Joke", icon: Sparkles },
    { id: "trivia" as const, label: "Trivia", icon: BookOpen },
    { id: "tip" as const, label: "Tip", icon: Lightbulb },
    { id: "fact" as const, label: "Fact", icon: Info },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "joke":
        return "from-yellow-500/20 to-orange-500/20";
      case "trivia":
        return "from-blue-500/20 to-indigo-500/20";
      case "tip":
        return "from-green-500/20 to-emerald-500/20";
      case "fact":
        return "from-purple-500/20 to-pink-500/20";
      case "insights":
        return "from-cyan-500/20 to-blue-600/20";
      default:
        return "from-gray-500/20 to-slate-500/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      {/* AI Insights Header */}
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Currency Insights
          </h3>
          <div className="flex items-center gap-2">
            {insightData?.confidence && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  insightData.confidence === "high"
                    ? "bg-green-500/20 text-green-600"
                    : insightData.confidence === "medium"
                    ? "bg-amber-500/20 text-amber-600"
                    : "bg-red-500/20 text-red-600"
                }`}
              >
                {insightData.confidence === "high"
                  ? "High Confidence"
                  : insightData.confidence === "medium"
                  ? "Moderate"
                  : "Low"}
              </span>
            )}
            <button
              onClick={handleNewContent}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Refresh Analysis"
              )}
            </button>
          </div>
        </div>

        {/* Currency pair info */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="font-medium">
            {from?.flag} {fromCurrency}
          </span>
          <span className="text-muted-foreground">→</span>
          <span className="font-medium">
            {to?.flag} {toCurrency}
          </span>
          {rate && (
            <span className="ml-auto text-muted-foreground font-mono">
              1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
            </span>
          )}
        </div>

        {/* Insight content */}
        {insightData && !loading && !insightError && (
          <div className="space-y-4">
            {/* Trend summary */}
            <div
              className={`p-4 rounded-xl border text-sm leading-relaxed ${
                insightData.trend.includes("under pressure") ||
                insightData.trend.includes("depreciat")
                  ? "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400"
                  : insightData.trend.includes("strengthened") ||
                    insightData.trend.includes("strong")
                  ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400"
                  : "bg-muted/50 border-border"
              }`}
            >
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">
                    {(insightData as any).trendHeading || "Current Trend"}
                  </p>
                  <p>{(insightData as any).trend}</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm leading-relaxed">{insightData.explanation}</p>
            </div>

            {/* Key factors */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-primary" />
                Key Factors
              </h4>
              <div className="flex flex-wrap gap-2">
                {insightData.factors.slice(0, 8).map((factor, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>Sources: {insightData.sources.join(" · ")}</span>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-3 py-4">
            <div className="h-4 bg-muted/50 rounded-full animate-pulse w-3/4" />
            <div className="h-4 bg-muted/50 rounded-full animate-pulse w-full" />
            <div className="h-4 bg-muted/50 rounded-full animate-pulse w-1/2" />
            <div className="flex gap-2 mt-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 bg-muted/50 rounded-full animate-pulse flex-1"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {insightError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>{insightError}</span>
          </div>
        )}

        {/* News section */}
        {insightData?.news && insightData.news.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <h4 className="text-sm font-semibold mb-2">Related News</h4>
            <div className="space-y-2">
              {insightData.news.slice(0, 3).map((news, i) => (
                <a
                  key={i}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2.5 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors text-sm"
                >
                  <p className="font-medium text-foreground mb-1">{news.title}</p>
                  <p className="text-muted-foreground line-clamp-2">{news.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                    <span>{news.source}</span>
                    <span>•</span>
                    <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs for fun content */}
      <div className="mt-4 bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-4 gap-2 mb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px]">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab !== "insights" && content && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl bg-gradient-to-br ${getTypeColor(activeTab)} border border-primary/20 min-h-[60px] flex items-center`}
            >
              <p className="text-sm leading-relaxed">{content.content}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Currency Info Footer */}
        <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">{fromCurrency}</span> - {from?.name} ({from?.country})
            </div>
            <div>
              <span className="font-medium">{toCurrency}</span> - {to?.name} ({to?.country})
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Fetch news from free APIs (best-effort)
async function fetchCurrencyNews(
  fromCurrency: string,
  toCurrency: string
): Promise<Array<{ title: string; description: string; url: string; source: string; publishedAt: string }>> {
  const queries = [
    `forex ${fromCurrency} ${toCurrency}`,
    `currency ${fromCurrency} ${toCurrency} exchange rate`,
  ];

  for (const query of queries) {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=3&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY || ""}`,
        { next: { revalidate: 3600 } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
          return data.articles.slice(0, 3).map((article: any) => ({
            title: article.title,
            description: article.description || article.content?.substring(0, 200),
            url: article.url,
            source: article.source?.name || "Unknown",
            publishedAt: article.publishedAt,
          }));
        }
      }
    } catch {
      continue;
    }
  }

  return [];
}

// Mini version for compact display
export function LearningMini({ fromCurrency, toCurrency }: { fromCurrency: string; toCurrency: string }) {
  const comment = useMemo(() => {
    return getCurrencyJoke(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  return (
    <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
      <div className="flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-xs italic">{comment.content}</p>
      </div>
    </div>
  );
}