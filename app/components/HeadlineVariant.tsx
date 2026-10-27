"use client";

import { useEffect, useState } from "react";
import { HEADLINE_COPY, Variant } from "@/lib/abTest";

/**
 * HeadlineVariant
 * ----------------
 * The real (not simulated) homepage A/B test. On mount, asks the server
 * which variant to show (GET /api/marketing/ab, which also logs a real
 * impression row to ab_events) and renders that headline/sub + wires the
 * primary CTA's click handler to log a real click for the same variant.
 *
 * Renders Variant A's copy by default while the request is in flight so
 * there's no layout flash/empty state on first paint.
 */
export default function HeadlineVariant() {
  const [variant, setVariant] = useState<Variant>("A");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/marketing/ab")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && (data.variant === "A" || data.variant === "B")) {
          setVariant(data.variant);
        }
      })
      .catch(() => {
        /* fall back to the default variant already rendered */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleCtaClick() {
    fetch("/api/marketing/ab/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variant }),
    }).catch(() => {
      /* non-blocking — the click still navigates even if logging fails */
    });
  }

  const copy = HEADLINE_COPY[variant];

  return (
    <>
      <h1 className="font-display uppercase leading-[0.86] text-[clamp(48px,9.5vw,132px)] tracking-tight text-balance">
        {variant === "A" ? (
          <>
            Design the
            <br />
            moment they
            <br />
            <span className="text-accent">open it.</span>
          </>
        ) : (
          <>
            Your box is
            <br />
            doing the
            <br />
            <span className="text-accent">talking.</span>
          </>
        )}
      </h1>

      <p className="font-tagline italic text-[clamp(18px,2.2vw,24px)] max-w-[26ch] mt-7 mb-6 leading-snug">
        {copy.sub}
      </p>

      <p className="text-[15.5px] text-ink-soft max-w-[46ch] leading-relaxed mb-9">
        UNBOX is an AI tool that helps e-commerce brands and subscription
        box creators design an intentional, memorable unboxing
        experience — from the box itself to the moment it&apos;s opened.
      </p>

      <div className="flex items-center gap-5 flex-wrap">
        <a
          href="/core"
          onClick={handleCtaClick}
          className="font-label font-bold text-[13.5px] bg-ink text-bg px-7 py-4 inline-flex items-center gap-2 hover:bg-accent transition-colors"
        >
          Try the Core Agent →
        </a>
        <span className="font-label text-[11.5px] text-ink-soft">
          free · takes about 40 seconds
        </span>
      </div>
    </>
  );
}
