 import type { Metadata } from "next";
 import { Geist, Geist_Mono } from "next/font/google";
 import { ThemeProvider } from "@/components/providers/ThemeProvider";
 import { Header } from "@/components/layout/Header";
 import { Footer } from "@/components/layout/Footer";
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
    default: "Conversion Hub - Free Currency Converter & Unit Tools",
    template: "%s | Conversion Hub",
  },
  description: "Convert 180+ world currencies with live exchange rates. Also featuring length, weight, temperature, and other unit converters. Fast, accurate, and free.",
  keywords: "currency converter, exchange rates, forex, live rates, unit converter, length converter, weight converter, temperature converter, free tools",
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
    title: "Conversion Hub - Currency Converter & Unit Tools",
    description: "Convert currencies with live exchange rates and use our suite of unit converters. Trusted by millions for accurate, real-time conversions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Conversion Hub - Currency Converter & Unit Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conversion Hub - Currency Converter & Unit Tools",
    description: "Live currency exchange rates and unit converters. Fast, accurate, and completely free.",
    images: ["/og-image.png"],
    creator: "@conversionhub",
  },
  alternates: {
    canonical: "https://conversionhub.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Google Site Verification */}
        {/* <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" /> */}
        
        {/* Bing Site Verification */}
        {/* <meta name="msvalidate.01" content="YOUR_VERIFICATION_CODE" /> */}
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider defaultTheme="system" storageKey="conversion-hub-theme">
          {/* Site-wide structured data */}
          <SiteWideStructuredData />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}