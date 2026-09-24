import { PageHero } from "@/components/PageHero";
import { ClinicCard } from "@/components/ClinicCard";
import { AppointmentCTA } from "@/components/AppointmentCTA";
import { JsonLd } from "@/components/JsonLd";
import { clinics, contact, doctor, mailHref, telHref, whatsappHref } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { physicianSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "Clinics & Consultation Timings",
  description: `${doctor.name} consults at ${clinics.map((c) => `${c.name} (${c.locality})`).join(" and ")}. Timings, directions and booking.`,
  path: "/clinics/",
});

export default function ClinicsPage() {
  return (
    <>
      <JsonLd data={physicianSchema()} />
      <PageHero
        crumbs={[{ name: "Clinics", href: "/clinics/" }]}
        eyebrow="Clinics & contact"
        title={
          <>
            Consultation clinics in <span className="italic">Gurugram</span>
          </>
        }
        lede={<p>Two locations in Gurugram. Consultation days can vary — please call to confirm before visiting.</p>}
      />
      <section className="py-16 md:py-24" aria-label="Clinic locations">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:gap-8">
          {clinics.map((c) => (
            <ClinicCard key={c.id} clinic={c} headingLevel={2} />
          ))}
        </div>
      </section>
      <section aria-labelledby="contact-title" className="border-t border-line bg-paper py-16 md:py-20">
        <div className="container-x grid gap-10 md:grid-cols-12">
          <h2 id="contact-title" className="display-3 md:col-span-4">
            Contact
          </h2>
          <dl className="grid gap-8 sm:grid-cols-3 md:col-span-8">
            <div>
              <dt className="eyebrow">Phone</dt>
              <dd className="mt-3">
                <a href={telHref} className="font-serif text-[1.5rem] text-plum hover:underline">
                  {contact.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">WhatsApp</dt>
              <dd className="mt-3">
                <a href={whatsappHref()} target="_blank" rel="noopener" className="font-serif text-[1.5rem] text-plum hover:underline">
                  Message us
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-3">
                <a href={mailHref} className="font-serif text-[1.3rem] break-all text-plum hover:underline">
                  {contact.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <AppointmentCTA />
    </>
  );
}
