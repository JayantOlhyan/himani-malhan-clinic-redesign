import { PageHero } from "@/components/PageHero";
import { contact, doctor, mailHref } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Privacy", description: `Privacy notice for the website of ${doctor.name}.`, path: "/privacy/" });

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Privacy", href: "/privacy/" }]} eyebrow="Legal" title="Privacy notice" />
      <section className="py-16 md:py-20">
        {/* Draft for client/legal review before launch. */}
        <div className="container-x max-w-3xl space-y-6 text-[1rem] leading-relaxed text-muted">
          <p>
            This website does not use advertising or analytics cookies, and does not store the information you enter in the appointment request form.
          </p>
          <p>
            When you send an appointment request, your details are passed directly to WhatsApp or your email application to send to the practice. From
            that point, the message is handled under the privacy terms of that service and kept only for arranging your consultation.
          </p>
          <p>Please do not share detailed medical information through this website. It is better discussed during your consultation.</p>
          <p>
            For any question about your information, contact{" "}
            <a href={mailHref} className="text-plum underline underline-offset-4">
              {contact.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
