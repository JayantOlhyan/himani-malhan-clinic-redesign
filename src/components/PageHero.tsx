import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export function PageHero({
  crumbs,
  eyebrow,
  title,
  lede,
  aside,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="border-b border-line">
      <div className="container-x grid gap-10 pt-8 pb-14 md:pt-10 md:pb-20 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow mt-10 md:mt-14">{eyebrow}</p>
          <h1 className="display-1 mt-5 max-w-[16ch] !text-[clamp(2.5rem,1.6rem+3.6vw,5rem)]">{title}</h1>
          {lede && <div className="lede mt-7 max-w-2xl">{lede}</div>}
        </div>
        {aside && <div className="lg:col-span-4 lg:self-end">{aside}</div>}
      </div>
    </section>
  );
}
