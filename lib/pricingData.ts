/**
 * pricingData
 * -----------
 * Shared source of truth for UNBOX's own pricing tiers and customer segments —
 * read by both /product (the static feature map) and /pricing (the calculator)
 * so the two pages can't drift out of sync with each other.
 *
 * Note on scope: this models what UNBOX itself would charge a founder to use
 * the platform (/core, /research) — not what a founder charges their own
 * end customers. No payments are actually processed; these are planning
 * numbers for the revenue calculator, editable in the Assumptions panel.
 */

export type TierId = "sample" | "run" | "line";
export type SegmentId = "local" | "scale";

export interface Tier {
  id: TierId;
  name: string;
  monthlyPrice: number; // USD
  hasResearch: boolean;
  monthlyBriefLimit: number | "unlimited";
  savedLimit: number | "unlimited";
  multiWorkspace: boolean;
  canEditSavedScenario: boolean; // always false this week — scope cut, see Manifest §05
}

export const TIERS: Tier[] = [
  {
    id: "sample",
    name: "Sample",
    monthlyPrice: 0,
    hasResearch: false,
    monthlyBriefLimit: 3,
    savedLimit: 5,
    multiWorkspace: false,
    canEditSavedScenario: false,
  },
  {
    id: "run",
    name: "Run",
    monthlyPrice: 9,
    hasResearch: true,
    monthlyBriefLimit: 25,
    savedLimit: 10,
    multiWorkspace: false,
    canEditSavedScenario: false,
  },
  {
    id: "line",
    name: "Line",
    monthlyPrice: 29,
    hasResearch: true,
    monthlyBriefLimit: "unlimited",
    savedLimit: "unlimited",
    multiWorkspace: true,
    canEditSavedScenario: false,
  },
];

export interface Segment {
  id: SegmentId;
  name: string;
  description: string;
  defaultTierMix: Record<TierId, number>; // percents, sum to 100
}

export const SEGMENTS: Segment[] = [
  {
    id: "local",
    name: "Local",
    description:
      "Sells only in Mexico, testing one product idea, wants to move fast. Mostly uses /core; /research's cross-border angle matters less.",
    defaultTierMix: { sample: 60, run: 35, line: 5 },
  },
  {
    id: "scale",
    name: "Scale",
    description:
      "Selling (or planning to sell) beyond Mexico, running multiple product lines. Needs /core and /research regularly.",
    defaultTierMix: { sample: 10, run: 40, line: 50 },
  },
];

export function getTier(id: TierId): Tier {
  const tier = TIERS.find((t) => t.id === id);
  if (!tier) throw new Error(`Unknown tier: ${id}`);
  return tier;
}

export function getSegment(id: SegmentId): Segment {
  const segment = SEGMENTS.find((s) => s.id === id);
  if (!segment) throw new Error(`Unknown segment: ${id}`);
  return segment;
}
