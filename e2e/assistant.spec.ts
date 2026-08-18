import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("musterring.consent", "false"));
});

test("Product Detail shows validated Better Match results", async ({ page }) => {
  await page.goto("/furniture/mr-2875");
  await page.getByRole("button", { name: /Discover More Like This/ }).click();
  await expect(page.getByLabel("What are you looking for?")).toHaveValue("");
  await page.getByLabel("What are you looking for?").fill("Same style, but smaller");
  await page.getByRole("button", { name: "Show matches" }).click();
  await expect(page.getByRole("heading", { name: "Exact matches" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Other options" })).toBeVisible();
  await expect(page.locator(".alternative-group.is-exact article").first()).toContainText("Exact match");
  await expect(page.locator(".alternative-group.is-other article").first()).toContainText("Differs from request");
  await expect(page.getByText("Your request", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("dialog", { name: /Alternatives for/ })).not.toContainText(/price|pricing/i);
  await expect(page.getByRole("link", { name: /Compare/ })).toHaveCount(0);
});

test("Better Match treats a red sofa request as a catalogue requirement", async ({ page }) => {
  await page.goto("/furniture/justb-pm200");
  await page.getByRole("button", { name: /Discover More Like This/ }).click();
  await page.getByLabel("What are you looking for?").fill("sofa red");
  await page.getByRole("button", { name: "Show matches" }).click();
  await expect(page.getByText("red colour", { exact: true })).toBeVisible();
  const exactGroup = page.locator(".alternative-group.is-exact");
  await expect(exactGroup).toContainText("MR 260");
  await expect(exactGroup.getByText("Shown in red", { exact: true })).toBeVisible();
  await expect(exactGroup.locator("img")).toHaveAttribute("src", /mr-260%2Fimage-08-hq\.jpg|mr-260\/image-08-hq\.jpg/);
  await expect(exactGroup.locator(".alternative-product-specs")).toContainText(/Width.*Depth.*Height/s);
  const viewProduct = exactGroup.getByRole("link", { name: "View Product" });
  await expect(viewProduct).toHaveAttribute("href", "/furniture/mr-260");
  await expect(exactGroup).not.toContainText("Differs from request");
  await viewProduct.click();
  await expect(page).toHaveURL(/\/furniture\/mr-260$/);
  await expect(page.getByRole("dialog", { name: /Alternatives for/ })).toHaveCount(0);
  await expect(page.locator(".alternative-group.is-other article").first()).toContainText("red colour is not verified for this product");
});

test("Guided search preserves kitchen shape and minimum width constraints", async ({ page }) => {
  await page.goto("/search");
  await page.getByLabel("Describe the furniture you are looking for").fill("L shaped kitchen above 300 cm");
  await page.getByRole("button", { name: "Search products" }).click();
  await expect(page.getByRole("button", { name: "Remove Category filter" })).toContainText("kitchen");
  await expect(page.getByRole("button", { name: "Remove Layout filter" })).toContainText("l-shaped");
  await expect(page.getByRole("button", { name: "Remove Minimum width filter" })).toContainText("300 cm");
  await expect(page.getByRole("heading", { name: "No exact catalogue match" })).toBeVisible();
  await expect(page.getByText("There are no active kitchen products in the connected catalogue.")).toBeVisible();
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
  await page.getByRole("button", { name: "Open Musterring Assistant" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("Show me a modular corner sofa in beige.");
  await page.getByRole("button", { name: "Interpret typed text as a voice command" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".advisor-products a").first()).toBeVisible();
});

test("Voice red sofa search does not show wrong-colour alternatives", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Assistant" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("red sofa");
  await page.getByRole("button", { name: "Interpret typed text as a voice command" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".advisor-products a")).toHaveCount(1);
  await expect(page.locator(".advisor-products")).toContainText("MR 260");
  await expect(page.locator(".advisor-products")).not.toContainText("MR 2490");
});

test("Voice state-changing action requires confirmation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Assistant" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("Book a consultation.");
  await page.getByRole("button", { name: "Interpret typed text as a voice command" }).click();
  await expect(page.getByRole("heading", { name: "Confirmation required" })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});

test("Advisor answers a grounded product question", async ({ page }) => {
  await page.goto("/furniture/mr-2875");
  await page.getByRole("button", { name: "Open Musterring Assistant" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("What is the width and seat height of this product?");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText(/cm wide, .* cm deep .* with a .* cm seat height/)).toBeVisible();
  await expect(page.getByText(/Source: Musterring product catalogue/)).toBeVisible();
});

test("Advisor answers simple conversation naturally", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Assistant" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("okay thank you");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText(/you.re welcome/i)).toBeVisible();
  await expect(page.getByText(/information is not currently available/i)).toHaveCount(0);
});

test("Advisor recommends and saves a referenced product after confirmation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Assistant" }).click();
  const input = page.getByLabel("Ask Musterring about products and your project");
  await input.fill("Show me sofas under 260 cm");
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
  await page.getByRole("button", { name: "Open Musterring Assistant" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("Can I add an electric relax function?");
  await page.getByRole("button", { name: "Send question" }).click();
  await page.getByRole("button", { name: /Validate options/ }).click();
  await expect(page).toHaveURL(/\/configurator\/mr-2875/);
  await expect(page.getByText(/configuration engine validates the product rules/i)).toBeVisible();
});

test("Advisor resolves a follow-up against prior products", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Assistant" }).click();
  const input = page.getByLabel("Ask Musterring about products and your project");
  await input.fill("Show me sofas under 260 cm");
  await page.getByRole("button", { name: "Send question" }).click();
  await input.fill("Which one has the highest seat?");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText(/highest recorded seat height/)).toBeVisible();
});

test("Advisor prepares but does not submit retailer handover", async ({ page }) => {
  await page.goto("/my-musterring");
  await page.getByRole("button", { name: "Open Musterring Assistant" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("Prepare this project for a retailer.");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText(/will not submit it/)).toBeVisible();
  await page.getByRole("button", { name: "Review retailer handover checklist" }).click();
  await expect(page.getByRole("heading", { name: "Confirmation required" })).toBeVisible();
});

test("Missing API key retains deterministic Advisor behavior", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Assistant" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("What is the weather on Mars?");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText(/not currently available in the connected product data/i)).toBeVisible();
});

test("Mobile Advisor uses a full-height bottom sheet", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1000) > 600, "Mobile-only check");
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Assistant" }).click();
  const panel = page.locator(".advisor-panel");
  await expect(panel).toBeVisible();
  expect(await panel.evaluate((element) => Math.round(element.getBoundingClientRect().width))).toBe(page.viewportSize()?.width);
});

test("Advisor supports keyboard-only open, input and close", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Assistant" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Ask Musterring about products and your project")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator(".advisor-panel")).toHaveCount(0);
});

test("Musterring Assistant keeps the conversation after closing and reopening", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Assistant" }).click();
  await page.getByLabel("Ask Musterring about products and your project").fill("hello");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.locator(".advisor-messages article.customer")).toContainText("hello");
  await page.getByRole("button", { name: "Close Musterring Assistant" }).click();
  await page.getByRole("button", { name: "Open Musterring Assistant" }).click();
  await expect(page.locator(".advisor-messages article.customer")).toContainText("hello");
});

test("Musterring Assistant closes when navigating to another page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Musterring Assistant" }).click();
  await expect(page.locator(".advisor-panel")).toBeVisible();
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator(".advisor-panel")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open Musterring Assistant" })).toBeVisible();
});
