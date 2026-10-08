"use client";

import { TIERS, TierId } from "@/lib/pricingData";

export interface Assumptions {
  totalUsers: number;
  tierMix: Record<TierId, number>;
  tierPrices: Record<TierId, number>;
}

interface AssumptionsPanelProps {
  value: Assumptions;
  onChange: (next: Assumptions) => void;
}

const TIER_IDS: TierId[] = ["sample", "run", "line"];

// React controlled <input type="number"> has a known quirk: when the parsed
// number matches, React skips re-syncing the field's displayed text, so a
// leading zero you type (e.g. "0350") never visually cleans up to "350" even
// though the underlying number is correct. Stripping it directly on the DOM
// node inside the event handler — before React re-renders — fixes the
// display immediately instead of fighting the browser over it.
function cleanLeadingZero(input: HTMLInputElement): string {
  const cleaned = input.value.replace(/^0+(?=\d)/, "");
  if (cleaned !== input.value) {
    input.value = cleaned;
  }
  return cleaned;
}

export default function AssumptionsPanel({ value, onChange }: AssumptionsPanelProps) {
  const mixTotal = TIER_IDS.reduce((sum, id) => sum + (value.tierMix[id] || 0), 0);

  function updateTotalUsers(n: number) {
    onChange({ ...value, totalUsers: n });
  }

  function updateMix(id: TierId, pct: number) {
    onChange({ ...value, tierMix: { ...value.tierMix, [id]: pct } });
  }

  function updatePrice(id: TierId, price: number) {
    onChange({ ...value, tierPrices: { ...value.tierPrices, [id]: price } });
  }

  return (
    <div className="border border-line p-5">
      <h3 className="font-label text-[11px] uppercase tracking-[0.1em] text-ink-soft mb-4">
        Assumptions
      </h3>

      <label className="block mb-4">
        <span className="text-sm text-ink-soft block mb-1">Total UNBOX users</span>
        <input
          type="number"
          min={0}
          value={value.totalUsers}
          onChange={(e) => updateTotalUsers(Math.max(0, Number(cleanLeadingZero(e.target)) || 0))}
          className="w-full border border-line px-3 py-2 text-sm bg-bg"
        />
      </label>

      <div className="space-y-3">
        {TIER_IDS.map((id) => {
          const tier = TIERS.find((t) => t.id === id)!;
          return (
            <div key={id} className="grid grid-cols-2 gap-3 items-end">
              <label className="block">
                <span className="text-sm text-ink-soft block mb-1">
                  {tier.name} price/mo
                </span>
                <input
                  type="number"
                  min={0}
                  value={value.tierPrices[id]}
                  onChange={(e) => updatePrice(id, Math.max(0, Number(cleanLeadingZero(e.target)) || 0))}
                  className="w-full border border-line px-3 py-2 text-sm bg-bg"
                />
              </label>
              <label className="block">
                <span className="text-sm text-ink-soft block mb-1">{tier.name} mix %</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={value.tierMix[id]}
                  onChange={(e) =>
                    updateMix(id, Math.max(0, Math.min(100, Number(cleanLeadingZero(e.target)) || 0)))
                  }
                  className="w-full border border-line px-3 py-2 text-sm bg-bg"
                />
              </label>
            </div>
          );
        })}
      </div>

      <p className={`text-xs mt-3 ${mixTotal === 100 ? "text-ink-soft" : "text-red-600"}`}>
        Tier mix totals {mixTotal}%{mixTotal !== 100 && " — should sum to 100%"}
      </p>
    </div>
  );
}
