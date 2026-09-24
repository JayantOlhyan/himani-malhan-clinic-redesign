import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { categories, categoryHref, type CareCategory as Cat } from "@/content/services";

export function CareCategory({ category, index }: { category: Cat; index: number }) {
  const shown = category.services.slice(0, 4);
  const more = category.services.length - shown.length;
  return (
    <li className="group relative border-t border-line transition-colors duration-500 hover:bg-paper" data-reveal>
      <div className="grid gap-4 py-8 md:grid-cols-12 md:gap-6 md:py-10 md:pr-4">
        <span className="font-serif text-lg text-rose-ink italic md:col-span-1 md:pl-4 md:text-xl" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="md:col-span-4">
          <p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-muted uppercase">{category.eyebrow}</p>
          <h3 className="mt-2 font-serif text-[1.9rem] leading-[1.05] md:text-[2.3rem]">
            <Link
              href={categoryHref(category.slug)}
              className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-plum"
            >
              {category.name}
            </Link>
          </h3>
        </div>
        <p className="text-[0.95rem] leading-relaxed text-muted md:col-span-4">{category.description}</p>
        <div className="flex items-start justify-between gap-6 md:col-span-3">
          <ul className="space-y-1.5 text-[0.85rem] text-charcoal/85">
            {shown.map((s) => (
              <li key={s.slug}>{s.name}</li>
            ))}
            {more > 0 && <li className="text-rose-ink">+ {more} more</li>}
          </ul>
          <ArrowUpRight
            className="h-6 w-6 shrink-0 text-plum transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </li>
  );
}

export function CareCategories() {
  return (
    <section aria-labelledby="care-title" className="pb-20 md:pb-28">
      <div className="container-x">
        <SectionHeading
          id="care-title"
          eyebrow="Areas of care"
          title="How can we help you?"
          aside={
            <p className="lede !text-base">
              From pregnancy and fertility to gynaecological health and menopause — specialist care for every stage of a woman&rsquo;s life.
            </p>
          }
        />
        <ul className="mt-12 border-b border-line md:mt-16">
          {categories.map((c, i) => (
            <CareCategory key={c.slug} category={c} index={i} />
          ))}
        </ul>
        <div className="mt-8 flex justify-end">
          <Link href="/expertise/" className="link-arrow">
            View all areas of expertise
          </Link>
        </div>
      </div>
    </section>
  );
}
