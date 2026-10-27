import { PersonaCard as PersonaCardData } from "@/lib/generateMarketingBundle";

export default function PersonaCard({ persona }: { persona: PersonaCardData }) {
  return (
    <div className="border border-line bg-bg-2 p-5">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <div className="font-bold text-ink text-[15px]">{persona.name}</div>
        <div className="font-label text-[10.5px] text-ink-soft uppercase tracking-[0.06em] whitespace-nowrap">
          {persona.ageRange}
        </div>
      </div>
      <p className="text-sm text-ink-soft leading-relaxed mb-3">{persona.description}</p>
      <div className="flex flex-col gap-2">
        <div>
          <div className="font-label text-[10px] uppercase tracking-[0.06em] text-accent mb-0.5">
            Pain point
          </div>
          <p className="text-sm text-ink leading-relaxed">{persona.painPoint}</p>
        </div>
        <div>
          <div className="font-label text-[10px] uppercase tracking-[0.06em] text-accent mb-0.5">
            Motivation
          </div>
          <p className="text-sm text-ink leading-relaxed">{persona.motivation}</p>
        </div>
      </div>
    </div>
  );
}
