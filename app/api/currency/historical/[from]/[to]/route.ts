import { NextRequest, NextResponse } from "next/server";
import { fetchHistoricalRates } from "@/lib/currency-api";
import { getCurrencyByCode } from "@/types/currency";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const days = parseInt(searchParams.get("days") || "30");

  if (!from || !to) {
    return NextResponse.json(
      { error: "Missing required parameters: from, to" },
      { status: 400 }
    );
  }

  const upperFrom = from.toUpperCase().slice(0, 3);
  const upperTo = to.toUpperCase().slice(0, 3);

  const clampedDays = Math.min(Math.max(days, 7), 365);

  try {
    const historicalData = await fetchHistoricalRates(upperFrom, upperTo, clampedDays);

    const fromInfo = getCurrencyByCode(upperFrom);
    const toInfo = getCurrencyByCode(upperTo);

    // Calculate summary stats
    if (historicalData.length === 0) {
      return NextResponse.json({
        success: true,
        from: { code: upperFrom, name: fromInfo?.name, flag: fromInfo?.flag },
        to: { code: upperTo, name: toInfo?.name, flag: toInfo?.flag },
        data: [],
        summary: null,
      });
    }

    const rates = historicalData.map(d => d.rate);
    const high = Math.max(...rates);
    const low = Math.min(...rates);
    const current = rates[rates.length - 1];
    const previous = rates[0];
    const change = ((current - previous) / previous) * 100;
    const avg = rates.reduce((a, b) => a + b, 0) / rates.length;

    return NextResponse.json({
      success: true,
      from: {
        code: upperFrom,
        name: fromInfo?.name || upperFrom,
        flag: fromInfo?.flag || "",
      },
      to: {
        code: upperTo,
        name: toInfo?.name || upperTo,
        flag: toInfo?.flag || "",
      },
      data: historicalData,
      summary: {
        high,
        low,
        average: avg,
        current,
        change: {
          value: change,
          direction: change >= 0 ? "up" : "down",
        },
        periodDays: clampedDays,
        startDate: historicalData[0].date,
        endDate: historicalData[historicalData.length - 1].date,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch historical data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}