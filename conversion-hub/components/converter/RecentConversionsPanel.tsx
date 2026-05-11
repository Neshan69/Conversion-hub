"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { getRecentConversions, clearRecentConversions } from "@/lib/utils";
import { getCategoryById } from "@/data/conversions";

interface RecentConversionsProps {
  limit?: number;
}

export function RecentConversionsPanel({ limit = 5 }: RecentConversionsProps) {
  const recentConversions = useMemo(() => getRecentConversions().slice(0, limit), [limit]);

  if (recentConversions.length === 0) {
    return null;
  }

  return (
    <div className="glass-dark rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Conversions</h3>
        </div>
        <button
          onClick={() => {
            if (confirm("Clear all recent conversions?")) {
              clearRecentConversions();
              window.location.reload();
            }
          }}
          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
          aria-label="Clear recent conversions"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {recentConversions.map((conv, index) => {
          const category = getCategoryById(conv.category);
          if (!category) return null;

          const fromUnit = category.units[conv.fromUnit];
          const toUnit = category.units[conv.toUnit];

          return (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/convert/${conv.category}?from=${conv.fromUnit}&to=${conv.toUnit}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{category.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{fromUnit?.symbol}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{toUnit?.symbol}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {conv.fromValue} → {conv.toValue.toFixed(4).replace(/\.?0+$/, "")}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}