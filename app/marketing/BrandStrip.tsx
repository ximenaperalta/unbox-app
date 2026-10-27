/**
 * BrandStrip
 * -----------
 * This week's feature set has two different "marketing" things living on
 * the same site, and it's easy to conflate them, so this strip states the
 * distinction once, plainly, at the top of /marketing:
 *
 *  - The homepage headline A/B test (lib/abTest.ts) is a REAL growth
 *    feature FOR UNBOX ITSELF — real visitors, real impression/click rows
 *    in ab_events, no simulation involved.
 *  - Everything below on this page is a SIMULATED marketing-kit generator
 *    FOR THE VISITOR'S OWN BUSINESS — same family as /core and /research,
 *    deterministic template output, clearly labeled.
 */
export default function BrandStrip() {
  return (
    <div className="border border-line bg-bg-2 px-5 py-4 mb-10 flex flex-col gap-2 text-sm text-ink-soft leading-relaxed">
      <p>
        <strong className="text-ink">Two different things on this page.</strong>{" "}
        UNBOX&apos;s own homepage headline is running a real A/B test right now
        — no simulation, see the results below. The kit generator further
        down is a <strong className="text-ink">simulated</strong> tool that
        builds marketing content for <em>your</em> product, the same way{" "}
        <code className="bg-bg px-1.5 py-0.5 border border-line text-ink">/core</code> and{" "}
        <code className="bg-bg px-1.5 py-0.5 border border-line text-ink">/research</code>{" "}
        simulate a brief and a research report.
      </p>
    </div>
  );
}
