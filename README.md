# Dr. Himani Kundoo — website redesign

Editorial, privacy-first website for Dr. Himani Kundoo, Obstetrician & Gynaecologist, Fetal & Maternal Medicine Specialist, Gurugram.

**Before showing this to the client, read [`CONTENT_STATUS.md`](./CONTENT_STATUS.md).** It lists what is verified, what is drafted and what still needs confirmation.

## Stack

Next.js 16 (App Router, **static export**) · React 19 · TypeScript (strict) · Tailwind CSS v4 (container queries) · zod (build-time only) ·
sharp (image pipeline) · Vitest · Playwright + axe-core. Self-hosted, subset Cormorant Garamond + Manrope. No backend, no cookies, no tracking.

```bash
npm install
npm run dev        # http://localhost:3000 (runs the image pipeline first)
npm run build      # static site → out/  (image pipeline + content validation)
npm start          # serve out/
npm run check      # everything CI runs: lint, unit tests, build, e2e, QA sweep
```

| Script | What it does |
| --- | --- |
| `npm run lint` | `tsc --noEmit` + Prettier check |
| `npm test` | Vitest: content contract, search ranking, pregnancy-dating maths |
| `npm run e2e` | Playwright: mobile menu focus, ⌘K search, booking, due-date calculator + .ics, section nav, CSP (with production headers) |
| `npm run qa` | Crawls every page at 11 viewports (320 → 2560, including landscape): overflow, axe WCAG 2.2 AA, 24px targets, tiny text, console errors, broken links, Lorem ipsum. Exits 1 on any problem |
| `scripts/lighthouse.sh [paths]` | Lighthouse mobile + desktop against the build |
| `npm run images` | Photos in `assets/photos/` → AVIF/WebP srcsets + blur previews |
| `npm run headers` | Regenerate `public/_headers` + `vercel.json` from `scripts/headers.mjs` |
| `npm run icons` / `node scripts/og.mjs` | Regenerate app icons / Open Graph image |
| `npm run import:source` | Pull the live site's text + images into `content-source/` (needs normal network) |

Set `NEXT_PUBLIC_SITE_URL` for canonical URLs, sitemap and OG tags (defaults to `https://drhimanikundoogynae.com`).

## Architecture

```
src/content/        ← all practice facts and copy (typed)
  site.ts             doctor, contact, clinics, memberships, nav, testimonials, image slots
  services.ts         4 care categories → 28 services; a `detail` block publishes /services/<slug>/
  faqs.ts             general FAQ
  validate.ts         zod contract, run by the root layout — bad content fails the build
src/lib/
  pregnancy.ts        pure due-date / gestational-age / scan-window maths + .ics export (ACOG CO 700, ISUOG)
  search.ts           search index builder + ranking (with patient-vocabulary synonyms)
  seo.ts, schema.ts   metadata + JSON-LD
src/components/     server components by default; client islands only where needed:
                    Navbar, SearchDialog, BookingForm, PregnancyCalculator, SectionNav
src/app/            routes, sitemap.ts, robots.ts, manifest.ts, search-index.json (static)
scripts/            qa, e2e, lighthouse, images, headers, icons, og, subset-fonts, import-source
tests/              Vitest unit tests
```

Routes: `/` · `/about/` · `/expertise/` · `/expertise/[category]/` (4) · `/services/[slug]/` (8 with content) · `/clinics/` ·
`/resources/` · `/resources/due-date-calculator/` · `/book/` · `/privacy/` · `/search-index.json` · `/manifest.webmanifest`

### Scaling content

- **New service page:** add a `detail` block to the service in `services.ts`. The page, sitemap entry, search entry and JSON-LD follow automatically. The zod contract tells you what's missing.
- **New clinic:** add it to `clinics` in `site.ts`. Cards, footer, booking options, schema and search pick it up.
- **Testimonials:** add verified, consented reviews to `testimonials`. The section switches from placeholder to quotes.
- **Photos:** see below.

### Features

- **⌘K / Ctrl+K / "/" search** over services, questions and clinics. The 17 KB index is fetched on first open; it's a native `<dialog>` with the ARIA combobox pattern.
- **Due-date calculator** (home + `/resources/due-date-calculator/`): LMP, conception or IVF (day 3/5), gestational age, trimester track, scan and test windows, `.ics` export. Runs on the device only.
- **Booking** composes a WhatsApp or email message; nothing is stored. Clinic cards deep-link with the clinic preselected. On mobile there's a fixed **Call · WhatsApp · Book** bar.
- **Service pages** have a sticky "On this page" bar with scroll-spy.
- **Motion:** CSS scroll-driven reveals (`animation-timeline: view()`), no JS; off for reduced-motion users and invisible where unsupported. The ultrasound-sector artwork is pure SVG/CSS.

## Adding the client's photographs

Put originals in `assets/photos/` named after the slot (see `assets/photos/README.md`), then `npm run build`. Each photo becomes AVIF + WebP at
480–2000w with intrinsic dimensions and a blurred preview, rendered through `<picture>`. Without a photo, each slot shows a labelled brand placeholder.

## Deployment

Any static host. `vercel.json` (Vercel) and `public/_headers` (Netlify, Cloudflare Pages) carry the security headers: a strict same-origin CSP,
HSTS, nosniff, Referrer-Policy, Permissions-Policy and COOP, plus cache rules. The CSP has to allow inline scripts because Next.js static
export emits them; everything else is same-origin only.

## Quality status (last run)

- **CI** (`.github/workflows/ci.yml`): lint → unit tests → build → headers drift check → e2e → QA sweep.
- **Unit:** 26 tests. **E2E:** 10 flows, including CSP under production headers. **QA:** 20 URLs × 11 viewports, 0 problems (axe WCAG 2.2 AA included).
- **Lighthouse** (simulated): desktop 100/100/100/100 on home, service and calculator pages. Mobile performance 96–99; accessibility, best practices and SEO 100; CLS 0.
  Mobile LCP is 2.1–2.7s on the throttled profile while FCP is 0.9s. The gap is the simulator charging the framework JS and fonts to the LCP text node,
  not a late render. Confirm real-user LCP with field data (CrUX / Search Console) after launch.
