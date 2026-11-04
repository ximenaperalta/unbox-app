"use client";

interface ChatGuardrailNoticeProps {
  onRetry: () => void;
}

// Shown INSTEAD OF ChatCheckpoint/ChatResult when checkGuardrail() flags
// the product/market text — never alongside a recommendation. The only
// write that happens here is the guardrail_triggered=true row the parent
// saves for the record; no recommendation, no tool link.
export default function ChatGuardrailNotice({ onRetry }: ChatGuardrailNoticeProps) {
  return (
    <div className="border border-[#A8432C] bg-[#f1dfd6] p-5 flex flex-col gap-4">
      <div className="font-label text-[11px] uppercase tracking-[0.06em] text-[#A8432C]">
        Outside what I can help with
      </div>
      <p className="text-sm text-ink leading-relaxed">
        I&apos;m built specifically to help with UNBOX&apos;s packaging and
        unboxing tools. Try rephrasing your product, or go straight to{" "}
        <span className="font-bold">/core</span>,{" "}
        <span className="font-bold">/research</span>,{" "}
        <span className="font-bold">/pricing</span>, or{" "}
        <span className="font-bold">/marketing</span> directly.
      </p>
      <button
        onClick={onRetry}
        className="font-label font-bold text-[13px] self-start bg-ink text-bg px-5 py-2.5 hover:bg-accent transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
