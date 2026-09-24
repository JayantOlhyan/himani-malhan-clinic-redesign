// Renders public/og.png (1200x630) from HTML using the site's own fonts. Run: node scripts/og.mjs
import { chromium } from "playwright";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const PRE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"; // preinstalled in the cloud dev container
const font = (f) => `data:font/woff2;base64,${readFileSync(path.resolve("src/app/fonts", f)).toString("base64")}`;
const html = `<!doctype html><html><head><style>
@font-face{font-family:C;src:url(${font("cormorant-garamond-latin-wght-normal.woff2")});font-weight:300 700}
@font-face{font-family:C;font-style:italic;src:url(${font("cormorant-garamond-latin-wght-italic.woff2")});font-weight:300 700}
@font-face{font-family:M;src:url(${font("manrope-latin-wght-normal.woff2")});font-weight:200 800}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#f8f4f0;font-family:M;color:#4a2637;display:grid;grid-template-columns:1fr 360px}
.l{padding:72px 0 64px 80px;display:flex;flex-direction:column}.e{font-size:15px;letter-spacing:.2em;text-transform:uppercase;color:#8b4c5f;font-weight:600}
h1{font-family:C;font-weight:500;font-size:84px;line-height:.98;margin-top:28px;letter-spacing:-.015em;font-variant-numeric:lining-nums}h1 em{color:#8b4c5f}
.m{margin-top:auto;font-size:19px;color:#5f5758;line-height:1.5}.m b{color:#4a2637;font-weight:600}
.r{background:#4a2637;display:flex;align-items:center;justify-content:center;position:relative}.r:after{content:"";position:absolute;inset:18px;border:1px solid rgba(248,244,240,.2)}
svg{width:190px;color:#ecdcdc;opacity:.9}</style></head><body>
<div class="l"><p class="e">Obstetrics · Gynaecology · Fetal Medicine</p><h1>Dr. Himani<br><em>Kundoo</em></h1>
<p class="m"><b>Obstetrician &amp; Gynaecologist · Fetal &amp; Maternal Medicine Specialist</b><br>14+ years of experience · Gurugram</p></div>
<div class="r"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width=".7" stroke-linejoin="round"><path d="M20 5.5C26 12.5 26 21.5 20 29.5C14 21.5 14 12.5 20 5.5Z"/><path d="M20 29.5C13 28 8.2 22.2 6.8 14.8C12.8 15.8 17.8 20.8 20 29.5Z"/><path d="M20 29.5C27 28 31.8 22.2 33.2 14.8C27.2 15.8 22.2 20.8 20 29.5Z"/><path d="M10.5 33.2C16.5 35.4 23.5 35.4 29.5 33.2" stroke-linecap="round"/></svg></div>
</body></html>`;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? (existsSync(PRE) ? PRE : undefined) });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/og.png" });
await browser.close();
console.log("wrote public/og.png");
