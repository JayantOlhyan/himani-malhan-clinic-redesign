"use client";

import { useEffect, useRef, useState } from "react";

export type SectionLink = { id: string; label: string };

/**
 * Sticky in-page navigation with scroll-spy. Links target section headings; the active item
 * follows whichever section crosses the middle of the viewport. Horizontally scrollable on phones.
 */
export function SectionNav({ links }: { links: SectionLink[] }) {
  const [active, setActive] = useState(links[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const targets = links.map((l) => document.getElementById(l.id)?.closest("section") ?? null).filter(Boolean) as HTMLElement[];
    const byEl = new Map(targets.map((el, i) => [el, links[i].id]));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = byEl.get(e.target as HTMLElement);
          if (e.isIntersecting && id) setActive(id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [links]);

  // Keep the active chip visible in the horizontal scroller.
  useEffect(() => {
    // Scroll only the chip row (scrollIntoView could also move the page).
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (list && item && (item.offsetLeft < list.scrollLeft || item.offsetLeft + item.offsetWidth > list.scrollLeft + list.clientWidth)) {
      list.scrollTo({ left: item.offsetLeft - 16, behavior: "smooth" });
    }
  }, [active]);

  return (
    <nav aria-label="On this page" className="sticky top-[4.5rem] z-30 border-b border-line bg-ivory/95 backdrop-blur-sm lg:top-20">
      <div className="container-x flex items-center justify-between gap-6">
        <ul ref={listRef} className="-mx-1 flex min-w-0 snap-x [scrollbar-width:none] gap-1 overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden">
          {links.map((l) => (
            <li key={l.id} data-id={l.id} className="snap-start">
              <a
                href={`#${l.id}`}
                aria-current={active === l.id ? "location" : undefined}
                className={`inline-flex min-h-10 items-center px-3 text-[0.82rem] font-medium whitespace-nowrap transition-colors ${
                  active === l.id ? "text-plum shadow-[inset_0_-2px_0_var(--color-plum)]" : "text-muted hover:text-plum"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
