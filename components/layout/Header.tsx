"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X, Search, Moon, Sun, Keyboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Length", href: "/convert/length" },
  { label: "Weight", href: "/convert/weight" },
  { label: "Temperature", href: "/convert/temperature" },
  { label: "Speed", href: "/convert/speed" },
  { label: "Area", href: "/convert/area" },
  { label: "Volume", href: "/convert/volume" },
  { label: "Time", href: "/convert/time" },
  { label: "Storage", href: "/convert/storage" },
  { label: "Currency", href: "/currency", highlight: true },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80 border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity relative group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105">
              <span className="text-lg font-bold text-primary-foreground">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:block">
              Conversion Hub
            </span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent sm:hidden">
              Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    "hover:bg-accent/10 hover:text-accent",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground"
                  )}
                >
                  <span className={cn(
                    "relative z-10",
                    isActive && item.highlight && "px-2 py-0.5 bg-primary/20 rounded-full text-primary"
                  )}>
                    {item.label}
                  </span>
                  {/* Active indicator pill with glow */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-pill"
                      className="absolute inset-0 bg-primary/20 rounded-xl ring-2 ring-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search button with keyboard hint */}
            <Link
              href="/search"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-accent/10 transition-colors text-sm text-muted-foreground hover:text-foreground"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
              <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-xs font-mono text-muted-foreground border border-border/50">
                <Keyboard className="w-3 h-3" />
                /
              </kbd>
            </Link>

            {/* Mobile search button (icon only) */}
            <Link
              href="/search"
              className="sm:hidden p-2 rounded-xl hover:bg-accent/10 transition-colors"
              aria-label="Search converters"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-accent/10 transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {resolvedTheme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5 text-amber-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5 text-slate-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-accent/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1 border-t border-border/30 mt-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        "hover:bg-accent/10 hover:text-accent",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground"
                      )}
                    >
                      <span className="flex items-center justify-between">
                        {item.label}
                        {isActive && (
                          <motion.div
                            layoutId="mobile-check"
                            className="w-2 h-2 rounded-full bg-primary"
                          />
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
