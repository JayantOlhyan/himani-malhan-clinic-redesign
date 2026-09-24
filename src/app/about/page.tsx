import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ImageSlot } from "@/components/ImageSlot";
import { credentials, doctorBio } from "@/components/DoctorIntro";
import { TrustPillar, pillars } from "@/components/TrustPillars";
import { Memberships } from "@/components/Memberships";
import { AppointmentCTA } from "@/components/AppointmentCTA";
import { JsonLd } from "@/components/JsonLd";
import { doctor, images } from "@/content/site";
import { categories, categoryHref } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { physicianSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: `About ${doctor.name}`,
  description: `${doctor.name} is an obstetrician, gynaecologist and fetal & maternal medicine specialist in Gurugram, with training and clinical experience at MAMC, AIIMS, LHMC and Artemis Hospital.`,
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={physicianSchema()} />
      <PageHero
        crumbs={[{ name: "About", href: "/about/" }]}
        eyebrow="About the doctor"
        title={<>{doctor.name}</>}
        lede={
          <p>
            {doctor.roles.join(" · ")} — consulting in {doctor.city}.
          </p>
        }
      />

      <section className="py-20 md:py-28" aria-labelledby="bio-title">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28" data-reveal="image">
              <ImageSlot
                src={images.about.src}
                alt={images.about.alt}
                label="Dr. Kundoo, portrait"
                tone="rose"
                className="aspect-[4/5] w-full"
                sizes="(min-width: 1024px) 38vw, 100vw"
              />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 id="bio-title" className="display-3" data-reveal>
              A practice built on experience, training and individual care
            </h2>
            <div className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-muted" data-reveal>
              {doctorBio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <h2 className="eyebrow mt-14">Education, training & experience</h2>
            <ol className="mt-5 border-t border-line">
              {doctor.institutions.map((inst) => (
                <li key={inst.name} className="flex items-baseline justify-between gap-6 border-b border-line py-5" data-reveal>
                  <span className="font-serif text-[1.45rem] leading-tight text-plum">{inst.name}</span>
                  <span className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">{inst.short}</span>
                </li>
              ))}
            </ol>
            {/* Degrees and role-by-institution detail are intentionally not listed until verified with the client. */}

            <h2 className="eyebrow mt-14">At a glance</h2>
            <dl className="mt-5 border-t border-line">
              {credentials.map((c) => (
                <div key={c.term} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="text-[0.7rem] font-semibold tracking-[0.14em] text-rose-ink uppercase sm:pt-0.5">{c.term}</dt>
                  <dd className="text-[0.95rem]">{c.detail}</dd>
                </div>
              ))}
            </dl>

            <h2 className="eyebrow mt-14">Areas of care</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={categoryHref(c.slug)}
                    className="inline-flex items-center gap-2 border border-line-strong px-4 py-2.5 text-sm text-plum transition-colors hover:border-plum hover:bg-paper"
                  >
                    {c.name} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-20 md:py-24" aria-labelledby="approach-title">
        <div className="container-x">
          <p className="eyebrow">Approach</p>
          <h2 id="approach-title" className="display-2 mt-5">
            What patients can expect
          </h2>
          <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {pillars.map((p, i) => (
              <TrustPillar key={p.title} {...p} index={i} />
            ))}
          </ul>
        </div>
      </section>
      <Memberships />
      <AppointmentCTA />
    </>
  );
}
