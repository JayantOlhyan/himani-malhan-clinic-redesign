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
    <section aria-label="At a glance" className="@container border-y border-line bg-paper">
      <dl className="container-x grid grid-cols-2 @4xl:grid-cols-5">
        {items.map((it, i) => (
          <div
            key={it.label}
            className={`flex flex-col gap-1.5 border-line py-6 @4xl:border-l @4xl:px-5 @4xl:first:border-l-0 @4xl:first:pl-0 @5xl:px-6 ${
              i % 2 === 1 ? "border-l pl-5" : ""
            } ${i >= 2 ? "border-t @4xl:border-t-0" : ""} ${i === items.length - 1 ? "col-span-2 @4xl:col-span-1" : ""}`}
          >
            <dt className="text-[0.6875rem] font-semibold tracking-[0.16em] text-muted uppercase">{it.label}</dt>
            <dd className="font-serif text-[1.3rem] leading-tight text-plum @5xl:text-[1.4rem]">{it.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
