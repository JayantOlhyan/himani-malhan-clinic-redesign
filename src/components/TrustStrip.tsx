import { doctor, memberships } from "@/content/site";

const items = [
  { label: "Experience", value: `${doctor.experienceLabel}` },
  { label: "Specialisation", value: "Fetal & Maternal Medicine" },
  { label: "Advanced training", value: "MAMC · AIIMS · LHMC" },
  { label: "Consulting in", value: doctor.city },
  { label: "Memberships", value: memberships.map((m) => m.acronym).join(" · ") },
];

export function TrustStrip() {
  return (
    <section aria-label="At a glance" className="border-y border-line bg-paper">
      <dl className="container-x grid grid-cols-2 md:grid-cols-5">
        {items.map((it, i) => (
          <div
            key={it.label}
            className={`flex flex-col gap-1.5 border-line py-6 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0 ${
              i % 2 === 1 ? "border-l pl-5 md:pl-6" : ""
            } ${i >= 2 ? "border-t md:border-t-0" : ""} ${i === items.length - 1 ? "col-span-2 md:col-span-1" : ""}`}
          >
            <dt className="text-[0.6875rem] font-semibold tracking-[0.16em] text-muted uppercase">{it.label}</dt>
            <dd className="font-serif text-[1.3rem] leading-tight text-plum md:text-[1.4rem]">{it.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
