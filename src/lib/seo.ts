import type { Metadata } from "next";
import { SITE_URL, doctor } from "@/content/site";

export const SITE_NAME = `${doctor.name} — Obstetrician, Gynaecologist & Fetal Medicine Specialist`;

export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const url = `${SITE_URL}${path}`;
  const socialTitle = title.includes(doctor.name) ? title : `${title} | ${doctor.name}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: socialTitle,
      description,
      siteName: doctor.name,
      locale: "en_IN",
      images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [`${SITE_URL}/og.png`] },
  };
}
