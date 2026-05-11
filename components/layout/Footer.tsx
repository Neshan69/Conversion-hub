"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "All Converters", href: "/convert" },
    { label: "Length Converter", href: "/convert/length" },
    { label: "Weight Converter", href: "/convert/weight" },
    { label: "Temperature Converter", href: "/convert/temperature" },
    { label: "Speed Converter", href: "/convert/speed" },
    { label: "Area Converter", href: "/convert/area" },
    { label: "Volume Converter", href: "/convert/volume" },
  ],
  Tools: [
    { label: "Currency Converter", href: "/currency" },
    { label: "File Converter", href: "/tools" },
    { label: "Image Converter", href: "/tools/images" },
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
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Conversion Hub
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Your all-in-one conversion platform. Fast, accurate, and free tools for unit, currency, and file conversions.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Learn more about us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
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
            <Link href="/sitemap.xml" className="hover:text-accent transition-colors">
              Sitemap
            </Link>
            <Link href="/robots.txt" className="hover:text-accent transition-colors">
              Robots
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}