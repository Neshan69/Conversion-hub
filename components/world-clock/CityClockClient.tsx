"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Globe2, Sunrise, Sunset, MoonStar } from "lucide-react";
import { getSolarTimes, getTimeZoneDisplay, getUtcOffsetMinutes } from "@/lib/timezone-utils";

interface CityClockClientProps {
  city: string;
  country: string;
  timeZone: string;
  latitude: number;
  longitude: number;
}

function formatClock(time: Date, hour12: boolean) {
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12 });
}

export function CityClockClient({ city, country, timeZone, latitude, longitude }: CityClockClientProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const handle = requestAnimationFrame(function tick() {
      setNow(new Date());
      requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const localTime = useMemo(() => {
    return new Date(now.toLocaleString("en-US", { timeZone }));
  }, [now, timeZone]);

  const zoneInfo = useMemo(() => getTimeZoneDisplay(timeZone, now), [timeZone, now]);

  const solarTimes = useMemo(() => {
    const times = getSolarTimes(now, latitude, longitude);
    const offsetMinutes = getUtcOffsetMinutes(timeZone, now);
    const localSunrise = shiftMinutes(times.sunrise, offsetMinutes);
    const localSunset = shiftMinutes(times.sunset, offsetMinutes);
    return { ...times, sunrise: localSunrise, sunset: localSunset };
  }, [now, latitude, longitude, timeZone]);

  const isNight = localTime.getHours() < 6 || localTime.getHours() >= 18;

  return (
    <div className="grid gap-6 rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-2xl shadow-slate-950/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">{city}</p>
          <h2 className="text-3xl font-semibold text-foreground">{country}</h2>
          <p className="text-sm text-muted-foreground">{timeZone}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-3xl border border-border/60 bg-background/90 px-4 py-3 text-sm text-foreground">
          <Clock3 className="w-5 h-5 text-primary" />
          {formatClock(localTime, false)}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-border/60 bg-background/90 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">UTC offset</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">{zoneInfo.offset}</p>
          <p className="mt-2 text-sm text-muted-foreground">{zoneInfo.abbreviation} • {zoneInfo.isDst ? "DST active" : "Standard time"}</p>
        </div>
        <div className="rounded-3xl border border-border/60 bg-background/90 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Day-night</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">{isNight ? "Night" : "Day"}</p>
          <p className="mt-2 text-sm text-muted-foreground">Local sunrise / sunset times</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-border/60 bg-background/90 p-4 text-center">
          <Sunrise className="mx-auto mb-2 h-6 w-6 text-warning" />
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Sunrise</p>
          <p className="mt-2 text-lg font-semibold text-foreground">{solarTimes.sunrise}</p>
        </div>
        <div className="rounded-3xl border border-border/60 bg-background/90 p-4 text-center">
          <Sunset className="mx-auto mb-2 h-6 w-6 text-orange-500" />
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Sunset</p>
          <p className="mt-2 text-lg font-semibold text-foreground">{solarTimes.sunset}</p>
        </div>
        <div className="rounded-3xl border border-border/60 bg-background/90 p-4 text-center">
          <MoonStar className="mx-auto mb-2 h-6 w-6 text-slate-400" />
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Mode</p>
          <p className="mt-2 text-lg font-semibold text-foreground">{isNight ? "Evening" : "Morning"}</p>
        </div>
      </div>
    </div>
  );
}

function shiftMinutes(time: string, offsetMinutes: number) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(Date.UTC(1970, 0, 1, hours, minutes));
  date.setUTCMinutes(date.getUTCMinutes() + offsetMinutes);
  return `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
}
