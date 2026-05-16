"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "All Converters", href: "/unit" },
    { label: "Currency Converter", href: "/currency" },
    { label: "Length Converter", href: "/unit/length" },
    { label: "Weight Converter", href: "/unit/weight" },
    { label: "Temperature Converter", href: "/unit/temperature" },
  ],
  Resources: [
    { label: "Currency Charts", href: "/currency" },
    { label: "Conversion Tables", href: "/unit/length" },
    { label: "Popular Conversions", href: "/" },
    { label: "Search Tools", href: "/search" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-sm font-bold text-primary-foreground">C</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Conversion Hub
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs leading-relaxed">
              Your all-in-one conversion platform. Fast, accurate, and free tools for unit, currency, and data conversions.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Learn more about us
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-4 text-sm">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1 group"
                      prefetch={true}
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {currentYear} Conversion Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/sitemap.xml" className="hover:text-accent transition-colors">Sitemap</Link>
            <Link href="/robots.txt" className="hover:text-accent transition-colors">Robots</Link>
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
