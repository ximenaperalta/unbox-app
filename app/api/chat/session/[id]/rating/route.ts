import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const RATINGS = ["up", "down"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: Partial<{ rating: string }>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { rating } = body;
  if (!rating || !RATINGS.includes(rating)) {
    return NextResponse.json(
      { error: 'rating is required and must be "up" or "down".' },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("chat_sessions")
    .update({ rating })
    .eq("id", id);

  if (error) {
    console.warn("Failed to update chat_sessions rating:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
