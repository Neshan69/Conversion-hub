"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Lightbulb, Brain, Sparkles } from "lucide-react";
import { 
  getCurrencyJoke, 
  getCurrencyTrivia, 
  getLearningTip, 
  getFunFact, 
  saveComment
} from "@/lib/ai-jokes";
import { getCurrencyByCode } from "@/types/currency";

interface LearningPanelProps {
  fromCurrency: string;
  toCurrency: string;
  amount?: string;
  convertedAmount?: string | null;
}

export function LearningPanel({ 
  fromCurrency, 
  toCurrency,
}: LearningPanelProps) {
  const [activeTab, setActiveTab] = useState<"joke" | "trivia" | "tip" | "fact">("joke");
  const [loading, setLoading] = useState(false);

  const from = getCurrencyByCode(fromCurrency);
  const to = getCurrencyByCode(toCurrency);

  const generateContent = useCallback(() => {
    switch (activeTab) {
      case "joke":
        return getCurrencyJoke(fromCurrency, toCurrency);
      case "trivia":
        return getCurrencyTrivia(fromCurrency, toCurrency);
      case "tip":
        return getLearningTip(fromCurrency, toCurrency);
      case "fact":
        return getFunFact(fromCurrency);
      default:
        return getCurrencyJoke(fromCurrency, toCurrency);
    }
  }, [activeTab, fromCurrency, toCurrency]);

  const currentComment = useMemo(() => generateContent(), [generateContent]);

  const handleNewContent = useCallback(() => {
    setLoading(true);
    generateContent();
    saveComment(generateContent());
    setLoading(false);
  }, [generateContent]);

  const tabs = [
    { id: "joke", label: "Joke", icon: Sparkles },
    { id: "trivia", label: "Trivia", icon: Brain },
    { id: "tip", label: "Tip", icon: Lightbulb },
    { id: "fact", label: "Fact", icon: BookOpen },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "joke": return "from-yellow-500/20 to-orange-500/20";
      case "trivia": return "from-blue-500/20 to-indigo-500/20";
      case "tip": return "from-green-500/20 to-emerald-500/20";
      case "fact": return "from-purple-500/20 to-pink-500/20";
      default: return "from-gray-500/20 to-slate-500/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Learning Hub
        </h3>
        
        <button
          onClick={handleNewContent}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
          {loading ? "Loading..." : "New"}
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "joke" | "trivia" | "tip" | "fact")}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1
                ${activeTab === tab.id 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"}
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {currentComment && (
          <motion.div
            key={currentComment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              p-4 rounded-xl bg-gradient-to-br ${getTypeColor(currentComment.type)}
              border border-primary/20 min-h-[80px] flex items-center
            `}
          >
            <p className="text-sm leading-relaxed">{currentComment.content}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Currency Info Footer */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <span className="font-medium">{fromCurrency}</span> - {from?.name}
          </div>
          <div>
            <span className="font-medium">{toCurrency}</span> - {to?.name}
          </div>
        </div>
      </div>
    </motion.div>
  );
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