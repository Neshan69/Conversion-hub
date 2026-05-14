"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, AlertTriangle, Clock, WifiOff, Info, Shield, Copy } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface StatusIndicatorProps {
  label: string;
  status: "online" | "offline" | "stale";
  lastUpdated?: string;
  onRetry?: () => void;
}

export function StatusIndicator({ label, status, lastUpdated, onRetry }: StatusIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
      status === "online" ? "bg-green-500/10 text-green-700 dark:text-green-400" :
      status === "stale" ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" :
      "bg-red-500/10 text-red-700 dark:text-red-400"
    }`}>
      {status === "online" ? (
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      ) : status === "stale" ? (
        <Clock className="w-4 h-4" />
      ) : (
        <WifiOff className="w-4 h-4" />
      )}
      <span className="font-medium">{label}</span>
      {lastUpdated && <span className="opacity-70">• {lastUpdated}</span>}
      {status !== "online" && onRetry && (
        <button onClick={onRetry} className="ml-2 underline hover:opacity-80">Retry</button>
      )}
    </div>
  );
}

export function SourceAttribution() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
      <span className="flex items-center gap-1">
        <Shield className="w-3 h-3" />
        Sources:
      </span>
      <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
        ExchangeRate-API
      </a>
      <span>•</span>
      <a href="https://www.frankfurter.app" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
        Frankfurter
      </a>
      <span>•</span>
      <a href="https://open.er-api.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
        ER-API
      </a>
    </div>
  );
}

export function OfflineBanner({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-500/10 border-b border-amber-500/30 text-amber-700 dark:text-amber-400 px-4 py-2 text-sm flex items-center justify-center gap-2"
    >
      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      <span>You are offline. Displaying the last cached data.</span>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-2 underline hover:opacity-80">Dismiss</button>
      )}
    </motion.div>
  );
}