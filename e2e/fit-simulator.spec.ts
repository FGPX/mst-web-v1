import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/will-it-fit/mr-2875");
});

test("shows the scaled room and product silhouette", async ({ page }) => {
  await expect(page.getByRole("img", { name: /Top-down room placement/ })).toBeVisible();
  await expect(page.getByText(/Wall distances:/)).toBeVisible();
});

test("updates room dimensions live", async ({ page }) => {
  await page.getByLabel("Width in centimetres").first().fill("500");
  await expect(page.getByText("500 cm").first()).toBeVisible();
});

test("supports accessible product coordinates", async ({ page }) => {
  await page.getByLabel("X position in centimetres").fill("180");
  await expect(page.getByText(/left 61/)).toBeVisible();
});

test("rotates and centres the product", async ({ page }) => {
  await page.getByRole("button", { name: "Rotate +15°" }).click();
  await page.getByRole("button", { name: "Centre" }).click();
  await expect(page.locator(".fit-product-dims")).toContainText("15°");
});

test("adds, edits and deletes an obstacle", async ({ page }) => {
  await page.getByText("Objects & restrictions").click();
  await page.getByRole("button", { name: /obstacle/i }).click();
  await page.getByLabel("Selected object name").fill("Coffee table");
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("button", { name: "Coffee table" })).toHaveCount(0);
});

test("applies an automatic placement suggestion", async ({ page }) => {
  await page.getByRole("button", { name: /Recommended/ }).click();
  await expect(page.getByText(/Wall distances:/)).toBeVisible();
});

test("shows modular delivery components and route status", async ({ page }) => {
  await page.getByRole("button", { name: "Delivery path" }).first().click();
  await expect(page.getByText("Delivery components")).toBeVisible();
  await expect(page.getByText("Entrance door").first()).toBeVisible();
});

test("detects a narrow entrance deterministically", async ({ page }) => {
  await page.getByRole("button", { name: "Delivery path" }).first().click();
  await page.getByLabel("Entrance width in centimetres").fill("40");
  await expect(page.getByText(/more width may be needed/).first()).toBeVisible();
});

test("saves a complete report to My Musterring storage", async ({ page }) => {
  await page.getByRole("button", { name: "Save fit report" }).click();
  await expect(page.getByRole("button", { name: "Fit report saved" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("musterring.fitReports") ?? "[]").length)).toBeGreaterThan(0);
});

test("mobile keeps the canvas and sticky navigation usable", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1000) > 600, "Mobile-only check");
  await expect(page.getByRole("img", { name: /Top-down room placement/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Continue/ })).toBeVisible();
});
