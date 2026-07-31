import { chromium } from "playwright";

const route = process.argv[2] ?? "/";
const width = Number(process.argv[3] ?? 390);
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width, height: 844 } });
await context.addInitScript(() => localStorage.setItem("musterring.consent", "false"));
const page = await context.newPage();
const failedResources = [];
page.on("response", (response) => {
  if (response.status() >= 400) failedResources.push({ status: response.status(), url: response.url() });
});
await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "networkidle" });
const result = await page.evaluate(() => ({
  documentWidth: document.documentElement.scrollWidth,
  viewportWidth: document.documentElement.clientWidth,
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
    .slice(0, 30)
}));
console.log(JSON.stringify({ route, width, failedResources, ...result }, null, 2));
await browser.close();
