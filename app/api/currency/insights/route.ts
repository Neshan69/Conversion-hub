import { NextRequest, NextResponse } from "next/server";
import { generateInsight } from "@/lib/insights-engine";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { error: "Missing from or to parameter" },
      { status: 400 }
    );
  }

  try {
    const upperFrom = from.toUpperCase().slice(0, 3);
    const upperTo = to.toUpperCase().slice(0, 3);

    // Return the generated insight
    const insight = generateInsight(upperFrom, upperTo, null);

    return NextResponse.json({
      success: true,
      data: {
        fromCurrency: upperFrom,
        toCurrency: upperTo,
        explanation: insight.explanation,
        factors: insight.factors.slice(0, 6),
        trend: insight.trend,
        confidence: insight.confidence,
        sources: insight.sources,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate insight", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}