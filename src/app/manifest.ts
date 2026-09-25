import type { MetadataRoute } from "next";
import { doctor } from "@/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${doctor.name} — Obstetrician & Gynaecologist`,
    short_name: doctor.shortName,
    description: `${doctor.roles.join(", ")} in ${doctor.city}.`,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8f4f0",
    theme_color: "#4a2637",
    lang: "en-IN",
    categories: ["health", "medical"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Book a consultation", url: "/book/" },
      { name: "Due date calculator", url: "/resources/due-date-calculator/" },
      { name: "Clinics & timings", url: "/clinics/" },
    ],
  };
}
