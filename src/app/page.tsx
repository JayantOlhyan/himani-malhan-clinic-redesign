import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { DoctorIntro } from "@/components/DoctorIntro";
import { CareCategories } from "@/components/CareCategories";
import { SpecialistFeature } from "@/components/SpecialistFeature";
import { TrustPillars } from "@/components/TrustPillars";
import { PregnancyPlanner } from "@/components/PregnancyPlanner";
import { Memberships } from "@/components/Memberships";
import { ClinicLocations } from "@/components/ClinicLocations";
import { Testimonials } from "@/components/Testimonials";
import { FAQSection } from "@/components/FAQSection";
import { AppointmentCTA } from "@/components/AppointmentCTA";
import { JsonLd } from "@/components/JsonLd";
import { generalFaqs } from "@/content/faqs";
import { doctor } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { physicianSchema } from "@/lib/schema";

export const metadata = {
  ...pageMetadata({
    title: `${doctor.name} | Obstetrician, Gynaecologist & Fetal Medicine Specialist, Gurugram`,
    description: `${doctor.name} offers pregnancy care, high-risk pregnancy and fetal medicine, fertility and gynaecological care in Gurugram, with ${doctor.experienceLabel} of experience. Book a consultation.`,
    path: "/",
  }),
  title: { absolute: `${doctor.name} | Obstetrician, Gynaecologist & Fetal Medicine Specialist, Gurugram` },
};

export default function Home() {
  return (
    <>
      <JsonLd data={physicianSchema()} />
      <Hero />
      <TrustStrip />
      <DoctorIntro />
      <CareCategories />
      <SpecialistFeature />
      <PregnancyPlanner />
      <TrustPillars />
      <Memberships />
      <ClinicLocations />
      <Testimonials />
      <FAQSection faqs={generalFaqs.slice(0, 7)} />
      <AppointmentCTA />
    </>
  );
}
