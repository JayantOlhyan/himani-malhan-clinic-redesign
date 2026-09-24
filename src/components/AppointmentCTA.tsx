import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { contact, doctor, telHref } from "@/content/site";

export function AppointmentCTA({
  title = "Your health deserves thoughtful, expert care.",
  text = `Book a consultation with ${doctor.name}.`,
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="on-dark bg-plum text-ivory">
      <div className="container-x grid gap-10 py-20 md:py-24 lg:grid-cols-12 lg:items-end">
        <h2 id="cta-title" className="display-2 !text-ivory lg:col-span-7" data-reveal>
          {title}
        </h2>
        <div className="lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9" data-reveal>
          <p className="lede">{text}</p>
          <div className="mt-7 flex flex-col flex-wrap gap-3 sm:flex-row">
            <Link href="/book/" className="btn btn-light">
              Book Consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href={telHref} className="btn btn-ghost-light">
              <Phone className="h-4 w-4" aria-hidden="true" /> Call {contact.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
