import { NextRequest } from "next";
import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const contentType = "image/png";

const CURRENCY_INFO: Record<string, { name: string; flag: string; symbol: string }> = {
  USD: { name: "US Dollar", flag: "🇺🇸", symbol: "$" },
  EUR: { name: "Euro", flag: "🇪🇺", symbol: "€" },
  GBP: { name: "British Pound", flag: "🇬🇧", symbol: "£" },
  JPY: { name: "Japanese Yen", flag: "🇯🇵", symbol: "¥" },
  INR: { name: "Indian Rupee", flag: "🇮🇳", symbol: "₹" },
  PKR: { name: "Pakistani Rupee", flag: "🇵🇰", symbol: "Rs" },
  CNY: { name: "Chinese Yuan", flag: "🇨🇳", symbol: "¥" },
  AUD: { name: "Australian Dollar", flag: "🇦🇺", symbol: "A$" },
  CAD: { name: "Canadian Dollar", flag: "🇨🇦", symbol: "C$" },
  CHF: { name: "Swiss Franc", flag: "🇨🇭", symbol: "Fr" },
  KRW: { name: "South Korean Won", flag: "🇰🇷", symbol: "₩" },
  SGD: { name: "Singapore Dollar", flag: "🇸🇬", symbol: "S$" },
  THB: { name: "Thai Baht", flag: "🇹🇭", symbol: "฿" },
  TRY: { name: "Turkish Lira", flag: "🇹🇷", symbol: "₺" },
  SAR: { name: "Saudi Riyal", flag: "🇸🇦", symbol: "﷼" },
  AED: { name: "UAE Dirham", flag: "🇦🇪", symbol: "د.إ" },
  BRL: { name: "Brazilian Real", flag: "🇧🇷", symbol: "R$" },
  MXN: { name: "Mexican Peso", flag: "🇲🇽", symbol: "$" },
  GBP: { name: "British Pound", flag: "🇬🇧", symbol: "£" },
};

const CATEGORY_EMOJIS: Record<string, string> = {
  length: "📏", weight: "⚖️", temperature: "🌡️", speed: "🚀",
  area: "📐", volume: "🧊", time: "⏰", storage: "💾",
};

function getCurrencyInfo(code: string) {
  return CURRENCY_INFO[code.toUpperCase()] || { name: code.toUpperCase(), flag: "🌐", symbol: "" };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const type = searchParams.get("type");
  const category = searchParams.get("category");

  let title = "Conversion Hub";
  let subtitle = "Free Online Converters";
  let emoji = "🔄";

  if (type === "currency" && from && to) {
    const fromInfo = getCurrencyInfo(from);
    const toInfo = getCurrencyInfo(to);
    title = `${fromInfo.flag} ${from.toUpperCase()} → ${toInfo.flag} ${to.toUpperCase()}`;
    subtitle = `${fromInfo.name} to ${toInfo.name} · Live Exchange Rate`;
    emoji = "💱";
  } else if (category) {
    emoji = CATEGORY_EMOJIS[category.toLowerCase()] || "🔄";
    title = `${category.charAt(0).toUpperCase() + category.slice(1)} Converter`;
    subtitle = `Free online ${category.toLowerCase()} conversion tool`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          padding: "40px 60px",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Background accents */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 25% 40%, rgba(59,130,246,0.12) 0%, transparent 50%), radial-gradient(circle at 75% 60%, rgba(139,92,246,0.08) 0%, transparent 50%)",
          }}
        />

        {/* Subtle border glow */}
        <div
          style={{
            position: "absolute",
            inset: "3px",
            borderRadius: "16px",
            border: "1px solid rgba(59,130,246,0.25)",
            boxShadow: "0 0 60px rgba(59,130,246,0.08)",
          }}
        />

        {/* Corner accent */}
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 28,
            width: 8,
            height: 8,
            borderTop: "2px solid rgba(59,130,246,0.4)",
            borderRight: "2px solid rgba(59,130,246,0.4)",
            borderRadius: "0 4px 0 0",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 28,
            width: 8,
            height: 8,
            borderBottom: "2px solid rgba(139,92,246,0.4)",
            borderLeft: "2px solid rgba(139,92,246,0.4)",
            borderRadius: "0 0 0 4px",
          }}
        />

        {/* Top label */}
        <div
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          Conversion Hub
        </div>

        {/* Main emoji */}
        <div
          style={{
            fontSize: "72px",
            marginBottom: "20px",
            filter: "drop-shadow(0 8px 32px rgba(59,130,246,0.25))",
          }}
        >
          {emoji}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: "800",
            color: "#ffffff",
            textAlign: "center",
            letterSpacing: "-0.03em",
            textShadow: "0 4px 30px rgba(0,0,0,0.4)",
            maxWidth: "700px",
            lineHeight: 1.15,
            marginBottom: "14px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "22px",
            color: "rgba(255,255,255,0.65)",
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          {subtitle}
        </div>

        {/* Divider */}
        <div
          style={{
            width: "60px",
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)",
            marginBottom: "24px",
          }}
        />

        {/* Badge */}
        <div
          style={{
            padding: "8px 24px",
            background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: "100px",
            fontSize: "13px",
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.04em",
          }}
        >
          conversionhub.com • Free & Open
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: await fetch(
            new URL(
              "https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2bj87AZ9hjp-Ek-_EeB_m0tv7.woff"
            )
          ).then((res) => res.arrayBuffer()),
          weight: 800,
        },
      ],
    }
  );
}