"use client";

import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { supabase } from "@/lib/supabaseClient";

interface SavedScenarioRow {
  id: string;
  created_at: string;
  segment: string;
  total_users: number;
  monthly_revenue: number;
}

export interface SavedScenariosListHandle {
  refresh: () => void;
}

const SavedScenariosList = forwardRef<SavedScenariosListHandle>(function SavedScenariosList(
  _props,
  ref
) {
  const [rows, setRows] = useState<SavedScenarioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pricing_scenarios")
      .select("id, created_at, segment, total_users, monthly_revenue")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      setRows(data ?? []);
    }
    setLoading(false);
  }, []);

  useImperativeHandle(ref, () => ({ refresh: fetchRows }), [fetchRows]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  return (
    <div>
      <h3 className="font-label text-[11px] uppercase tracking-[0.1em] text-ink-soft mb-4">
        Saved pricing scenarios
      </h3>

      {loading && rows.length === 0 && (
        <p className="text-sm text-ink-soft">Loading saved scenarios…</p>
      )}

      {error && (
        <p className="text-sm text-red-600">
          Couldn&apos;t load saved scenarios: {error}
        </p>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="text-sm text-ink-soft">
          No scenarios saved yet — run the calculator above and save it to see it here.
        </p>
      )}

      {rows.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {rows.map((row) => (
            <div
              key={row.id}
              className="shrink-0 border border-line px-4 py-3 min-w-[200px]"
            >
              <div className="text-sm font-medium text-ink capitalize">
                {row.segment} &middot; {row.total_users.toLocaleString()} users
              </div>
              <div className="text-xs text-ink-soft truncate mt-0.5">
                {row.monthly_revenue.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                })}
                /mo
              </div>
              <div className="font-label text-[10.5px] text-ink-soft mt-1">
                {new Date(row.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default SavedScenariosList;
