import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { ImageSlot } from "./ImageSlot";
import type { Clinic } from "@/content/site";

export function ClinicCard({ clinic, headingLevel = 3 }: { clinic: Clinic; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="@container flex flex-col border border-line bg-paper" aria-labelledby={`clinic-${clinic.id}`} data-reveal>
      <ImageSlot
        src={clinic.image}
        alt={`${clinic.name}, ${clinic.locality}`}
        label={clinic.shortName}
        tone="sage"
        className="aspect-[16/9] w-full"
        sizes="(min-width: 768px) 45vw, 100vw"
      />
      <div className="flex flex-1 flex-col p-6 @md:p-8 @2xl:p-10">
        <p className="eyebrow">{clinic.locality}</p>
        <H id={`clinic-${clinic.id}`} className="mt-3 font-serif text-[1.75rem] leading-tight @md:text-[2rem]">
          {clinic.name}
        </H>
        <address className="mt-4 text-[0.93rem] leading-relaxed text-muted not-italic">
          {clinic.addressLines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </address>
        <div className="mt-7 border-t border-line pt-5">
          <p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-plum uppercase">Consultation timings</p>
          <dl className="mt-3 space-y-2">
            {clinic.timings.map((t) => (
              <div key={t.label} className="flex items-center justify-between gap-4 text-[0.93rem]">
                <dt className="flex items-center gap-2 text-muted">
                  <Clock className="h-4 w-4 text-rose-ink" aria-hidden="true" />
                  {t.label}
                </dt>
                <dd className="font-medium text-charcoal tabular-nums">{t.time}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-auto flex flex-col gap-3 pt-8 @lg:flex-row">
          <a href={clinic.mapsUrl} target="_blank" rel="noopener" className="btn btn-secondary flex-1">
            Get Directions <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
          <Link href={`/book/?clinic=${clinic.id}`} className="btn btn-primary flex-1">
            Book Consultation
          </Link>
        </div>
      </div>
    </article>
  );
}
