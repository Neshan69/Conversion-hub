import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThunderBot } from "@/components/chatbot/ThunderBot";
import { SiteWideStructuredData } from "@/components/seo/StructuredData";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://conversionhub.com"),
  title: {
    default: "Conversion Hub - Currency Converter & Unit Converter",
    template: "%s | Conversion Hub",
  },
  description: "Live currency converter and online unit converter for exchange rates today, USD to NPR, USD to GBP, kg to lbs, cm to feet, and more.",
  keywords: "currency converter, exchange rate today, unit converter, online conversion tool, USD to NPR, USD to GBP, kg to lbs, cm to feet",
  authors: [{ name: "Conversion Hub" }],
  creator: "Conversion Hub",
  publisher: "Conversion Hub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://conversionhub.com",
    siteName: "Conversion Hub",
    title: "Conversion Hub - Currency Converter & Unit Converter",
    description: "Live exchange rates and premium unit conversion tools for mobile and desktop.",
    images: [
      {
        url: "/api/og?title=Conversion+Hub&subtitle=Free+Online+Converters",
        width: 1200,
        height: 630,
        alt: "Conversion Hub - Currency Converter & Unit Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conversion Hub - Currency Converter & Unit Converter",
    description: "Live currency exchange rates and online unit converters. Fast, accurate, and free.",
    images: ["/api/og?title=Conversion+Hub&subtitle=Live+Exchange+Rates"],
    creator: "@conversionhub",
  },
  alternates: {
    canonical: "https://conversionhub.com",
  },
  other: {
    "apple-mobile-web-app-title": "Conversion Hub",
    "application-name": "Conversion Hub",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="theme-color" content="#3b82f6" />

        {/* Preconnect to API endpoints */}
        <link rel="preconnect" href="https://api.exchangerate.host" />
        <link rel="preconnect" href="https://api.frankfurter.app" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured data via server component */}
        <SiteWideStructuredData />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider defaultTheme="system" storageKey="conversion-hub-theme">
          <Header />
          <main className="flex-1" role="main">{children}</main>
          <Footer />
          <ThunderBot />
        </ThemeProvider>

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration.scope);
                  }).catch(function(error) {
                    console.log('SW registration failed: ', error);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
