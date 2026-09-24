// QA: serve ./out, crawl every internal link, and at each breakpoint check for horizontal
// overflow, console errors, broken links and axe violations. Screenshots go to qa-output/.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
const PRE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"; // preinstalled in the cloud dev container
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve("axe-core/axe.min.js"), "utf8");
const OUT = path.resolve("out");
const SHOTS = path.resolve("qa-output");
await mkdir(SHOTS, { recursive: true });

const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".json": "application/json",
};
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let f = path.join(OUT, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!existsSync(f)) {
    res.writeHead(404);
    res.end(await readFile(path.join(OUT, "404.html")));
    return;
  }
  res.writeHead(200, { "content-type": types[path.extname(f)] ?? "application/octet-stream" });
  res.end(await readFile(f));
}).listen(4173);
const BASE = "http://localhost:4173";

const widths = (process.env.WIDTHS ?? "390,430,768,1024,1440,1920").split(",").map(Number);
const onlyShots = process.env.SHOTS; // comma list of paths to screenshot (default: all)
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? (existsSync(PRE) ? PRE : undefined) });
const problems = [];

// 1. Crawl
const seen = new Set(["/"]);
const queue = ["/"];
const ctx0 = await browser.newContext();
const crawl = await ctx0.newPage();
while (queue.length) {
  const u = queue.shift();
  const r = await crawl.goto(BASE + u);
  if (!r || r.status() !== 200) problems.push(`BROKEN ${u} -> ${r?.status()}`);
  const hrefs = await crawl.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
  for (const h of hrefs) {
    if (!h || !h.startsWith("/")) continue;
    const clean = h.split("#")[0].split("?")[0];
    if (!seen.has(clean)) {
      seen.add(clean);
      queue.push(clean);
    }
  }
}
console.log(`Crawled ${seen.size} internal URLs`);

// 2. Per-page, per-width checks
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && problems.push(`CONSOLE ${w}px ${page.url()}: ${m.text()}`));
  page.on("pageerror", (e) => problems.push(`PAGEERROR ${w}px ${page.url()}: ${e.message}`));
  for (const u of seen) {
    await page.goto(BASE + u, { waitUntil: "networkidle" });
    // Reveal everything (without transitions) for screenshots and contrast checks.
    await page.addStyleTag({
      content: "*,*::before,*::after{transition:none!important;animation:none!important}html{scroll-behavior:auto!important}",
    });
    await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-visible")));
    await page.waitForTimeout(250);
    const overflow = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const bad = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > vw + 1 || r.left < -1) && getComputedStyle(el).position !== "fixed") {
          if (!el.closest("[hidden]")) bad.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} r=${Math.round(r.right)}`);
        }
      }
      return { scroll: document.documentElement.scrollWidth > vw, bad: bad.slice(0, 5) };
    });
    if (overflow.scroll || overflow.bad.length) problems.push(`OVERFLOW ${w}px ${u}: ${JSON.stringify(overflow)}`);
    const tiny = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll("p, a, li, span, dd, dt, label, button")) {
        if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs < 11 && el.getBoundingClientRect().width) out.push(`${el.tagName} ${fs}px "${el.textContent.trim().slice(0, 30)}"`);
      }
      return out.slice(0, 3);
    });
    if (tiny.length) problems.push(`TINYTEXT ${w}px ${u}: ${tiny.join(" | ")}`);
    if (w === 1440 || w === 390) {
      await page.addScriptTag({ content: axeSource });
      const res = await page.evaluate(async () =>
        (await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] })).violations.map(
          (v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.nodes[0].target.join(" ")}`,
        ),
      );
      for (const v of res) problems.push(`AXE ${w}px ${u}: ${v}`);
    }
    if (!onlyShots || onlyShots.split(",").includes(u)) {
      const name = (u === "/" ? "home" : u.replace(/\//g, "_").replace(/^_|_$/g, "")) + `-${w}.png`;
      await page.screenshot({ path: path.join(SHOTS, name), fullPage: true });
    }
  }
  await ctx.close();
}

// 3. Lorem ipsum / fabricated-content guard
const bodyText = [];
for (const u of seen) {
  await crawl.goto(BASE + u);
  bodyText.push(await crawl.evaluate(() => document.body.innerText));
}
if (/lorem ipsum/i.test(bodyText.join(" "))) problems.push("CONTENT: Lorem ipsum found");

await browser.close();
server.close();
console.log(problems.length ? problems.join("\n") : "No problems found");
console.log(`${problems.length} problem(s)`);
