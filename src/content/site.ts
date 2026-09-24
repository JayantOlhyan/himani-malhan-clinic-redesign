/**
 * Single source of truth for practice facts.
 *
 * Everything in this file was supplied as verified in the redesign brief
 * (sourced from https://drhimanikundoogynae.com/). Do not add credentials,
 * statistics, awards or reviews here unless they have been verified with the client.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://drhimanikundoogynae.com").replace(/\/$/, "");

export const doctor = {
  name: "Dr. Himani Kundoo",
  shortName: "Dr. Kundoo",
  roles: ["Obstetrician & Gynaecologist", "Fetal & Maternal Medicine Specialist"],
  specialties: ["Obstetrics", "Gynaecology", "Fetal & Maternal Medicine"],
  experienceYears: 14,
  experienceLabel: "14+ years",
  city: "Gurugram",
  region: "Haryana",
  country: "IN",
  institutions: [
    { short: "MAMC", name: "Maulana Azad Medical College" },
    { short: "AIIMS", name: "AIIMS Delhi" },
    { short: "LHMC", name: "LHMC Delhi" },
    { short: "Artemis", name: "Artemis Hospital, Gurugram" },
  ],
} as const;

export const contact = {
  phoneDisplay: "+91 99029 05188",
  phoneE164: "+919902905188",
  // Assumption: the consultation number is also reachable on WhatsApp. Confirm with the client.
  whatsapp: "919902905188",
  email: "himanikundoo@gmail.com",
} as const;

export const telHref = `tel:${contact.phoneE164}`;
export const mailHref = `mailto:${contact.email}`;
export function whatsappHref(text?: string) {
  const base = `https://wa.me/${contact.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export type Clinic = {
  id: string;
  name: string;
  shortName: string;
  addressLines: string[];
  locality: string;
  postalCode?: string;
  timings: { label: string; time: string }[];
  /** Google Maps search link. Replace with the exact link from the source site when available. */
  mapsUrl: string;
  image: string;
};

const mapsSearch = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const clinics: Clinic[] = [
  {
    id: "miracles-apollo-cradle",
    name: "Miracles Apollo Cradle Hospital",
    shortName: "Miracles Apollo Cradle",
    addressLines: ["1, 2 & 3, Miracles, Apollo Cradle Hospital", "Delhi Rd, Sector 14", "Gurugram, Haryana 122007"],
    locality: "Sector 14, Gurugram",
    postalCode: "122007",
    timings: [
      { label: "Morning", time: "09:00 AM – 12:00 PM" },
      { label: "Evening", time: "05:00 PM – 08:00 PM" },
    ],
    mapsUrl: mapsSearch("Miracles Apollo Cradle Hospital, Delhi Road, Sector 14, Gurugram, Haryana 122007"),
    image: "/images/clinic-miracles.jpg",
  },
  {
    id: "medsarc-sector-39",
    name: "Medsarc Advanced Superspeciality Clinics",
    shortName: "Medsarc, Sector 39",
    addressLines: ["Sector 39", "Gurgaon, Haryana"],
    locality: "Sector 39, Gurgaon",
    timings: [{ label: "Afternoon", time: "12:00 PM – 02:00 PM" }],
    mapsUrl: mapsSearch("Medsarc Advanced Superspeciality Clinics, Sector 39, Gurgaon"),
    image: "/images/clinic-medsarc.jpg",
  },
];

export type Membership = { acronym: string; name: string; logo?: string };

export const memberships: Membership[] = [
  { acronym: "FOGSI", name: "Federation of Obstetric & Gynaecological Societies of India", logo: "/images/logo-fogsi.png" },
  // GOGS expansion is taken from the design mock-up, not the brief — verify with the client.
  { acronym: "GOGS", name: "Gurgaon Obstetric & Gynaecological Society", logo: "/images/logo-gogs.png" },
  { acronym: "SFM", name: "Society of Fetal Medicine", logo: "/images/logo-sfm.png" },
];

export const nav = [
  { label: "About", href: "/about/" },
  { label: "Expertise", href: "/expertise/" },
  { label: "Pregnancy Care", href: "/expertise/pregnancy-maternity/" },
  { label: "Women's Health", href: "/expertise/gynecological-health/" },
  { label: "Clinics", href: "/clinics/" },
  { label: "Resources", href: "/resources/" },
] as const;

/**
 * Testimonials: intentionally empty. Add only verified patient reviews
 * (with consent) — e.g. transcribed from the practice's Google Business profile.
 */
export type Testimonial = { quote: string; attribution: string; source: string };
export const testimonials: Testimonial[] = [];

/** Doctor & practice photography. Files are optional: a designed placeholder renders until the file exists in /public. */
export const images = {
  heroPortrait: { src: "/images/dr-himani-kundoo-portrait.jpg", alt: "Dr. Himani Kundoo, obstetrician and gynaecologist in Gurugram" },
  doctorDesk: { src: "/images/dr-himani-kundoo-consultation.jpg", alt: "Dr. Himani Kundoo in the consultation room" },
  highRisk: { src: "/images/high-risk-pregnancy.jpg", alt: "Pregnancy ultrasound assessment" },
  about: { src: "/images/dr-himani-kundoo-about.jpg", alt: "Dr. Himani Kundoo" },
} as const;
