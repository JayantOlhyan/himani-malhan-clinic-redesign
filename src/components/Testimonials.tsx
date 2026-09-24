import { SectionHeading } from "./SectionHeading";
import { testimonials } from "@/content/site";

/**
 * Renders verified testimonials only. With none on file, shows a clearly-marked
 * placeholder so the section's design can be reviewed without inventing reviews.
 */
export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="py-20 md:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading stacked id="testimonials-title" eyebrow="Patient experiences" title="What patients say" />
        </div>
        <div className="lg:col-span-7" data-reveal>
          {testimonials.length > 0 ? (
            <ul className="space-y-10">
              {testimonials.map((t) => (
                <li key={t.quote} className="border-t border-line pt-8">
                  <blockquote className="font-serif text-[1.6rem] leading-snug text-plum italic">&ldquo;{t.quote}&rdquo;</blockquote>
                  <p className="mt-4 text-sm text-muted">
                    {t.attribution} · {t.source}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="relative border border-dashed border-line-strong bg-paper px-7 py-10 sm:px-12 sm:py-14">
              <span className="absolute -top-7 left-8 font-serif text-[5rem] leading-none text-rose" aria-hidden="true">
                &ldquo;
              </span>
              <p className="font-serif text-[1.6rem] leading-snug text-plum italic sm:text-[2rem]">
                Verified patient experiences will be published here.
              </p>
              <p className="mt-5 max-w-lg text-[0.93rem] leading-relaxed text-muted">
                Reserved for reviews shared with consent — for example, from the practice&rsquo;s Google Business profile. No reviews are shown until
                they are verified.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
