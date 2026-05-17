"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Clock3, Globe2, ArrowRight } from "lucide-react";
import { fuzzySearchTimeZones, getTimeZoneDisplay, allTimeZones, featuredCities } from "@/lib/timezone-utils";
import { Button, Input } from "@/components/ui/components";

const HISTORY_KEY = "conversion-hub-timezone-search-history";

export function TimezoneSearchClient() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setRecent(JSON.parse(stored));
      } catch {
        setRecent([]);
      }
    }
  }, []);

  const suggestions = useMemo(() => {
    return fuzzySearchTimeZones(query, 8);
  }, [query]);

  const addRecent = (timezone: string) => {
    setRecent((prev) => {
      const next = [timezone, ...prev.filter((item) => item !== timezone)].slice(0, 8);
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleSelect = (timezone: string) => {
    setQuery(timezone);
    addRecent(timezone);
  };

  const display = useMemo(() => {
    if (!query) return null;
    return getTimeZoneDisplay(query, new Date());
  }, [query]);

  return (
    <div className="grid gap-8">
      <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-2xl shadow-slate-950/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">Timezone search</p>
            <h2 className="text-3xl font-semibold text-foreground">Find any global clock fast</h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
              Search by city, region, abbreviation, or GMT offset, then review local time and DST at a glance.
            </p>
          </div>
          <Search className="w-6 h-6 text-primary" />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Nepal Time, Tokyo, GMT+5:45, EST..."
            className="w-full"
          />
          <Button variant="default" size="sm" onClick={() => handleSelect(query)} disabled={!query}>
            <ArrowRight className="w-4 h-4" /> Go
          </Button>
        </div>

        <div className="mt-6 grid gap-3">
          <p className="text-sm font-semibold text-foreground">Quick suggestions</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {featuredCities.slice(0, 4).map((city) => (
              <button
                key={city.slug}
                type="button"
                onClick={() => handleSelect(city.timezone)}
                className="rounded-3xl border border-border/60 bg-background/90 px-4 py-3 text-left text-sm text-foreground hover:border-primary"
              >
                <p className="font-medium">{city.city}</p>
                <p className="text-xs text-muted-foreground">{city.timezone}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-2xl shadow-slate-950/5">
          <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">Recent searches</p>
          <div className="mt-4 grid gap-3">
            {recent.length ? (
              recent.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="rounded-3xl border border-border/60 bg-background/90 px-4 py-3 text-left text-sm text-foreground hover:border-primary"
                >
                  {item}
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Your recent timezone searches will appear here.</p>
            )}
          </div>
        </div>

        {display && (
          <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-2xl shadow-slate-950/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">Result</p>
                <h3 className="text-xl font-semibold text-foreground">{query}</h3>
              </div>
              <Clock3 className="w-6 h-6 text-primary" />
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl border border-border/60 bg-background/90 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Local time</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">{display.localTime}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-border/60 bg-background/90 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Offset</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{display.offset}</p>
                </div>
                <div className="rounded-3xl border border-border/60 bg-background/90 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Abbreviation</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{display.abbreviation}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-2xl shadow-slate-950/5">
        <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">Browse time zones</p>
        <div className="mt-4 grid gap-3 max-h-[320px] overflow-y-auto pr-2">
          {allTimeZones.slice(0, 12).map((zone) => (
            <button
              key={zone}
              type="button"
              onClick={() => handleSelect(zone)}
              className="rounded-3xl border border-border/60 bg-background/90 px-4 py-3 text-left text-sm text-foreground hover:border-primary"
            >
              {zone}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
