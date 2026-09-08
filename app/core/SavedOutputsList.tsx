"use client";

import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { supabase } from "@/lib/supabaseClient";

interface SavedOutputRow {
  id: string;
  created_at: string;
  product: string;
}

export interface SavedOutputsListHandle {
  refresh: () => void;
}

const SavedOutputsList = forwardRef<SavedOutputsListHandle>(function SavedOutputsList(_props, ref) {
  const [rows, setRows] = useState<SavedOutputRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("core_outputs")
      .select("id, created_at, product")
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
      <h3 className="font-semibold text-gray-900 mb-3">Saved briefs</h3>

      {loading && rows.length === 0 && (
        <p className="text-sm text-gray-400">Loading saved briefs…</p>
      )}

      {error && (
        <p className="text-sm text-red-600">
          Couldn&apos;t load saved briefs: {error}
        </p>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="text-sm text-gray-400">
          No briefs saved yet — generate one above and save it to see it here.
        </p>
      )}

      {rows.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {rows.map((row) => (
            <div
              key={row.id}
              className="shrink-0 border border-gray-200 rounded-xl px-4 py-3 min-w-[180px]"
            >
              <div className="text-sm font-medium text-gray-900 truncate">
                {row.product}
              </div>
              <div className="text-xs text-gray-400 mt-1">
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

export default SavedOutputsList;
