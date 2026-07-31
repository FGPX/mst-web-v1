import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.AUDIT_BASE_URL ?? "http://127.0.0.1:3000";
const outputDirectory = path.resolve("docs/audit-screenshots");
const routes = [
  ["/", "home"],
  ["/presentation", "presentation"],
  ["/search?q=compact%20beige%20modular%20sofa%20maximum%20width%20240%20cm", "search"],
  ["/furniture", "furniture"],
  ["/furniture/mr-2875", "product-mr-2875"],
  ["/configurator/mr-2875", "configurator-mr-2875"],
  ["/compare?ids=p1,p2,p4", "compare"],
  ["/my-musterring", "my-musterring"],
  ["/my-musterring/projects/project-living", "project-detail"],
  ["/room-composer", "room-composer"],
  ["/room-composer/upload", "room-composer-upload"],
  ["/inspiration/rooms", "inspiration-rooms"],
  ["/visual-search", "visual-search"],
  ["/will-it-fit/mr-2875", "will-it-fit"],
  ["/materials", "materials"],
  ["/comfort-match", "comfort-match"],
  ["/dealers", "dealers"],
  ["/dealers/d1", "dealer-detail"],
  ["/handover", "handover"],
  ["/booking/confirmation", "booking-confirmation"],
  ["/privacy", "privacy"],
  ["/route-that-does-not-exist", "not-found"]
];
const viewports = [
  { name: "375", width: 375, height: 812, screenshot: true },
  { name: "390", width: 390, height: 844, screenshot: true },
  { name: "768", width: 768, height: 1024, screenshot: true },
  { name: "1024", width: 1024, height: 900 },
  { name: "1440", width: 1440, height: 1000, screenshot: true },
  { name: "1920", width: 1920, height: 1080, screenshot: true }
];

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });
const manifest = [];

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  await context.addInitScript(() => localStorage.setItem("musterring.consent", "false"));
  for (const [route, slug] of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const failedResources = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400) failedResources.push({ status: response.status(), url: response.url() });
    });
    let response;
    let navigationError = "";
    try {
      response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle", timeout: 30000 });
    } catch (error) {
      navigationError = error instanceof Error ? error.message : String(error);
    }
    const metrics = await page.evaluate(() => ({
      title: document.title,
      heading: document.querySelector("h1")?.textContent?.trim() ?? "",
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      bodyTextLength: document.body.innerText.length
      ,
      overflowElements: [...document.querySelectorAll("*")]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === "string" ? element.className : "",
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          };
        })
        .filter((element) => element.left < -1 || element.right > document.documentElement.clientWidth + 1)
        .slice(0, 20)
    })).catch(() => ({
      title: "",
      heading: "",
      documentWidth: 0,
      viewportWidth: viewport.width,
      horizontalOverflow: false,
      bodyTextLength: 0
      ,
      overflowElements: []
    }));
    let screenshot = "";
    if (viewport.screenshot) {
      screenshot = path.join(outputDirectory, `${slug}-${viewport.name}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
    }
    manifest.push({
      route,
      slug,
      viewport: `${viewport.width}x${viewport.height}`,
      status: response?.status() ?? 0,
      url: page.url(),
      screenshot: screenshot ? path.relative(process.cwd(), screenshot).replaceAll("\\", "/") : "",
      navigationError,
      consoleErrors,
      pageErrors,
      failedResources,
      ...metrics
    });
    await page.close();
  }
  await context.close();
}

await browser.close();
const manifestPath = path.join(outputDirectory, "manifest.json");
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

const failures = manifest.filter((entry) =>
  entry.navigationError ||
  entry.pageErrors.length ||
  (entry.consoleErrors.length && entry.slug !== "not-found") ||
  entry.horizontalOverflow ||
  entry.status >= 500 ||
  (entry.slug === "not-found" ? entry.status !== 404 : entry.status >= 400) ||
  entry.bodyTextLength < 20
);
console.log(`Audited ${manifest.length} route/viewport combinations.`);
console.log(`Saved ${manifest.filter((entry) => entry.screenshot).length} screenshots.`);
console.log(`Found ${failures.length} combinations requiring review.`);
for (const failure of failures) {
  console.log(`${failure.viewport} ${failure.route}: status=${failure.status} overflow=${failure.horizontalOverflow} console=${failure.consoleErrors.length} pageErrors=${failure.pageErrors.length}`);
}
process.exitCode = failures.length ? 1 : 0;
