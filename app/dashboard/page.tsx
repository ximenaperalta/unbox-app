"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "../components/Nav";
import Grain from "../components/Grain";

interface FeatureSummary {
  feature: string;
  route: string;
  count: number;
  recent: { id: string; createdAt: string; headline: string }[];
  error?: string;
}

interface SummaryResponse {
  totalRecords: number;
  features: FeatureSummary[];
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard/summary")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((json: SummaryResponse) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Couldn't load the dashboard.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Grain />
      <Nav active="/dashboard" />

      <div className="relative z-10 max-w-5xl mx-auto px-8 pb-24">
        <div className="mb-10">
          <div className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-2">
            Week 6 · Live data across every module
          </div>
          <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
          <p className="text-sm text-ink-soft mt-2 max-w-[64ch]">
            Real row counts and the most recent records from every Supabase
            table this semester has created — not a mockup. Reads live, on
            every page load, directly from the same database every feature
            writes to.
          </p>
        </div>

        {loading && <p className="text-sm text-ink-soft">Loading live data…</p>}
        {error && (
          <p className="text-sm text-red-600 border border-red-600/30 bg-red-50 px-4 py-3">
            Couldn&apos;t load the dashboard: {error}
          </p>
        )}

        {data && (
          <>
            <div className="border border-line bg-bg-2 px-5 py-4 mb-8 flex items-baseline gap-3">
              <span className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft">
                Total records across all tables
              </span>
              <span className="text-2xl font-bold text-ink">{data.totalRecords}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.features.map((f) => (
                <div key={f.feature} className="border border-line p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-ink">{f.feature}</h2>
                    <Link
                      href={f.route}
                      className="font-label text-[11px] uppercase tracking-[0.05em] text-accent hover:underline"
                    >
                      Open {f.route} →
                    </Link>
                  </div>
                  <div className="font-label text-[12px] text-ink-soft">
                    {f.count} record{f.count === 1 ? "" : "s"}
                  </div>
                  {f.error && (
                    <p className="text-xs text-red-600">Query error: {f.error}</p>
                  )}
                  {!f.error && f.recent.length === 0 && (
                    <p className="text-xs text-ink-soft italic">No records yet.</p>
                  )}
                  {!f.error && f.recent.length > 0 && (
                    <ul className="flex flex-col gap-1.5 mt-1">
                      {f.recent.map((row) => (
                        <li
                          key={row.id}
                          className="flex items-baseline justify-between gap-3 text-xs border-t border-line pt-1.5 first:border-t-0 first:pt-0"
                        >
                          <span className="text-ink truncate">{row.headline}</span>
                          <span className="text-ink-soft font-label whitespace-nowrap">
                            {formatWhen(row.createdAt)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
