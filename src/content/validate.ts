import { z } from "zod";
import { categories } from "./services";
import { clinics, contact, doctor, memberships, nav, testimonials } from "./site";
import { generalFaqs } from "./faqs";

/**
 * Build-time content contract. Imported by the root layout (a server component), so a
 * malformed entry fails `next build` with a readable message instead of shipping a broken page.
 * zod never reaches the client bundle.
 */
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case");
const sentence = z
  .string()
  .trim()
  .min(12)
  .refine((s) => !/lorem ipsum/i.test(s), "placeholder text");
const faq = z.object({ q: z.string().trim().endsWith("?"), a: sentence });

const detail = z.object({
  review: z.enum(["pending", "approved"]),
  whatIsTitle: z.string().trim().endsWith("?"),
  topic: z.string().trim().min(3),
  schemaType: z.enum(["MedicalCondition", "MedicalProcedure", "MedicalTherapy"]),
  intro: sentence,
  whatIs: z.array(sentence).min(1),
  whoShouldConsult: z.array(z.string().trim().min(3)).min(2),
  indicationsTitle: z.string().optional(),
  care: z.array(z.object({ title: z.string().min(2), text: sentence })).min(2),
  faqs: z.array(faq).min(1),
});

const service = z.object({ slug, name: z.string().min(2), summary: sentence, detail: detail.optional() });

const category = z.object({
  slug,
  name: z.string().min(2),
  navLabel: z.string().min(2),
  eyebrow: z.string().min(2),
  description: sentence,
  image: z.object({ src: z.string().startsWith("/images/"), alt: z.string().min(2) }),
  services: z.array(service).min(1),
});

const clinic = z.object({
  id: slug,
  name: z.string().min(2),
  shortName: z.string().min(2),
  addressLines: z.array(z.string().min(2)).min(1),
  locality: z.string().min(2),
  postalCode: z
    .string()
    .regex(/^\d{6}$/)
    .optional(),
  timings: z.array(z.object({ label: z.string(), time: z.string().regex(/^\d{2}:\d{2} [AP]M – \d{2}:\d{2} [AP]M$/) })).min(1),
  mapsUrl: z.string().url().startsWith("https://www.google.com/maps/"),
  image: z.string().startsWith("/images/"),
});

export const contentSchema = z
  .object({
    categories: z.array(category).min(1),
    clinics: z.array(clinic).min(1),
    faqs: z.array(faq),
    memberships: z.array(z.object({ acronym: z.string().min(2), name: z.string().min(4), logo: z.string().optional() })),
    testimonials: z.array(z.object({ quote: sentence, attribution: z.string().min(2), source: z.string().min(2) })),
    nav: z.array(z.object({ label: z.string(), href: z.string().regex(/^\/([a-z0-9-]+\/)*$/, "internal hrefs need a trailing slash") })),
    contact: z.object({ phoneE164: z.string().regex(/^\+91\d{10}$/), whatsapp: z.string().regex(/^91\d{10}$/), email: z.string().email() }),
    experienceYears: z.number().int().positive(),
  })
  .superRefine((c, ctx) => {
    const dupes = (xs: string[]) => xs.filter((x, i) => xs.indexOf(x) !== i);
    const serviceSlugs = c.categories.flatMap((cat) => cat.services.map((s) => s.slug));
    for (const d of dupes(serviceSlugs)) ctx.addIssue({ code: "custom", message: `duplicate service slug "${d}"` });
    for (const d of dupes(c.categories.map((x) => x.slug))) ctx.addIssue({ code: "custom", message: `duplicate category slug "${d}"` });
    for (const d of dupes(c.clinics.map((x) => x.id))) ctx.addIssue({ code: "custom", message: `duplicate clinic id "${d}"` });
  });

export type ContentInput = z.input<typeof contentSchema>;

export function collectContent(): ContentInput {
  return {
    categories,
    clinics,
    faqs: generalFaqs,
    memberships,
    testimonials,
    nav: [...nav],
    contact,
    experienceYears: doctor.experienceYears,
  };
}

export function validateContent(input: unknown = collectContent()) {
  const result = contentSchema.safeParse(input);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
    throw new Error(`Content validation failed:\n${issues}`);
  }
  return result.data;
}
