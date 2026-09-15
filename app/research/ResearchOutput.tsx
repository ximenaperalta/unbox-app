"use client";

import { useMemo, useState } from "react";
import { ResearchBrief, Competitor } from "@/lib/generateResearchBrief";

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

const THREAT_BAR_COLOR: Record<string, string> = {
  High: "bg-red-700",
  Med: "bg-accent",
  Low: "bg-line",
};

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "competitors", label: "Competitors" },
  { key: "riskmap", label: "Risk Map" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function threatBreakdown(competitors: Competitor[]) {
  const order: Competitor["threat"][] = ["High", "Med", "Low"];
  const total = competitors.length || 1;
  return order.map((threat) => {
    const names = competitors.filter((c) => c.threat === threat).map((c) => c.name);
    return { threat, count: names.length, names, pct: (names.length / total) * 100 };
  });
}

export default function ResearchOutput({ brief, onSave, isSaving, isSaved }: ResearchOutputProps) {
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

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

  const breakdown = useMemo(() => (brief ? threatBreakdown(brief.competitors) : []), [brief]);
  const overallRow = brief?.riskMap.find((r) => r.label.startsWith("Overall"));

  if (!brief) {
    return (
      <div className="border border-dashed border-line px-6 py-10 text-center text-sm text-ink-soft">
        Fill in the form and run research to see it here.
      </div>
    );
  }

  return (
    <div className="border border-line p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink">Research Brief</h3>
        <span className="font-label text-[10.5px] font-bold uppercase tracking-[0.05em] text-accent border border-accent px-2.5 py-1">
          Simulated AI Output
        </span>
      </div>

      <div className="flex gap-1 border-b border-line -mb-2 flex-wrap" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`font-label text-[11.5px] uppercase tracking-[0.06em] px-3.5 py-2.5 border-b-2 transition-colors -mb-px ${
              activeTab === tab.key
                ? "border-accent text-ink font-bold"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="flex flex-col gap-8">
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
        </div>
      )}

      {activeTab === "competitors" && (
        <div>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
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
      )}

      {activeTab === "riskmap" && (
        <div className="flex flex-col gap-6">
          <div>
            <div className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-3">
              Competitive pressure by threat level
            </div>
            <div className="flex h-3 w-full overflow-hidden border border-line">
              {breakdown
                .filter((b) => b.count > 0)
                .map((b) => (
                  <div
                    key={b.threat}
                    style={{ width: `${b.pct}%` }}
                    className={THREAT_BAR_COLOR[b.threat]}
                    title={`${b.threat}: ${b.count}`}
                  />
                ))}
            </div>
            <div className="flex flex-col gap-3 mt-4">
              {breakdown
                .filter((b) => b.count > 0)
                .map((b) => (
                  <div key={b.threat} className="flex items-start gap-3">
                    <span
                      className={`font-label text-[10px] shrink-0 border px-2 py-0.5 mt-0.5 ${THREAT_STYLES[b.threat]}`}
                    >
                      {b.threat} · {b.count}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {b.names.map((name) => (
                        <span
                          key={name}
                          className="text-xs text-ink-soft border border-line px-2 py-0.5 whitespace-nowrap"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {overallRow && (
            <p className="text-sm text-ink leading-relaxed bg-bg-2 border-l-2 border-accent pl-4 py-3">
              {overallRow.label}
            </p>
          )}
        </div>
      )}

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
