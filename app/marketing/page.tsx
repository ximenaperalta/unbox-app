"use client";

import { useRef, useState } from "react";
import { MarketingBundle, generateMarketingBundle } from "@/lib/generateMarketingBundle";
import MarketingForm, { MarketingFormValues } from "./MarketingForm";
import MarketingOutput from "./MarketingOutput";
import SavedMarketingList, { SavedMarketingListHandle } from "./SavedMarketingList";
import ABResultsPanel from "./ABResultsPanel";
import BrandStrip from "./BrandStrip";
import { supabase } from "@/lib/supabaseClient";
import Nav from "../components/Nav";
import Grain from "../components/Grain";

// Shown on page load, before any visitor touches the form — so the brand
// system (persona, landing copy, 10 posts, 3 scripts, 14-day calendar) is
// visible immediately, not only after a form submission. Generated with the
// exact same pure function a real submission uses, just with a stand-in
// product — nothing here is hand-written or faked separately from the real
// generator logic.
const EXAMPLE_INPUT: MarketingFormValues = {
  product: "a small-batch cold-brew coffee subscription box",
  segment: "Local",
};

export default function MarketingPage() {
  const [bundle, setBundle] = useState<MarketingBundle>(() =>
    generateMarketingBundle(EXAMPLE_INPUT)
  );
  const [lastValues, setLastValues] = useState<MarketingFormValues>(EXAMPLE_INPUT);
  const [isExample, setIsExample] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const savedListRef = useRef<SavedMarketingListHandle>(null);

  async function handleGenerate(values: MarketingFormValues) {
    setIsGenerating(true);
    setGenerateError(null);
    setIsSaved(false);

    try {
      const res = await fetch("/api/marketing/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to generate marketing kit.");
      }

      const data = await res.json();
      setBundle({
        persona: data.persona,
        landingCopy: data.landingCopy,
        socialPosts: data.socialPosts,
        videoScripts: data.videoScripts,
        campaignCalendar: data.campaignCalendar,
      });
      setLastValues(values);
      setIsExample(false);
    } catch (err) {
      // Keep whatever was already on screen (example or a prior real kit) —
      // a failed regeneration attempt shouldn't blank out working content.
      setGenerateError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave() {
    if (!bundle || !lastValues || isExample) return;
    setIsSaving(true);
    setSaveError(null);

    const { error } = await supabase.from("marketing_assets").insert({
      product: lastValues.product,
      segment: lastValues.segment,
      persona: bundle.persona,
      landing_copy: bundle.landingCopy,
      social_posts: bundle.socialPosts,
      video_scripts: bundle.videoScripts,
      campaign_calendar: bundle.campaignCalendar,
      is_simulated: true,
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
      <Nav active="/marketing" />

      <section className="relative z-[3] max-w-[980px] mx-auto px-8 pt-6 pb-16">
        <div className="flex items-center gap-2.5 font-label text-[12.5px] uppercase tracking-[0.1em] text-ink-soft mb-7">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Marketing Kit Generator
        </div>

        <h1 className="font-display uppercase leading-[0.9] text-[clamp(40px,6.5vw,80px)] tracking-tight mb-4">
          Say it before they open it.
        </h1>
        <p className="text-[15.5px] text-ink-soft max-w-[54ch] mb-7 leading-relaxed">
          A persona, landing page copy, 10 social posts, 3 video scripts,
          and a 14-day campaign calendar — generated below for a sample
          product right now. Describe your own underneath to replace it.
        </p>

        <BrandStrip />

        <div className="mb-16">
          <ABResultsPanel />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-label text-[11px] uppercase tracking-[0.1em] text-ink-soft mb-5">
              Intake
            </h2>
            <MarketingForm onSubmit={handleGenerate} isSubmitting={isGenerating} />
            {generateError && (
              <p className="text-sm text-red-600 mt-3">{generateError}</p>
            )}
          </div>

          <div>
            <h2 className="font-label text-[11px] uppercase tracking-[0.1em] text-ink-soft mb-5">
              Output
            </h2>
            <MarketingOutput
              bundle={bundle}
              productLabel={lastValues.product}
              isExample={isExample}
              onSave={handleSave}
              isSaving={isSaving}
              isSaved={isSaved}
            />
            {saveError && (
              <p className="text-sm text-red-600 mt-3">
                Couldn&apos;t save: {saveError}
              </p>
            )}
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-line">
          <SavedMarketingList ref={savedListRef} />
        </div>
      </section>

      <footer className="relative z-[3] border-t border-line px-8 py-8 text-center font-label text-[11px] text-ink-soft">
        UNBOX · Negocios Inteligentes y Comercio Digital · AI-101. Ximena
        Peralta
      </footer>
    </div>
  );
}
