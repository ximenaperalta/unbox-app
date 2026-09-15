"use client";

import { useState, FormEvent } from "react";

export interface CoreFormValues {
  product: string;
  customer: string;
  brandVoice: string;
  budget: string;
}

interface CoreFormProps {
  onSubmit: (values: CoreFormValues) => void;
  isSubmitting: boolean;
}

const REQUIRED_FIELDS: { key: keyof CoreFormValues; label: string }[] = [
  { key: "product", label: "Product" },
  { key: "customer", label: "Customer" },
  { key: "brandVoice", label: "Brand voice" },
];

const inputClasses =
  "w-full border border-line bg-bg px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent transition-colors";

const labelClasses =
  "block font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-1.5";

export default function CoreForm({ onSubmit, isSubmitting }: CoreFormProps) {
  const [values, setValues] = useState<CoreFormValues>({
    product: "",
    customer: "",
    brandVoice: "",
    budget: "",
  });
  const [missingField, setMissingField] = useState<string | null>(null);

  const missingRequired = REQUIRED_FIELDS.filter((f) => !values[f.key].trim());
  const hasAllRequired = missingRequired.length === 0;

  function handleChange(key: keyof CoreFormValues, value: string) {
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
          Product <span className="normal-case text-ink-soft/70">(required)</span>
        </label>
        <input
          id="product"
          type="text"
          value={values.product}
          onChange={(e) => handleChange("product", e.target.value)}
          placeholder="e.g. hand-poured soy candles"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="customer" className={labelClasses}>
          Customer <span className="normal-case text-ink-soft/70">(required)</span>
        </label>
        <input
          id="customer"
          type="text"
          value={values.customer}
          onChange={(e) => handleChange("customer", e.target.value)}
          placeholder="e.g. gift-givers, 25–40"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="brandVoice" className={labelClasses}>
          Brand voice <span className="normal-case text-ink-soft/70">(required)</span>
        </label>
        <input
          id="brandVoice"
          type="text"
          value={values.brandVoice}
          onChange={(e) => handleChange("brandVoice", e.target.value)}
          placeholder="e.g. cozy, minimal, sustainable"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="budget" className={labelClasses}>
          Budget <span className="normal-case text-ink-soft/70">(optional)</span>
        </label>
        <input
          id="budget"
          type="text"
          value={values.budget}
          onChange={(e) => handleChange("budget", e.target.value)}
          placeholder="e.g. $8–12/unit"
          className={inputClasses}
        />
      </div>

      {missingField && (
        <p className="text-sm text-red-600">
          {missingField} is required before you can generate a brief.
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
        {isSubmitting ? "Generating…" : "Generate brief"}
      </button>
    </form>
  );
}
