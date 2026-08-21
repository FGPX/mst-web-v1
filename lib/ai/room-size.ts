import type { Product } from "../types";

export type RoomSizeSceneItem = {
  productId: string;
  x: number;
  y: number;
  rotation: number;
};

export type RoomSizeProductFact = {
  productId: string;
  modelCode: string;
  category: string;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  dimensionStatus: "verified" | "local-reference";
};

export type RoomSizeCalculation = {
  minimumWidthMm: number;
  minimumLengthMm: number;
  recommendedWidthMm: number;
  recommendedLengthMm: number;
  furnitureSpanWidthMm: number;
  furnitureSpanLengthMm: number;
  circulationClearanceMm: number;
  arrangement: "current-layout";
  products: RoomSizeProductFact[];
};

const roundUpTo100 = (value: number) => Math.ceil(value / 100) * 100;

export function calculateRecommendedRoomSize(
  items: RoomSizeSceneItem[],
  selectedProducts: Product[],
  referenceRoom: { widthMm: number; lengthMm: number },
  circulationClearanceMm = 900
): RoomSizeCalculation {
  const byId = new Map(selectedProducts.map((product) => [product.id, product]));
  const footprints = items.map((item) => {
    const product = byId.get(item.productId);
    if (!product || !product.widthMm || !product.depthMm || !product.heightMm) throw new Error("Local dimensions are required for every selected product.");
    const radians = (((item.rotation % 360) + 360) % 360) * Math.PI / 180;
    const width = Math.abs(product.widthMm * Math.cos(radians)) + Math.abs(product.depthMm * Math.sin(radians));
    const depth = Math.abs(product.widthMm * Math.sin(radians)) + Math.abs(product.depthMm * Math.cos(radians));
    const centerX = Math.max(0, Math.min(100, item.x)) / 100 * referenceRoom.widthMm;
    const centerY = Math.max(0, Math.min(100, item.y)) / 100 * referenceRoom.lengthMm;
    return { item, product, width, depth, centerX, centerY };
  });
  if (!footprints.length) throw new Error("At least one product is required.");

  const minX = Math.min(...footprints.map((entry) => entry.centerX - entry.width / 2));
  const maxX = Math.max(...footprints.map((entry) => entry.centerX + entry.width / 2));
  const minY = Math.min(...footprints.map((entry) => entry.centerY - entry.depth / 2));
  const maxY = Math.max(...footprints.map((entry) => entry.centerY + entry.depth / 2));
  const widest = Math.max(...footprints.map((entry) => entry.width));
  const deepest = Math.max(...footprints.map((entry) => entry.depth));
  const clearance = circulationClearanceMm * 2;
  const compactClearance = 600 * 2;
  const spanWidth = Math.max(maxX - minX, widest);
  const spanLength = Math.max(maxY - minY, deepest);

  return {
    minimumWidthMm: roundUpTo100(spanWidth + compactClearance),
    minimumLengthMm: roundUpTo100(spanLength + compactClearance),
    recommendedWidthMm: roundUpTo100(spanWidth + clearance),
    recommendedLengthMm: roundUpTo100(spanLength + clearance),
    furnitureSpanWidthMm: roundUpTo100(spanWidth),
    furnitureSpanLengthMm: roundUpTo100(spanLength),
    circulationClearanceMm,
    arrangement: "current-layout",
    products: footprints.map(({ product }) => ({
      productId: product.id,
      modelCode: product.modelCode,
      category: product.category,
      widthMm: product.widthMm,
      depthMm: product.depthMm,
      heightMm: product.heightMm,
      dimensionStatus: product.verifiedFacts.dimensions ? "verified" : "local-reference"
    }))
  };
}
