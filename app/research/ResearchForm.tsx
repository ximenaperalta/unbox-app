"use client";

import { useState, FormEvent } from "react";

export interface ResearchFormValues {
  product: string;
  market: string;
}

interface ResearchFormProps {
  onSubmit: (values: ResearchFormValues) => void;
  isSubmitting: boolean;
}

const REQUIRED_FIELDS: { key: keyof ResearchFormValues; label: string }[] = [
  { key: "product", label: "Product / category" },
  { key: "market", label: "Target market" },
];

const inputClasses =
  "w-full border border-line bg-bg px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent transition-colors";

const labelClasses =
  "block font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-1.5";

export default function ResearchForm({ onSubmit, isSubmitting }: ResearchFormProps) {
  const [values, setValues] = useState<ResearchFormValues>({
    product: "",
    market: "",
  });
  const [missingField, setMissingField] = useState<string | null>(null);

  const missingRequired = REQUIRED_FIELDS.filter((f) => !values[f.key].trim());
  const hasAllRequired = missingRequired.length === 0;

  function handleChange(key: keyof ResearchFormValues, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (missingField) setMissingField(null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (missingRequired.length > 0) {
      setMissingField(missingRequired[0].label);
      return;
    }
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="product" className={labelClasses}>
          Product / category <span className="normal-case text-ink-soft/70">(required)</span>
        </label>
        <input
          id="product"
          type="text"
          value={values.product}
          onChange={(e) => handleChange("product", e.target.value)}
          placeholder="e.g. cold-brew coffee subscription"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="market" className={labelClasses}>
          Target market <span className="normal-case text-ink-soft/70">(required)</span>
        </label>
        <input
          id="market"
          type="text"
          value={values.market}
          onChange={(e) => handleChange("market", e.target.value)}
          placeholder="e.g. Mexico City, urban professionals 25-40"
          className={inputClasses}
        />
      </div>

      {missingField && (
        <p className="text-sm text-red-600">
          {missingField} is required before you can run research.
        </p>
      )}
      {!missingField && missingRequired.length > 0 && (
        <p className="text-sm text-ink-soft">
          Fill in {missingRequired.map((f) => f.label).join(", ")} to continue.
        </p>
      )}

      <button
        type="submit"
        disabled={!hasAllRequired || isSubmitting}
        className="font-label font-bold text-[13.5px] bg-ink text-bg px-6 py-3 hover:bg-accent disabled:bg-line disabled:text-ink-soft disabled:cursor-not-allowed transition-colors self-start"
      >
        {isSubmitting ? "Researching…" : "Run research →"}
      </button>
    </form>
  );
}
