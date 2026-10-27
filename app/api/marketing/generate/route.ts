import { NextRequest, NextResponse } from "next/server";
import {
  generateMarketingBundle,
  MarketingBundleInput,
  Segment,
} from "@/lib/generateMarketingBundle";

const SEGMENTS: Segment[] = ["Local", "Scale"];

export async function POST(request: NextRequest) {
  let body: Partial<MarketingBundleInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { product, segment } = body;

  if (!product?.trim()) {
    return NextResponse.json(
      { error: "product is required." },
      { status: 400 }
    );
  }
  if (!segment || !SEGMENTS.includes(segment)) {
    return NextResponse.json(
      { error: 'segment is required and must be "Local" or "Scale".' },
      { status: 400 }
    );
  }

  const bundle = generateMarketingBundle({ product, segment });

  return NextResponse.json({
    ...bundle,
    isSimulated: true,
  });
}
