"use client";

import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { supabase } from "@/lib/supabaseClient";

interface SavedResearchRow {
  id: string;
  created_at: string;
  product: string;
  market: string;
}

export interface SavedResearchListHandle {
  refresh: () => void;
}

const SavedResearchList = forwardRef<SavedResearchListHandle>(function SavedResearchList(_props, ref) {
  const [rows, setRows] = useState<SavedResearchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("research_outputs")
      .select("id, created_at, product, market")
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
        Saved research
      </h3>

      {loading && rows.length === 0 && (
        <p className="text-sm text-ink-soft">Loading saved research…</p>
      )}

      {error && (
        <p className="text-sm text-red-600">
          Couldn&apos;t load saved research: {error}
        </p>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="text-sm text-ink-soft">
          No research saved yet — run some above and save it to see it here.
        </p>
      )}

      {rows.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {rows.map((row) => (
            <div
              key={row.id}
              className="shrink-0 border border-line px-4 py-3 min-w-[200px]"
            >
              <div className="text-sm font-medium text-ink truncate">
                {row.product}
              </div>
              <div className="text-xs text-ink-soft truncate mt-0.5">
                {row.market}
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

export default SavedResearchList;
