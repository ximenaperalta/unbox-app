import Link from "next/link";
import Nav from "../components/Nav";
import Grain from "../components/Grain";

// Week 6 — Integrated Agentic Venture + Impact & Viability.
// This page is the required guided walkthrough: it ties together every
// agent built across Weeks 1-5 into one venture narrative, shows how they
// relate (the agent map), recaps how each was tested, and is honest about
// what's real, what's simulated, and what's deliberately not built yet.
// No interaction required to see any of it — matches the default-visible-
// content rule every other page on this site follows.

const AGENTS = [
  {
    name: "Core Agent",
    route: "/core",
    week: "Week 1",
    does: "Generates an unboxing concept brief from a product description.",
    kind: "Simulated",
  },
  {
    name: "Research Agent",
    route: "/research",
    week: "Week 2",
    does: "Generates a competitive-landscape + risk-map report.",
    kind: "Simulated",
  },
  {
    name: "Pricing Engine",
    route: "/pricing",
    week: "Week 3",
    does: "Calculates monthly/annual revenue from tier mix + pricing assumptions.",
    kind: "Deterministic math — not AI, simulated or otherwise",
  },
  {
    name: "Marketing Agent",
    route: "/marketing",
    week: "Week 4",
    does: "Generates a persona, landing copy, social posts, scripts, and a content calendar.",
    kind: "Simulated",
  },
  {
    name: "Growth A/B Agent",
    route: "/",
    week: "Week 4",
    does: "Runs UNBOX's own real homepage headline test and logs real impressions/clicks.",
    kind: "Real — not simulated",
  },
  {
    name: "Chat Router",
    route: "/chat",
    week: "Week 5",
    does: "Asks 3 questions, then routes a visitor to whichever agent above actually fits their need.",
    kind: "Simulated / rule-based",
  },
];

const ROADMAP = [
  "Let a visitor edit a saved pricing scenario instead of only creating new ones — deferred since Week 3 pending a decision on which tier it belongs to.",
  "Swap /chat's rule-based routing for a real LLM call, now that the deterministic version has proven the flow end-to-end — current approach was chosen deliberately to avoid paid-API risk during the semester.",
  "A motion/aesthetic pass across the whole site — smoother transitions, scroll-reactive detail, possibly an “unwrap”-style reveal on the homepage — explored as inspiration this semester, intentionally held until the core product was solid.",
  "Basic accounts/auth, so saved briefs, scenarios, and chat sessions belong to a real visitor instead of being open to anyone — every table this semester has shipped without auth, by design, to keep each week's scope small.",
  "An admin view over /chat's ratings and /dashboard's records, instead of reading Supabase directly.",
  "Real payment processing, if UNBOX ever needed to actually charge for a tier — intentionally out of scope all semester; the pricing calculator only models revenue, it has never touched real money.",
];

export default function DemoPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Grain />
      <Nav active="/demo" />

      <div className="relative z-10 max-w-5xl mx-auto px-8 pb-24">
        {/* Intro */}
        <div className="mb-14">
          <div className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-2">
            Week 6 · Integrated Agentic Venture + Impact &amp; Viability
          </div>
          <h1 className="text-3xl font-bold text-ink">
            UNBOX, end to end
          </h1>
          <p className="text-sm text-ink-soft mt-2 max-w-[68ch]">
            Five weeks of UNBOX built one feature at a time. This page is the
            guided walkthrough: what each agent does, how they fit together,
            what real data backs them, how they were tested, and what&apos;s
            deliberately not built yet.
          </p>
        </div>

        {/* Guided walkthrough */}
        <section className="mb-16">
          <h2 className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-4">
            Walk through it yourself
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/core" className="border border-line p-5 hover:border-accent transition-colors">
              <div className="font-label text-[11px] text-ink-soft mb-1">Week 1</div>
              <div className="font-bold text-ink">/core — start here</div>
              <p className="text-xs text-ink-soft mt-1">Describe a product, get an unboxing brief.</p>
            </Link>
            <Link href="/research" className="border border-line p-5 hover:border-accent transition-colors">
              <div className="font-label text-[11px] text-ink-soft mb-1">Week 2</div>
              <div className="font-bold text-ink">/research — who you&apos;re up against</div>
              <p className="text-xs text-ink-soft mt-1">Competitors, risk map, real sourced examples on /docs.</p>
            </Link>
            <Link href="/pricing" className="border border-line p-5 hover:border-accent transition-colors">
              <div className="font-label text-[11px] text-ink-soft mb-1">Week 3</div>
              <div className="font-bold text-ink">/product + /pricing — what it costs</div>
              <p className="text-xs text-ink-soft mt-1">Tiers, a live revenue calculator, saved scenarios.</p>
            </Link>
            <Link href="/marketing" className="border border-line p-5 hover:border-accent transition-colors">
              <div className="font-label text-[11px] text-ink-soft mb-1">Week 4</div>
              <div className="font-bold text-ink">/marketing — how you&apos;d launch it</div>
              <p className="text-xs text-ink-soft mt-1">A content kit, plus UNBOX&apos;s own real homepage A/B test.</p>
            </Link>
            <Link href="/chat" className="border border-line p-5 hover:border-accent transition-colors">
              <div className="font-label text-[11px] text-ink-soft mb-1">Week 5</div>
              <div className="font-bold text-ink">/chat — not sure where to start?</div>
              <p className="text-xs text-ink-soft mt-1">Answer 3 questions, get routed to the right tool above.</p>
            </Link>
            <Link href="/dashboard" className="border border-line p-5 hover:border-accent transition-colors">
              <div className="font-label text-[11px] text-ink-soft mb-1">Week 6</div>
              <div className="font-bold text-ink">/dashboard — the real data behind all of it</div>
              <p className="text-xs text-ink-soft mt-1">Live record counts, pulled from Supabase on every load.</p>
            </Link>
          </div>
        </section>

        {/* Agent map */}
        <section className="mb-16">
          <h2 className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-4">
            Agent map
          </h2>
          <p className="text-sm text-ink-soft mb-5 max-w-[68ch]">
            UNBOX isn&apos;t one agent — it&apos;s five, each scoped to one
            decision a founder has to make, plus one router (Chat) that
            points a visitor at whichever of the other five fits what they
            described.
          </p>
          <div className="border border-line overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink text-bg">
                  <th className="text-left font-label text-[10.5px] uppercase tracking-[0.05em] px-4 py-2.5">Agent</th>
                  <th className="text-left font-label text-[10.5px] uppercase tracking-[0.05em] px-4 py-2.5">Does</th>
                  <th className="text-left font-label text-[10.5px] uppercase tracking-[0.05em] px-4 py-2.5">Kind</th>
                </tr>
              </thead>
              <tbody>
                {AGENTS.map((a, i) => (
                  <tr key={a.name} className={i % 2 === 1 ? "bg-bg-2" : ""}>
                    <td className="px-4 py-3 align-top">
                      <div className="font-bold text-ink">{a.name}</div>
                      <div className="font-label text-[10.5px] text-ink-soft">{a.week} · {a.route}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-ink-soft">{a.does}</td>
                    <td className="px-4 py-3 align-top font-label text-[11px] text-ink-soft whitespace-nowrap">{a.kind}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink-soft italic mt-3">
            Chat Router is the only agent that calls into the others — it
            never generates content itself, it just decides which of the
            five above to send a visitor to, and why.
          </p>
        </section>

        {/* Testing summary */}
        <section className="mb-16">
          <h2 className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-4">
            Testing summary
          </h2>
          <p className="text-sm text-ink-soft mb-4 max-w-[68ch]">
            Every week shipped with its own software tests and at least one
            real human checking the live, deployed feature — documented in
            that week&apos;s own submission packet rather than repeated here.
            Two things are specific to Week 6:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="border border-line p-5">
              <div className="font-bold text-ink mb-1">Full-site regression test</div>
              <p className="text-xs text-ink-soft">
                Every route — /, /core, /research, /product, /pricing,
                /marketing, /chat, /dashboard, /demo, /docs, /about — was
                loaded fresh against the live deployment with zero
                interaction, confirming each one renders its real content
                immediately rather than an empty or broken state.
              </p>
            </div>
            <div className="border border-line p-5">
              <div className="font-bold text-ink mb-1">5 external users</div>
              <p className="text-xs text-ink-soft">
                5 people outside the course tried the live site end to end
                (not just one feature) and gave their own, separately
                recorded reactions — see the Test Evidence section of this
                week&apos;s submission packet.
              </p>
            </div>
          </div>
        </section>

        {/* Practical impact check */}
        <section className="mb-16">
          <h2 className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-4">
            Practical impact check
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="border border-line p-5">
              <div className="font-label text-[11px] uppercase tracking-[0.05em] text-ink-soft mb-2">
                Value it creates
              </div>
              <p className="text-sm text-ink-soft">
                A first-time founder with a packaging idea gets, in minutes
                and for free, a structured first pass on four decisions that
                otherwise take real time and often real money: what the
                unboxing experience could feel like, who they&apos;re really
                competing with, what a defensible price looks like, and how
                they&apos;d talk about it publicly. /chat removes the
                remaining friction of figuring out which of those to start
                with.
              </p>
            </div>
            <div className="border border-line p-5">
              <div className="font-label text-[11px] uppercase tracking-[0.05em] text-ink-soft mb-2">
                Harm considered and avoided
              </div>
              <p className="text-sm text-ink-soft">
                Every generated output is labeled &ldquo;Simulated AI
                Output&rdquo; so no visitor mistakes a template for real
                market research or financial advice. /chat&apos;s guardrail
                explicitly declines medical, legal, financial, and
                academic-integrity requests rather than improvising an
                answer. No real money ever moves — /pricing only models
                revenue. No visitor data is collected beyond what they
                voluntarily type into a form, and every table is documented
                openly in /docs.
              </p>
            </div>
          </div>
        </section>

        {/* Version 2 roadmap */}
        <section>
          <h2 className="font-label text-[11px] uppercase tracking-[0.06em] text-ink-soft mb-4">
            Version 2 roadmap
          </h2>
          <p className="text-sm text-ink-soft mb-4 max-w-[68ch]">
            What&apos;s deliberately not built yet, and why each was cut
            rather than forgotten:
          </p>
          <ul className="flex flex-col gap-3">
            {ROADMAP.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-ink-soft">
                <span className="text-accent font-bold shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
