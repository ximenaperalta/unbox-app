import Link from "next/link";
import Nav from "../components/Nav";
import Grain from "../components/Grain";
import { TIERS, Tier } from "@/lib/pricingData";

function limitLabel(value: number | "unlimited"): string {
  return value === "unlimited" ? "Unlimited" : String(value);
}

const FEATURE_ROWS: { label: string; render: (tier: Tier) => string | boolean }[] = [
  { label: "Brief generation (/core)", render: () => true },
  { label: "Research + competitor analysis (/research)", render: (t) => t.hasResearch },
  { label: "Monthly brief limit", render: (t) => limitLabel(t.monthlyBriefLimit) },
  { label: "Saved briefs / scenarios", render: (t) => limitLabel(t.savedLimit) },
  { label: "Multiple product lines / workspaces", render: (t) => t.multiWorkspace },
  { label: "Edit a saved scenario", render: () => "Planned, not this week" },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return <span className="text-accent font-medium">&#10003;</span>;
  }
  if (value === false) {
    return <span className="text-ink-soft">&mdash;</span>;
  }
  return <span className="text-ink-soft text-sm">{value}</span>;
}

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Grain />
      <Nav active="/product" />

      <section className="relative z-[3] max-w-[980px] mx-auto px-8 pt-6 pb-24">
        <div className="flex items-center gap-2.5 font-label text-[12.5px] uppercase tracking-[0.1em] text-ink-soft mb-7">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Product Architecture
        </div>

        <h1 className="font-display uppercase leading-[0.9] text-[clamp(40px,6.5vw,80px)] tracking-tight mb-4">
          What you get.
        </h1>
        <p className="text-[15.5px] text-ink-soft max-w-[56ch] mb-14 leading-relaxed">
          UNBOX is organized into three tiers. Each one unlocks more of the
          toolset — see{" "}
          <Link href="/pricing" className="text-accent hover:underline">
            /pricing
          </Link>{" "}
          to model what that could actually earn.
        </p>

        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`border p-6 ${
                tier.id === "run" ? "border-accent bg-accent/5" : "border-line"
              }`}
            >
              {tier.id === "run" && (
                <div className="font-label text-[10px] uppercase tracking-[0.08em] text-accent mb-2">
                  Most common
                </div>
              )}
              <h2 className="font-display uppercase text-2xl tracking-tight mb-1">
                {tier.name}
              </h2>
              <div className="font-label text-sm text-ink-soft mb-4">
                {tier.monthlyPrice === 0 ? "Free" : `$${tier.monthlyPrice}/mo`}
              </div>
              <ul className="text-sm text-ink-soft space-y-1.5">
                <li>{limitLabel(tier.monthlyBriefLimit)} briefs/month</li>
                <li>{tier.hasResearch ? "Core + Research" : "Core only"}</li>
                <li>{limitLabel(tier.savedLimit)} saved</li>
                {tier.multiWorkspace && <li>Multiple product lines</li>}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="font-label text-[11px] uppercase tracking-[0.1em] text-ink-soft mb-5">
          Feature map
        </h2>
        <div className="border border-line overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-line bg-bg-2">
                <th className="text-left font-label text-[10.5px] uppercase tracking-[0.06em] text-ink-soft px-4 py-3">
                  Feature
                </th>
                {TIERS.map((tier) => (
                  <th
                    key={tier.id}
                    className="text-left font-label text-[10.5px] uppercase tracking-[0.06em] text-ink-soft px-4 py-3"
                  >
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURE_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3 text-ink">{row.label}</td>
                  {TIERS.map((tier) => (
                    <td key={tier.id} className="px-4 py-3">
                      <Cell value={row.render(tier)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="relative z-[3] border-t border-line px-8 py-8 text-center font-label text-[11px] text-ink-soft">
        UNBOX · Negocios Inteligentes y Comercio Digital · AI-101. Ximena
        Peralta
      </footer>
    </div>
  );
}
