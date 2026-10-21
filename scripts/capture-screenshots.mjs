import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = "/opt/cursor/artifacts/screenshots";
const BASE = "http://localhost:3000";

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    localStorage.setItem("urte-theme", t);
    localStorage.setItem("urte-mode", "light");
    const root = document.documentElement;
    root.setAttribute("data-theme", t);
    root.setAttribute("data-mode", "light");
  }, theme);
  await page.waitForFunction(
    (t) => document.documentElement.getAttribute("data-theme") === t,
    theme,
  );
  // Allow CSS variable transitions / paint
  await page.waitForTimeout(400);
}

async function shot(page, name) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log("wrote", file);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  for (const theme of ["fox", "lagoon", "admiralty"]) {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await setTheme(page, theme);
    await shot(page, `home_${theme}`);
  }

  await page.goto(`${BASE}/browse`, { waitUntil: "networkidle" });
  await setTheme(page, "fox");
  await shot(page, "browse_fox");

  await page.goto(`${BASE}/study/delta-v-to-pluto-chemical-vs-ntp-vs-ion`, {
    waitUntil: "networkidle",
  });
  await setTheme(page, "fox");
  await shot(page, "study_pluto_fox");

  await page.goto(`${BASE}/study/submarine-performance-vs-water-temperature`, {
    waitUntil: "networkidle",
  });
  await setTheme(page, "lagoon");
  await shot(page, "study_submarine_lagoon");

  await page.goto(`${BASE}/ask`, { waitUntil: "networkidle" });
  await setTheme(page, "admiralty");
  await shot(page, "ask_admiralty");

  await page.goto(`${BASE}/credits`, { waitUntil: "networkidle" });
  await setTheme(page, "admiralty");
  await shot(page, "credits_admiralty");

  await page.goto(`${BASE}/about`, { waitUntil: "networkidle" });
  await setTheme(page, "fox");
  await shot(page, "about_fox");

  await page.goto(`${BASE}/search?q=pluto`, { waitUntil: "networkidle" });
  await setTheme(page, "lagoon");
  await shot(page, "search_lagoon");

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
