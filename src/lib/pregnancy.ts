/**
 * Pregnancy dating — pure functions, calendar dates only (no time zones, no DST).
 *
 * Sources:
 *  - EDD rules: ACOG Committee Opinion 700, "Methods for Estimating the Due Date" (2017):
 *      LMP + 280 days (adjusted for cycle length); conception + 266; IVF day-5 transfer + 261, day-3 transfer + 263.
 *  - Scan windows: ISUOG Practice Guidelines — 11–14-week scan (NT 11+0 to 13+6) and the 18–22-week anomaly scan.
 *  - Glucose screening 24–28 weeks (ACOG; DIPSI/FOGSI also advise testing at the first visit).
 * Every window is general guidance; the treating doctor decides the actual schedule.
 */

export type DatingMethod = "lmp" | "conception" | "ivf-day5" | "ivf-day3";

const DAY = 86_400_000;
export const TERM_DAYS = 280;
export const MAX_GA_DAYS = 42 * 7;

/** "YYYY-MM-DD" → UTC midnight timestamp. Returns NaN for invalid input. */
export function parseDate(iso: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return NaN;
  const t = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const d = new Date(t);
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3] ? t : NaN;
}
export const toISO = (t: number) => new Date(t).toISOString().slice(0, 10);
export const addDays = (t: number, days: number) => t + days * DAY;
export const diffDays = (a: number, b: number) => Math.round((a - b) / DAY);
/** Today's calendar date in the user's time zone, as UTC midnight. */
export function todayLocal(now = new Date()): number {
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Estimated due date from the chosen method. `cycleLength` only applies to LMP dating. */
export function estimateDueDate(method: DatingMethod, date: number, cycleLength = 28): number {
  switch (method) {
    case "lmp":
      return addDays(date, TERM_DAYS + (cycleLength - 28));
    case "conception":
      return addDays(date, 266);
    case "ivf-day5":
      return addDays(date, 261);
    case "ivf-day3":
      return addDays(date, 263);
  }
}

export type GestationalAge = { totalDays: number; weeks: number; days: number; trimester: 1 | 2 | 3 };

/** Gestational age on `on`, counted back from the EDD (EDD = 40+0). */
export function gestationalAge(edd: number, on: number): GestationalAge {
  const totalDays = TERM_DAYS - diffDays(edd, on);
  const weeks = Math.floor(totalDays / 7);
  return { totalDays, weeks, days: totalDays - weeks * 7, trimester: weeks < 14 ? 1 : weeks < 28 ? 2 : 3 };
}

export type Milestone = {
  id: string;
  title: string;
  detail: string;
  /** Gestational window in days, inclusive. */
  from: number;
  to: number;
};

const w = (weeks: number, days = 0) => weeks * 7 + days;

export const MILESTONES: Milestone[] = [
  {
    id: "early-scan",
    title: "Early pregnancy scan",
    detail: "Confirms the pregnancy, heartbeat and dates, if your doctor advises one.",
    from: w(6),
    to: w(9, 6),
  },
  {
    id: "nt-scan",
    title: "NT scan & first-trimester screening",
    detail: "Nuchal translucency scan with screening blood tests.",
    from: w(11),
    to: w(13, 6),
  },
  { id: "anomaly-scan", title: "Anomaly scan", detail: "Detailed scan of the baby's anatomy.", from: w(18), to: w(22, 6) },
  {
    id: "glucose",
    title: "Glucose screening",
    detail: "Test for gestational diabetes. Earlier testing may also be advised.",
    from: w(24),
    to: w(28, 6),
  },
  { id: "growth-scan", title: "Growth scan", detail: "Checks the baby's growth and fluid, if your doctor advises one.", from: w(28), to: w(32, 6) },
  { id: "term", title: "Term", detail: "The baby is considered term from 37 weeks.", from: w(37), to: w(41, 6) },
];

export type MilestoneDates = Milestone & { start: number; end: number; status: "past" | "current" | "upcoming" };

export function milestoneDates(edd: number, today: number): MilestoneDates[] {
  const lmpEquivalent = addDays(edd, -TERM_DAYS);
  const ga = gestationalAge(edd, today).totalDays;
  return MILESTONES.map((m) => ({
    ...m,
    start: addDays(lmpEquivalent, m.from),
    end: addDays(lmpEquivalent, m.to),
    status: ga > m.to ? "past" : ga >= m.from ? "current" : "upcoming",
  }));
}

export type DatingInput = { method: DatingMethod; date: string; cycleLength?: number; today?: number };
export type DatingResult = { ok: true; edd: number; ga: GestationalAge; milestones: MilestoneDates[] } | { ok: false; error: string };

export function calculate({ method, date, cycleLength = 28, today = todayLocal() }: DatingInput): DatingResult {
  const t = parseDate(date);
  if (Number.isNaN(t)) return { ok: false, error: "Please enter a valid date." };
  if (t > today) return { ok: false, error: "The date can't be in the future." };
  if (method === "lmp" && (!Number.isInteger(cycleLength) || cycleLength < 21 || cycleLength > 45))
    return { ok: false, error: "Cycle length should be between 21 and 45 days." };
  const edd = estimateDueDate(method, t, cycleLength);
  const ga = gestationalAge(edd, today);
  if (ga.totalDays > MAX_GA_DAYS) return { ok: false, error: "That date is more than 42 weeks ago. Please check the date." };
  return { ok: true, edd, ga, milestones: milestoneDates(edd, today) };
}

/** iCalendar (RFC 5545) file with each window as an all-day event, plus the due date. */
export function toICS(result: Extract<DatingResult, { ok: true }>, stamp = new Date()): string {
  const d = (t: number) => toISO(t).replace(/-/g, "");
  const dtstamp = stamp
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const esc = (s: string) =>
    s
      .replace(/\\/g, "\\\\")
      .replace(/[,;]/g, (c) => `\\${c}`)
      .replace(/\n/g, "\\n");
  const events = [
    ...result.milestones
      .filter((m) => m.status !== "past" && m.id !== "term")
      .map((m) => ({
        uid: m.id,
        summary: `${m.title} window`,
        start: m.start,
        end: addDays(m.end, 1),
        desc: `${m.detail} Timing is guidance only; follow your doctor's advice.`,
      })),
    {
      uid: "edd",
      summary: "Estimated due date",
      start: result.edd,
      end: addDays(result.edd, 1),
      desc: "Estimate only. Your dating scan may adjust this date.",
    },
  ];
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dr. Himani Kundoo//Pregnancy timeline//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events.flatMap((e) => [
      "BEGIN:VEVENT",
      `UID:${e.uid}-${d(result.edd)}@drhimanikundoogynae.com`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${d(e.start)}`,
      `DTEND;VALUE=DATE:${d(e.end)}`,
      `SUMMARY:${esc(e.summary)}`,
      `DESCRIPTION:${esc(e.desc)}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];
  // Fold lines longer than 75 octets (RFC 5545 §3.1).
  return lines.map((l) => (l.length <= 75 ? l : l.match(/.{1,74}/g)!.join("\r\n "))).join("\r\n") + "\r\n";
}
