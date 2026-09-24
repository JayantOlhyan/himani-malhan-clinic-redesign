// Viewport-sized screenshots down a page, for visual review. Usage: node scripts/shots.mjs /path width [height]
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
const PRE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"; // preinstalled in the cloud dev container
const [, , route = "/", w = "1440", h = "900"] = process.argv;
const OUT = path.resolve("out");
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};
const server = createServer(async (req, res) => {
  let f = path.join(OUT, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (existsSync(f) && statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!existsSync(f)) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { "content-type": types[path.extname(f)] ?? "application/octet-stream" });
  res.end(await readFile(f));
}).listen(4174);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? (existsSync(PRE) ? PRE : undefined) });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
await page.goto("http://localhost:4174" + route, { waitUntil: "networkidle" });
await page.addStyleTag({ content: "*{transition:none!important;animation:none!important}html{scroll-behavior:auto!important}" });
await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-visible")));
const total = await page.evaluate(() => document.documentElement.scrollHeight);
const dir = path.resolve("qa-output/shots");
await mkdir(dir, { recursive: true });
const slug = (route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_|_$/g, "")) + `-${w}`;
let i = 0;
for (let y = 0; y < total; y += +h) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(dir, `${slug}-${String(i++).padStart(2, "0")}.png`) });
}
console.log(slug, i, "shots, height", total);
await browser.close();
server.close();
