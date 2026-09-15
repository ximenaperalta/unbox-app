import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/core", label: "Core" },
  { href: "/docs", label: "Docs" },
];

export default function Nav({ active }: { active: string }) {
  return (
    <nav className="relative z-10 flex items-center justify-between px-8 py-6 font-label text-[13px]">
      <Link href="/" className="flex items-baseline">
        <span className="font-display text-2xl tracking-tight">UN</span>
        <span className="font-body font-extrabold text-xl ml-[3px] text-accent">
          BOX
        </span>
      </Link>
      <div className="flex gap-7 text-ink-soft">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              link.href === active
                ? "text-accent"
                : "hover:text-accent transition-colors"
            }
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
