import { describe, expect, it } from "vitest";
import { products } from "@/lib/data";
import { parseSearchQuery, searchProducts } from "@/lib/search";
import { productStructuredData } from "@/lib/product-structured-data";

describe("GEO product data", () => {
  it("keeps every real catalogue product provenance-labelled", () => {
    const real = products.filter((product) => !product.demoData);
    expect(real).toHaveLength(142);
    expect(real.every((product) => product.dataQuality && product.entityLevel && product.productGroupId)).toBe(true);
    expect(real.every((product) => product.gtin === null && product.ean === null && product.sku === null && product.mpn === null)).toBe(true);
  });

  it("merges verified ergonomic variants without turning them into demo facts", () => {
    const nils = products.find((product) => product.slug === "mr-nils")!;
    expect(nils.variants).toHaveLength(5);
    expect(nils.variants?.every((variant) => variant.demoData === false && variant.dataQuality?.level === "verified")).toBe(true);
    expect(nils.dimensionRange?.minHeightMm).toBe(1060);
    expect(nils.dataQuality?.verifiedFields).toContain("variants");
  });

  it("keeps validated catalogue overrides ahead of presentation enrichment", () => {
    const pm100 = products.find((product) => product.slug === "justb-pm100")!;
    expect(pm100.seatHeightMm).toBe(460);
    expect(pm100.seatDepthMm).toBe(620);
    expect(pm100.specifications?.seating?.seatHeightMm).toBe(460);
    expect(pm100.specifications?.seating?.seatDepthMm).toBe(620);
    expect(pm100.specifications?.seating?.electricRecliner).toBe(true);
    expect(pm100.verifiedFacts.seatHeight).toBe(true);
    expect(pm100.dataQuality?.verifiedFields).toContain("specifications.seating.seatHeightMm");
  });

  it("fills programme presentation fields without promoting demo facts to verified", () => {
    const lia = products.find((product) => product.slug === "mr-lia")!;
    expect(lia.referenceConfiguration?.dimensions.widthMm).toBeGreaterThan(0);
    expect(lia.colors.length).toBeGreaterThan(0);
    expect(lia.specifications?.seating?.seatHeightOptionsMm.length).toBeGreaterThan(0);
    expect(lia.dataQuality?.demoFields.length).toBeGreaterThan(0);
    expect(lia.verifiedFacts.dimensions).toBe(false);
    expect(lia.numberOfSeatsVerified).toBe(false);
  });

  it("adds source-backed pilot bedroom facts with exact provenance paths", () => {
    const isabelle = products.find((product) => product.slug === "mr-isabelle")!;
    expect(isabelle.productSubtypes).toEqual(expect.arrayContaining(["wardrobe", "bedside-table", "dresser"]));
    expect(isabelle.specifications?.wardrobe?.doorType).toEqual(["hinged", "sliding"]);
    expect(isabelle.specifications?.wardrobe?.widthOptionsMm).toContain(4000);
    expect(isabelle.sourceDocumentUrl).toMatch(/img\.musterring\.com/);
    expect(isabelle.lastVerifiedAt).toBe("2026-08-20");
    expect(isabelle.dataQuality?.verifiedFields).toEqual(expect.arrayContaining([
      "productSubtypes",
      "specifications.wardrobe.doorType",
      "specifications.wardrobe.widthOptionsMm"
    ]));
  });

  it("keeps unknown configuration dimensions null instead of treating them as false or verified", () => {
    const delphi = products.find((product) => product.slug === "delphi")!;
    expect(delphi.specifications?.bed?.sleepingWidthsMm).toEqual([1600, 1800]);
    expect(delphi.configurations?.every((configuration) => configuration.dimensions === null)).toBe(true);
    expect(delphi.configurations?.every((configuration) => configuration.dataQuality.unknownFields?.includes("dimensions"))).toBe(true);
    expect(delphi.dataQuality?.verifiedFields).not.toContain("specifications.bed.outerDimensionsBySleepingSize");
  });

  it("identifies verified dining programmes and bench candidates", () => {
    const chairs = ["justb-sp150", "justb-sp500", "nerina"].map((slug) => products.find((product) => product.slug === slug)!);
    expect(chairs.every((product) => product.dataQuality?.verifiedFields.includes("specifications.diningChair.seatCapacityMax"))).toBe(true);
    expect(chairs.find((product) => product.slug === "nerina")?.specifications?.diningChair?.swivelDegrees).toBe(360);
    const benches = products.filter((product) => product.productSubtypes?.includes("dining-bench") && product.dataQuality?.verifiedFields.includes("productSubtypes"));
    expect(benches.length).toBeGreaterThanOrEqual(3);
  });

  it("links only explicit compatible programmes in series specifications", () => {
    const table = products.find((product) => product.slug === "justb-sp100")!;
    const seating = products.find((product) => product.slug === "justb-sp500")!;
    expect(table.seriesId).toBe(seating.seriesId);
    expect(table.seriesSpecifications?.compatibleProductIds).toContain(seating.id);
    expect(table.dataQuality?.verifiedFields).toContain("seriesSpecifications.compatibleProductIds");
  });

  it("supports category-specific search intents", () => {
    const queries = [
      ["round dining table", "nica"],
      ["wardrobe with sliding doors", "mr-imola"],
      ["bed 180 x 200", "justb-sc100"],
      ["easy-care carpet", "mr-bergen"],
      ["outdoor chair weather resistant", "justb-od100"],
      ["lamp around 400 lumens", "lamps-20"]
    ];
    for (const [query, slug] of queries) {
      expect(searchProducts(parseSearchQuery(query)).some((product) => product.slug === slug), query).toBe(true);
    }
  });

  it("does not publish demo offers or identifiers in JSON-LD", () => {
    const product = products.find((item) => item.slug === "mr-alena")!;
    const json = productStructuredData(product);
    expect(json).not.toHaveProperty("offers");
    expect(json).not.toHaveProperty("sku");
    expect(JSON.stringify(json)).not.toContain("indicativePrice");
  });
});
