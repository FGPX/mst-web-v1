import { describe, expect, it } from "vitest";
import { calculateRecommendedRoomSize } from "@/lib/ai/room-size";
import type { Product } from "@/lib/types";

const product = (id: string, widthMm: number, depthMm: number, verified = true, category = "sofa") => ({
  id, modelCode: id.toUpperCase(), category, widthMm, depthMm, heightMm: 800,
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

  it("does not change required dimensions when the entered room changes", () => {
    const items = [
      { productId: "sofa", x: 25, y: 70, rotation: 0 },
      { productId: "chair", x: 75, y: 55, rotation: 90 }
    ];
    const selectedProducts = [product("sofa", 2400, 1000), product("chair", 900, 900)];
    const fourMetreRoom = calculateRecommendedRoomSize(items, selectedProducts, { widthMm: 4000, lengthMm: 4000 });
    const fifteenMetreRoom = calculateRecommendedRoomSize(items, selectedProducts, { widthMm: 15000, lengthMm: 15000 });

    expect(fifteenMetreRoom.minimumWidthMm).toBe(fourMetreRoom.minimumWidthMm);
    expect(fifteenMetreRoom.minimumLengthMm).toBe(fourMetreRoom.minimumLengthMm);
    expect(fifteenMetreRoom.recommendedWidthMm).toBe(fourMetreRoom.recommendedWidthMm);
    expect(fifteenMetreRoom.recommendedLengthMm).toBe(fourMetreRoom.recommendedLengthMm);
  });

  it("excludes armchairs, tables, small furniture, and carpets from room targets", () => {
    const baseline = calculateRecommendedRoomSize(
      [{ productId: "sofa", x: 50, y: 70, rotation: 0 }],
      [product("sofa", 2400, 1000)],
      { widthMm: 5000, lengthMm: 4000 }
    );
    const withExcludedProducts = calculateRecommendedRoomSize(
      [
        { productId: "sofa", x: 50, y: 70, rotation: 0 },
        { productId: "chair", x: 5, y: 5, rotation: 0 },
        { productId: "table", x: 95, y: 10, rotation: 0 },
        { productId: "rug", x: 95, y: 95, rotation: 0 }
      ],
      [
        product("sofa", 2400, 1000),
        product("chair", 1200, 1200, true, "armchair"),
        product("table", 1800, 900, true, "coffee-table"),
        product("rug", 3000, 2000, true, "carpet")
      ],
      { widthMm: 5000, lengthMm: 4000 }
    );

    expect(withExcludedProducts.minimumWidthMm).toBe(baseline.minimumWidthMm);
    expect(withExcludedProducts.minimumLengthMm).toBe(baseline.minimumLengthMm);
    expect(withExcludedProducts.products.map((item) => item.productId)).toEqual(["sofa"]);
  });

  it("returns no room target when every selected product is excluded", () => {
    const result = calculateRecommendedRoomSize(
      [{ productId: "rug", x: 50, y: 50, rotation: 0 }],
      [product("rug", 3000, 2000, true, "carpet")],
      { widthMm: 5000, lengthMm: 4000 }
    );

    expect(result.minimumWidthMm).toBe(0);
    expect(result.recommendedWidthMm).toBe(0);
    expect(result.products).toEqual([]);
  });
});
