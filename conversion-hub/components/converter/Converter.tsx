"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Select, Button } from "@/components/ui/components";
import { ConversionEngine } from "@/lib/converter-engine";
import { getCategoryById } from "@/data/conversions";
import { copyToClipboard, addRecentConversion } from "@/lib/utils";
import { Check, Copy, ArrowRightLeft } from "lucide-react";

interface ConverterProps {
  categoryId?: string;
  initialFromUnit?: string;
  initialToUnit?: string;
}

export function Converter({ categoryId = "length", initialFromUnit, initialToUnit }: ConverterProps) {
  const category = useMemo(() => getCategoryById(categoryId), [categoryId]);
  const [fromValue, setFromValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>(initialFromUnit || "");
  const [toUnit, setToUnit] = useState<string>(initialToUnit || "");
  const [copied, setCopied] = useState(false);

  // Initialize units when category changes
  useEffect(() => {
    if (category && !fromUnit) {
      const unitKeys = Object.keys(category.units);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFromUnit(unitKeys[0]);
      setToUnit(unitKeys[1] || unitKeys[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // Create conversion engine
  const engine = useMemo(() => {
    if (!category) return null;
    return new ConversionEngine(category.units);
  }, [category]);

  // Perform conversion
  const conversionResult = useMemo(() => {
    if (!engine || !fromValue || !fromUnit || !toUnit) return null;

    const value = parseFloat(fromValue);
    if (isNaN(value)) return null;

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

  // Handle input change
  const handleFromValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid number
    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
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
      <div className="glass-dark rounded-3xl p-6 md:p-8 shadow-xl border border-white/10">
        {/* Header with category info */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl shadow-lg`}>
            {category.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{category.name}</h2>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        </div>

        {/* Converter Panel */}
        <div className="space-y-6">
          {/* From input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">From</label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={fromValue}
                  onChange={handleFromValueChange}
                  placeholder="Enter value"
                  className="h-14 text-lg"
                />
              </div>
              <div className="w-48">
                <Select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  options={unitOptions}
                  className="h-14"
                />
              </div>
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <motion.button
              onClick={handleSwap}
              className="relative z-10 p-3 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              aria-label="Swap units"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </motion.button>
          </div>

          {/* To output */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">To</label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={conversionResult?.formatted || ""}
                  readOnly
                  className="h-14 text-lg bg-muted/50 font-mono"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        className="text-green-500"
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Copy className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
              <div className="w-48">
                <Select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  options={unitOptions}
                  className="h-14"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Conversion formula hint */}
        {conversionResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-border"
          >
            <p className="text-sm text-muted-foreground text-center">
              {fromValue} {category.units[fromUnit].symbol} = {conversionResult.formatted} {category.units[toUnit].symbol}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}