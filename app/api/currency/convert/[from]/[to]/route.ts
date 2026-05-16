import { NextRequest, NextResponse } from "next/server";
import { fetchLiveRates } from "@/lib/currency-api";
import { formatCurrency, getExchangeRate } from "@/lib/currency-utils";
import { getCurrencyByCode } from "@/types/currency";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const amount = searchParams.get("amount") || "1";

  if (!from || !to) {
    return NextResponse.json(
      { error: "Missing required parameters: from, to" },
      { status: 400 }
    );
  }

  const upperFrom = from.toUpperCase().slice(0, 3);
  const upperTo = to.toUpperCase().slice(0, 3);

  try {
    const rates = await fetchLiveRates(upperFrom);

    const fromInfo = getCurrencyByCode(upperFrom);
    const toInfo = getCurrencyByCode(upperTo);

    const parsedAmount = parseFloat(amount);
    const numericAmount = isNaN(parsedAmount) ? 1 : parsedAmount;

    const rate = getExchangeRate(upperFrom, upperTo, rates);
    const converted = numericAmount * rate;

    return NextResponse.json({
      success: true,
      from: {
        code: upperFrom,
        name: fromInfo?.name || upperFrom,
        flag: fromInfo?.flag || "",
        amount: numericAmount,
      },
      to: {
        code: upperTo,
        name: toInfo?.name || upperTo,
        flag: toInfo?.flag || "",
        amount: converted,
        formatted: formatCurrency(converted, upperTo),
      },
      rate: {
        value: rate,
        formatted: formatCurrency(rate, upperTo, { style: "decimal", maximumFractionDigits: 6 }),
      },
      meta: {
        source: rates.source,
        lastUpdated: rates.timestamp,
        cacheStatus: rates.source.includes("cache") ? "cached" : "live",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch exchange rate", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}