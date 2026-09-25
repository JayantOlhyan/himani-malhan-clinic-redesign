import { PageHero } from "@/components/PageHero";
import { PregnancyCalculator } from "@/components/PregnancyCalculator";
import { FAQSection } from "@/components/FAQSection";
import { AppointmentCTA } from "@/components/AppointmentCTA";
import { JsonLd } from "@/components/JsonLd";
import { MILESTONES } from "@/lib/pregnancy";
import { SITE_URL, doctor } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pregnancy Due Date Calculator & Scan Timeline",
  description:
    "Estimate your due date from your last period, conception or IVF transfer date, see how many weeks pregnant you are, and when commonly recommended pregnancy scans fall.",
  path: "/resources/due-date-calculator/",
});

const faqs = [
  {
    q: "How is the due date calculated?",
    a: "From the first day of your last period, the due date is 280 days later, adjusted if your cycle is longer or shorter than 28 days. From a known conception date it is 266 days later. After IVF it is 261 days after a day-5 transfer or 263 days after a day-3 transfer. These are the methods described in ACOG Committee Opinion 700.",
  },
  {
    q: "Can my due date change?",
    a: "Yes. An early ultrasound measurement is more accurate than dating from the last period, so your doctor may adjust the due date after a dating scan.",
  },
  {
    q: "Are these scan dates fixed?",
    a: "No. The windows reflect commonly recommended timings, such as the 11–14-week scan and the 18–22-week anomaly scan in ISUOG guidance. Your doctor will advise the scans and tests that are right for your pregnancy.",
  },
  {
    q: "Is my information stored?",
    a: "No. The calculation runs in your browser. Nothing you enter is sent to the practice or stored.",
  },
];

export default function DueDateCalculatorPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Pregnancy due date calculator",
          url: `${SITE_URL}/resources/due-date-calculator/`,
          applicationCategory: "HealthApplication",
          operatingSystem: "Any",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          provider: { "@id": `${SITE_URL}/#physician` },
        }}
      />
      <PageHero
        crumbs={[
          { name: "Resources", href: "/resources/" },
          { name: "Due date calculator", href: "/resources/due-date-calculator/" },
        ]}
        eyebrow="Pregnancy planner"
        title="Due date calculator"
        lede={
          <p>
            Your estimated due date, how far along you are, and when commonly recommended scans and tests fall — calculated privately on your device.
          </p>
        }
      />
      <section className="py-14 md:py-20" aria-label="Calculator">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <PregnancyCalculator />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9" aria-labelledby="windows-title">
            <h2 id="windows-title" className="eyebrow">
              Windows used
            </h2>
            <dl className="mt-5 border-t border-line">
              {MILESTONES.map((m) => (
                <div key={m.id} className="flex items-baseline justify-between gap-4 border-b border-line py-3 text-sm">
                  <dt className="text-charcoal">{m.title}</dt>
                  <dd className="shrink-0 text-muted tabular-nums">
                    {Math.floor(m.from / 7)}–{Math.floor(m.to / 7)}
                    {m.to % 7 ? `+${m.to % 7}` : ""} wk
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-muted">
              Sources: ACOG Committee Opinion 700, <em>Methods for Estimating the Due Date</em> (2017); ISUOG Practice Guidelines for the 11–14-week
              and mid-trimester scans. Clinical content to be reviewed by {doctor.name}.
            </p>
          </aside>
        </div>
      </section>
      <FAQSection faqs={faqs} title="About the calculator" />
      <AppointmentCTA title="Planning or expecting a pregnancy?" text={`Book an antenatal consultation with ${doctor.name}.`} />
    </>
  );
}
