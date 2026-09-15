"use client";

import { useRef, useState } from "react";
import { CoreBrief } from "@/lib/generateCoreBrief";
import CoreForm, { CoreFormValues } from "./CoreForm";
import OutputCard from "./OutputCard";
import SavedOutputsList, { SavedOutputsListHandle } from "./SavedOutputsList";
import { supabase } from "@/lib/supabaseClient";
import Nav from "../components/Nav";
import Grain from "../components/Grain";

export default function CorePage() {
  const [brief, setBrief] = useState<CoreBrief | null>(null);
  const [lastValues, setLastValues] = useState<CoreFormValues | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const savedListRef = useRef<SavedOutputsListHandle>(null);

  async function handleGenerate(values: CoreFormValues) {
    setIsGenerating(true);
    setGenerateError(null);
    setIsSaved(false);

    try {
      const res = await fetch("/api/core", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to generate brief.");
      }

      const data = await res.json();
      setBrief({
        boxType: data.boxType,
        materials: data.materials,
        inserts: data.inserts,
        revealMoment: data.revealMoment,
        brandFeel: data.brandFeel,
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

    const { error } = await supabase.from("core_outputs").insert({
      product: lastValues.product,
      customer: lastValues.customer,
      brand_voice: lastValues.brandVoice,
      budget: lastValues.budget || null,
      box_type: brief.boxType,
      materials: brief.materials,
      inserts: brief.inserts,
      reveal_moment: brief.revealMoment,
      brand_feel: brief.brandFeel,
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
      <Nav active="/core" />

      <section className="relative z-[3] max-w-[980px] mx-auto px-8 pt-6 pb-16">
        <div className="flex justify-between items-start gap-6 flex-wrap mb-7">
          <div className="flex items-center gap-2.5 font-label text-[12.5px] uppercase tracking-[0.1em] text-ink-soft">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Generative Core Agent
          </div>
          <div className="text-right font-label text-[11px] leading-[1.9] border-l border-line pl-3.5 whitespace-nowrap">
            <div>
              <span className="uppercase tracking-[0.08em] text-[9.5px] text-ink-soft">
                Output{" "}
              </span>
              <span className="font-bold">Simulated AI</span>
            </div>
            <div>
              <span className="uppercase tracking-[0.08em] text-[9.5px] text-ink-soft">
                Logic{" "}
              </span>
              <span className="font-bold">Template fn</span>
            </div>
            <div>
              <span className="uppercase tracking-[0.08em] text-[9.5px] text-ink-soft">
                Latency{" "}
              </span>
              <span className="font-bold">~40ms</span>
            </div>
          </div>
        </div>

        <h1 className="font-display uppercase leading-[0.9] text-[clamp(40px,6.5vw,80px)] tracking-tight mb-4">
          Design the brief.
        </h1>
        <p className="text-[15.5px] text-ink-soft max-w-[52ch] mb-12 leading-relaxed">
          Describe your product, customer, and brand — get back a structured
          unboxing brief you can hand to a packaging supplier.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-label text-[11px] uppercase tracking-[0.1em] text-ink-soft mb-5">
              Intake
            </h2>
            <CoreForm onSubmit={handleGenerate} isSubmitting={isGenerating} />
            {generateError && (
              <p className="text-sm text-red-600 mt-3">{generateError}</p>
            )}
          </div>

          <div>
            <h2 className="font-label text-[11px] uppercase tracking-[0.1em] text-ink-soft mb-5">
              Output
            </h2>
            <OutputCard
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
          <SavedOutputsList ref={savedListRef} />
        </div>
      </section>

      <footer className="relative z-[3] border-t border-line px-8 py-8 text-center font-label text-[11px] text-ink-soft">
        UNBOX · Negocios Inteligentes y Comercio Digital · AI-101. Ximena
        Peralta
      </footer>
    </div>
  );
}
