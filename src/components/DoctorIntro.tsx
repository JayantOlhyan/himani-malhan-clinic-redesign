import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImageSlot } from "./ImageSlot";
import { doctor, images, memberships } from "@/content/site";

const joinAnd = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

export const doctorBio = [
  `${doctor.name} is an obstetrician and gynaecologist with a specialist focus on fetal & maternal medicine, and more than ${doctor.experienceYears} years of clinical experience.`,
  `Training and clinical experience at ${joinAnd(doctor.institutions.map((i) => i.name))} underpin a practice built on personalised, evidence-based care — from pregnancy and fetal medicine to gynaecology and wellness at every stage of life.`,
];

export const credentials = [
  { term: "Experience", detail: `${doctor.experienceLabel} in obstetrics & gynaecology` },
  { term: "Specialisation", detail: "Obstetrics, gynaecology, and fetal & maternal medicine, including high-risk pregnancy" },
  { term: "Training & experience", detail: doctor.institutions.map((i) => i.name).join(" · ") },
  { term: "Memberships", detail: memberships.map((m) => m.acronym).join(" · ") },
];

export function DoctorIntro() {
  return (
    <section aria-labelledby="doctor-title" className="py-20 md:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="relative self-start lg:col-span-5" data-reveal="image">
          <div className="absolute -bottom-5 -left-5 hidden h-2/3 w-2/3 bg-sage-soft md:block" aria-hidden="true" />
          <ImageSlot
            src={images.doctorDesk.src}
            alt={images.doctorDesk.alt}
            label="Dr. Kundoo in consultation"
            tone="rose"
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="relative aspect-[4/5] w-full lg:aspect-[5/6]"
          />
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:self-center" data-reveal>
          <p className="eyebrow">About the doctor</p>
          <h2 id="doctor-title" className="display-2 mt-5">
            Meet <span className="italic">{doctor.name}</span>
          </h2>
          <p className="mt-4 text-[0.95rem] font-medium text-plum-soft">{doctor.roles.join(" · ")}</p>
          <div className="mt-7 space-y-4 text-[1.02rem] leading-relaxed text-muted">
            {doctorBio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="mt-10 border-t border-line">
            {credentials.map((c) => (
              <div key={c.term} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="text-[0.7rem] font-semibold tracking-[0.14em] text-rose-ink uppercase sm:pt-0.5">{c.term}</dt>
                <dd className="text-[0.95rem] text-charcoal">{c.detail}</dd>
              </div>
            ))}
          </dl>
          <Link href="/about/" className="link-arrow mt-9">
            About Dr. Kundoo <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
