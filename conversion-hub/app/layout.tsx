import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteWideStructuredData } from "@/components/seo/StructuredData";

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
    default: "Conversion Hub - Free Online Unit, Currency & File Converters",
    template: "%s | Conversion Hub",
  },
  description: "All-in-one conversion platform. Convert units, currencies, files, and more with fast, accurate, and beautiful tools. Free unlimited conversions.",
  keywords: "converter, unit converter, online tools, free converter, conversion tools, currency converter, file converter",
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
    title: "Conversion Hub - Free Online Unit, Currency & File Converters",
    description: "All-in-one conversion platform with fast, accurate tools for units, currencies, files, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Conversion Hub - All-in-One Conversion Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conversion Hub - Free Online Converters",
    description: "Fast, accurate conversion tools for units, currencies, files, and more",
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