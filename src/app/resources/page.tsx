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
      {/* Articles: add a data-driven list here once the practice publishes content. No placeholder articles are shown. */}
      <FAQSection faqs={generalFaqs} title="Frequently asked questions" />
      <AppointmentCTA />
    </>
  );
}
