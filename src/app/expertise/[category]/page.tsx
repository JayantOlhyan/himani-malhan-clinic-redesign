import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";
import { ImageSlot } from "@/components/ImageSlot";
import { AppointmentCTA } from "@/components/AppointmentCTA";
import { categories, categoryHref } from "@/content/services";
import { doctor } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

type Params = { category: string };

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const c = categories.find((x) => x.slug === category);
  if (!c) return {};
  return pageMetadata({ title: `${c.name} in Gurugram`, description: `${c.description} With ${doctor.name}.`, path: categoryHref(c.slug) });
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const c = categories.find((x) => x.slug === category);
  if (!c) notFound();
  const others = categories.filter((x) => x.slug !== c.slug);
  return (
    <>
      <PageHero
        crumbs={[
          { name: "Expertise", href: "/expertise/" },
          { name: c.name, href: categoryHref(c.slug) },
        ]}
        eyebrow={c.eyebrow}
        title={c.name}
        lede={<p>{c.description}</p>}
      />
      <section className="py-16 md:py-24" aria-labelledby="services-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28" data-reveal="image">
              <ImageSlot
                src={c.image.src}
                alt={c.image.alt}
                label={c.name}
                tone="rose"
                className="aspect-[4/5] w-full"
                sizes="(min-width: 1024px) 30vw, 100vw"
              />
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <h2 id="services-title" className="eyebrow">
              Services · {c.services.length}
            </h2>
            <ul className="mt-5 border-t border-line">
              {c.services.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">Services without a dedicated page can be discussed at consultation.</p>
          </div>
        </div>
      </section>
      <nav aria-label="Other areas of care" className="border-t border-line bg-paper">
        <ul className="container-x grid md:grid-cols-3">
          {others.map((o) => (
            <li key={o.slug} className="border-b border-line md:border-b-0 md:border-l md:first:border-l-0">
              <Link href={categoryHref(o.slug)} className="block py-8 transition-colors hover:text-plum md:px-8 md:first:pl-0">
                <span className="text-[0.6875rem] font-semibold tracking-[0.16em] text-muted uppercase">{o.eyebrow}</span>
                <span className="mt-2 block font-serif text-[1.7rem] text-plum">{o.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <AppointmentCTA />
    </>
  );
}
