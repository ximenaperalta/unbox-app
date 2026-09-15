"use client";

import { useRef, useState } from "react";
import { ResearchBrief } from "@/lib/generateResearchBrief";
import ResearchForm, { ResearchFormValues } from "./ResearchForm";
import ResearchOutput from "./ResearchOutput";
import SavedResearchList, { SavedResearchListHandle } from "./SavedResearchList";
import { supabase } from "@/lib/supabaseClient";
import Nav from "../components/Nav";
import Grain from "../components/Grain";

export default function ResearchPage() {
  const [brief, setBrief] = useState<ResearchBrief | null>(null);
  const [lastValues, setLastValues] = useState<ResearchFormValues | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const savedListRef = useRef<SavedResearchListHandle>(null);

  async function handleGenerate(values: ResearchFormValues) {
    setIsGenerating(true);
    setGenerateError(null);
    setIsSaved(false);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to run research.");
      }

      const data = await res.json();
      setBrief({
        globalExamples: data.globalExamples,
        mexicoNote: data.mexicoNote,
        competitors: data.competitors,
        riskMap: data.riskMap,
      });
      setLastValues(values);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Something went wrong.");
      setBrief(null);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave() {
    if (!brief || !lastValues) return;
    setIsSaving(true);
    setSaveError(null);

    const { error } = await supabase.from("research_outputs").insert({
      product: lastValues.product,
      market: lastValues.market,
      global_examples: brief.globalExamples,
      mexico_note: brief.mexicoNote,
      competitors: brief.competitors,
      risk_map: brief.riskMap,
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
      <Nav active="/research" />

      <section className="relative z-[3] max-w-[980px] mx-auto px-8 pt-6 pb-16">
        <div className="flex items-center gap-2.5 font-label text-[12.5px] uppercase tracking-[0.1em] text-ink-soft mb-7">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Research &amp; Benchmarking Agent
        </div>

        <h1 className="font-display uppercase leading-[0.9] text-[clamp(40px,6.5vw,80px)] tracking-tight mb-4">
          Know who you&apos;re up against.
        </h1>
        <p className="text-[15.5px] text-ink-soft max-w-[54ch] mb-12 leading-relaxed">
          Describe your product and target market — get back global reference
          points, a Mexico-specific read, and an 8-way competitor breakdown
          you can actually use.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-label text-[11px] uppercase tracking-[0.1em] text-ink-soft mb-5">
              Intake
            </h2>
            <ResearchForm onSubmit={handleGenerate} isSubmitting={isGenerating} />
            {generateError && (
              <p className="text-sm text-red-600 mt-3">{generateError}</p>
            )}
          </div>

          <div>
            <h2 className="font-label text-[11px] uppercase tracking-[0.1em] text-ink-soft mb-5">
              Output
            </h2>
            <ResearchOutput
              brief={brief}
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
          <SavedResearchList ref={savedListRef} />
        </div>
      </section>

      <footer className="relative z-[3] border-t border-line px-8 py-8 text-center font-label text-[11px] text-ink-soft">
        UNBOX · Negocios Inteligentes y Comercio Digital · AI-101. Ximena
        Peralta
      </footer>
    </div>
  );
}
