"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Trash2, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { getRecentConversions, clearRecentConversions } from "@/lib/utils";
import { getCategoryById } from "@/data/conversions";
import type { RecentConversion } from "@/lib/utils";

interface RecentConversionsProps {
  limit?: number;
}

export function RecentConversionsPanel({ limit = 5 }: RecentConversionsProps) {
  const recentConversions = useMemo(() => getRecentConversions().slice(0, limit), [limit]);
  const [removedId, setRemovedId] = useState<string | null>(null);

  if (recentConversions.length === 0) {
    return null;
  }

  const handleClear = () => {
    if (confirm("Clear all recent conversions?")) {
      clearRecentConversions();
      setRemovedId("all");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-dark rounded-2xl p-5 border border-white/[0.05]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold">Recent Conversions</h3>
          </div>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
            aria-label="Clear recent conversions"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          {recentConversions.map((conv) => {
            if (removedId === conv.id) return null;
            const category = getCategoryById(conv.category);
            if (!category) return null;

            const fromUnit = category.units[conv.fromUnit];
            const toUnit = category.units[conv.toUnit];

            return (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/unit/${conv.category}?from=${conv.fromUnit}&to=${conv.toUnit}`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-accent/10 transition-colors group"
                  prefetch={true}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.icon}</span>
                    <div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="font-medium text-foreground">{fromUnit?.symbol}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium text-foreground">{toUnit?.symbol}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {fromUnit?.name} → {toUnit?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-primary">
                      {conv.toValue.toFixed(4).replace(/\.?0+$/, "")}
                    </p>
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto mt-0.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
