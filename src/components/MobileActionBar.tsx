import Link from "next/link";
import { CalendarDays, MessageCircle, Phone } from "lucide-react";
import { telHref, whatsappHref } from "@/content/site";

/** Persistent bottom actions on small screens: call, WhatsApp, book. */
export function MobileActionBar() {
  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[0.7rem] font-semibold tracking-[0.04em]";
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/97 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden">
      <nav aria-label="Quick actions" className="flex">
        <a href={telHref} className={`${item} text-plum`}>
          <Phone className="h-[18px] w-[18px]" aria-hidden="true" /> Call
        </a>
        <a
          href={whatsappHref("Hello, I would like to book a consultation with Dr. Himani Kundoo.")}
          target="_blank"
          rel="noopener"
          className={`${item} border-x border-line text-plum`}
        >
          <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" /> WhatsApp
        </a>
        <Link href="/book/" className={`${item} bg-plum text-ivory`}>
          <CalendarDays className="h-[18px] w-[18px]" aria-hidden="true" /> Book
        </Link>
      </nav>
    </div>
  );
}
