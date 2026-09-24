import { ClinicCard } from "./ClinicCard";
import { SectionHeading } from "./SectionHeading";
import { clinics, contact, doctor, telHref } from "@/content/site";

export function ClinicLocations() {
  return (
    <section aria-labelledby="clinics-title" className="bg-ivory-deep py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          id="clinics-title"
          eyebrow="Clinic locations"
          title={
            <>
              Consultation clinics in <span className="italic">{doctor.city}</span>
            </>
          }
          aside={
            <p className="text-[0.95rem] leading-relaxed text-muted">
              Consultation days can vary. Please call{" "}
              <a href={telHref} className="whitespace-nowrap text-plum underline underline-offset-4">
                {contact.phoneDisplay}
              </a>{" "}
              to confirm before visiting.
            </p>
          }
        />
        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 lg:gap-8">
          {clinics.map((c) => (
            <ClinicCard key={c.id} clinic={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
