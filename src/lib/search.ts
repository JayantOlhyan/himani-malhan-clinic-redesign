import { categories, categoryHref } from "@/content/services";
import { generalFaqs } from "@/content/faqs";
import { clinics, doctor } from "@/content/site";

export type SearchKind = "Service" | "Area of care" | "Question" | "Clinic" | "Page" | "Tool";
export type SearchItem = { title: string; href: string; kind: SearchKind; context?: string; keywords: string };

/** Everyday words patients type, mapped to the vocabulary used on the site. */
export const SYNONYMS: Record<string, string> = {
  pcod: "pcos",
  "c-section": "caesarean",
  csection: "caesarean",
  cesarean: "caesarean",
  ivf: "infertility fertility",
  conceive: "infertility fertility conception",
  pregnant: "pregnancy",
  scan: "ultrasound scans",
  sonography: "ultrasound scans",
  period: "periods menstrual",
  periods: "periods menstrual",
  abortion: "mtp termination",
  gynecology: "gynaecology",
  gynecologist: "gynaecology",
  gyno: "gynaecology",
  timing: "timings clinics",
  timings: "timings clinics",
  address: "clinics location",
  location: "clinics location",
  directions: "clinics location",
  phone: "contact call",
  appointment: "book consultation",
  fees: "book consultation",
  due: "due date calculator",
  edd: "due date calculator",
  cancer: "screening",
  vaccine: "vaccination hpv",
};

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const c of categories) {
    items.push({ title: c.name, href: categoryHref(c.slug), kind: "Area of care", context: c.eyebrow, keywords: `${c.description} ${c.navLabel}` });
    for (const s of c.services) {
      items.push({
        title: s.name,
        href: s.detail ? `/services/${s.slug}/` : `${categoryHref(c.slug)}#${s.slug}`,
        kind: "Service",
        context: c.name,
        keywords: [s.summary, s.detail?.intro, s.detail?.whoShouldConsult.join(" ")].filter(Boolean).join(" "),
      });
      for (const f of s.detail?.faqs ?? [])
        items.push({ title: f.q, href: `/services/${s.slug}/#faq-title`, kind: "Question", context: s.name, keywords: f.a });
    }
  }
  for (const f of generalFaqs)
    items.push({ title: f.q, href: "/resources/#faq-title", kind: "Question", context: "Patient resources", keywords: f.a });
  for (const c of clinics)
    items.push({
      title: c.name,
      href: "/clinics/",
      kind: "Clinic",
      context: c.locality,
      keywords: `${c.addressLines.join(" ")} ${c.timings.map((t) => `${t.label} ${t.time}`).join(" ")} timings directions`,
    });
  items.push(
    {
      title: "Due date calculator",
      href: "/resources/due-date-calculator/",
      kind: "Tool",
      keywords: "pregnancy due date edd weeks pregnant trimester scan timeline nt scan anomaly scan ivf conception calculator",
    },
    { title: "Book a consultation", href: "/book/", kind: "Page", keywords: "appointment whatsapp call booking" },
    { title: `About ${doctor.name}`, href: "/about/", kind: "Page", keywords: "doctor training experience memberships biography" },
    { title: "Clinics & contact", href: "/clinics/", kind: "Page", keywords: "phone email whatsapp address timings contact" },
    { title: "All areas of expertise", href: "/expertise/", kind: "Page", keywords: "services treatments" },
  );
  return items;
}

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ");

/** Token AND-match with prefix matching; title hits outrank body hits. Small index, so linear scan is fine. */
export function searchItems(items: SearchItem[], query: string, limit = 12): SearchItem[] {
  const tokens = normalise(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const expanded = tokens.map((t) => [t, ...(SYNONYMS[t]?.split(" ") ?? [])]);
  const scored: { item: SearchItem; score: number }[] = [];
  for (const item of items) {
    const title = normalise(item.title);
    const body = normalise(`${item.context ?? ""} ${item.keywords}`);
    const titleWords = title.split(/\s+/);
    const bodyWords = body.split(/\s+/);
    let score = 0;
    let all = true;
    for (const alts of expanded) {
      let best = 0;
      for (const t of alts) {
        if (titleWords.some((w) => w === t)) best = Math.max(best, 10);
        else if (titleWords.some((w) => w.startsWith(t))) best = Math.max(best, 7);
        else if (title.includes(t)) best = Math.max(best, 5);
        else if (bodyWords.some((w) => w.startsWith(t))) best = Math.max(best, 2);
      }
      if (!best) {
        all = false;
        break;
      }
      score += best;
    }
    if (!all) continue;
    if (item.kind === "Service" || item.kind === "Tool") score += 2;
    if (item.kind === "Question") score -= 1;
    scored.push({ item, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.item.title.length - b.item.title.length)
    .slice(0, limit)
    .map((s) => s.item);
}
