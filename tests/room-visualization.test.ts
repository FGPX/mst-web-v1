import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { products } from "@/lib/data";
import {
  buildRoomVisualizationPrompt,
  groundVisualizationItems,
  normalizedOrientation,
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
    expect(prompt).toContain("16:9 landscape composition");
    expect(prompt).toContain("Keep it unmistakably the same room");
    expect(prompt).toContain("believable, lived-in Musterring editorial result");
    expect(prompt).toContain("ordinary, unbranded, non-catalogue styling accessories");
    expect(prompt).toContain("These accessories are decorative context only, not Musterring products");
    expect(prompt).toContain("Do not add people, pets, televisions, additional unselected seating");
    expect(prompt).toContain("PRODUCT LOCK");
    expect(prompt).toContain("Do not recolour, desaturate, brighten, darken");
    expect(prompt).toContain("exact selected-product appearance");
    expect(prompt).toContain("single chair must never appear larger than a sofa or sectional");
    expect(prompt).toContain("Product size is adaptive rather than a hard percentage");
    expect(prompt).toContain("nearby anchor zone, not an exact pixel lock");
  });

  it("organizes selected products into a coherent furniture grouping", () => {
    const sofa = products.find((candidate) => ["sofa", "sectional"].includes(candidate.category))!;
    const table = products.find((candidate) => candidate.category === "coffee-table")!;
    const armchair = products.find((candidate) => candidate.category === "armchair")!;
    const prompt = buildRoomVisualizationPrompt(groundVisualizationItems([
      { ...item, productId: sofa.id, x: 28, y: 72 },
      { ...item, productId: table.id, x: 58, y: 84 },
      { ...item, productId: armchair.id, x: 78, y: 82 }
    ]));
    expect(prompt).toContain("approximately 25-35 cm from the nearest sofa seat edge");
    expect(prompt).toContain("this relationship outranks the table's editor anchor");
    expect(prompt).toContain("Never leave a coffee table isolated");
    expect(prompt).toContain("Integrate each selected armchair into the conversation area");
    expect(prompt).toContain("No catalogue carpet was selected");
    expect(prompt).toContain("do not invent, retain, or add any rug");
  });

  it("locks a selected catalogue carpet design and permits no substitute", () => {
    const carpet = products.find((candidate) => candidate.active && candidate.category === "carpet")!;
    const prompt = buildRoomVisualizationPrompt(groundVisualizationItems([{
      ...item,
      productId: carpet.id,
      x: 50,
      y: 82
    }]));

    expect(prompt).toContain(carpet.modelCode);
    expect(prompt).toContain("selected catalogue carpet is required");
    expect(prompt).toContain("preserve the same pattern, motif geometry, colours, border");
    expect(prompt).toContain("This is the only permitted carpet design");
    expect(prompt).toContain("never generate a generic substitute");
    expect(prompt).not.toContain("No catalogue carpet was selected");
  });

  it("keeps quarter-turn orientation and wall placement as hard generation constraints", () => {
    const pm100 = products.find((candidate) => candidate.slug === "justb-pm100")!;
    const grounded = groundVisualizationItems([{
      productId: pm100.id,
      x: 22,
      y: 82,
      rotation: 90,
      viewIndex: 1,
      wallPlacement: "west",
      scale: 1
    }]);
    const prompt = buildRoomVisualizationPrompt(grounded);
    expect(grounded[0].assetUrl).toContain("illustrative-right-v2.png");
    expect(prompt).toContain("90 degrees clockwise");
    expect(prompt).toContain("west wall");
    expect(prompt).toContain("3-8 cm");
    expect(prompt).toContain("Align the main rear run of the seating parallel to that wall");
    expect(prompt).toContain("Do not apply a decorative angle");
    expect(prompt).toContain("Do not pull it toward the middle of the room");
    expect(prompt).toContain("Never rotate or tilt the flat image");
  });

  it("keeps wall-assigned storage straight and flush with its selected wall", () => {
    const storage = products.find((candidate) => candidate.category === "storage")!;
    const prompt = buildRoomVisualizationPrompt(groundVisualizationItems([{
      productId: storage.id,
      x: 18,
      y: 76,
      rotation: 0,
      wallPlacement: "back",
      scale: 1
    }]));

    expect(prompt).toContain("entire rear face of the storage unit straight and parallel");
    expect(prompt).toContain("must not sit diagonally");
    expect(prompt).toContain("selected wall placement and alignment");
  });

  it("normalizes rotations to the four horizontal product orientations", () => {
    expect(normalizedOrientation(450)).toMatchObject({ degrees: 90 });
    expect(normalizedOrientation(-90)).toMatchObject({ degrees: 270 });
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

  it("uses NELA's isolated catalogue product photograph instead of its editorial room scene", () => {
    const nela = products.find((candidate) => candidate.slug === "nela")!;
    const [grounded] = groundVisualizationItems([{
      productId: nela.id,
      x: 50,
      y: 84,
      rotation: 0,
      scale: 1
    }]);

    expect(grounded.assetUrl).toBe("/musterring-catalog/nela/image-02.jpg");
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
