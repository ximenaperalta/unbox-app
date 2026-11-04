import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  let body: Partial<{
    product: string;
    market: string;
    helpNeeded: string;
    guardrailTriggered: boolean;
    recommendedTool: string | null;
    reason: string | null;
  }>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const {
    product,
    market,
    helpNeeded,
    guardrailTriggered,
    recommendedTool,
    reason,
  } = body;

  if (!product || !product.trim()) {
    return NextResponse.json({ error: "product is required." }, { status: 400 });
  }
  if (!helpNeeded) {
    return NextResponse.json({ error: "helpNeeded is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      product,
      market: market || null,
      help_needed: helpNeeded,
      guardrail_triggered: !!guardrailTriggered,
      recommended_tool: recommendedTool ?? null,
      reason: reason ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.warn("Failed to insert chat_sessions row:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
