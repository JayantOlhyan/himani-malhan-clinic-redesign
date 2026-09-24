import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImageSlot } from "./ImageSlot";
import { images } from "@/content/site";
import { allServices } from "@/content/services";

export function SpecialistFeature() {
  const hr = allServices.find((s) => s.slug === "high-risk-pregnancy")!;
  const d = hr.detail!;
  return (
    <section aria-labelledby="specialist-title" className="on-dark bg-plum text-ivory">
      <div className="grid lg:grid-cols-2">
        <div className="container-x py-20 md:py-28 lg:mr-0 lg:ml-auto lg:max-w-[44rem] lg:pr-16" data-reveal>
          <p className="eyebrow">Specialist focus · Fetal &amp; maternal medicine</p>
          <h2 id="specialist-title" className="display-2 mt-5 !text-ivory">
            Specialised care for <em className="text-rose italic">high-risk pregnancy</em>
          </h2>
          <p className="lede mt-7">{d.whatIs[0]}</p>
          <p className="mt-10 text-[0.7rem] font-semibold tracking-[0.16em] text-ivory/60 uppercase">Consultation is often recommended for</p>
          <ul className="mt-4 border-t border-ivory/15">
            {d.whoShouldConsult.slice(0, 4).map((w) => (
              <li key={w} className="border-b border-ivory/15 py-3.5 text-[0.95rem] text-ivory/85">
                {w}
              </li>
            ))}
          </ul>
          <Link href="/services/high-risk-pregnancy/" className="btn btn-light mt-10">
            Explore High-Risk Pregnancy Care <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="relative min-h-[26rem] lg:min-h-full" data-reveal="image">
          <ImageSlot
            src={images.highRisk.src}
            alt={images.highRisk.alt}
            label="Pregnancy scan / fetal medicine"
            tone="plum"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="absolute inset-0"
          />
        </div>
      </div>
    </section>
  );
}
