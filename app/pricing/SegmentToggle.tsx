"use client";

import { SEGMENTS, SegmentId } from "@/lib/pricingData";

interface SegmentToggleProps {
  value: SegmentId;
  onChange: (segment: SegmentId) => void;
}

export default function SegmentToggle({ value, onChange }: SegmentToggleProps) {
  return (
    <div>
      <div className="inline-flex border border-ink rounded-full overflow-hidden">
        {SEGMENTS.map((segment) => (
          <button
            key={segment.id}
            type="button"
            onClick={() => onChange(segment.id)}
            className={`font-label text-[11px] uppercase tracking-[0.06em] px-4 py-1.5 transition-colors ${
              value === segment.id
                ? "bg-ink text-bg"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {segment.name}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft mt-3 max-w-[48ch]">
        {SEGMENTS.find((s) => s.id === value)?.description}
      </p>
    </div>
  );
}
