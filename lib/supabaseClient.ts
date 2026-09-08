import { createClient } from "@supabase/supabase-js";

// Reuses the Supabase project + env vars set up in Week 0.
// NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must already be
// set in Vercel project settings and in a local .env.local (see
// .env.local.example) — no new secrets are introduced this week.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly in development rather than silently no-op-ing on save/read.
  console.warn(
    "Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.local.example)."
  );
}

// Fall back to placeholder values so the client can be constructed (and the
// app can build/prerender) even when env vars aren't present yet — actual
// reads/writes will fail clearly at runtime instead of crashing the build.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
