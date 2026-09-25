// End-to-end checks of interactive features against the static build (npm run build first).
// Usage: node scripts/e2e.mjs
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const PRE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"; // preinstalled in the cloud dev container
const axeSource = await readFile(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const T = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".ics": "text/calendar",
};
const server = createServer(async (req, res) => {
  let f = path.join("out", decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (existsSync(f) && statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!existsSync(f)) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { "content-type": T[path.extname(f)] ?? "application/octet-stream" });
  res.end(await readFile(f));
}).listen(4178);
const BASE = "http://localhost:4178";
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? (existsSync(PRE) ? PRE : undefined) });

let failures = 0;
const results = [];
async function test(name, fn) {
  try {
    await fn();
    results.push(`  ✓ ${name}`);
  } catch (e) {
    failures++;
    results.push(`  ✗ ${name}\n      ${String(e.message).split("\n")[0]}`);
  }
}
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
async function axe(page, context = "document") {
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(
    async (ctx) =>
      (
        await window.axe.run(ctx === "document" ? document : document.querySelector(ctx), { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] })
      ).violations.map((v) => `${v.id}: ${v.nodes[0].target}`),
    context,
  );
}

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });

await test("mobile menu: opens, contains focus, closes on Escape, restores focus", async () => {
  const p = await mobile.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.click('button[aria-controls="mobile-menu"]');
  assert((await p.getAttribute('button[aria-controls="mobile-menu"]', "aria-expanded")) === "true", "not expanded");
  assert(await p.$eval("#main", (m) => m.hasAttribute("inert")), "page behind menu is not inert");
  for (let i = 0; i < 12; i++) await p.keyboard.press("Tab");
  assert(await p.evaluate(() => !document.getElementById("main").contains(document.activeElement)), "focus escaped into the page");
  await p.keyboard.press("Escape");
  assert((await p.evaluate(() => document.activeElement?.getAttribute("aria-controls"))) === "mobile-menu", "focus not restored to toggle");
  assert(!(await p.$eval("#main", (m) => m.hasAttribute("inert"))), "inert not removed");
});

await test("mobile menu: navigates client-side and closes", async () => {
  const p = await mobile.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.click('button[aria-controls="mobile-menu"]');
  await p.click("#mobile-menu >> text=Clinics");
  await p.waitForURL("**/clinics/");
  assert(await p.$eval("#mobile-menu", (e) => e.hidden), "menu still open");
});

await test("search: Ctrl+K opens, 'pcod' → Enter navigates to the PCOS page", async () => {
  const p = await desktop.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.keyboard.press("Control+k");
  await p.waitForSelector("dialog[open]");
  await p.keyboard.type("pcod");
  await p.waitForFunction(() => document.querySelector('[role="option"]')?.textContent?.includes("PCOS"));
  const violations = await axe(p, "dialog[open]");
  assert(!violations.length, `axe in dialog: ${violations.join(", ")}`);
  await p.keyboard.press("Enter");
  await p.waitForURL("**/services/pcos-pcod-treatment/");
  assert(!(await p.$("dialog[open]")), "dialog did not close");
});

await test("search: '/' opens, arrows move the active option, Esc closes", async () => {
  const p = await desktop.newPage();
  await p.goto(BASE + "/clinics/", { waitUntil: "networkidle" });
  await p.keyboard.press("/");
  await p.waitForSelector("dialog[open]");
  await p.keyboard.type("pregnancy");
  await p.waitForFunction(() => document.querySelectorAll('[role="option"]').length > 2);
  await p.keyboard.press("ArrowDown");
  const ok = await p.evaluate(() => {
    const id = document.querySelector('input[role="combobox"]').getAttribute("aria-activedescendant");
    return document.getElementById(id)?.getAttribute("aria-selected") === "true" && id.endsWith("-1");
  });
  assert(ok, "ArrowDown did not move aria-activedescendant to the second option");
  await p.keyboard.press("Escape");
  assert(!(await p.$("dialog[open]")), "Esc did not close");
});

await test("search: mobile trigger opens full-screen dialog", async () => {
  const p = await mobile.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.click('button[aria-label="Search the site"]');
  await p.waitForSelector("dialog[open]");
  const box = await p.$eval("dialog[open]", (d) => d.getBoundingClientRect().height);
  assert(box >= 800, `dialog height ${box}`);
});

await test("booking: validates, preselects clinic, composes WhatsApp message", async () => {
  const p = await mobile.newPage();
  await p.goto(BASE + "/book/?clinic=medsarc-sector-39", { waitUntil: "networkidle" });
  assert(await p.$eval('input[value="medsarc-sector-39"]', (e) => e.checked), "clinic not preselected");
  await p.evaluate(() => (window.open = (u) => ((window.__opened = u), null)));
  await p.click("text=Send via WhatsApp");
  assert((await p.textContent("#booking-error")).includes("name"), "missing validation");
  await p.fill('input[name="name"]', "Test Patient");
  await p.fill('input[name="phone"]', "98765 43210");
  await p.click("text=Send via WhatsApp");
  const url = await p.evaluate(() => window.__opened);
  assert(url?.startsWith("https://wa.me/919902905188?text="), `bad url ${url}`);
  assert(decodeURIComponent(url).includes("Medsarc Advanced Superspeciality Clinics"), "clinic missing in message");
});

await test("due date calculator: live result, validation and .ics download", async () => {
  const p = await mobile.newPage();
  await p.goto(BASE + "/resources/due-date-calculator/", { waitUntil: "networkidle" });
  const lmp = await p.evaluate(() => {
    const n = new Date();
    const t = new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - 150 * 86400000);
    return t.toISOString().slice(0, 10);
  });
  await p.fill('input[type="date"]', lmp);
  await p.waitForSelector("text=Estimated due date");
  const ga = (await p.textContent('[aria-live="polite"]')).replace(/\s+/g, " ");
  assert(/21 wk 3 d/.test(ga), `unexpected GA: ${ga.slice(0, 120)}`);
  assert(/Now/.test(ga), "current milestone not flagged");
  const [download] = await Promise.all([p.waitForEvent("download"), p.click("text=Add dates to calendar")]);
  assert(download.suggestedFilename() === "pregnancy-timeline.ics", "wrong filename");
  const future = await p.evaluate(() => new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10));
  await p.fill('input[type="date"]', future);
  await p.waitForSelector("text=can't be in the future");
  await p.click("text=IVF transfer");
  assert(await p.isVisible("text=Embryo age at transfer"), "IVF options missing");
  const violations = await axe(p);
  assert(!violations.length, `axe: ${violations.join(", ")}`);
});

await test("service page: section nav follows scroll and anchors clear the sticky bars", async () => {
  const p = await mobile.newPage();
  await p.goto(BASE + "/services/high-risk-pregnancy/", { waitUntil: "networkidle" });
  await p.click('nav[aria-label="On this page"] >> text=Care & treatment');
  await p.waitForTimeout(900);
  const top = await p.$eval("#care-title", (h) => h.getBoundingClientRect().top);
  const navBottom = await p.$eval('nav[aria-label="On this page"]', (n) => n.getBoundingClientRect().bottom);
  assert(top >= navBottom, `heading hidden under sticky nav (${top} < ${navBottom})`);
  await p.$eval("#faq-title", (h) => h.scrollIntoView({ behavior: "instant" }));
  await p.waitForTimeout(500);
  const current = await p.$eval('nav[aria-label="On this page"] [aria-current="location"]', (a) => a.textContent);
  assert(current === "FAQ", `active item is ${current}`);
});

for (const r of results) console.log(r);
console.log(failures ? `\n${failures} failing` : `\nall ${results.length} passed`);
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
