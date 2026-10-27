import { NextResponse } from "next/server";
import { pickVariant } from "@/lib/abTest";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const variant = pickVariant();

  // Log the impression. This is the REAL A/B test (not simulated) — a
  // failed log shouldn't block the page from rendering, so we don't
  // surface this error to the visitor, only to the server console.
  const { error } = await supabase
    .from("ab_events")
    .insert({ variant, event_type: "impression" });

  if (error) {
    console.warn("Failed to log ab_events impression:", error.message);
  }

  return NextResponse.json({ variant });
}
