"use client";

import { memo } from "react";
import { ConversionCategory, Unit } from "@/types/converter";

interface ConversionFormulaProps {
  category: ConversionCategory;
}

export const ConversionFormula = memo(function ConversionFormula({ category }: ConversionFormulaProps) {
  const baseUnit = category.units[category.baseUnit];
  
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Conversion Formula</h2>
      
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Base Unit</h3>
          <p className="text-muted-foreground">
            All conversions in this category use <span className="font-mono font-semibold text-primary">{baseUnit.name} ({baseUnit.symbol})</span> as the base unit.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Formula</h3>
          <div className="bg-muted/50 rounded-xl p-6 font-mono text-lg md:text-xl leading-relaxed">
            <p className="mb-4">
              <span className="text-foreground">To convert from any unit to the base unit ({baseUnit.symbol}):</span>
            </p>
            <div className="p-4 bg-background rounded-lg border border-border mb-6">
              <code className="text-primary">
                Value in {baseUnit.symbol} = Value in Source Unit × Conversion Factor
              </code>
            </div>
            
            <p className="mb-2 text-foreground">
              To convert between any two units:
            </p>
            <div className="p-4 bg-background rounded-lg border border-border">
              <code className="text-accent">
                Target Value = (Source Value × Source Factor) / Target Factor
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});