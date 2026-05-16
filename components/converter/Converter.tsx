"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Select, Button } from "@/components/ui/components";
import { ConversionEngine } from "@/lib/converter-engine";
import { getCategoryById } from "@/data/conversions";
import { copyToClipboard, addRecentConversion } from "@/lib/utils";
import { Check, Copy, ArrowRightLeft, ChevronUp, ChevronDown } from "lucide-react";

interface ConverterProps {
  categoryId?: string;
  initialFromUnit?: string;
  initialToUnit?: string;
}

export function Converter({ categoryId = "length", initialFromUnit, initialToUnit }: ConverterProps) {
  const category = useMemo(() => getCategoryById(categoryId), [categoryId]);
  const defaultUnits = useMemo(() => {
    if (!category) return { from: "", to: "" };

    const unitKeys = Object.keys(category.units);
    const from = initialFromUnit && category.units[initialFromUnit] ? initialFromUnit : unitKeys[0] || "";
    const to =
      initialToUnit && category.units[initialToUnit]
        ? initialToUnit
        : unitKeys.find((unitKey) => unitKey !== from) || from;

    return { from, to };
  }, [category, initialFromUnit, initialToUnit]);
  const [fromValue, setFromValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>(defaultUnits.from);
  const [toUnit, setToUnit] = useState<string>(defaultUnits.to);
  const [copied, setCopied] = useState(false);
  const [showFormula, setShowFormula] = useState(false);
  const fromInputRef = useRef<HTMLInputElement>(null);

  // Create conversion engine
  const engine = useMemo(() => {
    if (!category) return null;
    return new ConversionEngine(category.units);
  }, [category]);

  // Perform conversion - immediate, no debounce needed for calculations
  const conversionResult = useMemo(() => {
    if (!engine || !fromValue || !fromUnit || !toUnit) return null;

    const value = parseFloat(fromValue);
    if (isNaN(value) || !isFinite(value)) return null;

    try {
      return engine.convert(value, fromUnit, toUnit);
    } catch {
      return null;
    }
  }, [engine, fromValue, fromUnit, toUnit]);

  // Save to recent conversions when conversion result changes
  useEffect(() => {
    if (conversionResult && fromValue && fromUnit && toUnit) {
      addRecentConversion({
        category: categoryId,
        fromUnit,
        toUnit,
        fromValue: parseFloat(fromValue),
        toValue: conversionResult.value,
      });
    }
  }, [conversionResult, fromValue, fromUnit, toUnit, categoryId]);

  // Handle swap units
  const handleSwap = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (fromInputRef.current) {
      fromInputRef.current.focus();
    }
  }, [fromUnit, toUnit]);

  // Handle copy result
  const handleCopy = useCallback(async () => {
    if (!conversionResult) return;

    const success = await copyToClipboard(conversionResult.formatted);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [conversionResult]);

  // Handle input change - allow immediate typing
  const handleFromValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || value === "-" || value === "." || /^-?\d*\.?\d*$/.test(value)) {
      setFromValue(value);
    }
  }, []);

  // Get options for select dropdowns
  const unitOptions = useMemo(() => {
    if (!category) return [];
    return Object.entries(category.units).map(([key, unit]) => ({
      value: key,
      label: `${unit.name} (${unit.symbol})`,
    }));
  }, [category]);

  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-dark rounded-2xl p-6 md:p-8 shadow-xl border border-white/[0.05]">
        {/* Header with category info */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
            <span className="text-xl">{category.icon}</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-foreground truncate">{category.name} Converter</h2>
            <p className="text-muted-foreground text-sm truncate">{category.description}</p>
          </div>
        </div>

        {/* Converter Panel */}
        <div className="space-y-5">
          {/* From input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="from-value">
              From
            </label>
            <div className="flex gap-3">
              <div className="flex-1 min-w-0">
                <Input
                  id="from-value"
                  type="text"
                  inputMode="decimal"
                  value={fromValue}
                  onChange={handleFromValueChange}
                  placeholder="Enter value"
                  className="h-12 text-lg"
                  ref={fromInputRef}
                />
              </div>
              <div className="w-40 flex-shrink-0">
                <Select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  options={unitOptions}
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center -my-1">
            <motion.button
              onClick={handleSwap}
              className="relative z-10 p-2.5 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg hover:shadow-xl transition-shadow duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              aria-label="Swap units"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </motion.button>
          </div>

          {/* To output */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              To
            </label>
            <div className="flex gap-3">
              <div className="flex-1 min-w-0 relative">
                <Input
                  type="text"
                  value={conversionResult?.formatted || ""}
                  readOnly
                  className="h-12 text-lg bg-muted/50 font-mono cursor-default"
                  aria-label="Converted result"
                />
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500"
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        disabled={!conversionResult}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copy result"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="w-40 flex-shrink-0">
                <Select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  options={unitOptions}
                  className="h-12"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Conversion formula hint */}
        {conversionResult && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 pt-5 border-t border-border/50"
          >
            <button
              onClick={() => setShowFormula(!showFormula)}
              className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>
                {fromValue} {category.units[fromUnit]?.symbol} = {conversionResult.formatted} {category.units[toUnit]?.symbol}
              </span>
              {showFormula ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <AnimatePresence>
              {showFormula && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 font-mono"
                >
                  Formula: ({fromValue} × {category.units[fromUnit]?.factor}) / {category.units[toUnit]?.factor} = {conversionResult.value}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
