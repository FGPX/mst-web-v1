import { describe, expect, it } from "vitest";
import { hybridCatalogueSearch } from "@/lib/ai/retrieval";
import { canonicalizeSearchIntent } from "@/lib/ai/search-intent";
import { searchIntentSchema } from "@/lib/ai/schemas";
import { parseSearchQuery } from "@/lib/search";

describe("German input with English search output", () => {
  it("parses German furniture vocabulary into canonical English filters", () => {
    const filters = parseSearchQuery("Ich suche ein modernes beiges Ledersofa für eine kleine Wohnung, maximal 240 cm breit, mit Relaxfunktion.");

    expect(filters).toMatchObject({
      category: "sofa",
      colors: ["beige"],
      materials: ["leather"],
      styles: ["modern"],
      maxWidthMm: 2400,
      smallSpaceSuitable: true,
      relaxFunction: true
    });
  });

  it("supports German umlauts, seat terminology and relational dimensions", () => {
    expect(parseSearchQuery("Schwarzer elektrischer Sessel mit hoher Sitzhöhe, mindestens 80 cm breit")).toMatchObject({
      category: "armchair",
      colors: ["black"],
      minWidthMm: 800,
      minSeatHeightMm: 470,
      electricFunctions: true
    });
    expect(parseSearchQuery("L-förmige Eckküche zwischen 300 cm und 360 cm")).toMatchObject({
      category: "kitchen",
      layoutShapes: ["l-shaped"],
      minWidthMm: 3000,
      maxWidthMm: 3600
    });
    expect(parseSearchQuery("Beiges Sofa bis zu 240 cm breit")).toMatchObject({
      category: "sofa",
      colors: ["beige"],
      maxWidthMm: 2400
    });
  });

  it("canonicalizes German provider vocabulary without translating the original query", () => {
    const queryText = "Rotes Ledersofa mit Relaxfunktion für das Wohnzimmer";
    const canonical = canonicalizeSearchIntent(searchIntentSchema.parse({
      queryText,
      category: "sofa",
      colorFamilies: ["rotes"],
      materials: ["Leder"],
      maxWidthMm: null,
      minWidthMm: null,
      targetWidthMm: null,
      minSeatHeightMm: null,
      maxSeatDepthMm: null,
      numberOfSeats: null,
      modular: null,
      functions: ["Relaxfunktion"],
      styles: ["klassisch"],
      roomType: "Wohnzimmer",
      smallSpaceSuitable: null,
      layoutShapes: null
    }));

    expect(canonical).toMatchObject({
      queryText,
      colorFamilies: ["red"],
      materials: ["leather"],
      functions: ["relax"],
      styles: ["classic"],
      roomType: "living room"
    });
  });

  it("keeps catalogue match explanations in English for German queries", async () => {
    const queryText = "Beiges Sofa mit Relaxfunktion";
    const parsed = parseSearchQuery(queryText);
    const intent = searchIntentSchema.parse({
      queryText,
      category: parsed.category ?? null,
      colorFamilies: parsed.colors ?? null,
      materials: parsed.materials ?? null,
      maxWidthMm: parsed.maxWidthMm ?? null,
      minWidthMm: parsed.minWidthMm ?? null,
      targetWidthMm: parsed.targetWidthMm ?? null,
      minSeatHeightMm: parsed.minSeatHeightMm ?? null,
      maxSeatDepthMm: parsed.maxSeatDepthMm ?? null,
      numberOfSeats: parsed.seatCount ?? null,
      modular: parsed.modular ?? null,
      functions: parsed.relaxFunction ? ["relax"] : null,
      styles: parsed.styles ?? null,
      roomType: null,
      smallSpaceSuitable: parsed.smallSpaceSuitable ?? null,
      layoutShapes: parsed.layoutShapes ?? null
    });
    const result = await hybridCatalogueSearch(intent);
    const reasons = [...result.exactMatches, ...result.closeAlternatives].flatMap((match) => match.reasons);

    expect(reasons.length).toBeGreaterThan(0);
    expect(reasons.every((reason) => /requested|verified|width|seat|function|material|available|match|colour|catalogue|layout/i.test(reason))).toBe(true);
  });
});
