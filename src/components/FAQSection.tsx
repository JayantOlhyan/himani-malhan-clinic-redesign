import Link from "next/link";
import { FAQAccordion } from "./FAQAccordion";
import type { FAQ } from "@/content/services";
import { contact, telHref } from "@/content/site";

export function FAQSection({ faqs, title = "Your questions, answered", id = "faq-title" }: { faqs: FAQ[]; title?: string; id?: string }) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-20 md:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4" data-reveal>
          <p className="eyebrow">Frequently asked questions</p>
          <h2 id={id} className="display-2 mt-5">
            {title}
          </h2>
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-muted">
            General information only. For advice about your own situation, please{" "}
            <Link href="/book/" className="text-plum underline underline-offset-4">
              book a consultation
            </Link>{" "}
            or call{" "}
            <a href={telHref} className="whitespace-nowrap text-plum underline underline-offset-4">
              {contact.phoneDisplay}
            </a>
            .
          </p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6" data-reveal>
          <FAQAccordion faqs={faqs} />
        </div>
      </div>
    </section>
  );
}
