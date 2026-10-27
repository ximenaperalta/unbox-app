import { NextRequest, NextResponse } from "next/server";
import { Variant } from "@/lib/abTest";
import { supabase } from "@/lib/supabaseClient";

const VARIANTS: Variant[] = ["A", "B"];

export async function POST(request: NextRequest) {
  let body: Partial<{ variant: Variant }>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { variant } = body;
  if (!variant || !VARIANTS.includes(variant)) {
    return NextResponse.json(
      { error: 'variant is required and must be "A" or "B".' },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("ab_events")
    .insert({ variant, event_type: "click" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
