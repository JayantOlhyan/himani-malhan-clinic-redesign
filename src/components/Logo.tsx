import Link from "next/link";
import { doctor } from "@/content/site";

export function LotusMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 5.5C26 12.5 26 21.5 20 29.5C14 21.5 14 12.5 20 5.5Z" />
      <path d="M20 29.5C13 28 8.2 22.2 6.8 14.8C12.8 15.8 17.8 20.8 20 29.5Z" />
      <path d="M20 29.5C27 28 31.8 22.2 33.2 14.8C27.2 15.8 22.2 20.8 20 29.5Z" />
      <path d="M10.5 33.2C16.5 35.4 23.5 35.4 29.5 33.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const main = tone === "dark" ? "text-plum" : "text-ivory";
  const sub = tone === "dark" ? "text-muted" : "text-ivory/70";
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label={`${doctor.name} — home`}>
      <LotusMark className={`h-9 w-9 shrink-0 ${tone === "dark" ? "text-rose-ink" : "text-rose"}`} />
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-[1.35rem] font-semibold tracking-[-0.01em] whitespace-nowrap ${main}`}>{doctor.name}</span>
        <span className={`mt-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] whitespace-nowrap uppercase ${sub}`}>
          Obstetrician &amp; Gynaecologist
        </span>
      </span>
    </Link>
  );
}
