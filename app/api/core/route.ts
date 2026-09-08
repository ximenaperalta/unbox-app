import { NextRequest, NextResponse } from "next/server";
import { generateCoreBrief, CoreBriefInput } from "@/lib/generateCoreBrief";

export async function POST(request: NextRequest) {
  let body: Partial<CoreBriefInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { product, customer, brandVoice, budget } = body;

  if (!product?.trim() || !customer?.trim() || !brandVoice?.trim()) {
    return NextResponse.json(
      { error: "product, customer, and brandVoice are required." },
      { status: 400 }
    );
  }

  const brief = generateCoreBrief({ product, customer, brandVoice, budget });

  return NextResponse.json({
    ...brief,
    isSimulated: true,
  });
}
