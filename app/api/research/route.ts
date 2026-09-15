import { NextRequest, NextResponse } from "next/server";
import { generateResearchBrief, ResearchBriefInput } from "@/lib/generateResearchBrief";

export async function POST(request: NextRequest) {
  let body: Partial<ResearchBriefInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { product, market } = body;

  if (!product?.trim()) {
    return NextResponse.json(
      { error: "product is required." },
      { status: 400 }
    );
  }

  const brief = generateResearchBrief({ product, market: market ?? "" });

  return NextResponse.json({
    ...brief,
    isSimulated: true,
  });
}
