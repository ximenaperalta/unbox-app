"use client";

import { useState } from "react";
import {
  ChatAnswers,
  Recommendation,
  checkGuardrail,
  pickRecommendation,
} from "@/lib/chatAssistant";
import ChatGreeting from "./ChatGreeting";
import ChatIntake from "./ChatIntake";
import ChatCheckpoint from "./ChatCheckpoint";
import ChatGuardrailNotice from "./ChatGuardrailNotice";
import ChatResult from "./ChatResult";
import Nav from "../components/Nav";
import Grain from "../components/Grain";

type Step = "intake" | "checkpoint" | "guardrail" | "result";

export default function ChatPage() {
  const [step, setStep] = useState<Step>("intake");
  const [answers, setAnswers] = useState<ChatAnswers | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [introKey, setIntroKey] = useState(0);

  function reset() {
    setStep("intake");
    setAnswers(null);
    setRecommendation(null);
    setSessionId(null);
    setSubmitError(null);
    setIntroKey((k) => k + 1);
  }

  async function handleIntakeComplete(a: ChatAnswers) {
    setAnswers(a);

    const triggered = checkGuardrail(`${a.product} ${a.market}`);
    if (triggered) {
      // Log the blocked attempt for the record — no recommendation exists
      // to confirm, so this doesn't go through the human checkpoint.
      try {
        await fetch("/api/chat/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: a.product,
            market: a.market,
            helpNeeded: a.helpNeeded,
            guardrailTriggered: true,
            recommendedTool: null,
            reason: null,
          }),
        });
      } catch {
        // Logging the guardrail hit is best-effort — never block the
        // visitor from seeing the guardrail message because of it.
      }
      setStep("guardrail");
      return;
    }

    setRecommendation(pickRecommendation(a));
    setStep("checkpoint");
  }

  async function handleConfirm() {
    if (!answers || !recommendation) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/chat/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: answers.product,
          market: answers.market,
          helpNeeded: answers.helpNeeded,
          guardrailTriggered: false,
          recommendedTool: recommendation.tool,
          reason: recommendation.reason,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to save your session.");
      }
      const data = await res.json();
      setSessionId(data.id);
      setStep("result");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Grain />
      <Nav active="/chat" />

      <section className="relative z-[3] max-w-[760px] mx-auto px-8 pt-6 pb-16">
        <div className="flex items-center gap-2.5 font-label text-[12.5px] uppercase tracking-[0.1em] text-ink-soft mb-7">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Guided Assistant
        </div>

        <h1 className="font-display uppercase leading-[0.9] text-[clamp(36px,5.5vw,64px)] tracking-tight mb-4">
          Not sure where to start?
        </h1>
        <p className="text-[15.5px] text-ink-soft max-w-[54ch] mb-10 leading-relaxed">
          Answer three quick questions and I&apos;ll point you to the right
          UNBOX tool — no account, no guessing which page does what.
        </p>

        <div className="flex flex-col gap-6">
          <ChatGreeting />

          {step === "intake" && (
            <ChatIntake key={introKey} onComplete={handleIntakeComplete} />
          )}

          {step === "checkpoint" && answers && recommendation && (
            <ChatCheckpoint
              answers={answers}
              recommendation={recommendation}
              onConfirm={handleConfirm}
              onRedo={reset}
              isSubmitting={isSubmitting}
              error={submitError}
            />
          )}

          {step === "guardrail" && <ChatGuardrailNotice onRetry={reset} />}

          {step === "result" && recommendation && sessionId && (
            <ChatResult
              recommendation={recommendation}
              sessionId={sessionId}
              onRestart={reset}
            />
          )}
        </div>
      </section>

      <footer className="relative z-[3] border-t border-line px-8 py-8 text-center font-label text-[11px] text-ink-soft">
        UNBOX · Negocios Inteligentes y Comercio Digital · AI-101. Ximena
        Peralta
      </footer>
    </div>
  );
}
