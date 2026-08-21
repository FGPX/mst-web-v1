import { describe, expect, it } from "vitest";
import { calculateRecommendedRoomSize } from "@/lib/ai/room-size";
import type { Product } from "@/lib/types";

const product = (id: string, widthMm: number, depthMm: number, verified = true) => ({
  id, modelCode: id.toUpperCase(), widthMm, depthMm, heightMm: 800,
  verifiedFacts: { dimensions: verified }
}) as unknown as Product;

describe("calculateRecommendedRoomSize", () => {
  it("uses repeated product footprints and adds circulation clearance", () => {
    const result = calculateRecommendedRoomSize([
      { productId: "sofa", x: 25, y: 50, rotation: 0 },
      { productId: "chair", x: 75, y: 50, rotation: 0 }
    ], [product("sofa", 2400, 1000), product("chair", 900, 900)], { widthMm: 5000, lengthMm: 4000 });
    expect(result.recommendedWidthMm).toBe(6000);
    expect(result.recommendedLengthMm).toBe(2800);
    expect(result.minimumWidthMm).toBe(5400);
    expect(result.minimumLengthMm).toBe(2200);
    expect(result.furnitureSpanWidthMm).toBe(4200);
    expect(result.products).toHaveLength(2);
  });

  it("accounts for rotation", () => {
    const result = calculateRecommendedRoomSize([{ productId: "sofa", x: 50, y: 50, rotation: 90 }], [product("sofa", 2400, 1000)], { widthMm: 5000, lengthMm: 4000 });
    expect(result.recommendedWidthMm).toBe(2800);
    expect(result.recommendedLengthMm).toBe(4200);
    expect(result.minimumWidthMm).toBe(2200);
    expect(result.minimumLengthMm).toBe(3600);
  });

  it("uses local reference dimensions and labels them", () => {
    const result = calculateRecommendedRoomSize([{ productId: "demo", x: 50, y: 50, rotation: 0 }], [product("demo", 2000, 900, false)], { widthMm: 5000, lengthMm: 4000 });
    expect(result.recommendedWidthMm).toBe(3800);
    expect(result.products[0].dimensionStatus).toBe("local-reference");
  });
});
