"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Adds .is-visible to [data-reveal] elements as they enter the viewport. Re-scans on route change. */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    (window as unknown as { __revealReady?: boolean }).__revealReady = true;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}

/** Inline, pre-paint: opt into reveal styles; fall back to fully visible if the app bundle never boots. */
export const revealBootScript = `document.documentElement.classList.add('js');setTimeout(function(){if(!window.__revealReady){document.documentElement.classList.remove('js')}},2500);`;
