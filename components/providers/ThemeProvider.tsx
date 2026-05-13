"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
};

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "conversion-hub-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    const stored = localStorage.getItem(storageKey) as Theme | null;
    return stored || defaultTheme;
  });
   
  // Track system preference separately
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "light";
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    return mediaQuery.matches ? "dark" : "light";
  });

  // Detect initial system theme
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = (e?: MediaQueryListEvent | MediaQueryList) => {
      const newTheme = (e ? e.matches : mediaQuery.matches) ? "dark" : "light";
      setSystemTheme(newTheme);
    };

    updateSystemTheme(mediaQuery);
    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  // Compute resolved theme based on theme preference and system theme
  const resolvedTheme = useMemo((): "dark" | "light" => {
    return theme === "system" ? systemTheme : theme;
  }, [theme, systemTheme]);

  // Apply theme class to document root
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((theme: Theme) => {
    localStorage.setItem(storageKey, theme);
    setThemeState(theme);
  }, [storageKey]);

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{ theme, setTheme, resolvedTheme }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};