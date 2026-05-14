"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X, Search, Moon, Sun, Keyboard, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { UserDashboardInline } from "@/components/converter/UserDashboard";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Unit", href: "/unit" },
  { label: "Currency", href: "/currency", highlight: true },
  { label: "Search", href: "/search" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(prev => !prev);
        if (!searchOpen) {
          requestAnimationFrame(() => searchInputRef.current?.focus());
        }
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80 border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all duration-200 group-hover:scale-105">
              <span className="text-sm font-bold text-primary-foreground">C</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:block">
              Conversion Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={cn(
                    "relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap",
                    "hover:bg-accent/10 hover:text-accent",
                    active
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground"
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <motion.div
                      layoutId="navbar-pill"
                      className="absolute inset-0 bg-primary/20 rounded-lg shadow-[0_0_10px_rgba(var(--primary),0.15)]"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Activity Dashboard */}
            <div className="hidden sm:block">
              <UserDashboardInline />
            </div>

            {/* Search */}
            <div className="relative">
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 z-50"
                >
                  <Link
                    href="/search"
                    onClick={() => setSearchOpen(false)}
                    className="block w-full px-4 py-2.5 bg-card border border-border rounded-xl shadow-lg focus:outline-none focus:border-primary transition-all text-sm"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Search className="w-4 h-4" />
                      <span>Search converters & currencies...</span>
                      <kbd className="ml-auto hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground">Esc</kbd>
                    </div>
                  </Link>
                </motion.div>
              )}
              <Link
                href="/search"
                className={cn(
                  "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors text-sm text-muted-foreground hover:text-foreground whitespace-nowrap",
                  searchOpen && "bg-accent/10 text-foreground"
                )}
              >
                <Search className="w-4 h-4" />
                <span className="hidden md:inline">Search</span>
                <kbd className="hidden md:inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border/50">
                  /
                </kbd>
              </Link>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {resolvedTheme === "dark" ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Sun className="w-4 h-4 text-amber-500" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Moon className="w-4 h-4 text-slate-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-accent/10 transition-colors"
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
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-3 space-y-1 border-t border-border/30 mt-2">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                        "hover:bg-accent/10 hover:text-accent",
                        active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"
                      )}
                    >
                      <span className="flex-1">{item.label}</span>
                      {active && (
                        <motion.div layoutId="mobile-check" className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
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