"use client";

import { useMemo, useState } from "react";
import { ResearchBrief } from "@/lib/generateResearchBrief";

interface ResearchOutputProps {
  brief: ResearchBrief | null;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
}

const THREAT_STYLES: Record<string, string> = {
  High: "text-red-700 border-red-700",
  Med: "text-accent border-accent",
  Low: "text-ink-soft border-line",
};

export default function ResearchOutput({ brief, onSave, isSaving, isSaved }: ResearchOutputProps) {
  const [filter, setFilter] = useState("");

  const filteredCompetitors = useMemo(() => {
    if (!brief) return [];
    const q = filter.trim().toLowerCase();
    if (!q) return brief.competitors;
    return brief.competitors.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.threat.toLowerCase().includes(q) ||
        c.differentiator.toLowerCase().includes(q)
    );
  }, [brief, filter]);

  if (!brief) {
    return (
      <div className="border border-dashed border-line px-6 py-10 text-center text-sm text-ink-soft">
        Fill in the form and run research to see it here.
      </div>
    );
  }

  return (
    <div className="border border-line p-6 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink">Research Brief</h3>
        <span className="font-label text-[10.5px] font-bold uppercase tracking-[0.05em] text-accent border border-accent px-2.5 py-1">
          Simulated AI Output
        </span>
      </div>

      <div>
        <div className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-2">
          5 global examples
        </div>
        <ul className="flex flex-col gap-2">
          {brief.globalExamples.map((ex, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink leading-relaxed">
              <span className="font-label text-[11px] text-accent shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              {ex}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-2">
          Mexico localization
        </div>
        <p className="text-sm text-ink leading-relaxed bg-bg-2 border-l-2 border-accent pl-4 py-3">
          {brief.mexicoNote}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft">
            8 competitors &amp; substitutes
          </div>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by name, type, threat…"
            className="border border-line bg-bg px-3 py-1.5 text-xs w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent transition-colors"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="font-label text-[10px] uppercase tracking-[0.06em] text-ink-soft text-left py-2 pr-3">
                  Name
                </th>
                <th className="font-label text-[10px] uppercase tracking-[0.06em] text-ink-soft text-left py-2 pr-3">
                  Type
                </th>
                <th className="font-label text-[10px] uppercase tracking-[0.06em] text-ink-soft text-left py-2 pr-3">
                  Price
                </th>
                <th className="font-label text-[10px] uppercase tracking-[0.06em] text-ink-soft text-left py-2 pr-3">
                  Differentiator
                </th>
                <th className="font-label text-[10px] uppercase tracking-[0.06em] text-ink-soft text-left py-2">
                  Threat
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCompetitors.map((c) => (
                <tr key={c.name} className="border-b border-line align-top">
                  <td className="py-2.5 pr-3 font-medium text-ink whitespace-nowrap">{c.name}</td>
                  <td className="py-2.5 pr-3 text-ink-soft whitespace-nowrap">{c.type}</td>
                  <td className="py-2.5 pr-3 text-ink-soft whitespace-nowrap">{c.priceTier}</td>
                  <td className="py-2.5 pr-3 text-ink-soft">{c.differentiator}</td>
                  <td className="py-2.5">
                    <span
                      className={`font-label text-[10px] border px-2 py-0.5 whitespace-nowrap ${THREAT_STYLES[c.threat]}`}
                    >
                      {c.threat}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredCompetitors.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-ink-soft text-sm">
                    No competitors match &ldquo;{filter}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-2">
          Risk map
        </div>
        <div className="flex flex-col gap-1.5">
          {brief.riskMap.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 border-b border-line py-2 text-sm"
            >
              <span className="text-ink">{row.label}</span>
              <span
                className={`font-label text-[10px] shrink-0 border px-2 py-0.5 ${
                  row.status === "Watch" ? "text-red-700 border-red-700" : "text-accent border-accent"
                }`}
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>
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
