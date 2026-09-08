import Link from "next/link";

export default function Docs() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <span className="text-xl font-bold tracking-tight">UNBOX</span>
        <div className="flex gap-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">Home</Link>
          <Link href="/about" className="hover:text-black">About</Link>
          <Link href="/core" className="hover:text-black">Core</Link>
          <Link href="/docs" className="hover:text-black">Docs</Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-8 py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Docs</h1>
        <p className="text-gray-500 text-lg mb-16 text-center">
          Prompt library and build notes for each week&apos;s feature.
        </p>

        <article className="border border-gray-200 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">
              Week 1 — Generative Core Agent (/core)
            </h2>
            <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
              Simulated
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            The <code className="bg-gray-100 px-1.5 py-0.5 rounded">/core</code> page turns a
            product + customer + brand voice + budget into a structured unboxing brief.
            This week that generation is a deterministic template function,{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">generateCoreBrief()</code> in{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">lib/generateCoreBrief.ts</code>,
            not a call to a paid AI API — per course rules on free tools, until an
            instructor-approved API budget exists. The output shape below is exactly
            what a real Anthropic call would be asked to return, so swapping one in later
            is a one-file change.
          </p>

          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-2">
            Inputs
          </h3>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto mb-6">
{`{
  product: string,     // required
  customer: string,    // required
  brandVoice: string,  // required
  budget?: string       // optional
}`}
          </pre>

          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-2">
            Template logic (what a real prompt would ask for)
          </h3>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto mb-6 whitespace-pre-wrap">
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

          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-2">
            Current (simulated) implementation
          </h3>
          <p className="text-sm text-gray-500">
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">generateCoreBrief()</code>{" "}
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
      </section>
    </div>
  );
}
