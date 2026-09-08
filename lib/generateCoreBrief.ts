/**
 * generateCoreBrief
 * ------------------
 * Pure, deterministic "core extraction" template function.
 *
 * This is intentionally NOT a call to a real AI model. Per course rules
 * ("free tools only, no paid APIs unless instructor-approved") and since no
 * approval has been confirmed, UNBOX simulates the generative core agent
 * with template logic keyed off the intake fields. The shape of the output
 * matches what a real Anthropic API call would return, so swapping in a
 * real call later is a one-file change (see the docs entry on /docs for the
 * exact template this function fills in).
 *
 * IMPORTANT: keep this function pure (no randomness, no dates, no I/O) so
 * the same input always produces the same brief and it stays trivially
 * testable.
 */

export interface CoreBriefInput {
  product: string;
  customer: string;
  brandVoice: string;
  budget?: string;
}

export interface CoreBrief {
  boxType: string;
  materials: string;
  inserts: string;
  revealMoment: string;
  brandFeel: string;
}

type VoiceTag =
  | "minimal"
  | "luxury"
  | "playful"
  | "sustainable"
  | "cozy"
  | "bold"
  | "default";

type BudgetTier = "low" | "mid" | "high" | "unspecified";

/** Pull recognizable brand-voice keywords out of free text, in priority order. */
function detectVoiceTag(brandVoice: string): VoiceTag {
  const v = brandVoice.toLowerCase();
  if (/(luxur|premium|elevated|high-end)/.test(v)) return "luxury";
  if (/(sustainab|eco|recycl|planet|green)/.test(v)) return "sustainable";
  if (/(playful|fun|quirky|bright|whimsical)/.test(v)) return "playful";
  if (/(cozy|warm|comfort|homey|intimate)/.test(v)) return "cozy";
  if (/(bold|edgy|loud|statement|vibrant)/.test(v)) return "bold";
  if (/(minimal|clean|simple|modern)/.test(v)) return "minimal";
  return "default";
}

/** Roughly bucket a free-text budget string ("$8-12/unit", "$3", "low") into a tier. */
function detectBudgetTier(budget: string | undefined): BudgetTier {
  if (!budget || !budget.trim()) return "unspecified";
  const b = budget.toLowerCase();
  if (/(low|tight|cheap|shoestring)/.test(b)) return "low";
  if (/(high|premium|no limit|generous)/.test(b)) return "high";

  const numbers = b.match(/\d+(\.\d+)?/g)?.map(Number) ?? [];
  if (numbers.length === 0) return "mid";
  const maxNum = Math.max(...numbers);
  if (maxNum <= 5) return "low";
  if (maxNum >= 15) return "high";
  return "mid";
}

const BOX_TYPE: Record<VoiceTag, string> = {
  minimal: "Rigid two-piece lid-and-base box in uncoated white or kraft board — no printed pattern, just a single centered logo debossed or foil-stamped.",
  luxury: "Rigid magnetic-closure box with a matte soft-touch laminate finish and a ribbon pull tab for a slow, deliberate open.",
  playful: "Corrugated mailer box with a full-bleed printed interior graphic that's only visible once the box is opened.",
  sustainable: "FSC-certified recycled corrugated mailer, undyed and unbleached, with soy-based ink printing kept to a single color.",
  cozy: "Kraft mailer box lined with a warm-toned tissue wrap, sized snugly to the product so nothing shifts in transit.",
  bold: "Custom die-cut mailer with a high-contrast printed exterior (dark base color, single bright accent) that stands out in a mail pile.",
  default: "Standard corrugated mailer box sized to the product with a printed logo on the top flap.",
};

const MATERIALS: Record<VoiceTag, string> = {
  minimal: "Uncoated matte cardstock, one ink color, generous negative space. No glitter, foil kept minimal or omitted entirely.",
  luxury: "Soft-touch matte lamination, foil-stamped logo, satin ribbon, and a fitted foam or cardstock insert tray.",
  playful: "Colorful crinkle paper filler, stickers, and a mix of two or more accent colors on printed elements.",
  sustainable: "Shredded kraft paper or mushroom-based filler, biodegradable tape, no plastic-based glitter or lamination.",
  cozy: "Tissue paper in warm neutral tones, a fabric or twine tie, soft crinkle filler for cushioning.",
  bold: "High-contrast printed tissue, metallic accent tape, and a single statement sticker on the product itself.",
  default: "Tissue paper filler in the brand's primary color, standard packing tape, one printed insert card.",
};

const INSERTS: Record<VoiceTag, string> = {
  minimal: "One thin card with a short brand note printed in the brand's primary typeface. No stickers or extras.",
  luxury: "A letterpress or foil thank-you card, a small sample or gift-with-purchase, and a QR code to a private thank-you video.",
  playful: "A thank-you card with a hand-drawn or illustrated style, a sticker sheet, and a small surprise item.",
  sustainable: "A seed-paper thank-you card (plantable) and a printed note on care/recycling instructions for the packaging itself.",
  cozy: "A handwritten-style thank-you note and a small comfort add-on (tea bag, candle sample, or similar) themed to the product.",
  bold: "A statement card with a bold pull-quote from the brand, plus a discount code for the customer's next order.",
  default: "A printed thank-you card and a discount code for a future purchase.",
};

const REVEAL_MOMENT: Record<VoiceTag, string> = {
  minimal: "Lid lifts straight off to reveal the product centered and untouched by filler — the product itself is the only visual element.",
  luxury: "Magnetic lid opens slowly; the customer sees the ribbon pull first, lifts the product tray, and the brand card sits beneath it.",
  playful: "Opening the flaps reveals a printed graphic on the interior walls before the product itself is visible.",
  sustainable: "Filler is visibly minimal and recognizably recycled/biodegradable — the reveal doubles as a statement about the packaging choices.",
  cozy: "Tissue paper is folded closed like a small gift; unwrapping it is a deliberate two-step reveal before the product appears.",
  bold: "Interior color contrasts sharply with the exterior, so opening the box is a visible, almost surprising shift in color/energy.",
  default: "Product is wrapped in tissue paper on top of the filler, so the customer unwraps it as the final step of opening the box.",
};

const BRAND_FEEL: Record<VoiceTag, string> = {
  minimal: "Quiet confidence. Nothing shouts; the restraint itself communicates quality.",
  luxury: "Considered and slow. Every material choice signals the product was worth waiting for.",
  playful: "Delight and surprise. The unboxing should make the customer smile before they even see the product.",
  sustainable: "Honest and low-impact. The packaging should look intentionally simple rather than under-designed.",
  cozy: "Warm and personal, like a gift from a friend rather than a shipment from a company.",
  bold: "Confident and memorable — built to be the thing people screenshot or film.",
  default: "Clean and dependable, prioritizing a smooth, no-surprises open.",
};

const BUDGET_NOTE: Record<BudgetTier, string> = {
  low: " Kept to a single box format and minimal add-ons to protect per-unit cost.",
  mid: " Balances a few brand-forward touches against per-unit cost.",
  high: " Budget allows for premium finishes (foil, magnetic closure, fitted inserts) without cost tradeoffs.",
  unspecified: "",
};

export function generateCoreBrief(input: CoreBriefInput): CoreBrief {
  const voiceTag = detectVoiceTag(input.brandVoice);
  const budgetTier = detectBudgetTier(input.budget);
  const budgetNote = BUDGET_NOTE[budgetTier];

  const productLabel = input.product.trim();
  const customerLabel = input.customer.trim();

  return {
    boxType: `${BOX_TYPE[voiceTag]}${budgetNote}`,
    materials: `For "${productLabel}": ${MATERIALS[voiceTag]}`,
    inserts: INSERTS[voiceTag],
    revealMoment: `${REVEAL_MOMENT[voiceTag]} Designed with ${customerLabel || "your customer"} in mind.`,
    brandFeel: BRAND_FEEL[voiceTag],
  };
}
