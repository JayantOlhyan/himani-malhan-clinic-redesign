import { SITE_URL, clinics, contact, doctor, memberships } from "@/content/site";
import { allServices } from "@/content/services";

/**
 * Physician + clinic structured data. Opening hours are deliberately omitted:
 * the source lists times but not days, and schema.org hours require days.
 */
export function physicianSchema() {
  const clinicNodes = clinics.map((c) => ({
    "@type": "MedicalClinic",
    "@id": `${SITE_URL}/clinics/#${c.id}`,
    name: c.name,
    telephone: contact.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: c.addressLines.slice(0, -1).join(", "),
      addressLocality: "Gurugram",
      addressRegion: doctor.region,
      ...(c.postalCode ? { postalCode: c.postalCode } : {}),
      addressCountry: doctor.country,
    },
    hasMap: c.mapsUrl,
  }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Physician",
        "@id": `${SITE_URL}/#physician`,
        name: doctor.name,
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/og.png`,
        description: `${doctor.roles.join(", ")} in ${doctor.city} with ${doctor.experienceLabel} of experience.`,
        telephone: contact.phoneE164,
        email: contact.email,
        medicalSpecialty: ["Obstetric", "Gynecologic"],
        areaServed: { "@type": "City", name: "Gurugram" },
        address: { "@type": "PostalAddress", addressLocality: "Gurugram", addressRegion: doctor.region, addressCountry: doctor.country },
        memberOf: memberships.map((m) => ({ "@type": "MedicalOrganization", name: m.name, alternateName: m.acronym })),
        location: clinicNodes.map((c) => ({ "@id": c["@id"] })),
        availableService: allServices.map((s) => ({ "@type": "MedicalProcedure", name: s.name })),
      },
      ...clinicNodes,
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: doctor.name, inLanguage: "en-IN" },
    ],
  };
}
