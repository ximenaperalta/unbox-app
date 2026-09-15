/**
 * generateResearchBrief
 * ----------------------
 * Pure, deterministic "research + benchmarking" template function — the
 * Week 2 counterpart to generateCoreBrief() (Week 1).
 *
 * Same rules apply: no paid API, no live web search. This simulates a
 * research agent with category-keyword-matched template logic, clearly
 * labeled as simulated in the UI. The 8 competitors/substitutes are built
 * from fixed competitive-strategy archetypes (direct competitor, private
 * label, marketplace listing, artisan/handmade, subscription rival, DIY
 * substitute, incumbent retail, and "do nothing") rather than invented
 * named companies — real named-competitor research would require a live
 * search this project isn't allowed to make yet, so the archetypes keep
 * the output honest about what it actually is: a structured starting
 * point, not verified market intelligence.
 *
 * Kept pure (no randomness/dates/I-O) so the same input always produces
 * the same output and it stays trivially testable.
 */

export interface ResearchBriefInput {
  product: string;
  market: string;
}

export interface Competitor {
  name: string;
  type: "Direct" | "Substitute";
  priceTier: "Low" | "Mid" | "High";
  differentiator: string;
  threat: "Low" | "Med" | "High";
}

export interface RiskMapRow {
  label: string;
  status: "Watch" | "Opportunity";
}

export interface ResearchBrief {
  globalExamples: string[];
  mexicoNote: string;
  competitors: Competitor[];
  riskMap: RiskMapRow[];
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

const GLOBAL_EXAMPLES: Record<CategoryTag, string[]> = {
  beauty: [
    "A prestige skincare label ships in a rigid magnetic box with a printed ritual card explaining application order.",
    "A clean-beauty DTC brand uses a minimal kraft mailer with a single wax seal and no interior filler at all.",
    "A K-beauty-inspired brand layers pastel tissue paper with a mini sample sachet taped to the lid.",
    "A men's grooming brand uses a matte black rigid box with a magnetic flip lid and embossed logo.",
    "A subscription beauty box uses a themed monthly insert card that doubles as a styling guide.",
  ],
  food: [
    "A specialty coffee roaster ships whole-bean bags in a resealable kraft pouch with a brew guide insert.",
    "A snack subscription uses a corrugated box with a printed interior pattern and a recipe card.",
    "A tea brand uses individually wrapped sachets inside a reusable tin.",
    "A meal-kit service uses an insulated liner with ice packs and a step-by-step cooking card on top.",
    "A craft beverage brand uses molded pulp inserts to protect bottles, with a QR code to tasting notes.",
  ],
  fashion: [
    "A DTC apparel brand ships in a poly mailer with a printed thank-you card and a folded tissue wrap.",
    "A jewelry brand uses a small rigid box with a foam insert and a care-instructions card.",
    "A sneaker brand keeps the original shoebox but adds a branded outer mailer with a sticker seal.",
    "An accessories brand uses a dust bag plus a branded box, positioning the dust bag as reusable.",
    "A sustainable fashion label uses undyed recycled mailers with a single stamped logo, no plastic.",
  ],
  tech: [
    "A gadget brand uses a two-piece rigid box with foam cutouts holding each component in place.",
    "A smart-home device ships with a fold-out quick-start card printed directly inside the lid.",
    "An audio brand uses a magnetic box with the product visible through a die-cut window on first open.",
    "A wearables brand includes a charging cable coiled in its own small printed pouch.",
    "A tech-accessories brand uses minimal packaging designed to be recycled same-day.",
  ],
  home: [
    "A candle brand ships in a rigid box with excelsior (wood-wool) filler and a matchbook taped to the lid.",
    "A home-decor brand wraps fragile items in branded tissue plus molded pulp corner protectors.",
    "A kitchenware brand uses a printed interior box lid that doubles as a recipe or usage guide.",
    "A bedding brand compresses products into a small branded pouch with a reusable drawstring bag.",
    "A plant-delivery brand uses a vented box with a care card taped to the inside of the lid.",
  ],
  subscription: [
    "A lifestyle box uses a themed monthly card as the very first thing seen on open.",
    "A snack box groups items by a printed 'map' insert explaining what each item is.",
    "A beauty box includes a small survey card incentivized with a discount on the next box.",
    "A book box seals the book itself in branded wrap so it can't be seen before opening.",
    "A hobby box numbers each box in the series, turning the unboxing into a collectible moment.",
  ],
  default: [
    "A general DTC brand uses a corrugated mailer with a printed interior flap and a thank-you card.",
    "A marketplace-first brand keeps packaging minimal, relying on the product itself to stand out.",
    "A subscription-adjacent brand adds a small surprise item to reward repeat customers.",
    "A premium-positioned brand uses tissue and a wax seal despite a modest price point.",
    "A sustainability-focused brand skips plastic entirely, using only paper-based materials.",
  ],
};

const MEXICO_NOTE: Record<CategoryTag, string> = {
  beauty:
    "Heat and humidity in transit can affect texture-sensitive products — matte lamination (not glossy, which shows fingerprints/humidity marks) and insulated mailers hold up better across Mexican shipping routes. WhatsApp-based order support and cash-on-delivery (pago contra entrega) are still widely expected outside major metro areas.",
  food:
    "Perishable or scent-forward items need packaging that survives longer transit times outside CDMX/Guadalajara/Monterrey, plus clear bilingual labeling for customs and consumer trust. Local couriers (Estafeta, Fedex México, Paquetexpress) have different size/weight sweet spots than US carriers.",
  fashion:
    "Sizing charts need Mexican/Latin American conventions, not just US/EU sizing, and returns logistics — a major cost driver — should be designed into the packaging itself; resealable mailers cut return-shipping friction.",
  tech:
    "Import/customs duties on electronics can surprise first-time buyers — transparent, upfront pricing in the unboxing materials (not just at checkout) builds trust. Protective packaging matters more given longer average shipping distances within Mexico.",
  home:
    "Fragile items need packaging that survives inconsistent last-mile handling; OXXO pickup points and cash-on-delivery remain common outside major cities, which changes when and where the 'unboxing moment' actually happens for the customer.",
  subscription:
    "Recurring billing in Mexico still favors OXXO cash payments and debit over a credit card on file, so the physical box has to work harder to justify a recurring cash commitment — the unboxing itself becomes the retention mechanism.",
  default:
    "Consider Mexican courier norms (Estafeta, Fedex México, Paquetexpress), bilingual packaging, and the continued relevance of cash-on-delivery and OXXO payment points outside major metro areas when adapting a global concept locally.",
};

interface CompetitorArchetype {
  name: string;
  type: "Direct" | "Substitute";
  priceTier: "Low" | "Mid" | "High";
  threat: "Low" | "Med" | "High";
  differentiator: (categoryLabel: string) => string;
}

const ARCHETYPES: CompetitorArchetype[] = [
  {
    name: "Direct DTC competitor",
    type: "Direct",
    priceTier: "Mid",
    threat: "High",
    differentiator: (c) => `Another ${c} brand selling direct-to-consumer, competing mainly on price and delivery speed.`,
  },
  {
    name: "Retail / incumbent brand",
    type: "Direct",
    priceTier: "High",
    threat: "Med",
    differentiator: (c) => `An established ${c} brand with retail shelf presence and existing customer trust.`,
  },
  {
    name: "Private-label / store brand",
    type: "Substitute",
    priceTier: "Low",
    threat: "Med",
    differentiator: (c) => `A retailer's own cheaper ${c} alternative, winning on price over experience.`,
  },
  {
    name: "Marketplace generic listing",
    type: "Substitute",
    priceTier: "Low",
    threat: "High",
    differentiator: (c) => `Unbranded ${c} listings on a general marketplace — no unboxing experience at all, just the lowest price.`,
  },
  {
    name: "Local artisan / handmade seller",
    type: "Substitute",
    priceTier: "Mid",
    threat: "Low",
    differentiator: (c) => `A small-batch, handmade ${c} seller competing on authenticity and story rather than polish.`,
  },
  {
    name: "Subscription-box rival",
    type: "Direct",
    priceTier: "Mid",
    threat: "Med",
    differentiator: (c) => `A recurring subscription box in the same ${c} space, competing on discovery and surprise.`,
  },
  {
    name: "DIY / at-home substitute",
    type: "Substitute",
    priceTier: "Low",
    threat: "Low",
    differentiator: (c) => `The customer skips buying a finished ${c} product and makes or sources it themselves.`,
  },
  {
    name: '"Do nothing" / status quo',
    type: "Substitute",
    priceTier: "Low",
    threat: "Low",
    differentiator: () => "The customer simply doesn't buy anything in this category — the real competition for attention and budget.",
  },
];

function buildRiskMap(competitors: Competitor[]): RiskMapRow[] {
  const highThreat = competitors.filter((c) => c.threat === "High").map((c) => c.name);
  const lowThreat = competitors.filter((c) => c.threat === "Low").map((c) => c.name);
  const rows: RiskMapRow[] = [];

  if (highThreat.length > 0) {
    rows.push({
      label: `High competitive pressure from: ${highThreat.join(", ")}.`,
      status: "Watch",
    });
  }
  if (lowThreat.length > 0) {
    rows.push({
      label: `Lower pressure / differentiation opportunity vs: ${lowThreat.join(", ")}.`,
      status: "Opportunity",
    });
  }
  rows.push({
    label:
      "Overall: differentiate on the unboxing experience itself — most substitutes above don't compete on that dimension at all.",
    status: "Opportunity",
  });

  return rows;
}

export function generateResearchBrief(input: ResearchBriefInput): ResearchBrief {
  const categoryTag = detectCategoryTag(input.product);
  const categoryLabel = CATEGORY_LABEL[categoryTag];

  const competitors: Competitor[] = ARCHETYPES.map((a) => ({
    name: a.name,
    type: a.type,
    priceTier: a.priceTier,
    threat: a.threat,
    differentiator: a.differentiator(categoryLabel),
  }));

  const marketLabel = input.market.trim();
  const mexicoNote = marketLabel
    ? `${MEXICO_NOTE[categoryTag]} Specifically for ${marketLabel}: confirm local delivery coverage and payment preferences before finalizing packaging costs.`
    : MEXICO_NOTE[categoryTag];

  return {
    globalExamples: GLOBAL_EXAMPLES[categoryTag],
    mexicoNote,
    competitors,
    riskMap: buildRiskMap(competitors),
  };
}
