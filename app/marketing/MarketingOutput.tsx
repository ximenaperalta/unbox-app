"use client";

import { useState } from "react";
import { MarketingBundle } from "@/lib/generateMarketingBundle";
import PersonaCard from "./PersonaCard";

interface MarketingOutputProps {
  bundle: MarketingBundle | null;
  productLabel: string;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
}

const TABS = [
  { key: "copy", label: "Copy" },
  { key: "social", label: "Social" },
  { key: "scripts", label: "Scripts" },
  { key: "calendar", label: "Calendar" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function exportAsText(bundle: MarketingBundle, productLabel: string): string {
  const lines: string[] = [];
  lines.push(`UNBOX MARKETING KIT — ${productLabel}`);
  lines.push("(Simulated AI Output — see /docs for how this was generated)");
  lines.push("");
  lines.push("== PERSONA ==");
  lines.push(`${bundle.persona.name} (${bundle.persona.ageRange})`);
  lines.push(bundle.persona.description);
  lines.push(`Pain point: ${bundle.persona.painPoint}`);
  lines.push(`Motivation: ${bundle.persona.motivation}`);
  lines.push("");
  lines.push("== LANDING PAGE COPY ==");
  lines.push(bundle.landingCopy.headline);
  lines.push(bundle.landingCopy.subhead);
  bundle.landingCopy.body.forEach((p) => lines.push(p));
  lines.push("");
  lines.push("== SOCIAL POSTS (10) ==");
  bundle.socialPosts.forEach((p, i) => lines.push(`${i + 1}. ${p}`));
  lines.push("");
  lines.push("== VIDEO SCRIPTS (3) ==");
  bundle.videoScripts.forEach((s, i) => {
    lines.push(`${i + 1}. ${s.title}`);
    lines.push(`   Hook: ${s.hook}`);
    lines.push(`   Script: ${s.script}`);
  });
  lines.push("");
  lines.push("== 14-DAY CAMPAIGN CALENDAR ==");
  bundle.campaignCalendar.forEach((c) => lines.push(`Day ${c.day} — ${c.channel}: ${c.focus}`));
  return lines.join("\n");
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can fail (permissions, non-secure context, or no
      // clipboard API at all) — fail silently rather than throwing, since
      // this is a convenience action, not a required one.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="font-label text-[10px] uppercase tracking-[0.06em] border border-line px-2 py-1 text-ink-soft hover:border-ink hover:text-ink transition-colors shrink-0"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

export default function MarketingOutput({
  bundle,
  productLabel,
  onSave,
  isSaving,
  isSaved,
}: MarketingOutputProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("copy");

  if (!bundle) {
    return (
      <div className="border border-dashed border-line px-6 py-10 text-center text-sm text-ink-soft">
        Fill in the form and generate a kit to see it here.
      </div>
    );
  }

  return (
    <div className="border border-line p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="font-bold text-ink">Marketing Kit</h3>
        <span className="font-label text-[10.5px] font-bold uppercase tracking-[0.05em] text-accent border border-accent px-2.5 py-1">
          Simulated AI Output
        </span>
      </div>

      <PersonaCard persona={bundle.persona} />

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

      {activeTab === "copy" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3 border border-line bg-bg-2 p-4">
            <div>
              <div className="font-bold text-ink mb-1">{bundle.landingCopy.headline}</div>
              <div className="text-sm text-ink-soft italic mb-3">{bundle.landingCopy.subhead}</div>
              {bundle.landingCopy.body.map((p, i) => (
                <p key={i} className="text-sm text-ink leading-relaxed mb-2">
                  {p}
                </p>
              ))}
            </div>
            <CopyButton
              text={`${bundle.landingCopy.headline}\n${bundle.landingCopy.subhead}\n\n${bundle.landingCopy.body.join("\n\n")}`}
            />
          </div>
        </div>
      )}

      {activeTab === "social" && (
        <div className="flex flex-col gap-2">
          {bundle.socialPosts.map((post, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-3 border border-line px-4 py-3"
            >
              <p className="text-sm text-ink leading-relaxed">{post}</p>
              <CopyButton text={post} />
            </div>
          ))}
        </div>
      )}

      {activeTab === "scripts" && (
        <div className="flex flex-col gap-3">
          {bundle.videoScripts.map((s, i) => (
            <div key={i} className="border border-line p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="font-bold text-ink text-sm">{s.title}</div>
                <CopyButton text={`${s.title}\nHook: ${s.hook}\nScript: ${s.script}`} />
              </div>
              <div className="text-sm text-ink-soft italic mb-2">&ldquo;{s.hook}&rdquo;</div>
              <p className="text-sm text-ink leading-relaxed">{s.script}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="font-label text-[10px] uppercase tracking-[0.06em] text-ink-soft text-left py-2 pr-3">
                  Day
                </th>
                <th className="font-label text-[10px] uppercase tracking-[0.06em] text-ink-soft text-left py-2 pr-3">
                  Focus
                </th>
                <th className="font-label text-[10px] uppercase tracking-[0.06em] text-ink-soft text-left py-2">
                  Channel
                </th>
              </tr>
            </thead>
            <tbody>
              {bundle.campaignCalendar.map((entry) => (
                <tr key={entry.day} className="border-b border-line align-top">
                  <td className="py-2.5 pr-3 font-medium text-ink whitespace-nowrap">
                    {entry.day}
                  </td>
                  <td className="py-2.5 pr-3 text-ink">{entry.focus}</td>
                  <td className="py-2.5 text-ink-soft whitespace-nowrap">{entry.channel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onSave}
          disabled={isSaving || isSaved}
          className="font-label font-bold text-[13.5px] bg-ink text-bg px-6 py-2.5 hover:bg-accent disabled:bg-line disabled:text-ink-soft disabled:cursor-not-allowed transition-colors"
        >
          {isSaved ? "Saved ✓" : isSaving ? "Saving…" : "Save to library"}
        </button>
        <CopyButton text={exportAsText(bundle, productLabel)} label="Export (copy as text)" />
        <span className="font-label text-[10.5px] text-ink-soft">
          copies the full kit as plain text
        </span>
      </div>
    </div>
  );
}
