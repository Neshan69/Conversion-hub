export interface CityZone {
  slug: string;
  city: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
  region: string;
  label: string;
}

export const featuredCities: CityZone[] = [
  { slug: "tokyo", city: "Tokyo", country: "Japan", timezone: "Asia/Tokyo", latitude: 35.6762, longitude: 139.6503, region: "Asia", label: "Tokyo Time" },
  { slug: "london", city: "London", country: "United Kingdom", timezone: "Europe/London", latitude: 51.5074, longitude: -0.1278, region: "Europe", label: "London Time" },
  { slug: "kathmandu", city: "Kathmandu", country: "Nepal", timezone: "Asia/Kathmandu", latitude: 27.7172, longitude: 85.3240, region: "Asia", label: "Kathmandu Time" },
  { slug: "sydney", city: "Sydney", country: "Australia", timezone: "Australia/Sydney", latitude: -33.8688, longitude: 151.2093, region: "Australia", label: "Sydney Time" },
  { slug: "new-york", city: "New York", country: "United States", timezone: "America/New_York", latitude: 40.7128, longitude: -74.0060, region: "Americas", label: "New York Time" },
  { slug: "dubai", city: "Dubai", country: "United Arab Emirates", timezone: "Asia/Dubai", latitude: 25.2048, longitude: 55.2708, region: "Asia", label: "Dubai Time" },
  { slug: "paris", city: "Paris", country: "France", timezone: "Europe/Paris", latitude: 48.8566, longitude: 2.3522, region: "Europe", label: "Paris Time" },
  { slug: "singapore", city: "Singapore", country: "Singapore", timezone: "Asia/Singapore", latitude: 1.3521, longitude: 103.8198, region: "Asia", label: "Singapore Time" },
  { slug: "seoul", city: "Seoul", country: "South Korea", timezone: "Asia/Seoul", latitude: 37.5665, longitude: 126.9780, region: "Asia", label: "Seoul Time" },
  { slug: "beijing", city: "Beijing", country: "China", timezone: "Asia/Shanghai", latitude: 39.9042, longitude: 116.4074, region: "Asia", label: "Beijing Time" },
];

const fallbackTimeZones = [
  "UTC",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Denver",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Australia/Sydney",
  "Pacific/Auckland",
  "Africa/Johannesburg",
  "America/Sao_Paulo",
  "America/Mexico_City",
];

export const allTimeZones: string[] = (typeof Intl !== "undefined" && typeof Intl.supportedValuesOf === "function")
  ? Intl.supportedValuesOf("timeZone")
  : fallbackTimeZones;

export function findCityBySlug(slug: string): CityZone | undefined {
  const normalized = slug.toLowerCase();
  return featuredCities.find((city) => city.slug === normalized || city.timezone.toLowerCase().endsWith(normalized));
}

export function getZoneDisplay(timeZone: string, date = new Date()): { offset: string; abbreviation: string; isDst: boolean; localTime: string; utcOffsetMinutes: number } {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short"
  });
  const parts = dtf.formatToParts(date);
  const timeParts: Record<string, string> = {};
  parts.forEach((part) => {
    if (part.type !== "literal") {
      timeParts[part.type] = part.value;
    }
  });

  const localTime = `${timeParts.hour}:${timeParts.minute}:${timeParts.second}`;
  const zoneName = timeParts.timeZoneName ?? timeZone;
  const offset = getUtcOffset(timeZone, date);
  const isDst = isDaylightSavingTime(timeZone, date);

  return { offset, abbreviation: zoneName, localTime, isDst, utcOffsetMinutes: getUtcOffsetMinutes(timeZone, date) };
}

export function getUtcOffset(timeZone: string, date = new Date()): string {
  const dtf = new Intl.DateTimeFormat("en-US", { timeZone, hour12: false, timeZoneName: "shortOffset" });
  const parts = dtf.formatToParts(date);
  const offsetPart = parts.find((part) => part.type === "timeZoneName");
  return offsetPart?.value ?? "UTC";
}

export function getUtcOffsetMinutes(timeZone: string, date = new Date()): number {
  const local = new Date(date.toLocaleString("en-US", { timeZone }));
  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  return Math.round((local.getTime() - utc.getTime()) / 60000);
}

export function isDaylightSavingTime(timeZone: string, date = new Date()): boolean {
  const standardDate = new Date(date.getFullYear(), 0, 1);
  const standardOffset = getUtcOffsetMinutes(timeZone, standardDate);
  const currentOffset = getUtcOffsetMinutes(timeZone, date);
  return currentOffset < standardOffset;
}

export function fuzzySearchTimeZones(query: string, limit = 10): string[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...featuredCities.map((item) => item.timezone), "UTC", "America/New_York", "Europe/London", "Asia/Tokyo", "Asia/Kathmandu"].slice(0, limit);
  }

  const matches = allTimeZones
    .map((zone) => {
      const score = getFuzzyScore(normalized, zone.toLowerCase());
      return { zone, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.zone.localeCompare(b.zone))
    .slice(0, limit)
    .map((item) => item.zone);

  return matches.length ? matches : allTimeZones.slice(0, limit);
}

function getFuzzyScore(query: string, target: string): number {
  let score = 0;
  if (target.includes(query)) score += 10;
  const queryParts = query.split(/_|\//).filter(Boolean);
  queryParts.forEach((part) => {
    if (target.includes(part)) score += 5;
  });
  const initials = target.split(/[_\/-]/).map((part) => part[0]).join("");
  if (initials.includes(query[0])) score += 3;
  return score;
}

export function getSolarTimes(date: Date, latitude: number, longitude: number) {
  const zenith = 90.833;
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  const N1 = Math.floor(275 * month / 9);
  const N2 = Math.floor((month + 9) / 12);
  const N3 = (1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3));
  const N = N1 - (N2 * N3) + day - 30;
  const lngHour = longitude / 15;
  const tRise = N + ((6 - lngHour) / 24);
  const tSet = N + ((18 - lngHour) / 24);

  const M_rise = (0.9856 * tRise) - 3.289;
  const M_set = (0.9856 * tSet) - 3.289;

  const L_rise = normalizeAngle(M_rise + (1.916 * Math.sin(degToRad(M_rise))) + (0.020 * Math.sin(2 * degToRad(M_rise))) + 282.634);
  const L_set = normalizeAngle(M_set + (1.916 * Math.sin(degToRad(M_set))) + (0.020 * Math.sin(2 * degToRad(M_set))) + 282.634);

  const RA_rise = normalizeAngle(radToDeg(Math.atan(0.91764 * Math.tan(degToRad(L_rise)))));
  const RA_set = normalizeAngle(radToDeg(Math.atan(0.91764 * Math.tan(degToRad(L_set)))));

  const Lquadrant_rise = Math.floor(L_rise / 90) * 90;
  const RAquadrant_rise = Math.floor(RA_rise / 90) * 90;
  const RA_rise_corrected = RA_rise + (Lquadrant_rise - RAquadrant_rise);
  const RA_rise_hours = RA_rise_corrected / 15;

  const Lquadrant_set = Math.floor(L_set / 90) * 90;
  const RAquadrant_set = Math.floor(RA_set / 90) * 90;
  const RA_set_corrected = RA_set + (Lquadrant_set - RAquadrant_set);
  const RA_set_hours = RA_set_corrected / 15;

  const sinDec_rise = 0.39782 * Math.sin(degToRad(L_rise));
  const cosDec_rise = Math.cos(Math.asin(sinDec_rise));
  const sinDec_set = 0.39782 * Math.sin(degToRad(L_set));
  const cosDec_set = Math.cos(Math.asin(sinDec_set));

  const cosH_rise = (Math.cos(degToRad(zenith)) - (sinDec_rise * Math.sin(degToRad(latitude)))) / (cosDec_rise * Math.cos(degToRad(latitude)));
  const cosH_set = (Math.cos(degToRad(zenith)) - (sinDec_set * Math.sin(degToRad(latitude)))) / (cosDec_set * Math.cos(degToRad(latitude)));

  if (cosH_rise > 1 || cosH_set < -1) {
    return { sunrise: "00:00", sunset: "23:59" };
  }

  const H_rise = 360 - radToDeg(Math.acos(cosH_rise));
  const H_set = radToDeg(Math.acos(cosH_set));

  const T_rise = H_rise / 15 + RA_rise_hours - (0.06571 * tRise) - 6.622;
  const T_set = H_set / 15 + RA_set_hours - (0.06571 * tSet) - 6.622;

  const UT_rise = normalizeHour(T_rise - lngHour);
  const UT_set = normalizeHour(T_set - lngHour);

  return {
    sunrise: formatTime(UT_rise),
    sunset: formatTime(UT_set),
  };
}

function normalizeAngle(angle: number) {
  let value = angle % 360;
  if (value < 0) value += 360;
  return value;
}

function normalizeHour(hour: number) {
  let value = hour % 24;
  if (value < 0) value += 24;
  return value;
}

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

function formatTime(decimalHours: number) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.floor((decimalHours - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
