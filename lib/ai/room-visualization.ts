import sharp from "sharp";
import { z } from "zod";
import { products } from "../data";
import { roomSceneProductImage } from "../room-scene-assets";
import type { Category } from "../types";

export const MAX_VISUALIZATION_ITEMS = 6;

export const roomVisualizationItemSchema = z.object({
  productId: z.string().trim().min(1).max(160),
  x: z.number().finite().min(0).max(100),
  y: z.number().finite().min(0).max(100),
  rotation: z.number().finite().min(-720).max(720),
  scale: z.number().finite().min(0.4).max(2.5),
  materialId: z.string().trim().min(1).max(160).optional(),
  color: z.string().trim().min(1).max(120).optional()
});

export const roomVisualizationRequestSchema = z.object({
  consent: z.literal(true),
  confirmed: z.literal(true),
  items: z.array(roomVisualizationItemSchema).min(1).max(MAX_VISUALIZATION_ITEMS)
});

export type RoomVisualizationItemInput = z.infer<typeof roomVisualizationItemSchema>;

export type GroundedVisualizationItem = RoomVisualizationItemInput & {
  modelCode: string;
  name: string;
  category: Category;
  assetUrl: string;
  referenceImageIndex: number;
  verifiedColor?: string;
  verifiedMaterialId?: string;
};

export type NormalizedRoomImage = {
  buffer: Buffer;
  width: number;
  height: number;
};

const categoryMaskSize: Record<Category, { width: number; height: number }> = {
  sofa: { width: 66, height: 32 },
  sectional: { width: 62, height: 34 },
  armchair: { width: 30, height: 34 },
  storage: { width: 34, height: 50 },
  "coffee-table": { width: 30, height: 20 },
  "bedroom-series": { width: 48, height: 42 },
  bed: { width: 52, height: 32 },
  wardrobe: { width: 38, height: 62 },
  "dining-chair": { width: 20, height: 34 },
  "dining-table": { width: 48, height: 30 },
  bathroom: { width: 38, height: 46 },
  kitchen: { width: 60, height: 52 },
  outdoor: { width: 50, height: 36 },
  "small-furniture": { width: 22, height: 28 },
  carpet: { width: 54, height: 18 },
  lamp: { width: 20, height: 48 },
  "home-textile": { width: 26, height: 28 }
};

function catalogueValue(value: string | undefined, allowed: string[]) {
  if (!value) return undefined;
  return allowed.find((candidate) => candidate.toLowerCase() === value.toLowerCase());
}

export function groundVisualizationItems(items: RoomVisualizationItemInput[]) {
  const references = new Map<string, number>();

  return items.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId && candidate.active);
    if (!product) throw new Error(`Unavailable catalogue product: ${item.productId}`);

    const assetUrl = roomSceneProductImage(product.id, {
      materialId: item.materialId,
      color: item.color
    });
    if (!assetUrl) throw new Error(`No catalogue image is available for ${product.modelCode}.`);

    const assetKey = assetUrl.split("?")[0].toLowerCase();
    let referenceImageIndex = references.get(assetKey);
    if (!referenceImageIndex) {
      referenceImageIndex = references.size + 2;
      references.set(assetKey, referenceImageIndex);
    }

    return {
      ...item,
      modelCode: product.modelCode,
      name: product.name,
      category: product.category,
      assetUrl,
      referenceImageIndex,
      verifiedColor: catalogueValue(item.color, product.colors),
      verifiedMaterialId: catalogueValue(item.materialId, product.materials)
    } satisfies GroundedVisualizationItem;
  });
}

function horizontalPlacement(x: number) {
  if (x < 34) return "left side";
  if (x > 66) return "right side";
  return "centre";
}

function placementInstructions(items: GroundedVisualizationItem[]) {
  return items.map((item, index) => {
    const verifiedFinish = [item.verifiedColor, item.verifiedMaterialId].filter(Boolean).join(", ");
    const finish = verifiedFinish ? ` Use the catalogue-verified finish: ${verifiedFinish}.` : "";
    const targetWidth = Math.round(Math.min(88, categoryMaskSize[item.category].width * item.scale));
    return `${index + 1}. Add one ${item.modelCode} (${item.name}) from reference image ${item.referenceImageIndex}, near the ${horizontalPlacement(item.x)} of the canvas, with its base approximately ${Math.round(item.y)}% from the top and occupying roughly ${targetWidth}% of the image width.${finish}`;
  }).join("\n");
}

export function buildRoomVisualizationPrompt(items: GroundedVisualizationItem[]) {
  const placements = placementInstructions(items);

  return `Re-render input image 1 as one complete, cohesive, photorealistic premium interior photograph. Do not create a cutout, collage, overlay, isolated furniture layer, before-and-after image, or split view.

Input image 1 is the customer's real room and the high-fidelity source of truth. Keep it unmistakably the same room: preserve the exact camera position, viewing direction, lens perspective, crop, room proportions, wall/floor/ceiling geometry, windows, doors, openings, trim, radiators, built-ins, and exterior view. Do not redesign the architecture, change structural finishes, expand the space, or invent doors or windows. The uploaded original must remain recognizable at a glance.

Create a beautiful, restrained Musterring editorial result across the whole image. Harmonize the full scene with believable natural light, accurate global illumination, consistent colour grading, realistic materials, ambient shadows, contact shadows, reflections, depth, and clean photographic detail. The chosen furniture must feel physically present in the room rather than pasted onto it. Keep the scene minimal and uncluttered. Do not add people, text, logos, decorations, plants, or unselected furniture. Existing fixed room features remain; loose objects may only be subtly tidied where needed for a coherent result.

Add only the catalogue products listed below. Match their reference images faithfully in product identity, silhouette, modules, upholstery, material, colour, feet, cushions, proportions, and visible details. Place them naturally on the visible floor with correct perspective, credible scale, contact, occlusion, and lighting. Never merge products, invent extra modules, or substitute another design.

${placements}

Return a single polished full-room photograph. Prioritize, in order: the same room architecture and camera; faithful selected products; then beautiful unified photographic rendering.`;
}

function roundedMultipleOf16(value: number) {
  return Math.max(16, Math.round(value / 16) * 16);
}

export async function normalizeRoomImage(buffer: Buffer): Promise<NormalizedRoomImage> {
  const oriented = await sharp(buffer, { failOn: "error" })
    .rotate()
    // Strip camera-specific colour profiles and alpha channels before the image
    // reaches OpenAI. Phone exports can otherwise be valid in the browser but
    // rejected by the image edit endpoint.
    .toColourspace("srgb")
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toBuffer({ resolveWithObject: true });
  const sourceWidth = oriented.info.width;
  const sourceHeight = oriented.info.height;
  const aspectRatio = sourceWidth / sourceHeight;
  if (aspectRatio < 1 / 3 || aspectRatio > 3) {
    throw new Error("Panoramic room photos wider or taller than a 3:1 ratio are not supported.");
  }

  const maxAllowedScale = 1536 / Math.max(sourceWidth, sourceHeight);
  const preferredScale = Math.max(1, 512 / Math.min(sourceWidth, sourceHeight));
  const scale = Math.min(maxAllowedScale, preferredScale);
  const width = roundedMultipleOf16(sourceWidth * scale);
  const height = roundedMultipleOf16(sourceHeight * scale);
  const normalized = await sharp(oriented.data)
    .resize(width, height, { fit: "fill" })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return { buffer: normalized, width, height };
}
