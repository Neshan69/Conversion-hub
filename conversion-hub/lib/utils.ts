import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Recent conversions management
const RECENT_CONVERSIONS_KEY = "conversion-hub-recent";
const MAX_RECENT = 10;

export interface RecentConversion {
  id: string;
  category: string;
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
  timestamp: number;
}

export function getRecentConversions(): RecentConversion[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(RECENT_CONVERSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addRecentConversion(conversion: Omit<RecentConversion, "id" | "timestamp">): void {
  if (typeof window === "undefined") return;

  try {
    const recent = getRecentConversions();
    const newConversion: RecentConversion = {
      ...conversion,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    // Remove duplicate if exists
    const filtered = recent.filter(
      (c) =>
        !(c.category === conversion.category &&
          c.fromUnit === conversion.fromUnit &&
          c.toUnit === conversion.toUnit &&
          c.fromValue === conversion.fromValue)
    );

    // Add new conversion at the beginning
    filtered.unshift(newConversion);

    // Keep only MAX_RECENT items
    const trimmed = filtered.slice(0, MAX_RECENT);

    localStorage.setItem(RECENT_CONVERSIONS_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error("Failed to save recent conversion:", error);
  }
}

export function clearRecentConversions(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RECENT_CONVERSIONS_KEY);
}

// Utility functions
export function formatNumber(value: number, decimalPlaces: number = 2): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  // Use Intl.NumberFormat for proper formatting
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalPlaces,
  });

  return formatter.format(value);
}

export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand("copy");
        resolve(true);
      } catch {
        resolve(false);
      }
      
      document.body.removeChild(textArea);
    }
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}