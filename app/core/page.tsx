"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CoreBrief } from "@/lib/generateCoreBrief";
import CoreForm, { CoreFormValues } from "./CoreForm";
import OutputCard from "./OutputCard";
import SavedOutputsList, { SavedOutputsListHandle } from "./SavedOutputsList";
import { supabase } from "@/lib/supabaseClient";

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
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <span className="text-xl font-bold tracking-tight">UNBOX</span>
        <div className="flex gap-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">Home</Link>
          <Link href="/about" className="hover:text-black">About</Link>
          <Link href="/core" className="text-black font-medium">Core</Link>
          <Link href="/docs" className="hover:text-black">Docs</Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
          Generative Core Agent
        </h1>
        <p className="text-gray-500 mb-10 max-w-2xl">
          Describe your product, customer, and brand — get back a structured
          unboxing brief you can hand to a packaging supplier.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">
              Intake
            </h2>
            <CoreForm onSubmit={handleGenerate} isSubmitting={isGenerating} />
            {generateError && (
              <p className="text-sm text-red-600 mt-3">{generateError}</p>
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">
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

        <div className="mt-16 pt-10 border-t border-gray-200">
          <SavedOutputsList ref={savedListRef} />
        </div>
      </section>

      <footer className="border-t border-gray-200 px-8 py-8 text-center text-sm text-gray-400">
        UNBOX · Negocios Inteligentes y Comercio Digital · AI-101. Ximena Peralta
      </footer>
    </div>
  );
}
