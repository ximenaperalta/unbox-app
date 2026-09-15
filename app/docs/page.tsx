import Nav from "../components/Nav";
import Grain from "../components/Grain";

export default function Docs() {
  return (
    <div className="min-h-screen bg-bg">
      <Grain />
      <Nav active="/docs" />

      <section className="relative z-[3] max-w-[820px] mx-auto px-8 pt-6 pb-24">
        <div className="flex items-center gap-2.5 font-label text-[12.5px] uppercase tracking-[0.1em] text-ink-soft mb-7">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Prompt library &amp; build notes
        </div>
        <h1 className="font-display uppercase leading-[0.9] text-[clamp(36px,5.5vw,64px)] tracking-tight mb-14">
          Docs.
        </h1>

        <article className="border border-line p-8 bg-bg-2">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
            <h2 className="text-xl font-bold text-ink">
              Week 1 — Generative Core Agent (/core)
            </h2>
            <span className="font-label text-[10.5px] font-bold uppercase tracking-[0.05em] text-accent border border-accent px-2.5 py-1 whitespace-nowrap">
              Simulated
            </span>
          </div>
          <p className="text-sm text-ink-soft mb-6 leading-relaxed">
            The <code className="bg-bg px-1.5 py-0.5 border border-line text-ink">/core</code> page turns a
            product + customer + brand voice + budget into a structured unboxing brief.
            This week that generation is a deterministic template function,{" "}
            <code className="bg-bg px-1.5 py-0.5 border border-line text-ink">generateCoreBrief()</code> in{" "}
            <code className="bg-bg px-1.5 py-0.5 border border-line text-ink">lib/generateCoreBrief.ts</code>,
            not a call to a paid AI API — per course rules on free tools, until an
            instructor-approved API budget exists. The output shape below is exactly
            what a real Anthropic call would be asked to return, so swapping one in later
            is a one-file change.
          </p>

          <h3 className="font-label text-[11px] uppercase tracking-[0.08em] text-ink-soft mb-2">
            Inputs
          </h3>
          <pre className="bg-ink text-bg text-xs p-4 overflow-x-auto mb-6">
{`{
  product: string,     // required
  customer: string,    // required
  brandVoice: string,  // required
  budget?: string       // optional
}`}
          </pre>

          <h3 className="font-label text-[11px] uppercase tracking-[0.08em] text-ink-soft mb-2">
            Template logic (what a real prompt would ask for)
          </h3>
          <pre className="bg-ink text-bg text-xs p-4 overflow-x-auto mb-6 whitespace-pre-wrap">
{`You are a packaging and unboxing-experience designer.

Given:
- Product: {product}
- Customer: {customer}
- Brand voice: {brandVoice}
- Budget: {budget or "unspecified"}

Return a structured unboxing brief with exactly these five fields:
1. boxType – the physical box format and closure style
2. materials – filler, lamination, printing, and finish choices
3. inserts – thank-you cards, samples, or extras included
4. revealMoment – the sequence of what the customer sees/does when opening it
5. brandFeel – the one or two adjectives the whole experience should communicate

Keep every field grounded in the stated brand voice and budget. Do not
invent a product, customer, or budget that wasn't given.`}
          </pre>

          <h3 className="font-label text-[11px] uppercase tracking-[0.08em] text-ink-soft mb-2">
            Current (simulated) implementation
          </h3>
          <p className="text-sm text-ink-soft leading-relaxed">
            <code className="bg-bg px-1.5 py-0.5 border border-line text-ink">generateCoreBrief()</code>{" "}
            matches brand-voice keywords (e.g. &ldquo;minimal&rdquo;, &ldquo;luxury&rdquo;,
            &ldquo;playful&rdquo;, &ldquo;sustainable&rdquo;, &ldquo;cozy&rdquo;,
            &ldquo;bold&rdquo;) against a lookup table for each of the five fields, and
            adjusts the box-type note based on a rough budget tier parsed from the
            budget string. It is a pure function — same input always produces the same
            brief — which is what makes it possible to test deterministically and to
            swap in a real model call later without changing anything else in the
            request/response flow.
          </p>
        </article>

        <article className="border border-line p-8 bg-bg-2 mt-8">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
            <h2 className="text-xl font-bold text-ink">
              Week 2 — Research + Benchmarking Agent (/research)
            </h2>
            <span className="font-label text-[10.5px] font-bold uppercase tracking-[0.05em] text-accent border border-accent px-2.5 py-1 whitespace-nowrap">
              Simulated
            </span>
          </div>
          <p className="text-sm text-ink-soft mb-6 leading-relaxed">
            The <code className="bg-bg px-1.5 py-0.5 border border-line text-ink">/research</code> page
            turns a product/category + target market into 5 global reference examples, a
            Mexico-localization note, an 8-row competitor/substitute table, and a risk map.
            Same rule as Week 1: this is a deterministic template function,{" "}
            <code className="bg-bg px-1.5 py-0.5 border border-line text-ink">generateResearchBrief()</code>{" "}
            in{" "}
            <code className="bg-bg px-1.5 py-0.5 border border-line text-ink">lib/generateResearchBrief.ts</code>,
            not a live web search or paid API.
          </p>

          <h3 className="font-label text-[11px] uppercase tracking-[0.08em] text-ink-soft mb-2">
            Inputs
          </h3>
          <pre className="bg-ink text-bg text-xs p-4 overflow-x-auto mb-6">
{`{
  product: string,  // required — product or category
  market: string,    // required — target market
}`}
          </pre>

          <h3 className="font-label text-[11px] uppercase tracking-[0.08em] text-ink-soft mb-2">
            Template logic (what a real prompt would ask for)
          </h3>
          <pre className="bg-ink text-bg text-xs p-4 overflow-x-auto mb-6 whitespace-pre-wrap">
{`You are a market researcher and packaging strategist.

Given:
- Product/category: {product}
- Target market: {market}

Return a structured research brief with exactly these four parts:
1. globalExamples – 5 real-world unboxing approaches used in this category
2. mexicoNote – localization considerations specific to Mexico (delivery,
   payment norms, climate/durability, customs)
3. competitors – 8 competitors/substitutes, each with a name, type
   (direct/substitute), price tier, differentiator, and threat level
4. riskMap – which of those 8 represent the highest competitive pressure
   and where the real differentiation opportunity is

Do not invent a product or market that wasn't given. Label every
competitor honestly as a category/archetype, not a real named company,
unless the model has verified, current information about one.`}
          </pre>

          <h3 className="font-label text-[11px] uppercase tracking-[0.08em] text-ink-soft mb-2">
            Current (simulated) implementation
          </h3>
          <p className="text-sm text-ink-soft leading-relaxed">
            <code className="bg-bg px-1.5 py-0.5 border border-line text-ink">generateResearchBrief()</code>{" "}
            matches the product/category text against a keyword lookup (beauty, food,
            fashion, tech, home, subscription, or a general default) to pick 5 global
            examples and a Mexico note. The 8 competitors come from fixed
            competitive-strategy archetypes — direct competitor, retail incumbent,
            private label, marketplace listing, local artisan, subscription rival, DIY
            substitute, and &ldquo;do nothing&rdquo; — rather than invented named
            companies, since real competitor research would need a live search this
            project doesn&apos;t have yet. The risk map is derived directly from which
            archetypes are marked high vs. low threat. Pure function, same testing
            approach as Week 1.
          </p>
        </article>
      </section>

      <footer className="relative z-[3] border-t border-line px-8 py-8 text-center font-label text-[11px] text-ink-soft">
        UNBOX · Negocios Inteligentes y Comercio Digital · AI-101. Ximena
        Peralta
      </footer>
    </div>
  );
}
