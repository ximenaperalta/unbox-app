"use client";

import { RevenueOutput as RevenueResult } from "@/lib/calculateRevenue";

function formatUSD(n: number): string {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

interface RevenueOutputProps {
  result: RevenueResult | null;
  isCalculating: boolean;
  error: string | null;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
}

export default function RevenueOutput({
  result,
  isCalculating,
  error,
  onSave,
  isSaving,
  isSaved,
}: RevenueOutputProps) {
  return (
    <div className="border border-line p-5">
      <h3 className="font-label text-[11px] uppercase tracking-[0.1em] text-ink-soft mb-4">
        Revenue
      </h3>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {!result && !error && (
        <p className="text-sm text-ink-soft">
          {isCalculating ? "Calculating…" : "Adjust assumptions to see revenue."}
        </p>
      )}

      {result && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <div className="font-label text-[10px] uppercase tracking-[0.06em] text-ink-soft mb-1">
                Monthly
              </div>
              <div className="font-display text-3xl tracking-tight">
                {formatUSD(result.monthlyRevenue)}
              </div>
            </div>
            <div>
              <div className="font-label text-[10px] uppercase tracking-[0.06em] text-ink-soft mb-1">
                Annual
              </div>
              <div className="font-display text-3xl tracking-tight">
                {formatUSD(result.annualRevenue)}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || isSaved}
            className="font-label text-[11px] uppercase tracking-[0.06em] border border-ink px-4 py-2 disabled:opacity-50"
          >
            {isSaved ? "Saved" : isSaving ? "Saving…" : "Save scenario"}
          </button>
        </>
      )}
    </div>
  );
}
