import { expect, test, type Page } from "@playwright/test";
import { products } from "../lib/data";

function stylistResponse() {
  const slots = [
    { slotId: "living-seating", slotLabel: "Seating", categories: ["sofa", "sectional"] },
    { slotId: "living-table", slotLabel: "Coffee table", categories: ["coffee-table"] },
    { slotId: "living-storage", slotLabel: "Living storage", categories: ["storage"] }
  ];
  return {
    preferences: {
      roomType: "living-room",
      answers: { target: "complete-living-room", "seating-capacity": "3", "seating-type": "modular-sofa", "special-functions": "relax-function", space: "compact", material: "fabric", "style-colours": "light-neutral" },
      notes: {}, selectedProductIds: [], target: "complete-living-room", style: "minimalist-scandinavian", palette: "light-neutral", material: "fabric", spaceSize: "compact", maxWidthMm: null, maxDepthMm: null, priorities: ["flexible-modular", "compact-footprint"]
    },
    title: "Warm modern living set",
    rationale: "A coherent catalogue-grounded set for the selected quiz preferences.",
    catalogueMatch: { level: "partial", message: "This set combines explicit and partial catalogue evidence for the selected preferences." },
    roomType: "living-room",
    style: "modern-contemporary",
    ai: { provider: "openai", mode: "Test fixture" },
    selections: slots.map((slot) => {
      const matches = products.filter((product) => product.active && slot.categories.includes(product.category)).slice(0, 3);
      return {
        slotId: slot.slotId,
        slotLabel: slot.slotLabel,
        product: matches[0],
        reason: "Selected from verified catalogue candidates.",
        styleMatch: "partial",
        preferenceMatch: "partial",
        matchEvidence: ["Authorized catalogue copy supports the selected direction."],
        alternatives: matches.slice(1).map((product) => ({ product, reason: "A grounded catalogue alternative.", styleMatch: "partial", preferenceMatch: "partial", matchEvidence: [] }))
      };
    })
  };
}

async function prepareStylistQuiz(page: Page) {
  await page.getByRole("button", { name: /^Living room/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /^Complete living room/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /^3/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /^Modular sofa/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /^Relax function/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /^Compact/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /^Fabric/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /^Light & neutral/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.getByRole("button", { name: "Create my recommendations" })).toBeEnabled();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("musterring.consent", "false"));
});

test("Search to product to save", async ({ page }) => {
  await page.goto("/search?q=compact beige modular sofa maximum width 240 cm");
  await expect(page.getByRole("heading", { name: /catalogue match|Other products to consider/ }).first()).toBeVisible();
  await page.getByRole("button", { name: "Save to Project" }).first().click();
  await expect(page.getByRole("button", { name: "Saved" }).first()).toBeVisible();
});

test("Product to configure to save configuration", async ({ page }) => {
  await page.goto("/furniture/mr-2875");
  await page.getByText("Configure This Product").first().click();
  await expect(page.getByText("Configuration ID")).toBeVisible();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByRole("button", { name: "Saved", exact: true })).toBeVisible();
  const configurationId = await page.locator(".stitch-config-id strong").textContent();
  await page.goto(`/configurator/mr-2875?configuration=${encodeURIComponent(configurationId ?? "")}`);
  await expect(page.locator(".stitch-config-id strong")).toHaveText(configurationId ?? "");
});

test("Compare three products", async ({ page }) => {
  await page.goto("/compare");
  await expect(page.getByRole("heading", { name: "Product Comparison" })).toBeVisible();
});

test("Complete Will It Fit", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/will-it-fit/mr-2875");
  await expect(page.getByRole("heading", { name: /Will It Fit/ })).toBeVisible();
  await page.getByRole("button", { name: "Save fit report" }).click();
  expect(pageErrors, `Page errors: ${pageErrors.join(" | ")}`).toEqual([]);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("musterring.fitReports") ?? "[]").length)).toBeGreaterThan(0);
  await expect(page.getByRole("button", { name: "Fit report saved" })).toBeVisible();
});

test("Select dealer and book consultation", async ({ page }) => {
  await page.goto("/dealers");
  await page.getByText("Select Retailer").first().click();
  await page.goto("/handover");
  await page.getByLabel("First name").fill("Demo");
  await page.getByLabel("Last name").fill("User");
  await page.locator("main").getByLabel("Email address").fill("demo@example.com");
  await page.getByLabel(/I agree that my project data/).check();
  await page.getByRole("button", { name: "Review retailer request" }).click();
  await page.getByRole("button", { name: "Confirm request" }).click();
  await expect(page.getByRole("heading", { name: /Your project has been sent to/ })).toBeVisible();
  await page.getByRole("link", { name: "View in My Musterring" }).click();
  await expect(page.getByRole("heading", { name: "Book a Consultation" })).toBeVisible();
});

test("Select dealer and request quote", async ({ page }) => {
  await page.goto("/dealers");
  await page.getByText("Select Retailer").first().click();
  await page.goto("/handover");
  await page.getByLabel("Request type").selectOption("Request a Quote");
  await page.getByLabel("First name").fill("Quote");
  await page.locator("main").getByLabel("Email address").fill("quote@example.com");
  await page.getByLabel(/I agree that my project data/).check();
  await page.getByRole("button", { name: "Review retailer request" }).click();
  await page.getByRole("button", { name: "Confirm request" }).click();
  await expect(page).toHaveURL(/\/booking\/confirmation/);
  await expect(page.locator("main p").filter({ hasText: "Request type:" })).toContainText("Request a Quote");
});

test("Create and save room scene", async ({ page }) => {
  await page.goto("/room-composer");
  await page.getByRole("button", { name: /Add to room/ }).first().click({ force: true });
  await page.getByRole("button", { name: "Save concept" }).click();
  await expect(page.getByRole("button", { name: "Saved to project" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("musterring.roomScenes") ?? "[]").length)).toBeGreaterThan(0);
});

test("Guest save persists after refresh", async ({ page }) => {
  await page.goto("/search?q=compact%20sofa");
  await page.getByRole("button", { name: "Save to Project" }).first().click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Saved" }).first()).toBeVisible();
});

test("Mobile navigation exposes primary destinations", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) > 600, "Mobile-only navigation check.");
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("link", { name: "My Project", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Furniture", exact: true }).last().click();
  await expect(page).toHaveURL(/\/furniture$/);
});

test("Keyboard search journey", async ({ page }) => {
  await page.goto("/search");
  const input = page.getByRole("textbox", { name: "Describe the furniture you are looking for" });
  await input.focus();
  await input.fill("MR 2875");
  await input.press("Enter");
  await expect(page.getByRole("heading", { name: /exact catalogue match/ })).toBeVisible();
});

test("Listing selects three products and saves comparison", async ({ page }) => {
  await page.goto("/furniture");
  const compare = page.getByLabel("Compare", { exact: true });
  await compare.nth(0).check();
  await compare.nth(1).check();
  await compare.nth(2).check();
  await page.getByRole("link", { name: "Compare selected" }).click();
  await page.getByRole("button", { name: "Save comparison" }).first().click();
  await expect(page.getByRole("button", { name: "Comparison saved" }).first()).toBeVisible();
});

test("Upload room consent, preview and save", async ({ page }) => {
  await page.goto("/room-composer/upload");
  await page.getByLabel(/I consent to temporary AI processing/).check();
  await page.locator('input[type="file"]').setInputFiles("public/test-assets/musterring/furniture/image-03.jpg");
  await expect(page.getByAltText("Uploaded room scene")).toBeVisible();
  await expect(page.getByText("Room analysis", { exact: true })).toBeVisible();
  await page.getByLabel("Room type").fill("Corrected family living room");
  await expect(page.getByLabel("Room type")).toHaveValue("Corrected family living room");
  await page.getByRole("button", { name: /Add to room/ }).first().click({ force: true });
  await page.getByRole("button", { name: "Save concept" }).click({ force: true });
  await expect(page.getByRole("button", { name: "Saved to project" })).toBeVisible();
});

test("Style Finder creates, adjusts and saves a grounded room set", async ({ page }) => {
  await page.route("**/api/ai/stylist", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(stylistResponse()) }));
  await page.goto("/ai-stylist");
  await prepareStylistQuiz(page);
  await page.getByRole("button", { name: "Create my recommendations" }).click();
  await expect(page.getByRole("heading", { name: "Warm modern living set" })).toBeVisible();
  await page.getByRole("button", { name: /MR|JUSTB|KARA|NARA/ }).first().click();
  await page.getByRole("button", { name: "Save complete set" }).click();
  await expect(page.getByRole("button", { name: "Saved to My Musterring" })).toBeVisible();
  await page.getByRole("link", { name: /View product/ }).first().click();
  await expect(page).toHaveURL(/\/furniture\//);
  await page.goto("/my-musterring");
  await expect(page.getByRole("heading", { name: "Style Finder Sets", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Warm modern living set" })).toBeVisible();
});

test("Style Finder shows a retry and never substitutes demo results", async ({ page }) => {
  let attempts = 0;
  await page.route("**/api/ai/stylist", (route) => {
    attempts += 1;
    return attempts === 1
      ? route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "The room could not be styled right now. Please try again." }) })
      : route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(stylistResponse()) });
  });
  await page.goto("/ai-stylist");
  await prepareStylistQuiz(page);
  await page.getByRole("button", { name: "Create my recommendations" }).click();
  await expect(page.getByText("We could not create the recommendations.")).toBeVisible();
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("heading", { name: "Warm modern living set" })).toBeVisible();
});

test("Style Finder adapts its questions and keeps dimension validation usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ai-stylist");
  await page.getByRole("button", { name: /^Bedroom/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.getByText("What are you looking for?", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Bed Select/ })).toBeVisible();
  await page.getByRole("button", { name: /^Bed Select/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /^160 × 200/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /^Upholstered/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /^No/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /^Maximum comfort/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /^Enter dimensions/ }).click();
  await expect(page.getByRole("button", { name: /Continue/ })).toBeDisabled();
  await page.getByLabel("Maximum width in centimetres").fill("220");
  await page.getByLabel("Maximum depth in centimetres").fill("210");
  await expect(page.getByRole("button", { name: /Continue/ })).toBeEnabled();
  await expect(page.getByRole("heading", { name: "Build your personal brief" })).toBeVisible();
});

test("Material compare and save", async ({ page }) => {
  await page.goto("/materials");
  await page.getByRole("button", { name: "Compare", exact: true }).first().click();
  await page.getByRole("button", { name: "Save Material", exact: true }).first().click();
  await expect(page.getByRole("button", { name: "Saved", exact: true }).first()).toBeVisible();
  await expect(page.getByRole("region", { name: "Material comparison" })).toBeVisible();
});

test("Browser geolocation sorts dealer list", async ({ page, context }) => {
  await context.grantPermissions(["geolocation"], { origin: "http://127.0.0.1:3000" });
  await context.setGeolocation({ latitude: 52.3759, longitude: 9.732 });
  await page.goto("/dealers");
  await page.getByRole("button", { name: "Use my location" }).click();
  await expect(page.getByText("Retailers are sorted by distance from your current location.")).toBeVisible();
});

test("Visual search analyzes an upload inline and shows recommendations", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/search#visual-search");
  await page.locator('input[type="file"]').setInputFiles("public/test-assets/musterring/furniture/image-03.jpg");
  await expect(page.getByText("Visual recommendations")).toBeVisible();
  await expect(page.getByText(/catalogue matches?/i)).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("MR 2490")).toBeVisible();
});

test("Visual search identifies an identical catalogue image before ranking alternatives", async ({ page }) => {
  await page.goto("/search#visual-search");
  await page.locator('input[type="file"]').setInputFiles("public/test-assets/musterring/furniture/image-03.jpg");
  await expect(page.getByText(/^Exact Catalogue Image:/)).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("MR 2490")).toBeVisible();
});

test("No exact colour match is explicitly separated from alternatives", async ({ page }) => {
  await page.goto("/search");
  await page.getByLabel("Describe the furniture you are looking for").fill("purple sofa");
  await page.getByRole("button", { name: "Search products" }).click();
  await expect(page.getByRole("heading", { name: "No exact catalogue match" })).toBeVisible();
  await expect(page.getByText(/There is no exact match in the requested colour/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Other products to consider" })).toBeVisible();
});

test("AI configuration request produces a rule-valid deterministic proposal", async ({ page }) => {
  await page.goto("/configurator/mr-2875");
  await page.getByLabel("Describe your ideal configuration").fill("Build a compact four-seat sofa in beige, maximum 290 cm, with easy-care fabric and relax function.");
  await page.getByRole("button", { name: "Build valid proposal" }).click();
  await expect(page.locator(".ai-config-result")).toContainText("All product rules passed");
  await expect(page.getByText(/Configuration ID CFG-/)).toBeVisible();
});

test("Retailer handover creates summary and retains structured data", async ({ page }) => {
  await page.goto("/furniture/mr-2875");
  await page.getByRole("button", { name: "Save to Project" }).first().click();
  await page.goto("/handover");
  await page.getByRole("button", { name: "Create consultation summary" }).click();
  await expect(page.getByText(/Customer intent:/)).toBeVisible();
  await expect(page.getByText(/Saved project details will be included/)).toBeVisible();
});

test("Missing API key uses complete deterministic demo fallback", async ({ page }) => {
  await page.goto("/search");
  await page.getByLabel("Describe the furniture you are looking for").fill("MR 2875");
  await page.getByRole("button", { name: "Search products" }).click();
  await page.getByText("How these results were prepared").click();
  await expect(page.getByText(/Deterministic demo AI/)).toBeVisible();
  await expect(page.getByText(/exact product code MR 2875/i).first()).toBeVisible();
});

test("AI provider error falls back to deterministic behavior", async ({ page }) => {
  await page.route("**/api/ai/search", async (route) => {
    await route.continue({ headers: { ...route.request().headers(), "x-ai-test-provider-error": "true" } });
  });
  await page.goto("/search");
  await page.getByLabel("Describe the furniture you are looking for").fill("red sofa");
  await page.getByRole("button", { name: "Search products" }).click();
  await page.getByText("How these results were prepared").click();
  await expect(page.getByText(/fallback used/)).toBeVisible();
  await expect(page.getByRole("heading", { name: /exact catalogue/ })).toBeVisible();
});
