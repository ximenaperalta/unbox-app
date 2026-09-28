import { MaterialTag } from "@/lib/generateCoreBrief";

/**
 * Small, illustrative line icons standing in for packaging materials —
 * deliberately NOT real product photography. This project doesn't call a
 * paid image-generation API (course rule: free tools only), and generating
 * fake "photos" of materials that don't exist would be misleading about
 * what the output actually is. A simple icon, clearly illustrative, keeps
 * the "Simulated AI Output" promise honest while still giving a visual cue.
 */

const ICON_LABEL: Record<MaterialTag, string> = {
  cardstock: "Cardstock",
  foil: "Foil accent",
  ribbon: "Ribbon / tie",
  foam: "Foam insert",
  crinklePaper: "Crinkle filler",
  stickers: "Stickers",
  kraftPaper: "Kraft paper",
  biodegradable: "Biodegradable",
  tissuePaper: "Tissue paper",
  tape: "Packing tape",
  insertCard: "Insert card",
};

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconGlyph({ tag }: { tag: MaterialTag }) {
  switch (tag) {
    case "cardstock":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...strokeProps}>
          <rect x="5" y="4" width="14" height="16" rx="1" />
          <line x1="8" y1="9" x2="16" y2="9" />
          <line x1="8" y1="13" x2="13" y2="13" />
        </svg>
      );
    case "foil":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...strokeProps}>
          <path d="M4 16 L10 6 L14 12 L20 4" />
          <path d="M4 20 L10 10 L14 16 L20 8" opacity="0.5" />
        </svg>
      );
    case "ribbon":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...strokeProps}>
          <path d="M12 4 C9 8, 15 8, 12 12 C9 16, 15 16, 12 20" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "foam":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...strokeProps}>
          <rect x="4" y="5" width="16" height="14" rx="1" />
          <path d="M4 12 L9 8 L13 13 L20 7" />
        </svg>
      );
    case "crinklePaper":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...strokeProps}>
          <path d="M3 8 Q6 4, 9 8 T15 8 T21 8" />
          <path d="M3 13 Q6 9, 9 13 T15 13 T21 13" />
          <path d="M3 18 Q6 14, 9 18 T15 18 T21 18" />
        </svg>
      );
    case "stickers":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...strokeProps}>
          <circle cx="10" cy="10" r="6" />
          <path d="M14.2 14.2 L20 20" />
        </svg>
      );
    case "kraftPaper":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...strokeProps}>
          <path d="M5 4 L19 4 L19 20 L5 20 Z" />
          <line x1="8" y1="8" x2="16" y2="8" opacity="0.5" />
          <line x1="8" y1="12" x2="16" y2="12" opacity="0.5" />
          <line x1="8" y1="16" x2="13" y2="16" opacity="0.5" />
        </svg>
      );
    case "biodegradable":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...strokeProps}>
          <path d="M12 21 C12 13, 6 11, 5 5 C13 5, 19 9, 19 15 C19 19, 15 21, 12 21 Z" />
          <line x1="12" y1="21" x2="12" y2="11" />
        </svg>
      );
    case "tissuePaper":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...strokeProps}>
          <path d="M4 6 L20 6 L16 20 L8 20 Z" />
          <path d="M4 6 L8 20" opacity="0.5" />
          <path d="M20 6 L16 20" opacity="0.5" />
        </svg>
      );
    case "tape":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...strokeProps}>
          <rect x="3" y="10" width="18" height="4" rx="1" />
          <line x1="6" y1="10" x2="6" y2="14" opacity="0.5" />
          <line x1="18" y1="10" x2="18" y2="14" opacity="0.5" />
        </svg>
      );
    case "insertCard":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...strokeProps}>
          <rect x="4" y="6" width="16" height="12" rx="1" />
          <line x1="7" y1="10" x2="17" y2="10" />
          <line x1="7" y1="13" x2="14" y2="13" />
        </svg>
      );
  }
}

export default function MaterialIcon({ tag }: { tag: MaterialTag }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft border border-line px-2 py-1 whitespace-nowrap">
      <span className="text-accent shrink-0">
        <IconGlyph tag={tag} />
      </span>
      {ICON_LABEL[tag]}
    </span>
  );
}
