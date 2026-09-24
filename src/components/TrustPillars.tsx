import { SectionHeading } from "./SectionHeading";
import { doctor } from "@/content/site";

export const pillars = [
  { title: `${doctor.experienceYears}+ Years`, text: "of clinical experience in obstetrics, gynaecology, and fetal & maternal medicine." },
  { title: "Advanced Training", text: `Training and clinical experience at ${doctor.institutions.map((i) => i.short).join(", ")}.` },
  { title: "Personalized Care", text: "Care plans shaped around each patient's history, circumstances and preferences." },
  { title: "Evidence-Based Medicine", text: "Recommendations grounded in current clinical evidence and practice guidelines." },
];

export function TrustPillar({ title, text, index }: { title: string; text: string; index: number }) {
  return (
    <li
      className="border-t border-line pt-6 lg:border-t-0 lg:border-l lg:px-8 lg:pt-0 lg:first:border-l-0 lg:first:pl-0"
      data-reveal
      style={{ ["--reveal-delay" as string]: `${index * 80}ms` }}
    >
      <span className="font-serif text-sm text-rose-ink italic" aria-hidden="true">
        {["i", "ii", "iii", "iv"][index]}.
      </span>
      <h3 className="mt-3 font-serif text-[1.75rem] leading-tight">{title}</h3>
      <p className="mt-3 text-[0.93rem] leading-relaxed text-muted">{text}</p>
    </li>
  );
}

export function TrustPillars() {
  return (
    <section aria-labelledby="why-title" className="py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          id="why-title"
          eyebrow={`Why ${doctor.shortName}`}
          title={
            <>
              Why patients choose <span className="italic">{doctor.shortName}</span>
            </>
          }
        />
        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {pillars.map((p, i) => (
            <TrustPillar key={p.title} {...p} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
