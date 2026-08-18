import { describe, expect, it } from "vitest";
import { products } from "@/lib/data";
import { catalogueCategories } from "@/lib/types";
import { buildGroundedConfiguration } from "@/lib/ai/configuration";
import { comparisonSummaryInput, deterministicComparisonSummary } from "@/lib/ai/comparison-summary";
import { groundProjectData } from "@/lib/ai/grounding";
import { hybridCatalogueSearch, searchCatalogueByVisualTags } from "@/lib/ai/retrieval";
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
    expect(summary.glance.join(" ")).toMatch(/Seat heights|Seat construction/);
    expect(summary.recommendation).not.toMatch(/not enough verified catalogue data/i);
  });
});

describe("grounded hybrid retrieval", () => {
  it("returns natural-language results only from catalogue data", async () => {
    const result = await hybridCatalogueSearch(searchIntentSchema.parse(baseIntent));
    const ids = new Set(products.map((product) => product.id));
    const matches = [...result.exactMatches, ...result.closeAlternatives];
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every(({ product }) => ids.has(product.id))).toBe(true);
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
