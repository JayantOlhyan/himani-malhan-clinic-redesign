import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";
import { AppointmentCTA } from "@/components/AppointmentCTA";
import { categories, categoryHref } from "@/content/services";
import { doctor } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Areas of Expertise",
  description: `Pregnancy and fetal medicine, fertility, gynaecological health and women's wellness — the full range of care offered by ${doctor.name} in Gurugram.`,
  path: "/expertise/",
});

export default function ExpertisePage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Expertise", href: "/expertise/" }]}
        eyebrow="Areas of expertise"
        title="Care for every stage of a woman's life"
        lede={<p>Specialist care across obstetrics, gynaecology, and fetal &amp; maternal medicine — organised into four areas.</p>}
        aside={
          <nav aria-label="Jump to area" className="border-t border-line">
            {categories.map((c, i) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="flex items-center justify-between border-b border-line py-3 text-sm text-plum hover:bg-paper"
              >
                <span>
                  <span className="mr-3 font-serif text-rose-ink italic">{String(i + 1).padStart(2, "0")}</span>
                  {c.name}
                </span>
                <span className="text-muted">{c.services.length}</span>
              </a>
            ))}
          </nav>
        }
      />
      {categories.map((c, i) => (
        <section key={c.slug} id={c.slug} aria-labelledby={`${c.slug}-title`} className={`py-16 md:py-24 ${i % 2 ? "bg-paper" : ""}`}>
          <div className="container-x grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4" data-reveal>
              <div className="lg:sticky lg:top-28">
                <p className="font-serif text-xl text-rose-ink italic">{String(i + 1).padStart(2, "0")}</p>
                <h2 id={`${c.slug}-title`} className="display-3 mt-3">
                  {c.name}
                </h2>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{c.description}</p>
                <Link href={categoryHref(c.slug)} className="link-arrow mt-6">
                  Explore {c.name} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <ul className="border-t border-line lg:col-span-7 lg:col-start-6">
              {c.services.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </ul>
          </div>
        </section>
      ))}
      <AppointmentCTA title="Not sure where your concern fits?" text="Book a consultation — your first visit is the right place to start." />
    </>
  );
}
