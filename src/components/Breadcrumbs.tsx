import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { SITE_URL } from "@/content/site";

export type Crumb = { name: string; href: string };

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  const color = tone === "dark" ? "text-muted" : "text-ivory/70";
  return (
    <>
      <nav aria-label="Breadcrumb" className={`text-[0.78rem] ${color}`}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" aria-hidden="true" />}
              {i === all.length - 1 ? (
                <span aria-current="page" className={tone === "dark" ? "text-plum" : "text-ivory"}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="inline-flex min-h-6 items-center underline-offset-4 hover:underline">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE_URL}${c.href}` })),
        }}
      />
    </>
  );
}
