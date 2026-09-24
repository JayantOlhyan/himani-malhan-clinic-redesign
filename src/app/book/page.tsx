import { Suspense } from "react";
import { Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { BookingForm } from "@/components/BookingForm";
import { clinics, contact, doctor, telHref } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Book a Consultation",
  description: `Request a consultation with ${doctor.name} at ${clinics.map((c) => c.shortName).join(" or ")}, Gurugram. Call ${contact.phoneDisplay}.`,
  path: "/book/",
});

export default function BookPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Book a consultation", href: "/book/" }]}
        eyebrow="Appointments"
        title="Book a consultation"
        lede={<p>Send a request and the practice will confirm your appointment. For anything urgent, please call.</p>}
      />
      <section className="py-16 md:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Suspense fallback={null}>
              <BookingForm />
            </Suspense>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9" aria-label="Call instead">
            <div className="border border-line bg-paper p-7">
              <p className="eyebrow">Prefer to call?</p>
              <a href={telHref} className="mt-4 flex items-center gap-3 font-serif text-[1.9rem] leading-none text-plum hover:underline">
                <Phone className="h-5 w-5" aria-hidden="true" /> {contact.phoneDisplay}
              </a>
              <div className="mt-8 space-y-6 border-t border-line pt-6">
                {clinics.map((c) => (
                  <div key={c.id}>
                    <p className="font-serif text-[1.2rem] leading-tight text-plum">{c.name}</p>
                    <p className="mt-1 text-sm text-muted">{c.locality}</p>
                    <ul className="mt-2 space-y-0.5 text-sm tabular-nums">
                      {c.timings.map((t) => (
                        <li key={t.label}>
                          <span className="text-muted">{t.label}:</span> {t.time}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-muted">
                In a medical emergency, go to the nearest hospital emergency department.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
