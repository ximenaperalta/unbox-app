"use client";

import { useState, FormEvent } from "react";
import { Segment } from "@/lib/generateMarketingBundle";

export interface MarketingFormValues {
  product: string;
  segment: Segment;
}

interface MarketingFormProps {
  onSubmit: (values: MarketingFormValues) => void;
  isSubmitting: boolean;
}

const SEGMENT_OPTIONS: { id: Segment; label: string; description: string }[] = [
  {
    id: "Local",
    label: "Local",
    description: "One product, selling mostly in Mexico, still proving the idea.",
  },
  {
    id: "Scale",
    label: "Scale",
    description: "Multiple product lines, selling beyond Mexico.",
  },
];

const inputClasses =
  "w-full border border-line bg-bg px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent transition-colors";

const labelClasses =
  "block font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-1.5";

export default function MarketingForm({ onSubmit, isSubmitting }: MarketingFormProps) {
  const [product, setProduct] = useState("");
  const [segment, setSegment] = useState<Segment | null>(null);
  const [missingField, setMissingField] = useState<string | null>(null);

  const hasAllRequired = product.trim().length > 0 && segment !== null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!product.trim()) {
      setMissingField("Product description");
      return;
    }
    if (!segment) {
      setMissingField("Segment");
      return;
    }
    onSubmit({ product, segment });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="product" className={labelClasses}>
          Product description <span className="normal-case text-ink-soft/70">(required)</span>
        </label>
        <input
          id="product"
          type="text"
          value={product}
          onChange={(e) => {
            setProduct(e.target.value);
            if (missingField) setMissingField(null);
          }}
          placeholder="e.g. cold-brew coffee subscription"
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>
          Segment <span className="normal-case text-ink-soft/70">(required)</span>
        </label>
        <div className="flex gap-3 flex-wrap">
          {SEGMENT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setSegment(opt.id);
                if (missingField) setMissingField(null);
              }}
              className={`text-left border px-4 py-2.5 flex-1 min-w-[180px] transition-colors ${
                segment === opt.id
                  ? "border-ink bg-ink text-bg"
                  : "border-line hover:border-ink"
              }`}
            >
              <div className="font-label text-[11.5px] uppercase tracking-[0.06em] mb-1">
                {opt.label}
              </div>
              <div
                className={`text-xs leading-snug ${
                  segment === opt.id ? "text-bg/80" : "text-ink-soft"
                }`}
              >
                {opt.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {missingField && (
        <p className="text-sm text-red-600">
          {missingField} is required before you can generate a marketing kit.
        </p>
      )}

      <button
        type="submit"
        disabled={!hasAllRequired || isSubmitting}
        className="font-label font-bold text-[13.5px] bg-ink text-bg px-6 py-3 hover:bg-accent disabled:bg-line disabled:text-ink-soft disabled:cursor-not-allowed transition-colors self-start"
      >
        {isSubmitting ? "Generating…" : "Generate marketing kit →"}
      </button>
    </form>
  );
}
