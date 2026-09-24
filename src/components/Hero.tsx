import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { ImageSlot } from "./ImageSlot";
import { clinics, doctor, images } from "@/content/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="container-x grid items-end gap-12 pt-10 pb-14 md:pt-14 lg:grid-cols-12 lg:gap-10 lg:pt-12 lg:pb-16">
        <div className="lg:col-span-7 lg:pb-6">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-rose-ink/60" aria-hidden="true" />
            {doctor.name} · {doctor.city}
          </p>
          <h1 id="hero-title" className="display-1 mt-6 max-w-[17ch] !text-[clamp(2.6rem,1.5rem+4.2vw,5.4rem)]">
            Expert Women&rsquo;s Healthcare, <em className="font-normal text-rose-ink italic">From Pregnancy</em> to Every Stage of Life
          </h1>
          <p className="lede mt-7 max-w-[34rem]">
            {doctor.name} combines {doctor.experienceLabel} of experience in obstetrics, gynaecology, and fetal &amp; maternal medicine with
            personalised, evidence-based care.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/book/" className="btn btn-primary">
              Book a Consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/expertise/" className="btn btn-secondary">
              Explore Areas of Care
            </Link>
          </div>
          <p className="mt-9 flex items-start gap-2.5 text-[0.82rem] text-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-ink" aria-hidden="true" />
            <span>
              Consulting at{" "}
              {clinics.map((c, i) => (
                <span key={c.id}>
                  {i > 0 && " and "}
                  <Link href="/clinics/" className="text-plum underline decoration-line-strong underline-offset-4 hover:decoration-plum">
                    {c.shortName}
                  </Link>
                </span>
              ))}
            </span>
          </p>
        </div>

        <div className="relative md:mx-auto md:w-[70%] lg:col-span-5 lg:w-full">
          <div className="absolute -top-5 -right-5 hidden h-[82%] w-[70%] bg-rose-soft md:block lg:-top-8 lg:-right-8" aria-hidden="true" />
          <ImageSlot
            src={images.heroPortrait.src}
            alt={images.heroPortrait.alt}
            label="Dr. Kundoo, portrait"
            tone="ivory"
            priority
            position="center top"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="relative aspect-[4/5] w-full lg:aspect-[6/7]"
          />
          <div className="relative -mt-14 mr-10 ml-4 border border-line bg-paper px-6 py-5 shadow-[0_18px_40px_-24px_rgb(74_38_55/0.35)] sm:mr-auto sm:ml-8 sm:max-w-sm">
            <p className="font-serif text-[1.35rem] leading-tight text-plum">{doctor.name}</p>
            <p className="mt-1.5 text-[0.8rem] leading-snug text-muted">{doctor.roles.join(" · ")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
