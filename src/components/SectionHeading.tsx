import type { ReactNode } from "react";

export function SectionHeading({
  id,
  eyebrow,
  title,
  aside,
  tone = "dark",
  stacked = false,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  aside?: ReactNode;
  tone?: "dark" | "light";
  /** Use inside an already-narrow column: no internal grid. */
  stacked?: boolean;
}) {
  return (
    <div className={stacked ? "" : "grid gap-6 md:grid-cols-12 md:items-end"} data-reveal>
      <div className={stacked ? "" : "md:col-span-7"}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className={`display-2 mt-5 ${tone === "light" ? "!text-ivory" : ""}`}>
          {title}
        </h2>
      </div>
      {aside && <div className="md:col-span-4 md:col-start-9">{aside}</div>}
    </div>
  );
}
