import { describe, expect, it } from "vitest";
import { findGroundedAlternatives } from "@/lib/assistant";

describe("bed alternative discovery", () => {
  it("understands a grey upholstered storage bed in a 160 x 200 cm sleeping size", () => {
    const result = findGroundedAlternatives({
      sourceProductId: "musterring-justb-sc100-grey",
      requestText: "I want a grey upholstery bed with storage 160x200cm"
    });

    expect(result.interpretedRequirements).toEqual(expect.arrayContaining([
      "bed",
      "grey colour",
      "upholstered bed",
      "160 × 200 cm sleeping size",
      "bed storage"
    ]));
    expect(result.exactMatches.map((match) => match.productId)).toContain("musterring-delphi-light-grey");
    expect(result.exactMatches.map((match) => match.productId)).not.toContain("musterring-delphi");
    expect(result.closestAlternatives.every((match) => match.unmetRequirements.length > 0)).toBe(true);
  });

  it("matches a detailed box-spring request only when every requested fact is verified", () => {
    const result = findGroundedAlternatives({
      sourceProductId: "musterring-delphi",
      requestText: "I need a grey upholstered box-spring bed, 160 x 200 cm, with storage and motorised head and foot adjustment"
    });

    expect(result.interpretedRequirements).toEqual(expect.arrayContaining([
      "grey colour",
      "boxspring bed",
      "upholstered bed",
      "160 × 200 cm sleeping size",
      "bed storage",
      "motorised bed adjustment"
    ]));
    expect(result.exactMatches.map((match) => match.productId)).toContain("musterring-justb-sc100-grey");
  });

  it("keeps unsupported requirements out of exact matches and explains them as other options", () => {
    const result = findGroundedAlternatives({
      sourceProductId: "musterring-justb-sc100",
      requestText: "I want a purple leather upholstered bed with storage in 160x200cm"
    });

    expect(result.exactMatches).toHaveLength(0);
    expect(result.closestAlternatives.length).toBeGreaterThan(0);
    expect(result.closestAlternatives.every((match) => match.unmetRequirements.length > 0)).toBe(true);
  });

  it("understands explicitly excluded bed functions", () => {
    const result = findGroundedAlternatives({
      sourceProductId: "musterring-justb-sc100",
      requestText: "I want an upholstered fabric bed 180x200 cm without storage and without motorised adjustment"
    });

    expect(result.interpretedRequirements).toEqual(expect.arrayContaining([
      "upholstered bed",
      "180 × 200 cm sleeping size",
      "without bed storage",
      "without motorised bed adjustment",
      "fabric material"
    ]));
  });

  const verifiedExactQueries = [
    ["I want a beige upholstered fabric bed with under-bed storage in 160x200 cm", "musterring-delphi"],
    ["Show me a taupe upholstered fabric bed, 180 x 200 cm, with integrated storage", "musterring-delphi"],
    ["I need a blue upholstered fabric bed with storage and a 180x200 cm sleeping size", "musterring-delphi"],
    ["Find a green upholstery bed in fabric, 160 x 200 cm, including under-bed storage", "musterring-delphi"],
    ["I want a light grey upholstered fabric bed, 180x200cm, with a storage compartment", "musterring-delphi-light-grey"],
    ["Show an elegant upholstered fabric bed with storage in 180 x 200 cm", "musterring-justb-sc200"],
    ["I need an upholstered box-spring bed, 200x200 cm, with storage and motorised adjustment", "musterring-justb-sc100"]
  ] as const;

  it.each(verifiedExactQueries)("returns a verified exact match for: %s", (requestText, expectedProductId) => {
    const result = findGroundedAlternatives({
      sourceProductId: "musterring-mr-dubai",
      requestText
    });

    expect(result.exactMatches.map((match) => match.productId)).toContain(expectedProductId);
    expect(result.exactMatches.every((match) => match.unmetRequirements.length === 0)).toBe(true);
  });

  it.each([
    "I want a red upholstered fabric bed with storage in 160x200 cm",
    "Show me a purple leather upholstered bed with under-bed storage in 160x200 cm",
    "I need a leather box-spring bed, 200x220 cm, with storage and motorised adjustment"
  ])("returns labelled other options instead of inventing an exact match for: %s", (requestText) => {
    const result = findGroundedAlternatives({ sourceProductId: "musterring-mr-dubai", requestText });

    expect(result.exactMatches).toHaveLength(0);
    expect(result.closestAlternatives.length).toBeGreaterThan(0);
    expect(result.closestAlternatives.every((match) => match.unmetRequirements.length > 0)).toBe(true);
  });
});
