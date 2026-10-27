import Nav from "./components/Nav";
import Grain from "./components/Grain";
import HeadlineVariant from "./components/HeadlineVariant";

const PILLARS = [
  {
    name: "Box & Materials",
    hint: "format, size, and finish for your budget",
  },
  {
    name: "Presentation & Inserts",
    hint: "the reveal, tissue, inserts, thank-you cards",
  },
  {
    name: "Brand Experience",
    hint: "every detail reinforcing who you are",
  },
];

const ROADMAP = [
  { week: "Week 1", feature: "AI unboxing experience generator", status: "Live" },
  { week: "Week 2", feature: "Research + benchmarking dashboard", status: "Live" },
  { week: "Week 3", feature: "Pricing simulator", status: "Live" },
  { week: "Week 4", feature: "Marketing kit generator + headline A/B test", status: "Live" },
  { week: "Week 5", feature: "Full packaging brief export", status: null },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <Grain />
      <Nav active="/" />

      {/* Hero */}
      <section className="relative z-[3] px-8 pt-6 pb-20">
        <div className="max-w-[980px] mx-auto">
          <div className="flex items-center gap-2.5 font-label text-[12.5px] uppercase tracking-[0.1em] text-ink-soft mb-7">
            <span className="w-2 h-2 rounded-full bg-accent" />
            AI Venture Prototype
          </div>

          <HeadlineVariant />
        </div>
      </section>

      <div className="relative z-[3] h-3.5 bg-ink" />

      {/* What it does */}
      <section className="relative z-[3] bg-bg-2 px-8 py-16">
        <div className="max-w-[980px] mx-auto">
          <div className="font-label text-[11.5px] uppercase tracking-[0.1em] text-ink-soft mb-5">
            what it does
          </div>
          <h2 className="font-display uppercase text-[clamp(26px,3.4vw,40px)] leading-[1.05] max-w-[20ch] mb-10">
            Three parts of the experience.
          </h2>
          <div className="border-t border-line">
            {PILLARS.map((p, i) => (
              <div
                key={p.name}
                className="flex items-baseline gap-7 py-[19px] border-b border-line"
              >
                <span className="font-label text-[12px] text-accent w-6 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-bold text-[18px] w-[220px] shrink-0">
                  {p.name}
                </span>
                <span className="font-tagline italic text-[15px] text-ink-soft">
                  {p.hint}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="relative z-[3] px-8 py-16">
        <div className="max-w-[980px] mx-auto">
          <div className="font-label text-[11.5px] uppercase tracking-[0.1em] text-ink-soft mb-5">
            semester roadmap
          </div>
          <h2 className="font-display uppercase text-[clamp(26px,3.4vw,40px)] leading-[1.05] max-w-[20ch] mb-10">
            Coming soon.
          </h2>
          <div className="border-t border-line">
            {ROADMAP.map((item) => (
              <div
                key={item.week}
                className="flex items-center gap-7 py-[17px] border-b border-line"
              >
                <span className="font-label text-[12px] text-ink-soft w-16 shrink-0 uppercase">
                  {item.week}
                </span>
                <span className="text-[15px] flex-1">{item.feature}</span>
                {item.status && (
                  <span className="font-label text-[10.5px] font-bold uppercase tracking-[0.05em] text-accent border border-accent px-2.5 py-1">
                    {item.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-[3] border-t border-line px-8 py-8 text-center font-label text-[11px] text-ink-soft">
        UNBOX · Negocios Inteligentes y Comercio Digital · AI-101. Ximena
        Peralta
      </footer>
    </div>
  );
}
