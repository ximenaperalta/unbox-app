import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Week 6: /dashboard's data source. Reads real row counts + the most
// recent rows from every table this semester has created — no new schema
// needed, this just aggregates what already exists. Read-only (no writes),
// same public-select RLS policy every table already has.

type TableSpec = {
  table: string;
  feature: string;
  route: string;
  headline: (row: Record<string, unknown>) => string;
};

const TABLES: TableSpec[] = [
  {
    table: "core_outputs",
    feature: "Core (Week 1)",
    route: "/core",
    headline: (r) => String(r.product ?? "—"),
  },
  {
    table: "research_outputs",
    feature: "Research (Week 2)",
    route: "/research",
    headline: (r) => String(r.product ?? "—"),
  },
  {
    table: "pricing_scenarios",
    feature: "Pricing (Week 3)",
    route: "/pricing",
    headline: (r) =>
      `${String(r.segment ?? "—")} · ${r.total_users ?? "—"} users`,
  },
  {
    table: "marketing_assets",
    feature: "Marketing (Week 4)",
    route: "/marketing",
    headline: (r) => String(r.product ?? "—"),
  },
  {
    table: "ab_events",
    feature: "Homepage A/B test (Week 4)",
    route: "/",
    headline: (r) => `${String(r.variant ?? "—")} · ${String(r.event_type ?? "—")}`,
  },
  {
    table: "chat_sessions",
    feature: "Chat (Week 5)",
    route: "/chat",
    headline: (r) => String(r.product ?? "—"),
  },
];

export async function GET() {
  const results = await Promise.all(
    TABLES.map(async (spec) => {
      const { count, error: countError } = await supabase
        .from(spec.table)
        .select("*", { count: "exact", head: true });

      const { data: recent, error: recentError } = await supabase
        .from(spec.table)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (countError || recentError) {
        return {
          feature: spec.feature,
          route: spec.route,
          count: 0,
          recent: [] as { id: string; createdAt: string; headline: string }[],
          error: (countError ?? recentError)?.message ?? "query failed",
        };
      }

      return {
        feature: spec.feature,
        route: spec.route,
        count: count ?? 0,
        recent: (recent ?? []).map((row) => ({
          id: String(row.id),
          createdAt: String(row.created_at),
          headline: spec.headline(row),
        })),
      };
    })
  );

  const totalRecords = results.reduce((sum, r) => sum + r.count, 0);

  return NextResponse.json({ totalRecords, features: results });
}
