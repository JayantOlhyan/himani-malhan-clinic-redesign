import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/content/services";

/** A service row. Links to a dedicated page only when one exists. */
export function ServiceCard({ service }: { service: Service }) {
  const inner = (
    <>
      <div>
        <h3 className="font-serif text-[1.45rem] leading-tight text-plum">{service.name}</h3>
        <p className="mt-2 max-w-xl text-[0.93rem] leading-relaxed text-muted">{service.summary}</p>
      </div>
      {service.detail ? (
        <ArrowRight className="mt-1.5 h-5 w-5 shrink-0 text-plum transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
      ) : null}
    </>
  );
  return (
    <li className="border-b border-line">
      {service.detail ? (
        <Link
          href={`/services/${service.slug}/`}
          className="group flex items-start justify-between gap-6 py-6 transition-colors hover:bg-paper md:px-4"
        >
          {inner}
        </Link>
      ) : (
        <div className="flex items-start justify-between gap-6 py-6 md:px-4">{inner}</div>
      )}
    </li>
  );
}
