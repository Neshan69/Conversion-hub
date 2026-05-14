"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ConversionCategory } from "@/types/converter";

interface ConversionFormulaProps {
  category: ConversionCategory;
}

export const ConversionFormula = memo(function ConversionFormula({ category }: ConversionFormulaProps) {
  const baseUnit = category.units[category.baseUnit];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6">How Conversion Works</h2>

      <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Base Unit</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              All conversions in this category use <span className="font-mono font-semibold text-primary">{baseUnit.name} ({baseUnit.symbol})</span> as the reference unit.
              Every other unit is defined relative to this base.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Precision</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Results are calculated to {category.id === "temperature" ? "decimal precision" : "6 decimal places"} and rounded for display.
              For very large or very small values, scientific notation may be used.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Formula</h3>
          <div className="bg-muted/50 rounded-xl p-6 font-mono space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">To convert from any unit to the base unit ({baseUnit.symbol}):</p>
              <div className="p-3 md:p-4 bg-background rounded-lg border border-border">
                <code className="text-primary text-sm md:text-base">
                  Base = Value × Factor
                </code>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">To convert between any two units:</p>
              <div className="p-3 md:p-4 bg-background rounded-lg border border-border">
                <code className="text-accent text-sm md:text-base">
                  Result = (Value × From Factor) / To Factor
                </code>
              </div>
            </div>

            {category.id === "temperature" && (
              <div className="p-3 md:p-4 bg-background rounded-lg border border-border text-sm text-muted-foreground">
                <p className="mb-1">🌡️ Temperature uses special formulas (not simple factors):</p>
                <p className="font-mono">°F = (°C × 9/5) + 32</p>
                <p className="font-mono">K = °C + 273.15</p>
              </div>
            )}
          </div>
        </div>

        {/* Example */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-xl">
          <p className="text-sm font-medium text-primary mb-2">Example</p>
          <p className="text-sm text-muted-foreground">
            To convert 100 {category.units[Object.keys(category.units)[1]]?.symbol || ""} to {baseUnit.symbol}:
            <br />
            <span className="font-mono">100 × {category.units[Object.keys(category.units)[1]]?.factor} = {(100 * (category.units[Object.keys(category.units)[1]]?.factor || 0)).toLocaleString()} {baseUnit.symbol}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
});