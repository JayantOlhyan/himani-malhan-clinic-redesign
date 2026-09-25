import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FAQSection } from "@/components/FAQSection";
import { AppointmentCTA } from "@/components/AppointmentCTA";
import { generalFaqs } from "@/content/faqs";
import { doctor } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Patient Resources & FAQ",
  description: `Answers to common questions about pregnancy, fertility, PCOS and gynaecological check-ups, from the practice of ${doctor.name}, Gurugram.`,
  path: "/resources/",
});

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Resources", href: "/resources/" }]}
        eyebrow="Patient resources"
        title="Information for patients"
        lede={<p>Answers to common questions. Articles and patient guides will be added here as they are published.</p>}
      />
      <section aria-labelledby="tools-title" className="py-16 md:py-20">
        <div className="container-x">
          <h2 id="tools-title" className="eyebrow">
            Tools
          </h2>
          <Link
            href="/resources/due-date-calculator/"
            className="group mt-5 grid gap-4 border border-line bg-paper p-6 transition-colors hover:border-plum sm:grid-cols-[1fr_auto] sm:items-center sm:p-8"
          >
            <span>
              <span className="block font-serif text-[1.9rem] leading-tight text-plum">Due date calculator</span>
              <span className="mt-2 block max-w-2xl text-[0.95rem] text-muted">
                Estimated due date, weeks pregnant and a timeline of commonly recommended scans, with calendar export. Private, on your device.
              </span>
            </span>
            <ArrowRight className="h-6 w-6 text-plum transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </section>
      {/* Articles: add a data-driven list here once the practice publishes content. No placeholder articles are shown. */}
      <FAQSection faqs={generalFaqs} title="Frequently asked questions" />
      <AppointmentCTA />
    </>
  );
}
