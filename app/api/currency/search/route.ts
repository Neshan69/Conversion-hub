import { NextRequest, NextResponse } from "next";
import { currencies, getCurrencyByCode, searchCurrencies } from "@/types/currency";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json({ error: "Search query must be at least 2 characters", results: [] });
  }

  const results = searchCurrencies(q).slice(0, 20);

  return NextResponse.json({
    success: true,
    query: q,
    count: results.length,
    results: results.map(c => ({
      code: c.code,
      name: c.name,
      symbol: c.symbol,
      flag: c.flag,
      country: c.country,
      region: c.region,
    })),
  });
}