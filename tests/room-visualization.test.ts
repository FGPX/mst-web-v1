import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { products } from "@/lib/data";
import {
  buildRoomVisualizationPrompt,
  groundVisualizationItems,
  normalizeRoomImage,
  roomVisualizationRequestSchema
} from "@/lib/ai/room-visualization";

const product = products.find((candidate) => candidate.active)!;
const item = {
  productId: product.id,
  x: 50,
  y: 86,
  rotation: 0,
  scale: 1,
  materialId: product.materials[0],
  color: product.colors[0]
};

describe("catalogue-grounded room visualization", () => {
  it("requires explicit consent and generation confirmation", () => {
    expect(roomVisualizationRequestSchema.safeParse({ consent: true, confirmed: true, items: [item] }).success).toBe(true);
    expect(roomVisualizationRequestSchema.safeParse({ consent: true, confirmed: false, items: [item] }).success).toBe(false);
    expect(roomVisualizationRequestSchema.safeParse({ consent: false, confirmed: true, items: [item] }).success).toBe(false);
  });

  it("accepts only active catalogue product IDs and reuses identical references", () => {
    const grounded = groundVisualizationItems([item, { ...item, x: 70 }]);
    expect(grounded).toHaveLength(2);
    expect(grounded[0].modelCode).toBe(product.modelCode);
    expect(grounded[0].referenceImageIndex).toBe(2);
    expect(grounded[1].referenceImageIndex).toBe(2);
    expect(() => groundVisualizationItems([{ ...item, productId: "invented-product" }])).toThrow(/Unavailable catalogue product/);
  });

  it("builds a full-scene editorial prompt from grounded catalogue facts", () => {
    const prompt = buildRoomVisualizationPrompt(groundVisualizationItems([item]));
    expect(prompt).toContain(product.modelCode);
    expect(prompt).toContain("one complete, cohesive, photorealistic premium interior photograph");
    expect(prompt).toContain("Keep it unmistakably the same room");
    expect(prompt).toContain("Do not add people, text, logos, decorations, plants, or unselected furniture");
    expect(prompt).toContain("PRODUCT LOCK");
    expect(prompt).toContain("Do not recolour, desaturate, brighten, darken");
    expect(prompt).toContain("exact selected-product appearance");
  });

  it("never lets an approximate layout colour override a fixed catalogue reference", () => {
    const kleo = products.find((candidate) => candidate.slug === "mr-kleo")!;
    const grounded = groundVisualizationItems([{
      productId: kleo.id,
      x: 40,
      y: 86,
      rotation: 0,
      scale: 1,
      color: "beige",
      materialId: kleo.materials[0]
    }]);
    expect(grounded[0].verifiedColor).toBeUndefined();
    expect(grounded[0].verifiedMaterialId).toBeUndefined();
    const prompt = buildRoomVisualizationPrompt(grounded);
    expect(prompt).not.toContain("required catalogue finish is beige");
    expect(prompt).toContain("Copy the exact visible colour, material, texture, and finish from reference image 2");
  });

  it("normalizes room photos to an API-safe size without changing their aspect materially", async () => {
    const source = await sharp({ create: { width: 901, height: 601, channels: 4, background: { r: 216, g: 209, b: 198, alpha: 0.6 } } })
      .withMetadata({ orientation: 6 })
      .png()
      .toBuffer();
    const normalized = await normalizeRoomImage(source);
    const metadata = await sharp(normalized.buffer).metadata();
    expect(normalized.width % 16).toBe(0);
    expect(normalized.height % 16).toBe(0);
    expect(Math.max(normalized.width, normalized.height)).toBeLessThanOrEqual(1536);
    expect(normalized.width / normalized.height).toBeCloseTo(601 / 901, 1);
    expect(metadata.space).toBe("srgb");
    expect(metadata.hasAlpha).toBe(false);
  });

});
