/**
 * generateMarketingBundle
 * ------------------------
 * Pure, deterministic marketing-kit template function — the Week 4
 * counterpart to generateCoreBrief() (Week 1) and generateResearchBrief()
 * (Week 2).
 *
 * Same rules apply: no paid API, no live generation. This simulates a
 * marketing agent with category-keyword-matched template logic, clearly
 * labeled "Simulated AI Output" in the UI — exactly like /core and
 * /research. This is distinct from the homepage A/B headline test
 * (lib/abTest.ts), which is a real feature, not simulated: this function
 * only powers the /marketing kit generator, for a visitor's OWN product.
 *
 * Kept pure (no randomness/dates/I-O) so the same input always produces
 * the same output and it stays trivially testable.
 */

export type Segment = "Local" | "Scale";

export interface MarketingBundleInput {
  product: string;
  segment: Segment;
}

export interface PersonaCard {
  name: string;
  ageRange: string;
  description: string;
  painPoint: string;
  motivation: string;
}

export interface LandingCopy {
  headline: string;
  subhead: string;
  body: string[]; // 3 paragraphs
}

export interface VideoScript {
  title: string;
  hook: string;
  script: string;
}

export interface CalendarEntry {
  day: number; // 1-14
  focus: string;
  channel: string;
}

export interface MarketingBundle {
  persona: PersonaCard;
  landingCopy: LandingCopy;
  socialPosts: string[]; // 10
  videoScripts: VideoScript[]; // 3
  campaignCalendar: CalendarEntry[]; // 14
}

type CategoryTag =
  | "beauty"
  | "food"
  | "fashion"
  | "tech"
  | "home"
  | "subscription"
  | "default";

/** Pull a recognizable product-category keyword out of free text, in priority order. */
function detectCategoryTag(product: string): CategoryTag {
  const p = product.toLowerCase();
  if (/(beauty|skincare|cosmetic|makeup|grooming)/.test(p)) return "beauty";
  if (/(food|coffee|tea|snack|beverage|drink|meal)/.test(p)) return "food";
  if (/(apparel|clothing|fashion|jewelry|accessor|sneaker)/.test(p)) return "fashion";
  if (/(tech|gadget|electronic|device|wearable|audio)/.test(p)) return "tech";
  if (/(home|decor|candle|kitchen|plant|bedding)/.test(p)) return "home";
  if (/(subscription|box club|monthly)/.test(p)) return "subscription";
  return "default";
}

const CATEGORY_LABEL: Record<CategoryTag, string> = {
  beauty: "beauty and skincare",
  food: "food and beverage",
  fashion: "fashion and accessories",
  tech: "tech and gadgets",
  home: "home and lifestyle",
  subscription: "subscription box",
  default: "e-commerce",
};

const CATEGORY_HOOK: Record<CategoryTag, string> = {
  beauty: "the first swipe of the lid, before a single product is even visible",
  food: "the smell that hits before the box is even fully open",
  fashion: "the moment the tissue paper peels back",
  tech: "the first click of the lid, foam cradling the device exactly in place",
  home: "the first thing your eye lands on when the lid comes off",
  subscription: "the reveal card that explains what's inside before you dig in",
  default: "the first ten seconds after the tape comes off",
};

interface SegmentProfile {
  name: string;
  ageRange: string;
  description: (categoryLabel: string) => string;
  painPoint: (categoryLabel: string) => string;
  motivation: string;
}

const SEGMENT_PROFILES: Record<Segment, SegmentProfile> = {
  Local: {
    name: "Mariana, the first-product founder",
    ageRange: "28-38",
    description: (c) =>
      `Runs a single ${c} product line, sells mostly in Mexico, and is still proving the idea works before building anything else.`,
    painPoint: (c) =>
      `Doesn't have a design team or packaging budget, so every ${c} shipment risks looking like a generic reseller box instead of a real brand.`,
    motivation:
      "Wants customers to feel like they bought from a real, considered brand — not a dropshipped afterthought — without hiring anyone.",
  },
  Scale: {
    name: "Diego, the multi-line operator",
    ageRange: "32-45",
    description: (c) =>
      `Runs several ${c} product lines, ships beyond Mexico, and is standardizing packaging and messaging across all of them at once.`,
    painPoint: (c) =>
      `Each ${c} line has slightly different packaging decided ad hoc, so the brand feels inconsistent across products and markets.`,
    motivation:
      "Wants one repeatable system for unboxing and marketing copy that scales across product lines without re-inventing it every launch.",
  },
};

function buildPersona(categoryTag: CategoryTag, segment: Segment): PersonaCard {
  const profile = SEGMENT_PROFILES[segment];
  const categoryLabel = CATEGORY_LABEL[categoryTag];
  return {
    name: profile.name,
    ageRange: profile.ageRange,
    description: profile.description(categoryLabel),
    painPoint: profile.painPoint(categoryLabel),
    motivation: profile.motivation,
  };
}

function buildLandingCopy(
  productLabel: string,
  categoryTag: CategoryTag,
  segment: Segment
): LandingCopy {
  const categoryLabel = CATEGORY_LABEL[categoryTag];
  const hook = CATEGORY_HOOK[categoryTag];
  const scaleNote =
    segment === "Scale"
      ? "across every line you ship"
      : "from your very first order";

  return {
    headline: `${productLabel}, designed to be opened — not just shipped.`,
    subhead: `A ${categoryLabel} unboxing built around ${hook}, ${scaleNote}.`,
    body: [
      `Most ${categoryLabel} brands spend everything on the product and nothing on the thirty seconds after it arrives — the thirty seconds the customer actually remembers.`,
      `${productLabel} flips that: the box, the reveal, and the first thing the customer reads are designed together, not bolted on after the fact.`,
      segment === "Scale"
        ? "Because the system is documented once, every new product line inherits the same unboxing standard instead of starting from zero."
        : "Because it's designed as a repeatable system from day one, it's ready to scale the moment the first batch sells out.",
    ],
  };
}

const SOCIAL_POST_TEMPLATES: ((p: string, c: string) => string)[] = [
  (p, c) => `Unboxing a ${c} order should feel like a gift, not a transaction. Here's how ${p} does it. 📦`,
  (p) => `We spent more time on the first ten seconds after you open ${p} than almost anything else. Here's why.`,
  (p, c) => `POV: your ${c} order just arrived and it actually looks like it was made for you. That's ${p}.`,
  (p) => `The box is not packaging. The box is the first thing people remember about ${p}.`,
  (p, c) => `If your ${c} brand doesn't have an unboxing moment yet, it has a missed opportunity. ${p} does.`,
  (p) => `Behind the scenes: every detail inside the ${p} box, explained.`,
  (p, c) => `Most ${c} brands ship a box. ${p} ships an experience.`,
  (p) => `Save this if you're building a brand people actually talk about: ${p}'s unboxing breakdown.`,
  (p, c) => `What's inside a ${p} order? More thought than a typical ${c} shipment, that's for sure.`,
  (p) => `This is your sign to stop treating your packaging as an afterthought — ${p} didn't.`,
];

function buildSocialPosts(productLabel: string, categoryTag: CategoryTag): string[] {
  const categoryLabel = CATEGORY_LABEL[categoryTag];
  return SOCIAL_POST_TEMPLATES.map((fn) => fn(productLabel, categoryLabel));
}

function buildVideoScripts(productLabel: string, categoryTag: CategoryTag): VideoScript[] {
  const categoryLabel = CATEGORY_LABEL[categoryTag];
  const hook = CATEGORY_HOOK[categoryTag];
  return [
    {
      title: "The unboxing, start to finish",
      hook: `This is ${hook} — unedited.`,
      script: `Open on the sealed box. Cut to hands lifting the lid. Hold on ${hook}. Narration: "This is what every ${productLabel} customer sees first." Close on the fully revealed product with a single on-screen caption naming the one detail viewers are most likely to ask about.`,
    },
    {
      title: "Why the packaging looks like this",
      hook: `Every ${categoryLabel} brand ships a box. Here's why ours is different.`,
      script: `Talking-head intro explaining the one constraint that shaped the design (budget, durability, or shipping distance). Cut to close-up shots of the material/finish choice. End with the trade-off that was NOT made — the thing this brand chose not to do, and why.`,
    },
    {
      title: "Customer reaction, real-time",
      hook: `We handed someone a ${productLabel} box and just... filmed it.`,
      script: `Unscripted reaction shot of a real or simulated customer opening the box for the first time, no narration until the final 5 seconds, where a single caption states the one thing ${productLabel} wants every first-time customer to feel.`,
    },
  ];
}

const CALENDAR_TEMPLATE: { offsetLabel: string; focus: string; channel: string }[] = [
  { offsetLabel: "Day 1", focus: "Teaser: the box, unopened", channel: "Instagram Reel" },
  { offsetLabel: "Day 2", focus: "Behind-the-scenes: material/finish choice", channel: "Instagram Story" },
  { offsetLabel: "Day 3", focus: "Full unboxing video", channel: "TikTok" },
  { offsetLabel: "Day 4", focus: "Customer reaction repost", channel: "Instagram Feed" },
  { offsetLabel: "Day 5", focus: "\"Why the packaging looks like this\" explainer", channel: "YouTube Shorts" },
  { offsetLabel: "Day 6", focus: "Carousel: 3 details most people miss", channel: "Instagram Feed" },
  { offsetLabel: "Day 7", focus: "Week 1 recap + landing page push", channel: "Email" },
  { offsetLabel: "Day 8", focus: "Persona-targeted ad copy test (headline A/B)", channel: "Meta Ads" },
  { offsetLabel: "Day 9", focus: "User-generated unboxing repost", channel: "Instagram Story" },
  { offsetLabel: "Day 10", focus: "\"What's inside\" myth-busting post", channel: "TikTok" },
  { offsetLabel: "Day 11", focus: "Founder talking-head: the one trade-off made", channel: "Instagram Reel" },
  { offsetLabel: "Day 12", focus: "Limited restock / urgency reminder", channel: "Email" },
  { offsetLabel: "Day 13", focus: "Side-by-side: generic box vs. this box", channel: "Instagram Feed" },
  { offsetLabel: "Day 14", focus: "Campaign recap + landing page push", channel: "Email" },
];

function buildCampaignCalendar(): CalendarEntry[] {
  return CALENDAR_TEMPLATE.map((entry, i) => ({
    day: i + 1,
    focus: entry.focus,
    channel: entry.channel,
  }));
}

export function generateMarketingBundle(input: MarketingBundleInput): MarketingBundle {
  const categoryTag = detectCategoryTag(input.product);
  const productLabel = input.product.trim() || "this product";

  return {
    persona: buildPersona(categoryTag, input.segment),
    landingCopy: buildLandingCopy(productLabel, categoryTag, input.segment),
    socialPosts: buildSocialPosts(productLabel, categoryTag),
    videoScripts: buildVideoScripts(productLabel, categoryTag),
    campaignCalendar: buildCampaignCalendar(),
  };
}
