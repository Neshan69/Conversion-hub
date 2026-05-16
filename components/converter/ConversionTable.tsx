"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { ConversionCategory } from "@/types/converter";

interface ConversionTableProps {
  category: ConversionCategory;
}

export const ConversionTable = memo(function ConversionTable({ category }: ConversionTableProps) {
  const [copiedUnit, setCopiedUnit] = useState<string | null>(null);

  const baseValue = 1; // Show conversions for 1 unit

  const handleCopy = async (symbol: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUnit(symbol);
      setTimeout(() => setCopiedUnit(null), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedUnit(symbol);
      setTimeout(() => setCopiedUnit(null), 2000);
    }
  };

  const formatFactor = (factor: number): string => {
    if (factor >= 1) {
      return factor.toLocaleString('en-US', { maximumFractionDigits: 6 });
    }
    return factor.toExponential(4);
  };

  const sortedUnits = useMemo(() => {
    return Object.entries(category.units).sort((a, b) => {
      if (a[0] === category.baseUnit) return -1;
      if (b[0] === category.baseUnit) return 1;
      return a[1].name.localeCompare(b[1].name);
    });
  }, [category]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Conversion Factors</h2>

      <p className="text-muted-foreground mb-6 leading-relaxed">
        Conversion factors from all {category.name.toLowerCase()} units to the base unit
        ({category.units[category.baseUnit].name}, {category.units[category.baseUnit].symbol}).
        Multiply by the factor to convert TO the base unit, divide to convert FROM.
      </p>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Factor
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  Example (1 {category.units[category.baseUnit].symbol})
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Copy
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUnits.map(([key, unit]) => {
                const factor = unit.factor;
                const convertedValue = baseValue * factor;
                const isBaseUnit = key === category.baseUnit;

                return (
                  <motion.tr
                    key={key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border-b border-border/40 transition-colors hover:bg-muted/30 ${
                      isBaseUnit ? 'bg-primary/5 font-semibold' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-foreground text-sm">{unit.name}</span>
                      {isBaseUnit && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary font-normal">
                          base
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <code className="px-1.5 py-0.5 rounded text-sm font-mono bg-muted">
                        {unit.symbol}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleCopy(key, factor.toString())}
                        className={`font-mono text-sm transition-all px-2 py-0.5 rounded ${
                          copiedUnit === key
                            ? 'bg-green-500/20 text-green-600'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {formatFactor(factor)}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-muted-foreground hidden sm:table-cell font-mono">
                      {convertedValue.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs transition-opacity ${copiedUnit === key ? 'opacity-100' : 'opacity-0'}`}>
                        ✓
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
});