"use client";

import { useMemo, useState } from "react";
import { Button, Input } from "@/components/ui/components";
import { ArrowRight, Sparkles, ShieldCheck, TreeDeciduous } from "lucide-react";
import { toRoman, isValidRoman, fromRoman } from "@/lib/roman-numeral";

export function RomanExtras() {
  const [year, setYear] = useState("2025");
  const [previewText, setPreviewText] = useState("Conversion Hub");
  const yearRoman = useMemo(() => {
    const num = Number(year);
    if (!Number.isInteger(num) || num < 1 || num > 3999) return "";
    return toRoman(num);
  }, [year]);

  const tattooStyle = useMemo(() => {
    if (!previewText) return "";
    return previewText
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, "")
      .split("")
      .map((char) => (isValidRoman(char) ? char : char === " " ? " " : ""))
      .join("");
  }, [previewText]);

  return (
    <div className="grid gap-8">
      <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-lg shadow-slate-950/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Roman year generator</p>
            <h3 className="mt-2 text-2xl font-semibold text-foreground">Generate historical year markers</h3>
            <p className="mt-3 text-sm text-muted-foreground">Type a year and preview its Roman numeral equivalent instantly.</p>
          </div>
          <ArrowRight className="w-6 h-6 text-primary" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] items-end">
          <Input
            type="number"
            value={year}
            min={1}
            max={3999}
            onChange={(e) => setYear(e.target.value)}
            label="Year"
            className="w-full"
          />
          <div className="rounded-3xl border border-border/60 bg-background/80 p-4 text-center">
            <p className="text-sm text-muted-foreground">Roman year</p>
            <p className="mt-3 text-3xl font-semibold text-primary">{yearRoman || "—"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-lg shadow-slate-950/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Tattoo preview mode</p>
            <h3 className="mt-2 text-2xl font-semibold text-foreground">Stylish Roman typography</h3>
            <p className="mt-3 text-sm text-muted-foreground">Enter text to preview how Roman-style numerals and letters will appear.</p>
          </div>
          <Sparkles className="w-6 h-6 text-secondary" />
        </div>
        <div className="mt-6 grid gap-4">
          <Input
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            label="Tattoo text"
            placeholder="e.g. XVIII or MMXXV"
            className="w-full"
          />
          <div className="rounded-3xl border border-border/60 bg-background/95 p-6 text-center text-5xl font-semibold tracking-[0.25em] text-foreground sm:text-6xl">
            {tattooStyle || "NOVA"}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-lg shadow-slate-950/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Historical timeline</p>
            <h3 className="mt-2 text-2xl font-semibold text-foreground">Roman numeral evolution</h3>
            <p className="mt-3 text-sm text-muted-foreground">See the most important milestones in the history and modern use of Roman numerals.</p>
          </div>
          <TreeDeciduous className="w-6 h-6 text-accent" />
        </div>
        <div className="mt-6 grid gap-4 text-sm text-muted-foreground">
          <div className="rounded-3xl border border-border/60 bg-background/80 p-4">
            <p className="font-semibold text-foreground">500 BCE</p>
            <p>Early Roman numerals appear on monuments and tally marks.</p>
          </div>
          <div className="rounded-3xl border border-border/60 bg-background/80 p-4">
            <p className="font-semibold text-foreground">1st century CE</p>
            <p>Standardized notation emerges for commerce, engineering, and calendars.</p>
          </div>
          <div className="rounded-3xl border border-border/60 bg-background/80 p-4">
            <p className="font-semibold text-foreground">14th century</p>
            <p>Roman numerals remain common in scholarly works and clock faces.</p>
          </div>
          <div className="rounded-3xl border border-border/60 bg-background/80 p-4">
            <p className="font-semibold text-foreground">Modern use</p>
            <p>They are still used in films, watches, monuments, event numbering, and design.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
