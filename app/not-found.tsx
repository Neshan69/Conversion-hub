"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent leading-none">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The converter you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium hover:shadow-lg transition-all"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <Link
              href="/search"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border bg-background/50 font-medium hover:bg-accent/10 transition-all"
            >
              <Search className="w-5 h-5" />
              Find Converter
            </Link>
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-background/50 font-medium hover:bg-accent/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-border/40">
            <p className="text-sm text-muted-foreground mb-4">Try these popular converters:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: "kg to lbs", href: "/unit/kg-to-lbs" },
                { label: "km to miles", href: "/unit/length?from=kilometer&to=mile" },
                { label: "°C to °F", href: "/unit/temperature?from=celsius&to=fahrenheit" },
                { label: "USD to EUR", href: "/currency/usd-to-eur" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="px-4 py-2 rounded-full bg-muted hover:bg-accent/20 text-sm font-medium transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
