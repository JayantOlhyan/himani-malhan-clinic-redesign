// Responsive image pipeline. Runs before `dev` and `build`.
//
// Put original photos in assets/photos/<key>.{jpg,jpeg,png,webp,tif}. The key is the file name
// that the components reference, e.g. assets/photos/dr-himani-kundoo-portrait.jpg feeds the slot
// whose src is /images/dr-himani-kundoo-portrait.jpg.
//
// For each photo this writes AVIF + WebP at several widths (never upscaled) and a JPEG fallback to
// public/images/generated/, plus a manifest with intrinsic size and a tiny blurred preview (LQIP)
// that ImageSlot reads at build time. Outputs are cached: unchanged photos are skipped.
import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const SRC = path.resolve("assets/photos");
const OUT = path.resolve("public/images/generated");
const MANIFEST = path.resolve("src/content/image-manifest.json");
const WIDTHS = [480, 800, 1200, 1600, 2000];
const FORMATS = { avif: { quality: 55, effort: 5 }, webp: { quality: 76 } };

mkdirSync(OUT, { recursive: true });
const previous = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
const manifest = {};
const files = existsSync(SRC) ? readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f)) : [];

for (const file of files) {
  const key = file.replace(/\.[^.]+$/, "");
  const input = path.join(SRC, file);
  const mtime = statSync(input).mtimeMs;
  const cached = previous[key];
  if (cached && cached.mtime === mtime && existsSync(path.join("public", cached.fallback))) {
    manifest[key] = cached;
    continue;
  }
  // Apply EXIF rotation once, then work from the rotated buffer.
  const base = await sharp(input).rotate().toBuffer();
  const { width, height } = await sharp(base).metadata();
  const widths = [...new Set([...WIDTHS.filter((w) => w < width), Math.min(width, WIDTHS.at(-1))])].sort((a, b) => a - b);
  const sources = {};
  for (const [fmt, opts] of Object.entries(FORMATS)) {
    sources[fmt] = [];
    for (const w of widths) {
      const name = `${key}-${w}.${fmt}`;
      await sharp(base).resize({ width: w })[fmt](opts).toFile(path.join(OUT, name));
      sources[fmt].push([`/images/generated/${name}`, w]);
    }
  }
  const fbWidth = Math.min(width, 1200);
  const fallback = `/images/generated/${key}-${fbWidth}.jpg`;
  await sharp(base).resize({ width: fbWidth }).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join("public", fallback));
  const lqip = await sharp(base).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  manifest[key] = {
    mtime,
    width,
    height,
    fallback,
    sources,
    blurDataURL: `data:image/webp;base64,${lqip.toString("base64")}`,
  };
  console.log(`image: ${file} → ${widths.join("/")}w avif+webp`);
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`images: ${Object.keys(manifest).length} photo(s) in manifest`);
