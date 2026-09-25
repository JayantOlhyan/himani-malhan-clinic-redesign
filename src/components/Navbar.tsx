"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, Phone, Search, X } from "lucide-react";
import { openSearch } from "./SearchDialog";
import { Logo } from "./Logo";
import { contact, nav, telHref } from "@/content/site";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Rendered after mount to avoid a hydration mismatch; Apple platforms use ⌘, everything else Ctrl.
  const [shortcut, setShortcut] = useState("Ctrl K");
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) setShortcut("⌘K");
  }, []);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    // Keep keyboard and screen-reader focus inside the open menu.
    const background = Array.from(document.querySelectorAll<HTMLElement>("#main, body > footer, [data-mobile-actions]"));
    background.forEach((el) => el.setAttribute("inert", ""));
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      background.forEach((el) => el.removeAttribute("inert"));
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b bg-ivory/95 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 supports-[backdrop-filter]:bg-ivory/85 ${
          scrolled ? "border-line shadow-[0_1px_24px_rgb(74_38_55/0.06)]" : "border-transparent"
        }`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:bg-plum focus:px-4 focus:py-2 focus:text-ivory"
        >
          Skip to content
        </a>
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-3 sm:gap-6 lg:h-20">
          <Logo />
          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-6 xl:gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`relative py-2 text-[0.84rem] font-medium tracking-[0.01em] whitespace-nowrap transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-plum after:transition-transform after:duration-300 hover:text-plum ${
                      isActive(item.href) ? "text-plum after:scale-x-100" : "text-charcoal/80 after:scale-x-0 hover:after:scale-x-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={telHref}
              className="hidden min-h-11 items-center gap-2 px-3 text-[0.84rem] font-medium whitespace-nowrap text-plum 2xl:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {contact.phoneDisplay}
            </a>
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search the site"
              aria-keyshortcuts="Control+K Meta+K /"
              className="inline-flex h-11 min-w-11 items-center justify-center gap-2 border-line-strong px-2 text-plum transition-colors hover:border-plum xl:border xl:px-3"
            >
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
              <span className="hidden text-[0.8rem] text-muted xl:inline">Search</span>
              <kbd className="kbd hidden xl:inline-flex">{shortcut}</kbd>
            </button>
            <Link href="/book/" className="btn btn-primary hidden !min-h-11 !px-5 sm:inline-flex">
              Book Consultation
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-plum xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto border-t border-line bg-ivory lg:top-20 xl:hidden"
      >
        <nav aria-label="Mobile" className="container-x flex min-h-full flex-col py-8">
          <ul className="divide-y divide-line border-y border-line">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex items-center justify-between py-4 font-serif text-[1.75rem] text-plum"
                >
                  {item.label}
                  <ArrowRight className="h-5 w-5 text-rose-ink" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3 pb-24">
            <Link href="/book/" className="btn btn-primary w-full">
              Book Consultation
            </Link>
            <a href={telHref} className="btn btn-secondary w-full">
              <Phone className="h-4 w-4" aria-hidden="true" /> Call {contact.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
