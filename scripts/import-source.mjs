// Pulls text + images from the current live site for content verification and photo replacement.
// The site was not reachable from the build environment, so run this from a normal network:
//   npm run import:source
// Output:
//   content-source/<page>.txt        plain-text dump of each page (compare against src/content/*)
//   content-source/images.json       every image URL with its alt text and the page it appeared on
//   content-source/images/<file>     downloaded originals — rename/copy the right ones into public/images/
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = process.env.SOURCE_ORIGIN ?? "https://drhimanikundoogynae.com";
const OUT = path.resolve("content-source");
const MAX_PAGES = 80;

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;|&rsquo;|&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;|&ndash;/g, "–");
const toText = (html) =>
  decode(
    html
      .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, "")
      .replace(/<(br|\/p|\/h[1-6]|\/li|\/div|\/section|\/tr)>/gi, "\n")
      .replace(/<h([1-6])[^>]*>/gi, (_, n) => `\n${"#".repeat(+n)} `)
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<[^>]+>/g, ""),
  )
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");

async function get(url) {
  const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (content import for site redesign)" } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r;
}

await mkdir(path.join(OUT, "images"), { recursive: true });
const queue = [`${ORIGIN}/`];
const seen = new Set(queue);
const images = new Map();

while (queue.length && seen.size <= MAX_PAGES) {
  const url = queue.shift();
  let html;
  try {
    html = await (await get(url)).text();
  } catch (e) {
    console.warn("skip", e.message);
    continue;
  }
  const slug = new URL(url).pathname.replace(/^\/|\/$/g, "").replace(/\//g, "_") || "home";
  await writeFile(path.join(OUT, `${slug}.txt`), `${url}\n\n${toText(html)}\n`);
  if (/lorem ipsum/i.test(html)) console.warn(`  ! Lorem ipsum present on ${url}`);

  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const src = (tag.match(/\b(?:data-src|src)=["']([^"']+)["']/i) || [])[1];
    if (!src || src.startsWith("data:")) continue;
    const abs = new URL(src, url).href;
    const alt = decode((tag.match(/\balt=["']([^"']*)["']/i) || [])[1] ?? "");
    if (!images.has(abs)) images.set(abs, { url: abs, alt, pages: [] });
    images.get(abs).pages.push(url);
  }
  for (const m of html.matchAll(/href=["']([^"'#?]+)["']/gi)) {
    let u;
    try {
      u = new URL(m[1], url);
    } catch {
      continue;
    }
    if (
      u.origin !== new URL(ORIGIN).origin ||
      /\.(jpg|jpeg|png|webp|gif|svg|pdf|css|js|xml)$/i.test(u.pathname) ||
      /wp-(admin|json|login)/.test(u.pathname)
    )
      continue;
    const href = u.href.replace(/\/?$/, "/");
    if (!seen.has(href)) {
      seen.add(href);
      queue.push(href);
    }
  }
  console.log("page", url);
}

for (const img of images.values()) {
  try {
    const name = decodeURIComponent(new URL(img.url).pathname.split("/").pop());
    await writeFile(path.join(OUT, "images", name), Buffer.from(await (await get(img.url)).arrayBuffer()));
    img.file = `content-source/images/${name}`;
  } catch (e) {
    img.error = e.message;
  }
}
await writeFile(path.join(OUT, "images.json"), JSON.stringify([...images.values()], null, 2));
console.log(`\n${seen.size} pages, ${images.size} images → ${OUT}`);
