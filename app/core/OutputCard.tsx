"use client";

import { CoreBrief } from "@/lib/generateCoreBrief";

interface OutputCardProps {
  brief: CoreBrief | null;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
}

const SECTIONS: { key: keyof CoreBrief; label: string }[] = [
  { key: "boxType", label: "Box Type" },
  { key: "materials", label: "Materials" },
  { key: "inserts", label: "Inserts & Extras" },
  { key: "revealMoment", label: "Reveal Moment" },
  { key: "brandFeel", label: "Brand Feel" },
];

export default function OutputCard({ brief, onSave, isSaving, isSaved }: OutputCardProps) {
  if (!brief) {
    return (
      <div className="border border-dashed border-gray-200 rounded-xl px-6 py-10 text-center text-sm text-gray-400">
        Fill in the form and generate a brief to see it here.
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Unboxing Brief</h3>
        <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
          Simulated AI Output
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {SECTIONS.map(({ key, label }) => (
          <div key={key}>
            <div className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">
              {label}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{brief[key]}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onSave}
        disabled={isSaving || isSaved}
        className="self-start bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        {isSaved ? "Saved ✓" : isSaving ? "Saving…" : "Save to library"}
      </button>
    </div>
  );
}
