"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Variant } from "@/lib/abTest";

interface VariantStats {
  impressions: number;
  clicks: number;
  ctr: number; // 0-100, rounded to 1 decimal
}

function emptyStats(): VariantStats {
  return { impressions: 0, clicks: 0, ctr: 0 };
}

/**
 * ABResultsPanel
 * ---------------
 * Queries every row in ab_events (the REAL headline A/B test, not
 * simulated), groups it by variant + event_type, and shows current
 * impression/click counts and a click-through rate for each variant.
 *
 * This project has very little live traffic, so this panel says that
 * directly rather than implying a winner — a CTR computed from a
 * handful of impressions isn't statistically meaningful, and presenting
 * it as if it were would be a worse failure than showing raw counts.
 */
export default function ABResultsPanel() {
  const [stats, setStats] = useState<Record<Variant, VariantStats>>({
    A: emptyStats(),
    B: emptyStats(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("ab_events")
        .select("variant, event_type");

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const next: Record<Variant, VariantStats> = { A: emptyStats(), B: emptyStats() };
      for (const row of data ?? []) {
        const v = row.variant as Variant;
        if (v !== "A" && v !== "B") continue;
        if (row.event_type === "impression") next[v].impressions += 1;
        if (row.event_type === "click") next[v].clicks += 1;
      }
      (["A", "B"] as Variant[]).forEach((v) => {
        next[v].ctr =
          next[v].impressions > 0
            ? Math.round((next[v].clicks / next[v].impressions) * 1000) / 10
            : 0;
      });

      setError(null);
      setStats(next);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalImpressions = stats.A.impressions + stats.B.impressions;

  return (
    <div className="border border-line p-6">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h3 className="font-bold text-ink">Homepage headline A/B — live results</h3>
        <span className="font-label text-[10.5px] font-bold uppercase tracking-[0.05em] text-ink border border-ink px-2.5 py-1">
          Real data, not simulated
        </span>
      </div>

      {loading && <p className="text-sm text-ink-soft">Loading results…</p>}
      {error && (
        <p className="text-sm text-red-600">Couldn&apos;t load results: {error}</p>
      )}

      {!loading && !error && (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {(["A", "B"] as Variant[]).map((v) => (
              <div key={v} className="border border-line bg-bg-2 p-4">
                <div className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-2">
                  Variant {v}
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-ink">{stats[v].ctr}%</span>
                  <span className="text-xs text-ink-soft">click-through rate</span>
                </div>
                <div className="text-xs text-ink-soft">
                  {stats[v].clicks} clicks / {stats[v].impressions} impressions
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-ink-soft leading-relaxed bg-bg-2 border-l-2 border-accent pl-4 py-3">
            <strong className="text-ink">Honest limitation:</strong> this site has
            {" "}{totalImpressions}{" "}
            total impressions logged so far. That&apos;s nowhere near enough
            traffic for either variant&apos;s click-through rate to be
            statistically significant — these are real counts, not a
            verdict on which headline wins.
          </p>
        </>
      )}
    </div>
  );
}
