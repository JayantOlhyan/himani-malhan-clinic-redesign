import { Plus } from "lucide-react";
import { JsonLd } from "./JsonLd";
import type { FAQ } from "@/content/services";

export function FAQAccordion({ faqs, schema = true }: { faqs: FAQ[]; schema?: boolean }) {
  return (
    <>
      <div className="border-t border-line">
        {faqs.map((f) => (
          <details key={f.q} className="faq group border-b border-line">
            <summary className="flex items-start justify-between gap-6 py-5 text-left transition-colors hover:text-plum md:py-6">
              <span className="font-serif text-[1.25rem] leading-snug text-plum md:text-[1.4rem]">{f.q}</span>
              <span
                className="faq-icon mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center border border-line-strong text-plum"
                aria-hidden="true"
              >
                <Plus className="h-3.5 w-3.5" />
              </span>
            </summary>
            <div className="faq-body">
              <div className="overflow-hidden">
                <p className="max-w-2xl pr-12 pb-6 text-[0.97rem] leading-relaxed text-muted">{f.a}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
      {schema && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }}
        />
      )}
    </>
  );
}
