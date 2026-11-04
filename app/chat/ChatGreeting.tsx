// Static — renders unconditionally the moment /chat loads, so the page
// never shows a blank/loading state before any interaction. Same
// default-visible-content lesson applied to /marketing and /research after
// the real Week 4 grading feedback, adapted here: a chat page's "default
// content" is a real first message already on screen, not a populated
// example output.
export default function ChatGreeting() {
  return (
    <div className="flex gap-3 items-start">
      <div className="shrink-0 w-10 h-10 border border-line bg-bg-2 flex items-center justify-center font-label text-[12px] font-bold text-accent">
        U
      </div>
      <div className="border border-line bg-bg-2 px-4 py-3 max-w-[540px]">
        <p className="text-sm text-ink leading-relaxed">
          Hi — I&apos;m the UNBOX guide. Answer three quick questions and
          I&apos;ll point you to the right tool.
        </p>
        <p className="text-xs text-ink-soft mt-1.5">
          Simulated AI output — rule-based logic, not a live language model.
        </p>
      </div>
    </div>
  );
}
