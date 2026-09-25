"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowRight, CornerDownLeft, Search, X } from "lucide-react";
import { searchItems, type SearchItem } from "@/lib/search";

export const OPEN_SEARCH_EVENT = "site:open-search";
export const openSearch = () => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));

const QUICK_LINKS: SearchItem[] = [
  { title: "Book a consultation", href: "/book/", kind: "Page", keywords: "" },
  { title: "High-Risk Pregnancy", href: "/services/high-risk-pregnancy/", kind: "Service", keywords: "" },
  { title: "Due date calculator", href: "/resources/due-date-calculator/", kind: "Tool", keywords: "" },
  { title: "Clinic timings & directions", href: "/clinics/", kind: "Clinic", keywords: "" },
];

/**
 * ⌘K / Ctrl+K / "/" site search. Native <dialog> (top layer, inert background, Esc to close) with the
 * ARIA 1.2 combobox + listbox pattern. The index is fetched once, on first open.
 */
export function SearchDialog() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [index, setIndex] = useState<SearchItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();

  const results = useMemo(() => (query.trim() ? searchItems(index ?? [], query) : QUICK_LINKS), [index, query]);

  const open = useCallback(() => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    d.showModal();
    setActive(0);
    requestAnimationFrame(() => inputRef.current?.select());
    if (!index)
      fetch("/search-index.json")
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then(setIndex)
        .catch(() => setFailed(true));
  }, [index]);

  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, open);
    };
  }, [open]);

  const go = (item: SearchItem) => {
    close();
    router.push(item.href);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Escape") {
      // type="search" would otherwise swallow the first Esc to clear the text.
      e.preventDefault();
      close();
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, listId]);

  const optionId = (i: number) => `${listId}-${i}`;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Search the site"
      onClick={(e) => e.target === dialogRef.current && close()}
      className="search-dialog m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-plum-deep/45 backdrop:backdrop-blur-[2px] sm:mx-auto sm:mt-[12vh] sm:h-auto sm:max-w-2xl sm:px-4"
    >
      <div className="flex h-full flex-col border-line bg-paper shadow-[0_30px_80px_-30px_rgb(51_25_42/0.55)] sm:h-auto sm:max-h-[70vh] sm:border">
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Search className="h-5 w-5 shrink-0 text-rose-ink" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={results.length ? optionId(active) : undefined}
            aria-label="Search services, questions and clinics"
            placeholder="Search services, questions, clinics…"
            enterKeyHint="go"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            className="h-16 min-w-0 flex-1 bg-transparent font-serif text-[1.35rem] text-plum placeholder:text-muted/70 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={close}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-plum"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
          <p className="px-3 pt-2 pb-1 text-[0.6875rem] font-semibold tracking-[0.16em] text-muted uppercase" aria-live="polite">
            {query.trim()
              ? failed
                ? "Search is unavailable right now"
                : !index
                  ? "Loading…"
                  : `${results.length} result${results.length === 1 ? "" : "s"}`
              : "Suggested"}
          </p>
          <ul id={listId} role="listbox" aria-label="Search results">
            {results.map((r, i) => (
              <li
                key={`${r.href}-${r.title}`}
                id={optionId(i)}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => go(r)}
                className={`flex cursor-pointer items-center justify-between gap-4 px-3 py-3 ${i === active ? "bg-rose-soft/60" : ""}`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[0.98rem] text-charcoal">{r.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted">
                    {r.kind}
                    {r.context ? ` · ${r.context}` : ""}
                  </span>
                </span>
                {i === active ? (
                  <CornerDownLeft className="h-4 w-4 shrink-0 text-plum" aria-hidden="true" />
                ) : (
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted/60" aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>
          {query.trim() && index && results.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-muted">
              No matches for &ldquo;{query}&rdquo;.{" "}
              <button
                type="button"
                className="text-plum underline underline-offset-4"
                onClick={() => go({ title: "", href: "/expertise/", kind: "Page", keywords: "" })}
              >
                Browse all areas of care
              </button>
            </div>
          )}
        </div>

        <div className="hidden items-center gap-5 border-t border-line px-5 py-3 text-xs text-muted sm:flex">
          <span>
            <kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> to move
          </span>
          <span>
            <kbd className="kbd">Enter</kbd> to open
          </span>
          <span>
            <kbd className="kbd">Esc</kbd> to close
          </span>
        </div>
      </div>
    </dialog>
  );
}
