// Week 5: /chat's "AI" — deterministic, keyword-matched logic, same family
// as generateCoreBrief() / generateResearchBrief() / generateMarketingBundle().
// No real LLM call, no paid API — labeled "Simulated AI Output" everywhere
// this is surfaced in the UI, same honesty-first pattern as every other
// generated feature in this app. See the Chat Assistant Manifest (Gate 1)
// for the full decision record on why rule-based was chosen over a real
// LLM call this week.

export type HelpNeeded =
  | "unboxing"
  | "research"
  | "pricing"
  | "marketing"
  | "not-sure";

export interface ChatAnswers {
  product: string;
  market: string;
  helpNeeded: HelpNeeded;
}

export type Tool = "/core" | "/research" | "/pricing" | "/marketing";

// Shared source of truth for the Q3 options — both ChatIntake (the picker)
// and ChatCheckpoint (the human-readable review) import this instead of
// each keeping their own copy that could drift apart.
export const HELP_OPTIONS: { value: HelpNeeded; label: string }[] = [
  { value: "unboxing", label: "Designing the unboxing" },
  { value: "research", label: "Researching competitors" },
  { value: "pricing", label: "Pricing it" },
  { value: "marketing", label: "Marketing it" },
  { value: "not-sure", label: "Not sure yet" },
];

export function helpNeededLabel(value: HelpNeeded): string {
  return HELP_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export interface Recommendation {
  tool: Tool;
  toolLabel: string;
  reason: string;
}

// Deliberately not a real moderation model — a fixed set of patterns for
// clearly off-topic or inappropriate requests, i.e. anything that isn't
// about a product, a packaging/unboxing decision, or which UNBOX tool to
// use. Checked against the two free-text fields only (product, market) —
// "help needed" is a constrained choice, not free text, so it can't trigger
// this.
const OFF_TOPIC_PATTERNS: RegExp[] = [
  /\b(medical|legal|tax|financial)\s+advice\b/i,
  /\b(write|do)\s+my\s+(essay|homework|assignment|thesis)\b/i,
  /\b(diagnos(e|is)|prescri(be|ption)|lawsuit|sue\s+(someone|them))\b/i,
  /\b(weather|sports?\s+score|capital\s+of|president\s+of|who\s+won)\b/i,
  /\b(hack|exploit|malware|bypass\s+security)\b/i,
];

export function checkGuardrail(freeText: string): boolean {
  const text = freeText.trim();
  if (!text) return false;
  return OFF_TOPIC_PATTERNS.some((re) => re.test(text));
}

// Keyword cues used only as a fallback when the visitor picks "not sure"
// for help-needed — same category-keyword-lookup pattern as
// generateResearchBrief()/generateMarketingBundle(), applied to a smaller,
// fixed set of outcomes (which of the 4 tools, not which product category).
const KEYWORD_TOOL: { pattern: RegExp; tool: Tool }[] = [
  { pattern: /\b(compet|market research|rival|benchmark)/i, tool: "/research" },
  { pattern: /\b(price|pricing|revenue|cost|charge|tier)/i, tool: "/pricing" },
  { pattern: /\b(market|campaign|social|promot|launch|content)/i, tool: "/marketing" },
];

const TOOL_INFO: Record<
  Tool,
  { label: string; reasonFor: (product: string) => string }
> = {
  "/core": {
    label: "Core — Unboxing Brief",
    reasonFor: (p) =>
      `Start with a full unboxing brief for ${p || "your product"} — box type, materials, inserts, and brand feel in one pass.`,
  },
  "/research": {
    label: "Research — Competitor & Benchmarking",
    reasonFor: (p) =>
      `See how ${p || "your product"} stacks up against real competitors and substitutes before you commit to a direction.`,
  },
  "/pricing": {
    label: "Pricing — Revenue Calculator",
    reasonFor: (p) =>
      `Model what UNBOX would charge to build ${p || "your product"}'s experience, broken down by segment and tier.`,
  },
  "/marketing": {
    label: "Marketing — Content Kit Generator",
    reasonFor: (p) =>
      `Get a persona, landing copy, social posts, and a campaign calendar ready to launch ${p || "your product"}.`,
  },
};

export function pickRecommendation(answers: ChatAnswers): Recommendation {
  let tool: Tool;

  switch (answers.helpNeeded) {
    case "unboxing":
      tool = "/core";
      break;
    case "research":
      tool = "/research";
      break;
    case "pricing":
      tool = "/pricing";
      break;
    case "marketing":
      tool = "/marketing";
      break;
    case "not-sure":
    default: {
      const combined = `${answers.product} ${answers.market}`;
      const match = KEYWORD_TOOL.find((k) => k.pattern.test(combined));
      tool = match ? match.tool : "/core";
      break;
    }
  }

  const info = TOOL_INFO[tool];
  return { tool, toolLabel: info.label, reason: info.reasonFor(answers.product) };
}
