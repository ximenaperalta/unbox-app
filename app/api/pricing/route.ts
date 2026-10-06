import { NextRequest, NextResponse } from "next/server";
import { calculateRevenue, RevenueInput } from "@/lib/calculateRevenue";
import { TierId } from "@/lib/pricingData";

const TIER_IDS: TierId[] = ["sample", "run", "line"];

export async function POST(request: NextRequest) {
  let body: Partial<RevenueInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { totalUsers, tierMix, tierPrices } = body;

  if (typeof totalUsers !== "number" || totalUsers < 0) {
    return NextResponse.json(
      { error: "totalUsers is required and must be a non-negative number." },
      { status: 400 }
    );
  }
  if (!tierMix || !tierPrices) {
    return NextResponse.json(
      { error: "tierMix and tierPrices are required." },
      { status: 400 }
    );
  }
  for (const id of TIER_IDS) {
    if (typeof tierMix[id] !== "number" || typeof tierPrices[id] !== "number") {
      return NextResponse.json(
        { error: `tierMix and tierPrices must include a numeric value for "${id}".` },
        { status: 400 }
      );
    }
  }

  const result = calculateRevenue({
    totalUsers,
    tierMix: tierMix as Record<TierId, number>,
    tierPrices: tierPrices as Record<TierId, number>,
  });

  return NextResponse.json(result);
}
