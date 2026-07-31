import { describe, expect, it } from "vitest";
import evaluation from "@/data/evaluation/search-evaluation.json";
import { products } from "@/lib/data";
import { parseSearchQuery } from "@/lib/search";
import { hybridCatalogueSearch } from "@/lib/ai/retrieval";
import { searchIntentSchema } from "@/lib/ai/schemas";

describe("curated bilingual search evaluation", () => {
  for (const item of evaluation) {
    it(`${item.id}: parses expected intent and prevents irrelevant exact results`, async () => {
      const parsed = parseSearchQuery(item.query);
      const expected = item.expectedIntent as Record<string, unknown>;
      for (const [key, value] of Object.entries(expected)) {
        if (key === "easyCare" || key === "materials") continue;
        const parsedValue = key === "numberOfSeats"
          ? parsed.seatCount
          : parsed[key as keyof typeof parsed];
        expect(parsedValue ?? null, `${item.id} ${key}`).toEqual(value);
      }
      const intent = searchIntentSchema.parse({
        queryText: item.query,
        category: parsed.category && ["sofa", "armchair", "sectional", "storage"].includes(parsed.category) ? parsed.category : null,
        colorFamilies: parsed.colors ?? null,
        materials: expected.materials ?? null,
        maxWidthMm: parsed.maxWidthMm ?? null,
        minSeatHeightMm: parsed.minSeatHeightMm ?? null,
        maxSeatDepthMm: parsed.maxSeatDepthMm ?? null,
        numberOfSeats: parsed.seatCount ?? null,
        modular: parsed.modular ?? null,
        functions: [
          ...(parsed.relaxFunction ? ["relax"] : []),
          ...(parsed.electricFunctions ? ["electric"] : []),
          ...(expected.easyCare ? ["easy-care"] : [])
        ],
        styles: null,
        roomType: null,
        smallSpaceSuitable: parsed.smallSpaceSuitable ?? null
      });
      const result = await hybridCatalogueSearch(intent);
      const catalogueIds = new Set(products.map((product) => product.id));
      const allResults = [...result.exactMatches, ...result.closeAlternatives];
      expect(allResults.every(({ product }) => catalogueIds.has(product.id))).toBe(true);
      const exactIds = new Set(result.exactMatches.map(({ product }) => product.id));
      expect(result.closeAlternatives.every(({ product }) => !exactIds.has(product.id))).toBe(true);
      const blockedIds = item.mustNotAppear as string[];
      expect(allResults.every(({ product }) => !blockedIds.includes(product.id))).toBe(true);
      if (item.expectedProductIds.length) {
        const rankedIds = allResults.map(({ product }) => product.id);
        expect(item.expectedProductIds.every((id) => rankedIds.includes(id))).toBe(true);
      }
      if (Array.isArray(expected.colors) && expected.colors.includes("purple")) {
        expect(result.exactMatches).toHaveLength(0);
        expect(result.closeAlternatives.length).toBeGreaterThan(0);
      }
    });
  }
});
