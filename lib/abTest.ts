/**
 * abTest
 * -------
 * The REAL (not simulated) half of Week 4 — a genuine, if simple, A/B
 * assignment for the homepage headline. Unlike generateMarketingBundle(),
 * nothing here is a stand-in for an AI call: it's plain randomness plus
 * two API routes (app/api/marketing/ab, app/api/marketing/ab/click) that
 * log real impression/click events to the ab_events table.
 *
 * Kept deliberately simple: a coin flip per page load, not a persistent
 * per-visitor assignment (no cookies/auth yet in this project) and not a
 * statistically-governed rollout. The honest limitation — there isn't
 * enough live traffic yet for the results to be significant — is stated
 * directly in ABResultsPanel, not hidden.
 */

export type Variant = "A" | "B";

export function pickVariant(): Variant {
  return Math.random() < 0.5 ? "A" : "B";
}

export const HEADLINE_COPY: Record<Variant, { headline: string; sub: string }> = {
  A: {
    headline: "Design the moment they open it.",
    sub: "Every unboxing is a first impression — most brands never got to design theirs.",
  },
  B: {
    headline: "Your box is doing the talking. Make it say the right thing.",
    sub: "UNBOX turns a shipping box into the first real conversation you have with a customer.",
  },
};
