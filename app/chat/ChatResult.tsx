"use client";

import { useState } from "react";
import Link from "next/link";
import { Recommendation } from "@/lib/chatAssistant";

interface ChatResultProps {
  recommendation: Recommendation;
  sessionId: string;
  onRestart: () => void;
}

export default function ChatResult({
  recommendation,
  sessionId,
  onRestart,
}: ChatResultProps) {
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [isRating, setIsRating] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);

  async function rate(value: "up" | "down") {
    if (rating || isRating) return;
    setIsRating(true);
    setRateError(null);

    try {
      const res = await fetch(`/api/chat/session/${sessionId}/rating`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: value }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to save rating.");
      }
      setRating(value);
    } catch (err) {
      setRateError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsRating(false);
    }
  }

  return (
    <div className="border border-line p-5 flex flex-col gap-5">
      <div>
        <div className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-1">
          Recommended
        </div>
        <h3 className="text-xl font-bold text-ink">{recommendation.toolLabel}</h3>
        <p className="text-sm text-ink-soft leading-relaxed mt-2 max-w-[54ch]">
          {recommendation.reason}
        </p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <Link
          href={recommendation.tool}
          className="font-label font-bold text-[13px] bg-ink text-bg px-5 py-2.5 hover:bg-accent transition-colors inline-block"
        >
          Open {recommendation.tool} →
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-soft">Was this helpful?</span>
          <button
            onClick={() => rate("up")}
            disabled={!!rating || isRating}
            aria-label="Helpful"
            className={`font-label text-[11px] uppercase tracking-[0.05em] border px-3 py-1.5 transition-colors disabled:cursor-not-allowed ${
              rating === "up"
                ? "border-accent text-accent bg-accent/10"
                : "border-line text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            Helpful
          </button>
          <button
            onClick={() => rate("down")}
            disabled={!!rating || isRating}
            aria-label="Not helpful"
            className={`font-label text-[11px] uppercase tracking-[0.05em] border px-3 py-1.5 transition-colors disabled:cursor-not-allowed ${
              rating === "down"
                ? "border-ink text-ink bg-line/40"
                : "border-line text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            Not helpful
          </button>
        </div>
      </div>
      {rating && (
        <p className="text-xs text-ink-soft -mt-2">Thanks — rating saved.</p>
      )}
      {rateError && <p className="text-sm text-red-600 -mt-2">{rateError}</p>}

      <button
        onClick={onRestart}
        className="font-label text-[12px] text-ink-soft self-start underline hover:text-ink transition-colors"
      >
        Start over with a different product
      </button>
    </div>
  );
}
