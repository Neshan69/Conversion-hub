"use client";

import { memo, useMemo, useState } from "react";
import { ConversionCategory } from "@/types/converter";

interface ConversionTableProps {
  category: ConversionCategory;
}

export const ConversionTable = memo(function ConversionTable({ category }: ConversionTableProps) {
  const [copiedUnit, setCopiedUnit] = useState<string | null>(null);

  const baseValue = 1; // Show conversions for 1 unit

  const handleCopy = async (symbol: string) => {
    try {
      await navigator.clipboard.writeText(symbol);
      setCopiedUnit(symbol);
      setTimeout(() => setCopiedUnit(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatFactor = (factor: number): string => {
    if (factor >= 1) {
      return factor.toLocaleString('en-US', { maximumFractionDigits: 6 });
    }
    return factor.toExponential(4);
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Conversion Factors
      </h2>
      
      <p className="text-muted-foreground mb-6">
        Conversion factors from {category.name.toLowerCase()} units to {category.units[category.baseUnit].name} ({category.units[category.baseUnit].symbol}).
        Multiply by the factor to convert TO {category.units[category.baseUnit].symbol}, divide to convert FROM.
      </p>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Unit
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Symbol
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                  1 {category.units[category.baseUnit].symbol} = 
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                  Factor
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                  Example
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(category.units).map(([key, unit], index) => {
                const factor = unit.factor;
                const convertedValue = baseValue * factor;
                const isBaseUnit = key === category.baseUnit;
                
                return (
                  <tr 
                    key={key}
                    className={`
                      border-b border-border/50 transition-colors hover:bg-muted/30
                      ${isBaseUnit ? 'bg-primary/5 font-semibold' : ''}
                    `}
                  >
                    <td className="px-6 py-4">
                      <span className="text-foreground">
                        {unit.name}
                      </span>
                      {isBaseUnit && (
                        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-primary/20 text-primary">
                          Base
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                        {unit.symbol}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <code className="text-foreground font-mono">
                        {convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleCopy(factor.toString())}
                        className={`
                          px-3 py-1 rounded-lg font-mono text-sm transition-all
                          ${copiedUnit === factor.toString()
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                          }
                        `}
                      >
                        {formatFactor(factor)}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-muted-foreground">
                        {baseValue} {unit.symbol} = {convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 })} {category.units[category.baseUnit].symbol}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});