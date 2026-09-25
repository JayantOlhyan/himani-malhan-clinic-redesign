import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PregnancyCalculator } from "./PregnancyCalculator";

/** Home-page section: the due-date calculator in an editorial frame. */
export function PregnancyPlanner() {
  return (
    <section aria-labelledby="planner-title" className="bg-ivory-deep py-20 md:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4" data-reveal>
          <p className="eyebrow">Pregnancy planner</p>
          <h2 id="planner-title" className="display-2 mt-5">
            Your due date, <span className="italic">and what comes next</span>
          </h2>
          <p className="lede mt-6">
            See your estimated due date, how far along you are, and when the commonly recommended scans and tests fall. Add the dates straight to your
            calendar.
          </p>
          <Link href="/resources/due-date-calculator/" className="link-arrow mt-8">
            How the calculation works <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="lg:col-span-7 lg:col-start-6" data-reveal>
          <PregnancyCalculator />
        </div>
      </div>
    </section>
  );
}
