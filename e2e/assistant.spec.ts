import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("musterring.consent", "false"));
});

test("Product Detail to Better Match to comparison", async ({ page }) => {
  await page.goto("/furniture/mr-2875");
  await page.getByRole("button", { name: /Find a Better Match for Me/ }).click();
  await page.getByLabel("What should be different?").fill("Same style, under 240 cm with a higher seat");
  await page.getByRole("button", { name: "Find alternatives" }).click();
  await expect(page.getByText(/catalogue alternative|No exact alternative/).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Compare/ }).first()).toBeVisible();
});

test("Material Advisor grounds and saves a material", async ({ page }) => {
  await page.goto("/materials");
  await page.getByLabel("Describe your home and everyday needs").fill("I have two children, a dog and strong afternoon sunlight.");
  await page.getByRole("button", { name: "Advise me" }).click();
  await expect(page.getByRole("heading", { name: "Recommended from available material data" })).toBeVisible();
  await page.getByRole("button", { name: "Save Material to Project" }).first().click();
  await expect(page.getByRole("button", { name: "Saved Material" }).first()).toBeVisible();
});

test("Voice text fallback searches products", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Product Advisor" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("Show me a modular corner sofa in beige.");
  await page.getByRole("button", { name: "Interpret typed text as a voice command" }).click();
  await expect(page).toHaveURL(/\/search\?q=/);
});

test("Voice state-changing action requires confirmation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Product Advisor" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("Book a consultation.");
  await page.getByRole("button", { name: "Interpret typed text as a voice command" }).click();
  await expect(page.getByRole("heading", { name: "Confirmation required" })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});

test("Advisor answers a grounded product question", async ({ page }) => {
  await page.goto("/furniture/mr-2875");
  await page.getByRole("button", { name: "Open Musterring Product Advisor" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("What is the width and seat height of this product?");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText(/cm wide with a .* cm seat height/)).toBeVisible();
  await expect(page.getByText(/Source: Musterring product catalogue/)).toBeVisible();
});

test("Advisor recommends and saves a referenced product after confirmation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Product Advisor" }).click();
  const input = page.getByLabel("Ask Musterring about products and your project");
  await input.fill("Show me compact sofas under 260 cm");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.locator(".advisor-products a").first()).toBeVisible();
  await input.fill("Save the second one.");
  await page.getByRole("button", { name: "Send question" }).click();
  await page.getByRole("button", { name: /Save .* to My Musterring/ }).click();
  await page.getByRole("button", { name: "Confirm" }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("musterring.savedProducts") ?? "[]").length)).toBeGreaterThan(0);
});

test("Advisor configuration action continues to deterministic configurator", async ({ page }) => {
  await page.goto("/furniture/mr-2875");
  await page.getByRole("button", { name: "Open Musterring Product Advisor" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("Can I add an electric relax function?");
  await page.getByRole("button", { name: "Send question" }).click();
  await page.getByRole("button", { name: /Validate options/ }).click();
  await expect(page).toHaveURL(/\/configurator\/mr-2875/);
  await expect(page.getByText(/Deterministic product rules/)).toBeVisible();
});

test("Advisor resolves a follow-up against prior products", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Product Advisor" }).click();
  const input = page.getByLabel("Ask Musterring about products and your project");
  await input.fill("Show me compact sofas under 260 cm");
  await page.getByRole("button", { name: "Send question" }).click();
  await input.fill("Which one has the highest seat?");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText(/highest recorded seat height/)).toBeVisible();
});

test("Advisor prepares but does not submit retailer handover", async ({ page }) => {
  await page.goto("/my-musterring");
  await page.getByRole("button", { name: "Open Musterring Product Advisor" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("Prepare this project for a retailer.");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText(/will not submit it/)).toBeVisible();
  await page.getByRole("button", { name: "Review retailer handover checklist" }).click();
  await expect(page.getByRole("heading", { name: "Confirmation required" })).toBeVisible();
});

test("Missing API key retains deterministic Advisor behavior", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Product Advisor" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("What is the weather on Mars?");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText(/not currently available in the connected product data/i)).toBeVisible();
});

test("Mobile Advisor uses a full-height bottom sheet", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1000) > 600, "Mobile-only check");
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Product Advisor" }).click();
  const panel = page.locator(".advisor-panel");
  await expect(panel).toBeVisible();
  expect(await panel.evaluate((element) => Math.round(element.getBoundingClientRect().width))).toBe(page.viewportSize()?.width);
});

test("Advisor supports keyboard-only open, input and close", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Product Advisor" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Ask Musterring about products and your project")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator(".advisor-panel")).toHaveCount(0);
});
