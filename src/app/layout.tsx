import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { SearchDialog } from "@/components/SearchDialog";
import { SITE_URL, doctor } from "@/content/site";
import { validateContent } from "@/content/validate";
import "./globals.css";

// Fail the build on malformed content (server-only; runs once at build time).
validateContent();

const cormorant = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-latin-wght-normal.woff2", style: "normal", weight: "400 600" },
    { path: "./fonts/cormorant-garamond-latin-wght-italic.woff2", style: "italic", weight: "400 600" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const manrope = localFont({
  src: "./fonts/manrope-latin-wght-normal.woff2",
  weight: "400 700",
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${doctor.name} | Obstetrician, Gynaecologist & Fetal Medicine Specialist, Gurugram`, template: `%s | ${doctor.name}` },
  description: `${doctor.name} is an obstetrician, gynaecologist and fetal & maternal medicine specialist in Gurugram with ${doctor.experienceLabel} of experience.`,
  applicationName: doctor.name,
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192" },
    ],
    apple: "/apple-icon.png",
  },
  appleWebApp: { title: doctor.shortName, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#f8f4f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="pb-[calc(3.9rem+env(safe-area-inset-bottom))] md:pb-0">
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <MobileActionBar />
        <SearchDialog />
      </body>
    </html>
  );
}
