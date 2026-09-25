import { describe, expect, it } from "vitest";
import { calculate, estimateDueDate, gestationalAge, parseDate, toICS, toISO } from "@/lib/pregnancy";

const d = parseDate;

describe("due date (ACOG CO 700)", () => {
  it("LMP + 280 days for a 28-day cycle", () => {
    expect(toISO(estimateDueDate("lmp", d("2026-01-01")))).toBe("2026-10-08");
  });
  it("adjusts for cycle length", () => {
    expect(toISO(estimateDueDate("lmp", d("2026-01-01"), 35))).toBe("2026-10-15");
    expect(toISO(estimateDueDate("lmp", d("2026-01-01"), 24))).toBe("2026-10-04");
  });
  it("conception + 266, IVF day-5 + 261, day-3 + 263", () => {
    expect(toISO(estimateDueDate("conception", d("2026-01-15")))).toBe("2026-10-08");
    expect(toISO(estimateDueDate("ivf-day5", d("2026-01-20")))).toBe("2026-10-08");
    expect(toISO(estimateDueDate("ivf-day3", d("2026-01-18")))).toBe("2026-10-08");
  });
  it("crosses leap years correctly", () => {
    expect(toISO(estimateDueDate("lmp", d("2027-06-01")))).toBe("2028-03-07");
  });
});

describe("gestational age", () => {
  const edd = d("2026-10-08");
  it("is 40+0 on the due date and 0+0 on the LMP", () => {
    expect(gestationalAge(edd, edd)).toMatchObject({ weeks: 40, days: 0, trimester: 3 });
    expect(gestationalAge(edd, d("2026-01-01"))).toMatchObject({ weeks: 0, days: 0, trimester: 1 });
  });
  it("uses trimester boundaries at 14+0 and 28+0", () => {
    expect(gestationalAge(edd, d("2026-04-08")).trimester).toBe(1); // 13+6
    expect(gestationalAge(edd, d("2026-04-09")).trimester).toBe(2); // 14+0
    expect(gestationalAge(edd, d("2026-07-16")).trimester).toBe(3); // 28+0
  });
});

describe("calculate", () => {
  const today = d("2026-06-01");
  it("returns EDD, GA and milestone status", () => {
    const r = calculate({ method: "lmp", date: "2026-01-01", today });
    if (!r.ok) throw new Error(r.error);
    expect(r.ga).toMatchObject({ weeks: 21, days: 4 });
    const status = Object.fromEntries(r.milestones.map((m) => [m.id, m.status]));
    expect(status).toMatchObject({ "nt-scan": "past", "anomaly-scan": "current", glucose: "upcoming" });
    const nt = r.milestones.find((m) => m.id === "nt-scan")!;
    expect([toISO(nt.start), toISO(nt.end)]).toEqual(["2026-03-19", "2026-04-08"]);
  });
  it("rejects invalid, future and too-old dates, and bad cycle lengths", () => {
    expect(calculate({ method: "lmp", date: "2026-02-30", today })).toMatchObject({ ok: false });
    expect(calculate({ method: "lmp", date: "2026-07-01", today })).toMatchObject({ ok: false, error: expect.stringMatching(/future/) });
    expect(calculate({ method: "lmp", date: "2025-01-01", today })).toMatchObject({ ok: false, error: expect.stringMatching(/42 weeks/) });
    expect(calculate({ method: "lmp", date: "2026-01-01", cycleLength: 60, today })).toMatchObject({ ok: false });
  });
});

describe("calendar export", () => {
  it("produces valid RFC 5545 all-day events for upcoming windows", () => {
    const r = calculate({ method: "lmp", date: "2026-01-01", today: d("2026-06-01") });
    if (!r.ok) throw new Error(r.error);
    const ics = toICS(r, new Date("2026-06-01T10:00:00Z"));
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("DTSTART;VALUE=DATE:20261008");
    expect(ics).not.toContain("NT scan"); // past windows are skipped
    expect(ics.split("\r\n").every((l) => l.length <= 75)).toBe(true);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(4); // anomaly, glucose, growth + EDD
  });
});
