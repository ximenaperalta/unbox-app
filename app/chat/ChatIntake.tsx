"use client";

import { useState, FormEvent } from "react";
import { ChatAnswers, HelpNeeded, HELP_OPTIONS } from "@/lib/chatAssistant";

interface ChatIntakeProps {
  onComplete: (answers: ChatAnswers) => void;
}

const inputClasses =
  "w-full border border-line bg-bg px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent transition-colors";

// Parent remounts this component (via a `key` change) to reset it when the
// visitor picks "Let me re-answer" at the checkpoint — simpler and less
// error-prone than hand-rolling an internal reset path.
export default function ChatIntake({ onComplete }: ChatIntakeProps) {
  const [step, setStep] = useState(0);
  const [product, setProduct] = useState("");
  const [market, setMarket] = useState("");
  const [missing, setMissing] = useState(false);

  function submitProduct(e: FormEvent) {
    e.preventDefault();
    if (!product.trim()) {
      setMissing(true);
      return;
    }
    setMissing(false);
    setStep(1);
  }

  function submitMarket(e: FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  function pickHelp(helpNeeded: HelpNeeded) {
    onComplete({ product: product.trim(), market: market.trim(), helpNeeded });
  }

  return (
    <div className="flex flex-col gap-4">
      {step === 0 && (
        <form onSubmit={submitProduct} className="flex flex-col gap-3">
          <label
            htmlFor="chat-product"
            className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft"
          >
            Q1 of 3 — product / category{" "}
            <span className="normal-case text-ink-soft/70">(required)</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            <input
              id="chat-product"
              type="text"
              value={product}
              onChange={(e) => {
                setProduct(e.target.value);
                if (missing) setMissing(false);
              }}
              placeholder="e.g. a small-batch cold-brew coffee subscription box"
              className={`${inputClasses} flex-1 min-w-[240px]`}
            />
            <button
              type="submit"
              className="font-label font-bold text-[13px] bg-ink text-bg px-5 py-2.5 hover:bg-accent transition-colors shrink-0"
            >
              Next →
            </button>
          </div>
          {missing && (
            <p className="text-sm text-red-600">
              Tell me what you&apos;re making before we continue.
            </p>
          )}
        </form>
      )}

      {step === 1 && (
        <form onSubmit={submitMarket} className="flex flex-col gap-3">
          <label
            htmlFor="chat-market"
            className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft"
          >
            Q2 of 3 — target market{" "}
            <span className="normal-case text-ink-soft/70">(optional)</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            <input
              id="chat-market"
              type="text"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              placeholder="e.g. Mexico City, urban professionals 25-40"
              className={`${inputClasses} flex-1 min-w-[240px]`}
            />
            <button
              type="submit"
              className="font-label font-bold text-[13px] bg-ink text-bg px-5 py-2.5 hover:bg-accent transition-colors shrink-0"
            >
              Next →
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-3">
          <span className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft">
            Q3 of 3 — what do you need help with right now?
          </span>
          <div className="flex flex-col gap-2">
            {HELP_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => pickHelp(opt.value)}
                className="text-left border border-line bg-bg px-4 py-2.5 text-sm text-ink hover:border-accent hover:text-accent transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${
              i <= step ? "bg-accent" : "bg-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
