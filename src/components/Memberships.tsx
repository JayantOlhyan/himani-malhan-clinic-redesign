import { publicFileExists } from "./ImageSlot";
import { memberships } from "@/content/site";

export function Memberships() {
  return (
    <section aria-labelledby="memberships-title" className="border-y border-line bg-paper">
      <div className="container-x grid gap-8 py-12 md:grid-cols-12 md:items-center md:py-14">
        <h2 id="memberships-title" className="eyebrow !font-sans md:col-span-3">
          Professional memberships
        </h2>
        <ul className="grid gap-8 sm:grid-cols-3 md:col-span-9">
          {memberships.map((m) => (
            <li key={m.acronym} className="flex items-start gap-4 sm:border-l sm:border-line sm:pl-6">
              {m.logo && publicFileExists(m.logo) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.logo} alt="" className="h-12 w-12 shrink-0 object-contain" loading="lazy" />
              )}
              <div>
                <p className="font-serif text-[1.9rem] leading-none tracking-[0.02em] text-plum">{m.acronym}</p>
                <p className="mt-2 text-[0.8rem] leading-snug text-muted">{m.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
