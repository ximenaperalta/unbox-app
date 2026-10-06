"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import Grain from "../components/Grain";
import SegmentToggle from "./SegmentToggle";
import AssumptionsPanel, { Assumptions } from "./AssumptionsPanel";
import RevenueOutput from "./RevenueOutput";
import SavedScenariosList, { SavedScenariosListHandle } from "./SavedScenariosList";
import { SEGMENTS, TIERS, SegmentId, TierId } from "@/lib/pricingData";
import { RevenueOutput as RevenueResult } from "@/lib/calculateRevenue";
import { supabase } from "@/lib/supabaseClient";

function defaultPrices(): Record<TierId, number> {
  return TIERS.reduce((acc, t) => ({ ...acc, [t.id]: t.monthlyPrice }), {} as Record<TierId, number>);
}

function assumptionsForSegment(segmentId: SegmentId, prices: Record<TierId, number>): Assumptions {
  const segment = SEGMENTS.find((s) => s.id === segmentId)!;
  return {
    totalUsers: 1000,
    tierMix: { ...segment.defaultTierMix },
    tierPrices: prices,
  };
}

export default function PricingPage() {
  const [segmentId, setSegmentId] = useState<SegmentId>("local");
  const [assumptions, setAssumptions] = useState<Assumptions>(() =>
    assumptionsForSegment("local", defaultPrices())
  );
  const [result, setResult] = useState<RevenueResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const savedListRef = useRef<SavedScenariosListHandle>(null);

  function handleSegmentChange(next: SegmentId) {
    setSegmentId(next);
    setAssumptions((prev) => assumptionsForSegment(next, prev.tierPrices));
    setIsSaved(false);
  }

  function handleAssumptionsChange(next: Assumptions) {
    setAssumptions(next);
    setIsSaved(false);
  }

  const calculate = useCallback(async (input: Assumptions) => {
    setIsCalculating(true);
    setCalcError(null);
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to calculate revenue.");
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setCalcError(err instanceof Error ? err.message : "Something went wrong.");
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  useEffect(() => {
    calculate(assumptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assumptions]);

  async function handleSave() {
    if (!result) return;
    setIsSaving(true);
    setSaveError(null);

    const { error } = await supabase.from("pricing_scenarios").insert({
      segment: segmentId,
      total_users: assumptions.totalUsers,
      tier_mix: assumptions.tierMix,
      tier_prices: assumptions.tierPrices,
      monthly_revenue: result.monthlyRevenue,
      annual_revenue: result.annualRevenue,
    });

    if (error) {
      setSaveError(error.message);
    } else {
      setIsSaved(true);
      savedListRef.current?.refresh();
    }
    setIsSaving(false);
  }

  return (
    <div className="min-h-screen bg-bg">
      <Grain />
      <Nav active="/pricing" />

      <section className="relative z-[3] max-w-[980px] mx-auto px-8 pt-6 pb-16">
        <div className="flex items-center gap-2.5 font-label text-[12.5px] uppercase tracking-[0.1em] text-ink-soft mb-7">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Pricing Simulator
        </div>

        <h1 className="font-display uppercase leading-[0.9] text-[clamp(40px,6.5vw,80px)] tracking-tight mb-4">
          What it could earn.
        </h1>
        <p className="text-[15.5px] text-ink-soft max-w-[54ch] mb-10 leading-relaxed">
          Pick a segment, adjust the assumptions, and see what UNBOX itself
          would earn at that scale. This is a planning calculator, not a
          checkout &mdash; nothing here charges anyone.
        </p>

        <div className="mb-10">
          <SegmentToggle value={segmentId} onChange={handleSegmentChange} />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <AssumptionsPanel value={assumptions} onChange={handleAssumptionsChange} />
          <RevenueOutput
            result={result}
            isCalculating={isCalculating}
            error={calcError}
            onSave={handleSave}
            isSaving={isSaving}
            isSaved={isSaved}
          />
        </div>
        {saveError && (
          <p className="text-sm text-red-600 -mt-10 mb-10">
            Couldn&apos;t save: {saveError}
          </p>
        )}

        <div className="pt-10 border-t border-line">
          <SavedScenariosList ref={savedListRef} />
        </div>
      </section>

      <footer className="relative z-[3] border-t border-line px-8 py-8 text-center font-label text-[11px] text-ink-soft">
        UNBOX · Negocios Inteligentes y Comercio Digital · AI-101. Ximena
        Peralta
      </footer>
    </div>
  );
}
