import Nav from "../components/Nav";
import Grain from "../components/Grain";

export default function About() {
  return (
    <div className="min-h-screen bg-bg">
      <Grain />
      <Nav active="/about" />

      <section className="relative z-[3] max-w-[780px] mx-auto px-8 py-24">
        <div className="flex items-center gap-2.5 font-label text-[12.5px] uppercase tracking-[0.1em] text-ink-soft mb-7">
          <span className="w-2 h-2 rounded-full bg-accent" />
          About the project
        </div>

        <h1 className="font-display uppercase leading-[0.9] text-[clamp(40px,6.5vw,84px)] tracking-tight mb-7">
          Why <span className="text-accent">UNBOX</span> exists.
        </h1>

        <p className="font-tagline italic text-[clamp(18px,2.2vw,23px)] max-w-[36ch] mb-6 leading-snug">
          Every unboxing is a first impression — most brands never got to
          design theirs.
        </p>

        <p className="text-[15.5px] text-ink-soft leading-relaxed mb-4">
          UNBOX is a student-built AI tool that helps e-commerce brands and
          subscription box creators design intentional, memorable unboxing
          experiences. It&apos;s the semester project for{" "}
          <span className="text-ink font-medium">
            Negocios Inteligentes y Comercio Digital
          </span>{" "}
          — a class about building real, deployed AI-powered products, not
          just prototypes on paper.
        </p>

        <p className="text-[15.5px] text-ink-soft leading-relaxed">
          Each week adds a feature and a piece of evidence: build logs, test
          results, architecture notes, and a running prompt library. The{" "}
          <span className="text-ink font-medium">/docs</span> page tracks
          that work as it happens.
        </p>
      </section>

      <footer className="relative z-[3] border-t border-line px-8 py-8 text-center font-label text-[11px] text-ink-soft">
        UNBOX · Negocios Inteligentes y Comercio Digital · AI-101. Ximena
        Peralta
      </footer>
    </div>
  );
}
