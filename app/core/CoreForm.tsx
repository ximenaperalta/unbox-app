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
        <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
          Product <span className="text-gray-400">(required)</span>
        </label>
        <input
          id="product"
          type="text"
          value={values.product}
          onChange={(e) => handleChange("product", e.target.value)}
          placeholder="e.g. hand-poured soy candles"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
        />
      </div>

      <div>
        <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
          Customer <span className="text-gray-400">(required)</span>
        </label>
        <input
          id="customer"
          type="text"
          value={values.customer}
          onChange={(e) => handleChange("customer", e.target.value)}
          placeholder="e.g. gift-givers, 25–40"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
        />
      </div>

      <div>
        <label htmlFor="brandVoice" className="block text-sm font-medium text-gray-700 mb-1">
          Brand voice <span className="text-gray-400">(required)</span>
        </label>
        <input
          id="brandVoice"
          type="text"
          value={values.brandVoice}
          onChange={(e) => handleChange("brandVoice", e.target.value)}
          placeholder="e.g. cozy, minimal, sustainable"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
        />
      </div>

      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
          Budget <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="budget"
          type="text"
          value={values.budget}
          onChange={(e) => handleChange("budget", e.target.value)}
          placeholder="e.g. $8–12/unit"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
        />
      </div>

      {missingField && (
        <p className="text-sm text-red-600">
          {missingField} is required before you can generate a brief.
        </p>
      )}
      {!missingField && missingRequired.length > 0 && (
        <p className="text-sm text-gray-400">
          Fill in {missingRequired.map((f) => f.label).join(", ")} to continue.
        </p>
      )}

      <button
        type="submit"
        disabled={!hasAllRequired || isSubmitting}
        className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Generating…" : "Generate brief"}
      </button>
    </form>
  );
}
