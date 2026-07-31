import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const output = path.resolve("docs/ai-audit-screenshots");
const routes = [
  ["/search?q=compact%20beige%20modular%20sofa%20maximum%20width%20240%20cm", "search"],
  ["/visual-search", "visual-search"],
  ["/room-composer/upload", "room-upload"],
  ["/configurator/mr-2875", "configurator"],
  ["/comfort-match", "comfort-match"],
  ["/handover", "handover"]
];
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 1000 }
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  await context.addInitScript(() => localStorage.setItem("musterring.consent", "false"));
  for (const [route, name] of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    const response = await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "networkidle", timeout: 30_000 });
    const metrics = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      emptyHeadings: [...document.querySelectorAll("h1,h2,h3")].filter((heading) => !heading.textContent?.trim()).length
    }));
    const screenshot = path.join(output, `${name}-${viewport.name}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    results.push({ route, viewport: viewport.name, status: response?.status(), screenshot: path.relative(process.cwd(), screenshot).replaceAll("\\", "/"), consoleErrors, pageErrors, ...metrics });
    await page.close();
  }
  await context.close();
}

await browser.close();
await writeFile(path.join(output, "manifest.json"), `${JSON.stringify(results, null, 2)}\n`, "utf8");
const failures = results.filter((result) => result.status !== 200 || result.horizontalOverflow || result.consoleErrors.length || result.pageErrors.length || result.emptyHeadings);
console.log(`Audited ${results.length} AI route/viewport combinations; ${failures.length} require review.`);
for (const failure of failures) console.log(JSON.stringify(failure));
process.exitCode = failures.length ? 1 : 0;
