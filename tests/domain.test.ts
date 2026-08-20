import { describe, expect, it } from "vitest";
import { products } from "@/lib/data";
import { formatEuro } from "@/lib/format";
import { parseSearchExclusions, parseSearchQuery, searchProducts, searchProductsRanked } from "@/lib/search";
import { createConfiguration, validateConfiguration } from "@/lib/configurator";
import { checkFit } from "@/lib/fit";
import { scoreComfortMatch } from "@/lib/comfort";

describe("search query parsing", () => {
  it("converts natural language into structured filters", () => {
    const filters = parseSearchQuery("I need a compact beige modular sofa for a small apartment, maximum width 240 cm.");
    expect(filters).toMatchObject({
      category: "sofa",
      modular: true,
      smallSpaceSuitable: true,
      maxWidthMm: 2400
    });
    expect(filters.colors).toContain("beige");
  });

  it("filters validated catalog data", () => {
    const results = searchProducts(parseSearchQuery("compact sofa maximum width 240 cm"));
    expect(results.every((product) => product.widthMm <= 2400)).toBe(true);
  });

  it("interprets an L-shaped kitchen above 300 cm without reversing the width relation", () => {
    const filters = parseSearchQuery("L shaped kitchen above 300 cm");
    expect(filters).toMatchObject({
      category: "kitchen",
      layoutShapes: ["l-shaped"],
      minWidthMm: 3000
    });
    expect(filters.maxWidthMm).toBeUndefined();
    expect(filters.targetWidthMm).toBeUndefined();
  });

  it.each([
    ["corner kitchen at least 3 metres", 3000],
    ["Eckküche mindestens 3 m", 3000]
  ])("normalizes kitchen shape and metric minimums: %s", (query, expectedWidth) => {
    expect(parseSearchQuery(query)).toMatchObject({ category: "kitchen", layoutShapes: ["l-shaped"], minWidthMm: expectedWidth });
  });

  it("keeps maximum and approximate widths distinct", () => {
    expect(parseSearchQuery("sofa under 240 cm")).toMatchObject({ maxWidthMm: 2400 });
    expect(parseSearchQuery("sofa around 240 cm")).toMatchObject({ targetWidthMm: 2400 });
  });

  it("treats 'smaller sofa than' as a width limit, not a small-space flag", () => {
    const filters = parseSearchQuery("find me a smaller sofa than 300cm");
    expect(filters).toMatchObject({ category: "sofa", maxWidthMm: 3000 });
    expect(filters.smallSpaceSuitable).toBeUndefined();

    const results = searchProducts(filters);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((product) => product.widthMm <= 3000)).toBe(true);
  });

  it.each([
    ["sofa that is not modular", { modular: true }],
    ["sofa without relax function", { functions: ["relax"] }],
    ["non-electric sofa", { functions: ["electric"] }],
    ["sofa that is not red", { colors: ["red"] }]
  ])("keeps negated requirements out of positive filters: %s", (query, expectedExclusion) => {
    const filters = parseSearchQuery(query);
    expect(filters.modular).toBeUndefined();
    expect(filters.relaxFunction).toBeUndefined();
    expect(filters.electricFunctions).toBeUndefined();
    expect(filters.colors).toBeUndefined();
    expect(parseSearchExclusions(query)).toMatchObject(expectedExclusion);
  });

  it("parses comparative minimum widths without provider help", () => {
    expect(parseSearchQuery("find me a larger sofa than 300cm")).toMatchObject({ minWidthMm: 3000 });
    expect(parseSearchQuery("sofa wider than 300 cm")).toMatchObject({ minWidthMm: 3000 });
  });

  it("ranks conversational and misspelled product requests", () => {
    const results = searchProductsRanked("i wnat a confortable armchair with electric relax");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].product.category).toBe("armchair");
    expect(results[0].reasons.join(" ")).toMatch(/armchair|relax|electric/i);
  });

  it("puts an explicitly requested model first", () => {
    expect(searchProductsRanked("show me MR 2875")[0].product.modelCode).toBe("MR 2875");
  });

  it("keeps living-wall searches inside the storage catalog", () => {
    const results = searchProductsRanked("I want an oak living wall with a TV unit");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].product.category).toBe("storage");
  });

  it("returns only verified red-upholstery sofas for a red sofa request", () => {
    const results = searchProductsRanked("red sofa");
    expect(results[0].product.slug).toBe("mr-260");
    expect(results.every(({ product }) => product.category === "sofa" && product.colors.includes("red"))).toBe(true);
  });
});

describe("configuration rules", () => {
  it("rejects incompatible combinations", () => {
    const product = products.find((item) => item.category === "armchair")!;
    const configuration = createConfiguration(product);
    configuration.armrest = "Wide lounge";
    expect(validateConfiguration(configuration).valid).toBe(false);
  });
});

describe("fit-check geometry", () => {
  it("returns a potential conflict when the door is too narrow", () => {
    const result = checkFit(products[0], {
      roomWidthMm: 4000,
      roomLengthMm: 4000,
      roomHeightMm: 2400,
      doorWidthMm: 700,
      doorHeightMm: 2000,
      hallwayWidthMm: 900,
      staircaseWidthMm: 900,
      staircaseTurningMm: 1200,
      elevatorWidthMm: 0,
      elevatorDepthMm: 0,
      elevatorHeightMm: 0
    });
    expect(result.status).not.toBe("likely");
    expect(result.reasons.join(" ")).toContain("Door");
  });
});

describe("comfort scoring", () => {
  it("returns recommendations with explanations", () => {
    const recommendations = scoreComfortMatch({
      roomType: "living room",
      users: 3,
      widthMm: 2400,
      comfort: "firm",
      posture: "upright",
      seatHeightMm: 460,
      seatDepthMm: 540,
      children: true,
      pets: true,
      electric: false,
      style: "modern heritage",
      color: "beige"
    });
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].explanation).toContain("Recommended because");
  });
});

describe("price formatting", () => {
  it("uses German euro formatting", () => {
    expect(formatEuro(428000)).toBe("4.280,00 €");
  });
});
