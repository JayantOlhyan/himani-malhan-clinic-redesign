"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { ArrowRight, CalendarPlus, Check, Lock } from "lucide-react";
import { MAX_GA_DAYS, TERM_DAYS, addDays, calculate, toICS, toISO, todayLocal, type DatingMethod } from "@/lib/pregnancy";

const METHODS: { id: "lmp" | "conception" | "ivf"; label: string; dateLabel: string }[] = [
  { id: "lmp", label: "Last period", dateLabel: "First day of your last period" },
  { id: "conception", label: "Conception", dateLabel: "Date of conception" },
  { id: "ivf", label: "IVF transfer", dateLabel: "Embryo transfer date" },
];

const fmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const fmtShort = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
const fmtLong = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const range = (a: number, b: number) => `${fmtShort.format(a)} – ${fmt.format(b)}`;

/** Due date + gestational age + scan timeline. Runs entirely in the browser; nothing is sent or stored. */
export function PregnancyCalculator() {
  const uid = useId();
  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("lmp");
  const [ivfDay, setIvfDay] = useState<"ivf-day5" | "ivf-day3">("ivf-day5");
  const [date, setDate] = useState("");
  const [cycle, setCycle] = useState("28");
  // "today" is only known on the client; keep SSR output deterministic.
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(todayLocal()), []);

  const datingMethod: DatingMethod = method === "ivf" ? ivfDay : method;
  const result = useMemo(
    () => (date && today !== null ? calculate({ method: datingMethod, date, cycleLength: Number(cycle), today }) : null),
    [date, cycle, datingMethod, today],
  );
  const active = METHODS.find((m) => m.id === method)!;

  const downloadICS = () => {
    if (!result?.ok) return;
    const url = URL.createObjectURL(new Blob([toICS(result)], { type: "text/calendar;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "pregnancy-timeline.ics" });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const input =
    "mt-2 block w-full rounded-[2px] border border-line-strong bg-paper px-4 py-3 text-[0.97rem] text-charcoal focus:border-plum focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum";
  const label = "text-[0.72rem] font-semibold tracking-[0.14em] text-plum uppercase";
  const progress = result?.ok ? Math.min(100, Math.max(0, (result.ga.totalDays / TERM_DAYS) * 100)) : 0;

  return (
    <div className="@container border border-line bg-paper">
      <form className="grid gap-6 p-6 @lg:p-8" onSubmit={(e) => e.preventDefault()} aria-describedby={`${uid}-privacy`}>
        <fieldset>
          <legend className={label}>Calculate from</legend>
          <div className="mt-3 grid grid-cols-3 border border-line-strong" role="radiogroup">
            {METHODS.map((m) => (
              <label
                key={m.id}
                className="relative flex min-h-11 cursor-pointer items-center justify-center border-l border-line-strong px-2 text-center text-[0.82rem] font-medium text-plum first:border-l-0 has-[:checked]:bg-plum has-[:checked]:text-ivory has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-plum"
              >
                <input
                  type="radio"
                  name={`${uid}-method`}
                  value={m.id}
                  checked={method === m.id}
                  onChange={() => setMethod(m.id)}
                  className="sr-only"
                />
                {m.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-6 @md:grid-cols-2">
          <label className="block">
            <span className={label}>{active.dateLabel}</span>
            <input
              type="date"
              className={input}
              value={date}
              max={today !== null ? toISO(today) : undefined}
              min={today !== null ? toISO(addDays(today, -MAX_GA_DAYS)) : undefined}
              onChange={(e) => setDate(e.target.value)}
              aria-invalid={result?.ok === false}
              aria-describedby={result?.ok === false ? `${uid}-error` : undefined}
            />
          </label>
          {method === "lmp" && (
            <label className="block">
              <span className={label}>Usual cycle length (days)</span>
              <input type="number" inputMode="numeric" min={21} max={45} className={input} value={cycle} onChange={(e) => setCycle(e.target.value)} />
            </label>
          )}
          {method === "ivf" && (
            <label className="block">
              <span className={label}>Embryo age at transfer</span>
              <select className={input} value={ivfDay} onChange={(e) => setIvfDay(e.target.value as "ivf-day5" | "ivf-day3")}>
                <option value="ivf-day5">Day 5 (blastocyst)</option>
                <option value="ivf-day3">Day 3</option>
              </select>
            </label>
          )}
        </div>
        <p id={`${uid}-privacy`} className="flex items-center gap-2 text-xs text-muted">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> Calculated on your device. Nothing is sent or stored.
        </p>
      </form>

      <div aria-live="polite" className="border-t border-line">
        {!result && (
          <p className="p-6 text-[0.95rem] text-muted @lg:px-8">
            Enter a date to see your estimated due date and a timeline of commonly recommended scans.
          </p>
        )}
        {result && !result.ok && (
          <p id={`${uid}-error`} role="alert" className="p-6 text-[0.95rem] font-medium text-rose-ink @lg:px-8">
            {result.error}
          </p>
        )}
        {result?.ok && (
          <div className="p-6 @lg:p-8">
            <div className="grid gap-6 @xl:grid-cols-2">
              <div>
                <p className="text-[0.72rem] font-semibold tracking-[0.14em] text-muted uppercase">Estimated due date</p>
                <p className="mt-2 font-serif text-[2.2rem] leading-none text-plum @lg:text-[2.6rem]">{fmt.format(result.edd)}</p>
                <p className="mt-2 text-sm text-muted">{fmtLong.format(result.edd)}</p>
              </div>
              <div>
                <p className="text-[0.72rem] font-semibold tracking-[0.14em] text-muted uppercase">Today</p>
                <p className="mt-2 font-serif text-[2.2rem] leading-none text-plum @lg:text-[2.6rem]">
                  {result.ga.weeks}
                  <span className="text-[0.55em] text-muted"> wk </span>
                  {result.ga.days}
                  <span className="text-[0.55em] text-muted"> d</span>
                </p>
                <p className="mt-2 text-sm text-muted">
                  {["First", "Second", "Third"][result.ga.trimester - 1]} trimester
                  {result.ga.totalDays > TERM_DAYS ? " · past the due date" : ` · ${Math.max(0, TERM_DAYS - result.ga.totalDays)} days to go`}
                </p>
              </div>
            </div>

            {/* 40-week track with trimester divisions */}
            <div className="mt-8" aria-hidden="true">
              <div className="relative h-2 bg-ivory-deep">
                <div className="absolute inset-y-0 left-0 bg-plum transition-[width] duration-700" style={{ width: `${progress}%` }} />
                <div className="absolute inset-y-0 left-[35%] w-px bg-paper" />
                <div className="absolute inset-y-0 left-[70%] w-px bg-paper" />
                <div
                  className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-paper bg-rose-ink shadow"
                  style={{ left: `${progress}%` }}
                />
              </div>
              <div className="mt-2 grid grid-cols-[35fr_35fr_30fr] text-[0.6875rem] tracking-[0.12em] text-muted uppercase">
                <span>Trimester 1</span>
                <span>Trimester 2</span>
                <span>Trimester 3</span>
              </div>
            </div>

            <ol className="mt-8 border-t border-line">
              {result.milestones.map((m) => (
                <li
                  key={m.id}
                  className={`grid gap-1 border-b border-line py-4 @lg:grid-cols-[1.5rem_1fr_auto] @lg:items-baseline @lg:gap-4 ${m.status === "past" ? "opacity-55" : ""}`}
                >
                  <span className="hidden @lg:block" aria-hidden="true">
                    {m.status === "past" ? (
                      <Check className="h-4 w-4 text-sage-ink" />
                    ) : (
                      <span
                        className={`block h-2.5 w-2.5 rounded-full ${m.status === "current" ? "bg-rose-ink ring-4 ring-rose-soft" : "border border-plum/40"}`}
                      />
                    )}
                  </span>
                  <div>
                    <p className="text-[0.98rem] font-medium text-charcoal">
                      {m.title}
                      {m.status === "current" && (
                        <span className="ml-2 bg-rose-soft px-2 py-0.5 text-[0.6875rem] font-semibold tracking-[0.1em] text-rose-ink uppercase">
                          Now
                        </span>
                      )}
                      <span className="sr-only">{m.status === "past" ? " (passed)" : m.status === "current" ? " (current)" : ""}</span>
                    </p>
                    <p className="mt-0.5 text-sm text-muted">{m.detail}</p>
                  </div>
                  <p className="text-sm text-plum tabular-nums @lg:text-right">
                    {range(m.start, m.end)}
                    <span className="block text-xs text-muted">
                      {Math.floor(m.from / 7)}
                      {m.from % 7 ? `+${m.from % 7}` : ""}–{Math.floor(m.to / 7)}
                      {m.to % 7 ? `+${m.to % 7}` : ""} weeks
                    </span>
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-7 flex flex-col gap-3 @lg:flex-row">
              <button type="button" onClick={downloadICS} className="btn btn-secondary">
                <CalendarPlus className="h-4 w-4" aria-hidden="true" /> Add dates to calendar
              </button>
              <Link href="/book/" className="btn btn-primary">
                Book a pregnancy consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-muted">
              An estimate for general information only. A dating scan may adjust your due date, and your doctor will advise the scans and tests that
              are right for you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
