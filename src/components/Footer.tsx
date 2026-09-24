import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { clinics, contact, doctor, mailHref, nav, telHref } from "@/content/site";
import { categories, categoryHref } from "@/content/services";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-plum-deep text-ivory/80">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-ivory/65">
            {doctor.roles.join(" · ")}. Consulting in {doctor.city}.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 md:col-span-4">
          <div>
            <h2 className="eyebrow">Practice</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link className="hover:text-ivory" href={n.href}>
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="hover:text-ivory" href="/book/">
                  Book Consultation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow">Areas of care</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link className="hover:text-ivory" href={categoryHref(c.slug)}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-4">
          <h2 className="eyebrow">Contact</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href={telHref} className="inline-flex items-center gap-3 hover:text-ivory">
                <Phone className="h-4 w-4 text-rose" aria-hidden="true" />
                {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={mailHref} className="inline-flex items-center gap-3 break-all hover:text-ivory">
                <Mail className="h-4 w-4 shrink-0 text-rose" aria-hidden="true" />
                {contact.email}
              </a>
            </li>
          </ul>
          <ul className="mt-6 space-y-4 text-sm">
            {clinics.map((c) => (
              <li key={c.id} className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden="true" />
                <span>
                  <a href={c.mapsUrl} target="_blank" rel="noopener" className="text-ivory hover:underline">
                    {c.name}
                  </a>
                  <span className="block text-ivory/60">{c.locality}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {doctor.name}. All rights reserved.
          </p>
          <p className="max-w-xl sm:text-right">
            Information on this website is general and is not a substitute for a medical consultation.{" "}
            <Link href="/privacy/" className="underline underline-offset-4 hover:text-ivory">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
