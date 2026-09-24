import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FAQSection } from "@/components/FAQSection";
import { AppointmentCTA } from "@/components/AppointmentCTA";
import { ImageSlot } from "@/components/ImageSlot";
import { pillars } from "@/components/TrustPillars";
import { JsonLd } from "@/components/JsonLd";
import { categoryHref, detailedServices } from "@/content/services";
import { SITE_URL, contact, doctor, telHref } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

type Params = { slug: string };

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return detailedServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = detailedServices.find((x) => x.slug === slug);
  if (!s) return {};
  return pageMetadata({
    title: `${s.name} in Gurugram`,
    description: `${s.detail!.intro} ${doctor.name}, ${doctor.roles[0]}.`,
    path: `/services/${s.slug}/`,
  });
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = detailedServices.find((x) => x.slug === slug);
  if (!s || !s.detail) notFound();
  const d = s.detail;
  const related = s.category.services.filter((x) => x.slug !== s.slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: s.name,
          url: `${SITE_URL}/services/${s.slug}/`,
          about: { "@type": "MedicalCondition", name: s.name },
          audience: { "@type": "PeopleAudience", audienceType: "Patient" },
          author: { "@id": `${SITE_URL}/#physician` },
        }}
      />
      <PageHero
        crumbs={[
          { name: "Expertise", href: "/expertise/" },
          { name: s.category.name, href: categoryHref(s.category.slug) },
          { name: s.name, href: `/services/${s.slug}/` },
        ]}
        eyebrow={s.category.name}
        title={s.name}
        lede={<p>{d.intro}</p>}
        aside={
          <div className="border border-line bg-paper p-6 sm:p-7">
            <p className="font-serif text-[1.35rem] leading-snug text-plum">Consult {doctor.name}</p>
            <p className="mt-2 text-sm text-muted">{doctor.roles.join(" · ")}</p>
            <div className="mt-6 grid gap-3">
              <Link href="/book/" className="btn btn-primary">
                Book Consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href={telHref} className="btn btn-secondary">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {contact.phoneDisplay}
              </a>
            </div>
          </div>
        }
      />

      <section aria-labelledby="what-title" className="py-20 md:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <h2 id="what-title" className="display-3 hyphens-none lg:col-span-5" data-reveal>
            What is {s.name.toLowerCase().replace(/ treatment$| services$/, "")}?
          </h2>
          <div className="space-y-5 text-[1.05rem] leading-relaxed text-muted lg:col-span-6 lg:col-start-7" data-reveal>
            {d.whatIs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="who-title" className="bg-paper py-20 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal="image">
            <ImageSlot
              src={`/images/service-${s.slug}.jpg`}
              alt={s.name}
              label={s.name}
              tone="sage"
              className="aspect-[4/3] w-full lg:aspect-[4/5]"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7" data-reveal>
            <p className="eyebrow">{d.indicationsTitle ?? "Who may need consultation"}</p>
            <h2 id="who-title" className="display-3 mt-4">
              {d.indicationsTitle ? "Signs it is worth getting checked" : "Consultation may help if you have"}
            </h2>
            <ol className="mt-8 border-t border-line">
              {d.whoShouldConsult.map((w, i) => (
                <li key={w} className="flex gap-5 border-b border-line py-4 text-[0.98rem]">
                  <span className="w-6 shrink-0 font-serif text-rose-ink italic" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {w}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="care-title" className="py-20 md:py-24">
        <div className="container-x">
          <p className="eyebrow">Care &amp; treatment</p>
          <h2 id="care-title" className="display-3 mt-4 max-w-2xl">
            How care is approached
          </h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {d.care.map((c, i) => (
              <li key={c.title} className="border-t border-plum/60 pt-6 lg:mr-8" data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
                <span className="text-[0.7rem] font-semibold tracking-[0.16em] text-rose-ink uppercase">Step {i + 1}</span>
                <h3 className="mt-3 font-serif text-[1.55rem] leading-tight">{c.title}</h3>
                <p className="mt-3 text-[0.93rem] leading-relaxed text-muted">{c.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="why-title" className="on-dark bg-plum py-16 text-ivory md:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="eyebrow">Why {doctor.shortName}</p>
            <h2 id="why-title" className="display-3 mt-4 !text-ivory">
              Specialist care, explained clearly
            </h2>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {pillars.map((p) => (
              <li key={p.title} className="border-t border-ivory/20 pt-4">
                <p className="font-serif text-[1.35rem] text-ivory">{p.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ivory/70">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FAQSection faqs={d.faqs} title={`Questions about ${s.name.toLowerCase()}`} />

      {related.length > 0 && (
        <nav aria-labelledby="related-title" className="border-t border-line bg-paper py-16">
          <div className="container-x">
            <h2 id="related-title" className="eyebrow">
              More in {s.category.name}
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.slug}>
                  {r.detail ? (
                    <Link
                      href={`/services/${r.slug}/`}
                      className="inline-flex items-center gap-2 border border-line-strong px-4 py-2.5 text-sm text-plum hover:border-plum hover:bg-ivory"
                    >
                      {r.name} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  ) : (
                    <span className="inline-flex border border-line px-4 py-2.5 text-sm text-muted">{r.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
      <AppointmentCTA />
    </>
  );
}
