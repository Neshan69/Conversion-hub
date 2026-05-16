// ──────────────────────────────────────
//  OG Image Generation API Route (App Router)
//  Create dynamic og images for every converter page
// ──────────────────────────────────────

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Helper: Get currency info
function getCurrencyInfo(code: string) {
  const currencies: Record<string, { name: string; flag: string; symbol: string }> = {
    USD: { name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
    EUR: { name: 'Euro', flag: '🇪🇺', symbol: '€' },
    GBP: { name: 'British Pound', flag: '🇬🇧', symbol: '£' },
    JPY: { name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
    INR: { name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
    PKR: { name: 'Pakistani Rupee', flag: '🇵🇰', symbol: 'Rs' },
    CNY: { name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
    AUD: { name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
    CAD: { name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
    CHF: { name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr' },
    KRW: { name: 'South Korean Won', flag: '🇰🇷', symbol: '₩' },
    SGD: { name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
    THB: { name: 'Thai Baht', flag: '🇹🇭', symbol: '฿' },
    TRY: { name: 'Turkish Lira', flag: '🇹🇷', symbol: '₺' },
    SAR: { name: 'Saudi Riyal', flag: '🇸🇦', symbol: '﷼' },
    AED: { name: 'UAE Dirham', flag: '🇦🇪', symbol: 'د.إ' },
    BRL: { name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$' },
    MXN: { name: 'Mexican Peso', flag: '🇲🇽', symbol: '$' },
  };
  return currencies[code.toUpperCase()] || { name: code.toUpperCase(), flag: '🌐', symbol: '' };
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const hasTitle = searchParams.has('title');
  const hasFrom = searchParams.has('from');
  const hasTo = searchParams.has('to');
  const hasType = searchParams.has('type');
  const hasCategory = searchParams.has('category');

  let title = 'Conversion Hub';
  let subtitle = 'Free Online Converters';
  let emoji = '🔄';

  if (hasType && hasFrom && hasTo) {
    const from = getCurrencyInfo(searchParams.get('from')!);
    const to = getCurrencyInfo(searchParams.get('to')!);
    title = `${from.flag} ${from.name} → ${to.flag} ${to.name}`;
    subtitle = `Live Exchange Rate Converter`;
    emoji = '💱';
  } else if (hasTitle) {
    title = searchParams.get('title') || 'Conversion Hub';
    subtitle = searchParams.get('subtitle') || '';
  } else if (hasCategory) {
    const cat = searchParams.get('category') || '';
    const catEmojis: Record<string, string> = {
      length: '📏', weight: '⚖️', temperature: '🌡️', speed: '🚀',
      area: '📐', volume: '🧊', time: '⏰', storage: '💾'
    };
    emoji = catEmojis[cat] || '🔄';
    title = `${cat.charAt(0).toUpperCase() + cat.slice(1)} Converter`;
    subtitle = `Free ${cat.toLowerCase()} conversion tool`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          padding: '40px',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(139,92,246,0.1) 0%, transparent 50%)',
          }}
        />

        {/* Border glow */}
        <div
          style={{
            position: 'absolute',
            inset: '3px',
            borderRadius: '16px',
            border: '1px solid rgba(59,130,246,0.3)',
            boxShadow: '0 0 40px rgba(59,130,246,0.1)',
          }}
        />

        {/* Emoji */}
        <div
          style={{
            fontSize: '64px',
            marginBottom: '16px',
            filter: 'drop-shadow(0 4px 20px rgba(59,130,246,0.3))',
          }}
        >
          {emoji}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: '800',
            color: '#ffffff',
            textAlign: 'center',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            maxWidth: '800px',
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: '22px',
              color: 'rgba(255,255,255,0.7)',
              marginTop: '12px',
              textAlign: 'center',
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Badge */}
        <div
          style={{
            marginTop: '24px',
            padding: '8px 20px',
            background: 'rgba(59,130,246,0.2)',
            border: '1px solid rgba(59,130,246,0.4)',
            borderRadius: '100px',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.8)',
            letterSpacing: '0.05em',
          }}
        >
          conversionhub.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: await fetch(
            new URL('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff')
          ).then(res => res.arrayBuffer()),
          weight: 800,
        },
      ],
    }
  );
}
