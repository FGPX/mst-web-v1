import { describe, expect, it } from "vitest";
import { products } from "@/lib/data";
import { catalogueCategories } from "@/lib/types";
import { buildGroundedConfiguration } from "@/lib/ai/configuration";
import { comparisonSummaryInput, deterministicComparisonSummary } from "@/lib/ai/comparison-summary";
import { groundProjectData } from "@/lib/ai/grounding";
import { hybridCatalogueSearch, searchCatalogueByVisualTags } from "@/lib/ai/retrieval";
import { validatedAIAlternativeRequirements } from "@/lib/ai/alternative-intent";
import { parseSearchExclusions, parseSearchQuery } from "@/lib/search";
import { groundSearchIntent } from "@/lib/ai/search-intent";
import { answerGroundedQuestion } from "@/lib/assistant";
import {
  configurationRequirementsSchema,
  retailerProjectDataSchema,
  roomAnalysisSchema,
  searchIntentSchema,
  visualTagsSchema
} from "@/lib/ai/schemas";

const baseIntent = {
  queryText: "compact beige modular sofa under 240 cm",
  category: "sofa" as const,
  colorFamilies: ["beige"],
  materials: null,
  maxWidthMm: 2400,
  minWidthMm: null,
  targetWidthMm: null,
  minSeatHeightMm: null,
  maxSeatDepthMm: null,
  numberOfSeats: null,
  modular: true,
  functions: null,
  styles: null,
  roomType: null,
  smallSpaceSuitable: true,
  layoutShapes: null
};

describe("AI schemas and fallbacks", () => {
  it("does not allow provider-invented hard filters into catalogue matching", () => {
    const grounded = groundSearchIntent("sofa wider than 300 cm", searchIntentSchema.parse({
      ...baseIntent,
      queryText: "sofa wider than 300 cm",
      colorFamilies: ["beige"],
      modular: true,
      functions: ["relax"]
    }));
    expect(grounded).toMatchObject({ category: "sofa", minWidthMm: 3000 });
    expect(grounded.colorFamilies).toBeNull();
    expect(grounded.modular).toBeNull();
    expect(grounded.functions).toBeNull();
  });

  it("discards model-invented alternative requirements without request evidence", () => {
    const result = validatedAIAlternativeRequirements(
      { sourceProductId: "musterring-justb-pm200", requestText: "red sofa" },
      {
        category: "sofa", colorFamilies: ["red"], styles: ["modern", "classic"], numberOfSeats: null,
        maxWidthMm: null, minWidthMm: null, targetWidthMm: null,
        layoutShapes: ["straight", "l-shaped", "u-shaped", "corner", "island"], excludedLayoutShapes: [], minSeatHeightMm: null,
        requiredFunctions: ["relax", "electric"], excludedFunctions: [],
        materialTags: ["fabric", "leather", "velvet"], preserveStyle: true, preserveComfort: true
      }
    );
    expect(result).toEqual({ category: "sofa", colorFamilies: ["red"] });
  });

  it("keeps explicitly requested style and comfort preservation", () => {
    const result = validatedAIAlternativeRequirements(
      { sourceProductId: "musterring-justb-pm200", requestText: "a red sofa with the same style and same comfort" },
      {
        category: "sofa", colorFamilies: ["red"], styles: [], numberOfSeats: null,
        maxWidthMm: null, minWidthMm: null, targetWidthMm: null, layoutShapes: [], excludedLayoutShapes: [], minSeatHeightMm: null,
        requiredFunctions: [], excludedFunctions: [], materialTags: [], preserveStyle: true, preserveComfort: true
      }
    );
    expect(result).toMatchObject({ category: "sofa", colorFamilies: ["red"], preserveStyle: true, preserveComfort: true });
  });

  it("keeps a negated layout out of positive layout requirements", () => {
    const result = validatedAIAlternativeRequirements(
      { sourceProductId: "musterring-justb-pm200", requestText: "grey sofa, not L-shaped" },
      {
        category: "sofa", colorFamilies: ["grey"], styles: [], numberOfSeats: null,
        maxWidthMm: null, minWidthMm: null, targetWidthMm: null,
        layoutShapes: ["l-shaped"], excludedLayoutShapes: ["l-shaped"], minSeatHeightMm: null,
        requiredFunctions: [], excludedFunctions: [], materialTags: [], preserveStyle: false, preserveComfort: false
      }
    );
    expect(result.layoutShapes).toBeUndefined();
    expect(result.excludedLayoutShapes).toEqual(["l-shaped"]);
  });

  it("validates structured search, image and room outputs", () => {
    expect(searchIntentSchema.safeParse(baseIntent).success).toBe(true);
    expect(visualTagsSchema.safeParse({ category: "sofa", colorFamilies: ["beige"], likelyMaterial: "fabric", style: ["modern"], silhouette: "wide", notableVisualFeatures: ["low arms"] }).success).toBe(true);
    expect(roomAnalysisSchema.safeParse({ roomType: "living room", visibleFloorRegion: "centre", approximateWallAreas: [], windows: [], doors: [], existingMajorFurniture: [], dominantColors: [], styleTags: [], lightingDescription: "daylight" }).success).toBe(true);
  });

  it("rejects invalid AI output instead of trusting it", () => {
    expect(searchIntentSchema.safeParse({ queryText: "sofa", maxWidthMm: "wide" }).success).toBe(false);
    expect(visualTagsSchema.safeParse({ category: "invented", colorFamilies: [] }).success).toBe(false);
  });

  it("builds a grounded comparison fallback for the selected catalogue products", () => {
    const selected = products.filter((product) => product.active).slice(0, 2);
    const input = comparisonSummaryInput(selected);
    const summary = deterministicComparisonSummary(input);
    expect(summary.products.map((product) => product.productId)).toEqual(selected.map((product) => product.id));
    expect(summary.recommendation).toMatch(/retailer|Refine/i);
  });

  it("includes detailed verified facts for the JUSTB! comparison", () => {
    const selected = ["musterring-justb-pm100", "musterring-justb-pm200"]
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is (typeof products)[number] => Boolean(product));
    const input = comparisonSummaryInput(selected);
    const summary = deterministicComparisonSummary(input);

    expect(input.products).toHaveLength(2);
    expect(input.products.every((product) => product.verifiedDetails.length >= 8)).toBe(true);
    expect(input.products.find((product) => product.modelCode === "JUSTB! PM100")?.verifiedDetails)
      .toContainEqual({ label: "Seat construction", value: "Spring core; optional barrel pocket spring core" });
    expect(input.products.find((product) => product.modelCode === "JUSTB! PM200")?.verifiedDetails)
      .toContainEqual({ label: "Seat Height", value: "41 or 43 cm" });
    expect(new Set(summary.products.map((product) => product.summary)).size).toBe(summary.products.length);
    expect(summary.glance.join(" ")).toMatch(/Seat heights|Seat construction/);
    expect(summary.recommendation).not.toMatch(/not enough verified catalogue data/i);
    expect(summary.recommendation).toContain("JUSTB! PM100");
    expect(summary.recommendation).toContain("JUSTB! PM200");
  });

  it("grounds dining-table summaries in verified format and material differences", () => {
    const selected = ["musterring-nica", "musterring-justb-sp100"]
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is (typeof products)[number] => Boolean(product));
    const input = comparisonSummaryInput(selected);
    const summary = deterministicComparisonSummary(input);

    expect(input.products.find((product) => product.modelCode === "NICA")?.verifiedDetails)
      .toContainEqual({ label: "Tabletop shapes", value: "6 verified shapes, including rectangular, oval and round" });
    expect(input.products.find((product) => product.modelCode === "JUSTB! SP100")?.verifiedDetails)
      .toContainEqual({ label: "Tabletop materials", value: "HPL or solid oak" });
    expect(summary.glance.join(" ")).toContain("Tabletop formats");
    expect(summary.recommendation).toContain("NICA");
    expect(summary.recommendation).toContain("JUSTB! SP100");
  });

  it("grounds HELANA versus JUSTB! SP100 in dining level, style and reference height", () => {
    const selected = ["musterring-helana", "musterring-justb-sp100"]
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is (typeof products)[number] => Boolean(product));
    const input = comparisonSummaryInput(selected);
    const summary = deterministicComparisonSummary(input);

    expect(input.products.find((product) => product.modelCode === "HELANA")?.verifiedDetails)
      .toContainEqual({ label: "Reference format", value: "200 × 100 cm tabletop; 96 cm high counter configuration" });
    expect(input.products.find((product) => product.modelCode === "JUSTB! SP100")?.verifiedDetails)
      .toContainEqual({ label: "Dining level", value: "Standard-height dining table for family meals and social gatherings" });
    expect(summary.glance.join(" ")).toContain("Dining concepts");
    expect(summary.glance.join(" ")).not.toContain("200–200");
    expect(summary.products.find((product) => product.productId === "musterring-helana")?.bestFor)
      .toBe("Best for Counter-Height Dining");
    expect(summary.products.find((product) => product.productId === "musterring-justb-sp100")?.bestFor)
      .toBe("Best for Standard Dining");
    expect(summary.recommendation).toContain("HELANA");
    expect(summary.recommendation).toContain("JUSTB! SP100");
  });
});

describe("grounded hybrid retrieval", () => {
  it("excludes explicitly negated catalogue facts from exact and alternative results", async () => {
    const queryText = "sofa that is not red and without relax function";
    const exclusions = parseSearchExclusions(queryText);
    const result = await hybridCatalogueSearch(
      searchIntentSchema.parse({ ...baseIntent, queryText, colorFamilies: null, maxWidthMm: null, modular: null, smallSpaceSuitable: null }),
      undefined,
      exclusions
    );
    const matches = [...result.exactMatches, ...result.closeAlternatives];
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every(({ product }) => !product.colors.includes("red") && !product.functions.includes("relax"))).toBe(true);
  });

  it("returns natural-language results only from catalogue data", async () => {
    const result = await hybridCatalogueSearch(searchIntentSchema.parse(baseIntent));
    const ids = new Set(products.map((product) => product.id));
    const matches = [...result.exactMatches, ...result.closeAlternatives];
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every(({ product }) => ids.has(product.id))).toBe(true);
  });

  it("uses the chatbot's grounded product selection as a search ranking signal", async () => {
    const intent = searchIntentSchema.parse({ ...baseIntent, queryText: "beige sofa", maxWidthMm: null, modular: null, smallSpaceSuitable: null });
    const baseline = await hybridCatalogueSearch(intent);
    const preferred = baseline.exactMatches.at(-1)?.product.id;
    expect(preferred).toBeTruthy();

    const aligned = await hybridCatalogueSearch(intent, undefined, undefined, [preferred!]);
    expect(aligned.exactMatches[0]?.product.id).toBe(preferred);
  });

  it("returns visible recommendations for a family with children and a dog", async () => {
    const query = "I'm looking for a sofa for a family with two children and a dog.";
    const parsed = parseSearchQuery(query);
    const parsedIntent = searchIntentSchema.parse({
      ...baseIntent,
      queryText: query,
      category: parsed.category ?? null,
      colorFamilies: null,
      maxWidthMm: null,
      modular: null,
      functions: ["easy-care"],
      smallSpaceSuitable: null
    });
    const advisor = answerGroundedQuestion(query, {
      route: "/search", referencedProductIds: [], selectedMaterialIds: [], currentFilters: {}, approvedPreferences: {}
    });
    const result = await hybridCatalogueSearch(groundSearchIntent(query, parsedIntent), undefined, parseSearchExclusions(query), advisor.productIds);

    expect([...result.exactMatches, ...result.closeAlternatives].length).toBeGreaterThan(0);
  });

  it("includes a chatbot-selected complementary category in AI Search", async () => {
    const coffeeTable = products.find((product) => product.active && product.category === "coffee-table");
    expect(coffeeTable).toBeTruthy();
    const intent = searchIntentSchema.parse({
      ...baseIntent,
      queryText: "family sofa with a matching coffee table",
      colorFamilies: null,
      maxWidthMm: null,
      modular: null,
      smallSpaceSuitable: null
    });

    const result = await hybridCatalogueSearch(intent, undefined, undefined, [coffeeTable!.id]);

    expect(result.closeAlternatives.map(({ product }) => product.id)).toContain(coffeeTable!.id);
    expect(result.closeAlternatives.find(({ product }) => product.id === coffeeTable!.id)?.reasons.join(" ")).toMatch(/coffee table.*another part/i);
  });

  it("never silently substitutes a wrong colour", async () => {
    const result = await hybridCatalogueSearch(searchIntentSchema.parse({ ...baseIntent, queryText: "purple sofa", colorFamilies: ["purple"] }));
    expect(result.exactColorAvailable).toBe(false);
    expect(result.exactMatches).toHaveLength(0);
    expect(result.closeAlternatives.every(({ product }) => !product.colors.includes("purple"))).toBe(true);
  });

  it("keeps exact red sofa matches exact when catalogue data has red", async () => {
    const result = await hybridCatalogueSearch(searchIntentSchema.parse({ ...baseIntent, queryText: "red sofa", colorFamilies: ["red"], maxWidthMm: null, modular: null, smallSpaceSuitable: null }));
    expect(result.exactMatches.length).toBeGreaterThan(0);
    expect(result.exactMatches.every(({ product }) => product.category === "sofa" && product.colors.includes("red"))).toBe(true);
    expect(result.closeAlternatives).toHaveLength(0);
  });

  it("grounds visual results in catalogue IDs", () => {
    const matches = searchCatalogueByVisualTags(visualTagsSchema.parse({ category: "sofa", colorFamilies: ["beige"], likelyMaterial: "fabric", style: ["modern heritage"], silhouette: "wide", notableVisualFeatures: [] }));
    const ids = new Set(products.map((product) => product.id));
    expect(matches.every(({ product }) => ids.has(product.id))).toBe(true);
  });

  it("accepts every catalogue category for visual search", () => {
    for (const category of catalogueCategories) {
      expect(visualTagsSchema.safeParse({ category, colorFamilies: [], likelyMaterial: null, style: [], silhouette: "visible object", notableVisualFeatures: [] }).success).toBe(true);
    }
  });

  it("maps visually detected sectionals to catalogue sofa programmes", () => {
    const matches = searchCatalogueByVisualTags(visualTagsSchema.parse({
      category: "sectional",
      colorFamilies: ["beige", "cream"],
      likelyMaterial: "fabric",
      style: ["modern"],
      silhouette: "corner sofa",
      notableVisualFeatures: []
    }));
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every(({ product }) => product.category === "sofa" || product.category === "sectional")).toBe(true);
  });

  it("returns catalogue dining tables for a visually detected dining table", () => {
    const matches = searchCatalogueByVisualTags(visualTagsSchema.parse({
      category: "dining-table",
      colorFamilies: ["white", "beige"],
      likelyMaterial: "wood",
      style: ["modern"],
      silhouette: "rectangular dining table",
      notableVisualFeatures: ["light top", "metal legs"]
    }));
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every(({ product }) => product.category === "dining-table")).toBe(true);
  });

  it("does not recommend a product when no supported furniture is detected", () => {
    const matches = searchCatalogueByVisualTags(visualTagsSchema.parse({
      category: null,
      colorFamilies: ["grey"],
      likelyMaterial: null,
      style: [],
      silhouette: "no supported furniture detected",
      notableVisualFeatures: []
    }));
    expect(matches).toEqual([]);
  });
});

describe("configuration and retailer grounding", () => {
  it("validates requirements before deterministic configuration", () => {
    const requirements = configurationRequirementsSchema.parse({
      customerRequest: "four-seat beige easy-care sofa with relax",
      category: "sofa",
      colorFamily: "beige",
      materialType: "fabric",
      easyCare: true,
      maxWidthMm: 2900,
      numberOfSeats: 4,
      modular: true,
      relaxFunction: true,
      electricFunction: false,
      comfort: "firm",
      posture: "upright"
    });
    const result = buildGroundedConfiguration(requirements);
    expect(products.some((product) => product.id === result.configuration.productId)).toBe(true);
    expect(result.validation.valid).toBe(true);
    expect(result.configuration.id).toMatch(/^CFG-/);
  });

  it("removes invented product and material IDs from retailer data", () => {
    const result = groundProjectData(retailerProjectDataSchema.parse({
      customerIntent: "Consultation",
      productIds: [products[0].id, "AI-INVENTED-PRODUCT"],
      configurationIds: ["CFG-VALIDATED"],
      materialIds: ["AI-INVENTED-MATERIAL"],
      roomPlan: null,
      fitWarnings: [],
      requestedRetailerAction: "Request a Quote"
    }));
    expect(result.project.productIds).toEqual([products[0].id]);
    expect(result.project.materialIds).toEqual([]);
    expect(result.groundedFacts).not.toContain("AI-INVENTED");
  });
});
