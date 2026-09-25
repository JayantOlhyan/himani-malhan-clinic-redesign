import fs from "node:fs";
import path from "node:path";
import { LotusMark } from "./Logo";

type Tone = "rose" | "ivory" | "plum" | "sage";

const tones: Record<Tone, { bg: string; ink: string; frame: string }> = {
  rose: { bg: "bg-rose-soft", ink: "text-rose-ink", frame: "border-plum/15" },
  ivory: { bg: "bg-ivory-deep", ink: "text-plum/60", frame: "border-plum/15" },
  plum: { bg: "bg-plum-soft", ink: "text-rose-soft", frame: "border-ivory/20" },
  sage: { bg: "bg-sage-soft", ink: "text-sage-ink", frame: "border-plum/10" },
};

type ManifestEntry = {
  width: number;
  height: number;
  fallback: string;
  blurDataURL: string;
  sources: Record<"avif" | "webp", [string, number][]>;
};

let manifestCache: Record<string, ManifestEntry> | undefined;
/** Build-time manifest written by scripts/images.mjs. Missing manifest = no processed photos. */
function manifest(): Record<string, ManifestEntry> {
  if (!manifestCache) {
    try {
      manifestCache = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/content/image-manifest.json"), "utf8"));
    } catch {
      manifestCache = {};
    }
  }
  return manifestCache!;
}

const keyOf = (src: string) => path.basename(src).replace(/\.[^.]+$/, "");

export function publicFileExists(src: string) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", src));
  } catch {
    return false;
  }
}

/**
 * Photo slot, resolved at build time in this order:
 *   1. a processed photo from assets/photos/<key>.* → <picture> with AVIF/WebP srcset, intrinsic size and blur-up
 *   2. a plain file at public${src}                  → <img>
 *   3. otherwise                                      → a designed, clearly-labelled placeholder
 * The wrapper controls size/aspect via className; `sizes` should describe the rendered width.
 */
export function ImageSlot({
  src,
  alt,
  label,
  tone = "ivory",
  className = "",
  priority = false,
  position = "center",
  sizes,
}: {
  src: string;
  alt: string;
  label: string;
  tone?: Tone;
  className?: string;
  priority?: boolean;
  position?: string;
  sizes?: string;
}) {
  const t = tones[tone];
  const pos = /(^|\s)absolute(\s|$)/.test(className) ? "" : "relative";
  const processed = manifest()[keyOf(src)];
  if (processed) {
    const srcSet = (fmt: "avif" | "webp") => processed.sources[fmt].map(([u, w]) => `${u} ${w}w`).join(", ");
    return (
      <div
        className={`${pos} overflow-hidden bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url(${processed.blurDataURL})`, backgroundPosition: position }}
      >
        <picture>
          <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
          <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={processed.fallback}
            alt={alt}
            width={processed.width}
            height={processed.height}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding={priority ? "sync" : "async"}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: position }}
          />
        </picture>
      </div>
    );
  }
  if (publicFileExists(src)) {
    return (
      <div className={`${pos} overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: position }}
        />
      </div>
    );
  }
  return (
    <div className={`grain ${pos} overflow-hidden ${t.bg} ${className}`} aria-hidden="true" data-placeholder={src}>
      <div className={`absolute inset-3 border ${t.frame} sm:inset-4`} />
      <div className={`absolute inset-0 flex items-center justify-center ${t.ink}`}>
        <LotusMark className="h-auto w-[46%] max-w-[22rem] opacity-40 [&_path]:[vector-effect:non-scaling-stroke]" />
      </div>
      <p className={`absolute right-6 bottom-6 left-6 text-[0.6875rem] font-semibold tracking-[0.18em] uppercase ${t.ink} sm:bottom-7 sm:left-8`}>
        Photograph — {label}
      </p>
    </div>
  );
}
