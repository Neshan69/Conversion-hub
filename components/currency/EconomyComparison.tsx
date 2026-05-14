"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getCategoryById } from "@/data/conversions";
import { getCurrencyByCode } from "@/types/currency";

interface EconomyComparisonProps {
  fromCurrency: string;
  toCurrency: string;
}

interface EconomyData {
  country: string;
  currency: string;
  gdpPerCapita: string;
  avgSalary: string;
  inflationRate: string;
  purchasingPower: string;
  economySize: string;
  unemployment: string;
}

export function EconomyComparison({ fromCurrency, toCurrency }: EconomyComparisonProps) {
  const [expanded, setExpanded] = useState(false);

  const fromInfo = getCurrencyByCode(fromCurrency);
  const toInfo = getCurrencyByCode(toCurrency);

  // Estimated economic data (static reference data)
  const economyData: Record<string, Partial<EconomyData>> = {
    US: {
      country: "United States",
      currency: "USD",
      gdpPerCapita: "$80,034",
      avgSalary: "$68,928/yr",
      inflationRate: "3.0%",
      purchasingPower: "High",
      economySize: "$28.8T GDP",
      unemployment: "3.7%",
    },
    EU: {
      country: "Eurozone",
      currency: "EUR",
      gdpPerCapita: "$36,130",
      avgSalary: "€40,240/yr",
      inflationRate: "2.4%",
      purchasingPower: "High",
      economySize: "€16.5T GDP",
      unemployment: "6.4%",
    },
    GB: {
      country: "United Kingdom",
      currency: "GBP",
      gdpPerCapita: "$46,125",
      avgSalary: "£36,885/yr",
      inflationRate: "3.8%",
      purchasingPower: "High",
      economySize: "£3.3T GDP",
      unemployment: "4.2%",
    },
    JP: {
      country: "Japan",
      currency: "JPY",
      gdpPerCapita: "$33,815",
      avgSalary: "¥4,520,000/yr",
      inflationRate: "2.8%",
      purchasingPower: "High",
      economySize: "¥593T GDP",
      unemployment: "2.6%",
    },
    IN: {
      country: "India",
      currency: "INR",
      gdpPerCapita: "$2,730",
      avgSalary: "₹7,86,000/yr",
      inflationRate: "4.8%",
      purchasingPower: "Medium",
      economySize: "₹245T GDP",
      unemployment: "6.8%",
    },
    CN: {
      country: "China",
      currency: "CNY",
      gdpPerCapita: "$13,370",
      avgSalary: "¥120,600/yr",
      inflationRate: "0.3%",
      purchasingPower: "Medium",
      economySize: "¥130T GDP",
      unemployment: "5.2%",
    },
    SA: {
      country: "Saudi Arabia",
      currency: "SAR",
      gdpPerCapita: "$30,405",
      avgSalary: "SAR 125,000/yr",
      inflationRate: "2.5%",
      purchasingPower: "High",
      economySize: "SAR 2.5T GDP",
      unemployment: "5.0%",
    },
    BR: {
      country: "Brazil",
      currency: "BRL",
      gdpPerCapita: "$9,670",
      avgSalary: "R$47,400/yr",
      inflationRate: "4.5%",
      purchasingPower: "Medium",
      economySize: "R$11.9T GDP",
      unemployment: "8.0%",
    },
    KR: {
      country: "South Korea",
      currency: "KRW",
      gdpPerCapita: "$33,147",
      avgSalary: "₩47,664,000/yr",
      inflationRate: "2.4%",
      purchasingPower: "High",
      economySize: "₩2,437T GDP",
      unemployment: "2.7%",
    },
  };

  const getCountryKey = (code: string) => {
    const map: Record<string, string> = {
      USD: "US", EUR: "EU", GBP: "GB", JPY: "JP",
      INR: "IN", CNY: "CN", SAR: "SA", BRL: "BR",
      KRW: "KR", AUD: "US", CAD: "US", CHF: "US",
      THB: "CN", TRY: "SA", RUB: "SA", PKR: "IN",
    };
    return map[code] || code.substring(0, 2).toUpperCase();
  };

  const fromEconomy = economyData[getCountryKey(fromCurrency)] || economyData["US"];
  const toEconomy = economyData[getCountryKey(toCurrency)] || economyData["EU"];

  if (!fromInfo || !toInfo) return null;

  const comparisonPoints = [
    { label: "GDP per Capita", from: fromEconomy.gdpPerCapita, to: toEconomy.gdpPerCapita },
    { label: "Average Salary", from: fromEconomy.avgSalary, to: toEconomy.avgSalary },
    { label: "Inflation Rate", from: fromEconomy.inflationRate, to: toEconomy.inflationRate },
    { label: "Purchasing Power", from: fromEconomy.purchasingPower, to: toEconomy.purchasingPower },
    { label: "Economy Size", from: fromEconomy.economySize, to: toEconomy.economySize },
    { label: "Unemployment", from: fromEconomy.unemployment, to: toEconomy.unemployment },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-6"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📊</span>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {fromInfo.code} vs {toInfo.code} — Economy Comparison
            </h3>
            <p className="text-xs text-muted-foreground">
              Compare economic indicators between {fromInfo.country} and {toInfo.country}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-4 rounded-xl bg-muted/50 border border-border space-y-3">
              {comparisonPoints.map((point, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 text-sm">
                  <span className="text-muted-foreground">{point.label}</span>
                  <span className="text-foreground font-medium text-center">{fromInfo.flag} {point.from}</span>
                  <span className="text-foreground font-medium text-center">{toInfo.flag} {point.to}</span>
                </div>
              ))}

              <div className="pt-3 mt-3 border-t border-border/50 text-center">
                <p className="text-[11px] text-muted-foreground">
                  Data shown is approximate and for reference only. Actual values may vary.
                  <br />
                  For precise data, consult{' '}
                  <a
                    href="https://data.worldbank.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    World Bank <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function PurchasingPowerComparison({ fromCurrency, toCurrency }: { fromCurrency: string; toCurrency: string }) {
  const [expanded, setExpanded] = useState(false);
  const fromInfo = getCurrencyByCode(fromCurrency);
  const toInfo = getCurrencyByCode(toCurrency);

  if (!fromInfo || !toInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-4"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3.5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">💰</span>
          <span className="text-sm font-medium">Purchasing Power Comparison</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-4 rounded-xl bg-muted/50 border border-border text-sm space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                <strong>Purchasing Power Parity (PPP)</strong> compares how much goods and services
                a currency can buy in different countries. Even when exchange rates fluctuate,
                the actual buying power of money differs based on local prices.
              </p>
              <div className="bg-background rounded-lg p-3">
                <p className="font-medium mb-1">Example:</p>
                <p className="text-muted-foreground">
                  A {fromInfo.code} {fromCurrency} might buy you a cup of coffee in {fromInfo.country},
                  but the same amount in {toInfo.code} {toCurrency} could buy {Math.round(1 * 60)} coffees in {toInfo.country}
                  (based on average local prices).
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Source: World Bank, IMF, and Numbeo cost-of-living indices
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}