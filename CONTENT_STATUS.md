# Content status — read before showing this to the client

The live site (`drhimanikundoogynae.com`) was **blocked by the build environment's network policy**, so it could not be inspected directly.
Everything below is classified by where it came from. Run `npm run import:source` from a normal network to pull the live site's text
and images into `content-source/`, then work through this list.

## Verified (from the redesign brief, which was sourced from the live site)

| Item | Where in code |
| --- | --- |
| Name, roles, specialties, 14+ years | `src/content/site.ts → doctor` |
| Institutions: MAMC, AIIMS Delhi, LHMC Delhi, Artemis Hospital Gurugram | `doctor.institutions` |
| Memberships: FOGSI, GOGS, SFM | `memberships` |
| Phone +91 9902905188, email himanikundoo@gmail.com | `contact` |
| Both clinics, addresses, timings | `clinics` |
| The 28 services and their names | `src/content/services.ts` |
| Hero headline + supporting copy, final CTA copy | brief, verbatim |

## Needs confirmation with the client

| Item | Why | Where |
| --- | --- | --- |
| **WhatsApp on +91 9902905188** | Brief asks for WhatsApp; not confirmed the number is on WhatsApp | `contact.whatsapp` |
| **Consultation days** | Source lists times only. UI says "please call to confirm"; schema omits opening hours | `clinics[].timings` |
| **Google Maps links** | Built as Maps searches; replace with the exact links from the live site | `clinics[].mapsUrl` |
| **GOGS full name** | "Gurgaon Obstetric & Gynaecological Society" is from the design mock-up, not the brief | `memberships` |
| **Which institutions were training vs. employment** | Brief lists them without roles, so copy says "training and clinical experience at…" | `DoctorIntro.tsx` |
| **Degrees** (MBBS / MD / fellowship) | Not in the brief. Third-party listings mention some but disagree with each other, so none are shown | — |
| Pronouns | Copy is written without pronouns for the doctor. Keep it that way or confirm | all copy |
| Clinic heading "in Gurugram" vs "Gurgaon" | Source uses both; UI keeps each address as given | `clinics` |

> Note: third-party directories disagree on experience (one says 9 years, another 12+). The site uses the brief's **14+**. Confirm with the client.

## Drafted for the demo — must be reviewed against the live site and approved by the doctor

These are conservative, general patient-education texts. They make **no claims about outcomes, volumes or the doctor's credentials**, but they are not from the live site.

- Service page bodies (`detail` blocks, each marked `review: "pending"`): High-Risk Pregnancy, Fetal Medicine, Pre-Pregnancy Counselling,
  Infertility Treatment, PCOD/PCOS, Abortion/MTP, Irregular Periods, Gynaecological Surgeries.
- One-line summaries for all 28 services.
- Category descriptions (4).
- General FAQ answers (`src/content/faqs.ts`). Questions follow the brief's topics; the live site's FAQ wording could not be checked.
- "Why patients choose" pillar descriptions (`TrustPillars.tsx`). "Personalized" and "evidence-based" come from the hero copy.
- Privacy notice (`/privacy/`) needs legal review.

The 20 services without a `detail` block **do not get pages**. They are listed but not linked, to avoid 20 thin pages that would hurt SEO.
Adding a `detail` block publishes a page at `/services/<slug>/` automatically.

## Clinical reference content (needs the doctor's sign-off)

- **Due-date calculator** (`src/lib/pregnancy.ts`). The EDD rules follow ACOG Committee Opinion 700 (LMP + 280 days adjusted for cycle length; conception + 266; IVF day-5 + 261, day-3 + 263).
  Scan windows: early scan 6–9+6 wk (if advised), NT/first-trimester screening 11+0–13+6 (ISUOG), anomaly scan 18–22+6 (ISUOG), glucose screening 24–28+6,
  growth scan 28–32+6 (if advised), term from 37 wk. **Confirm these match the practice's own antenatal schedule** (e.g. Indian practice often
  also tests glucose at booking, per DIPSI/FOGSI; the UI says "earlier testing may also be advised").
- **Search synonyms** (`src/lib/search.ts → SYNONYMS`) map patient words to site terms, e.g. pcod → pcos, c-section → caesarean, ivf → infertility.

## Deliberately absent

- **Testimonials.** None verified. The section shows a clearly labelled placeholder until real, consented reviews are added to `testimonials` in `site.ts`.
- **Photography.** No client photos were reachable. Every image slot renders a labelled brand placeholder until a photo is added to `assets/photos/` (see README).
  The home fetal-medicine feature uses abstract ultrasound-sector artwork, not a photo. It is not a real scan and shows no measurements.
- **Membership logos.** Typographic treatment until official logo files are supplied.
- **Lorem ipsum.** None. The QA script fails if any appears.
- Awards, patient numbers, success rates, review counts: none shown.
