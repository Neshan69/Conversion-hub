"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DragHandleDots2, Star, Clock3, Globe2 } from "lucide-react";
import { CityZone, featuredCities, getTimeZoneDisplay } from "@/lib/timezone-utils";
import { Button } from "@/components/ui/components";
import Link from "next/link";

const STORAGE_KEY = "conversion-hub-world-clock-order";
const FAVORITES_KEY = "conversion-hub-world-clock-favorites";

export function WorldClockDashboard() {
  const [cities, setCities] = useState<CityZone[]>(featuredCities);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [selectedComparison, setSelectedComparison] = useState<[string, string]>([featuredCities[0].slug, featuredCities[1].slug]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const storedOrder = window.localStorage.getItem(STORAGE_KEY);
    const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
    if (storedOrder) {
      try {
        const order: string[] = JSON.parse(storedOrder);
        const ordered = order
          .map((slug) => featuredCities.find((zone) => zone.slug === slug))
          .filter(Boolean) as CityZone[];
        setCities([...ordered, ...featuredCities.filter((zone) => !order.includes(zone.slug))]);
      } catch {
        setCities(featuredCities);
      }
    }
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cities.map((city) => city.slug)));
  }, [cities]);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const comparisonOptions = useMemo(() => featuredCities.map((city) => ({ value: city.slug, label: `${city.city}, ${city.country}` })), []);
  const comparisonZones = useMemo(() => {
    const primary = featuredCities.find((city) => city.slug === selectedComparison[0]);
    const secondary = featuredCities.find((city) => city.slug === selectedComparison[1]);
    return { primary, secondary };
  }, [selectedComparison]);

  const moveCity = (from: number, to: number) => {
    setCities((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) => (prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-2xl shadow-slate-950/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">World Clock</p>
            <h2 className="text-3xl font-semibold text-foreground">Live global dashboard</h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
              Watch live time for major cities, reorder your favorites with drag and drop, and compare time zones instantly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/timezones" className="rounded-2xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary">
              Search time zones
            </Link>
            <Link href="/clock/tokyo" className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              Open Tokyo clock
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="grid gap-5">
          {cities.map((city, index) => {
            const info = getTimeZoneDisplay(city.timezone, now);
            return (
              <motion.article
                key={city.slug}
                layout
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragStart={() => setDragIndex(index)}
                onDragEnd={() => setDragIndex(null)}
                onDrag={(event, info) => {
                  const nextIndex = Math.max(0, Math.min(cities.length - 1, index + Math.sign(info.delta.y)));
                  if (nextIndex !== index && dragIndex === index) moveCity(index, nextIndex);
                }}
                className="group rounded-[2rem] border border-border/70 bg-background/80 p-6 shadow-lg shadow-slate-950/5 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{city.label}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-foreground">{city.city}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{city.country}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(city.slug)}
                    className="rounded-2xl border border-border/60 bg-card/90 p-3 text-muted-foreground transition hover:border-primary hover:text-primary"
                    aria-label="Toggle favorite"
                  >
                    <Star className={`w-5 h-5 ${favorites.includes(city.slug) ? "text-amber-400" : ""}`} />
                  </button>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-border/60 bg-card/90 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Local time</p>
                    <p className="mt-3 text-3xl font-semibold text-foreground">{info.localTime}</p>
                  </div>
                  <div className="rounded-3xl border border-border/60 bg-card/90 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">UTC offset</p>
                    <p className="mt-3 text-3xl font-semibold text-foreground">{info.offset}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background/90 px-3 py-2">
                    <Clock3 className="w-4 h-4" /> {info.abbreviation}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background/90 px-3 py-2">
                    <Globe2 className="w-4 h-4" /> {info.isDst ? "DST" : "Standard"}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>

        <aside className="space-y-5">
          <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">Comparison</p>
                <h3 className="text-xl font-semibold text-foreground">Timezone difference</h3>
              </div>
              <DragHandleDots2 className="w-5 h-5 text-primary" />
            </div>
            <div className="mt-5 grid gap-4">
              <div className="grid gap-3">
                <label className="text-sm font-medium text-foreground">Primary city</label>
                <select
                  className="flex h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground"
                  value={selectedComparison[0]}
                  onChange={(e) => setSelectedComparison([e.target.value, selectedComparison[1]])}
                >
                  {comparisonOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3">
                <label className="text-sm font-medium text-foreground">Secondary city</label>
                <select
                  className="flex h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground"
                  value={selectedComparison[1]}
                  onChange={(e) => setSelectedComparison([selectedComparison[0], e.target.value])}
                >
                  {comparisonOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {comparisonZones.primary && comparisonZones.secondary && (
              <div className="mt-6 rounded-3xl border border-border/60 bg-background/90 p-5">
                <p className="text-sm text-muted-foreground">Time difference</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">
                  {Math.abs(getTimeZoneDisplay(comparisonZones.primary.timezone, now).utcOffsetMinutes - getTimeZoneDisplay(comparisonZones.secondary.timezone, now).utcOffsetMinutes) / 60} hours
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{comparisonZones.primary.city} vs {comparisonZones.secondary.city}</p>
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">Favorites</p>
                <h3 className="text-xl font-semibold text-foreground">Pinned cities</h3>
              </div>
            </div>
            {favorites.length ? (
              <div className="mt-5 space-y-3">
                {favorites.map((slug) => {
                  const city = featuredCities.find((item) => item.slug === slug);
                  return city ? (
                    <Link key={city.slug} href={`/clock/${city.slug}`} className="block rounded-3xl border border-border/60 bg-background/90 p-4 hover:border-primary">
                      <p className="font-medium text-foreground">{city.city}</p>
                      <p className="text-sm text-muted-foreground">{city.timezone}</p>
                    </Link>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">Favorite cities will appear here when you star them.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
