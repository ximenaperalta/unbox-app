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
      <div className="border border-dashed border-line px-6 py-10 text-center text-sm text-ink-soft">
        Fill in the form and generate a brief to see it here.
      </div>
    );
  }

  return (
    <div className="border border-line p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink">Unboxing Brief</h3>
        <span className="font-label text-[10.5px] font-bold uppercase tracking-[0.05em] text-accent border border-accent px-2.5 py-1">
          Simulated AI Output
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {SECTIONS.map(({ key, label }) => (
          <div key={key}>
            <div className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-1">
              {label}
            </div>
            <p className="text-sm text-ink leading-relaxed">{brief[key]}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onSave}
        disabled={isSaving || isSaved}
        className="font-label font-bold text-[13.5px] self-start bg-ink text-bg px-6 py-2.5 hover:bg-accent disabled:bg-line disabled:text-ink-soft disabled:cursor-not-allowed transition-colors"
      >
        {isSaved ? "Saved ✓" : isSaving ? "Saving…" : "Save to library"}
      </button>
    </div>
  );
}
