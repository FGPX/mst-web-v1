import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("musterring.consent", "false"));
  await page.goto("/presentation");
  await page.getByRole("button", { name: /Reset demo data/ }).click();
  await expect(page.getByRole("status")).toContainText("Presentation data restored");
});

test("Demo A launches grounded intelligent search", async ({ page }) => {
  await page.getByRole("button", { name: /Launch Intelligent Search/ }).click();
  await expect(page).toHaveURL(/\/search\?q=/);
  await expect(page.getByRole("heading", { name: /catalogue match|Other products to consider/ }).first()).toBeVisible();
  await page.getByText("How these results were prepared").click();
  await expect(page.getByText(/checked against available catalogue data/)).toBeVisible();
  await expect(page.getByRole("button", { name: /Save to Project|Saved/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Compare/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Plan with Retailer/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /See It in Your Room/ }).first()).toBeVisible();
});

test("Demo B opens the retailer handover", async ({ page }) => {
  await page.getByRole("button", { name: /Open Retailer Handover/ }).click();
  await expect(page).toHaveURL(/\/handover$/);
  await expect(page.getByRole("heading", { name: /Living Room Project/ })).toBeVisible();
});

test("Demo C restores room, project and retailer context", async ({ page }) => {
  await page.getByRole("button", { name: /Launch Room & Retailer Journey/ }).click();
  await expect(page).toHaveURL(/\/room-composer\/upload\?presentation=1/);
  await expect(page.getByText(/Saved versions: 1/)).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("musterring.roomScenes") ?? "[]")[0]?.items?.length)).toBeGreaterThanOrEqual(3);
  await page.goto("/my-musterring");
  await expect(page.getByText("Ready for Consultation")).toBeVisible();
  await page.goto("/my-musterring/projects/project-living");
  await expect(page.getByText("CFG-MR2875-PRESENTATION")).toBeVisible();
  await page.goto("/handover");
  await expect(page.getByText("CFG-MR2875-PRESENTATION")).toBeVisible();
  await expect(page.getByText("Living Room Presentation Concept")).toBeVisible();
});
