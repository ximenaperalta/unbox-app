"use client";

import { ChatAnswers, Recommendation, helpNeededLabel } from "@/lib/chatAssistant";

interface ChatCheckpointProps {
  answers: ChatAnswers;
  recommendation: Recommendation;
  onConfirm: () => void;
  onRedo: () => void;
  isSubmitting: boolean;
  error: string | null;
}

// The required "human checkpoint": nothing is written to Supabase and no
// recommendation is shown as final until the visitor explicitly confirms
// what the assistant parsed. "Let me re-answer" remounts ChatIntake fresh
// rather than trying to restore partial state.
export default function ChatCheckpoint({
  answers,
  recommendation,
  onConfirm,
  onRedo,
  isSubmitting,
  error,
}: ChatCheckpointProps) {
  return (
    <div className="border border-line bg-bg-2 p-5 flex flex-col gap-4">
      <div className="font-label text-[11px] uppercase tracking-[0.06em] text-accent">
        Here&apos;s what I heard
      </div>
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex gap-3">
          <dt className="w-28 shrink-0 text-ink-soft">Product</dt>
          <dd className="text-ink">{answers.product}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-28 shrink-0 text-ink-soft">Market</dt>
          <dd className="text-ink">{answers.market || "— not specified —"}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-28 shrink-0 text-ink-soft">Help needed</dt>
          <dd className="text-ink">{helpNeededLabel(answers.helpNeeded)}</dd>
        </div>
      </dl>

      <div className="border-t border-line pt-4">
        <div className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-1.5">
          Recommendation
        </div>
        <p className="text-sm font-bold text-ink">{recommendation.toolLabel}</p>
        <p className="text-sm text-ink-soft leading-relaxed mt-1">
          {recommendation.reason}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="font-label font-bold text-[13px] bg-ink text-bg px-5 py-2.5 hover:bg-accent disabled:bg-line disabled:text-ink-soft disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Saving…" : "Looks right →"}
        </button>
        <button
          onClick={onRedo}
          disabled={isSubmitting}
          className="font-label text-[13px] text-ink-soft border border-line px-5 py-2.5 hover:border-ink hover:text-ink transition-colors disabled:cursor-not-allowed"
        >
          Let me re-answer
        </button>
      </div>
      {error && <p className="text-sm text-red-600">Couldn&apos;t save: {error}</p>}
    </div>
  );
}
