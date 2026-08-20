import sharp from "sharp";
import { z } from "zod";
import { products } from "../data";
import { roomSceneProductFinish, roomSceneProductImage } from "../room-scene-assets";
import type { Category } from "../types";

export const MAX_VISUALIZATION_ITEMS = 6;

export const roomVisualizationItemSchema = z.object({
  productId: z.string().trim().min(1).max(160),
  x: z.number().finite().min(0).max(100),
  y: z.number().finite().min(0).max(100),
  rotation: z.number().finite().min(-720).max(720),
  viewIndex: z.number().int().min(0).max(3).optional(),
  wallPlacement: z.enum(["free", "west", "back", "east"]).optional(),
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

const categoryScaleGuidance: Record<Category, string> = {
  sofa: "a primary large seating piece",
  sectional: "a primary large seating piece, normally the visually largest selected item",
  armchair: "a single-seat piece, clearly smaller than any sofa or sectional",
  storage: "a substantial storage piece sized plausibly against the wall and seating",
  "coffee-table": "a low secondary piece, smaller and lower than the seating around it",
  "bedroom-series": "a coordinated large furniture grouping",
  bed: "a primary large furniture piece",
  wardrobe: "a tall wall-adjacent storage piece with believable room-scale height",
  "dining-chair": "a single chair, clearly smaller than a dining table, sofa, or sectional",
  "dining-table": "a primary table sized to the selected chairs and available floor area",
  bathroom: "a room-scaled bathroom furniture piece",
  kitchen: "a substantial fitted furniture piece",
  outdoor: "an outdoor furniture piece at believable human scale",
  "small-furniture": "a compact secondary piece",
  carpet: "a low floor textile sized beneath or around related furniture",
  lamp: "a slender lighting piece at believable human scale",
  "home-textile": "a small supporting textile item"
};

export function groundVisualizationItems(items: RoomVisualizationItemInput[]) {
  const references = new Map<string, number>();

  return items.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId && candidate.active);
    if (!product) throw new Error(`Unavailable catalogue product: ${item.productId}`);

    const assetUrl = roomSceneProductImage(product.id, {
      viewIndex: item.viewIndex,
      materialId: item.materialId,
      color: item.color
    });
    if (!assetUrl) throw new Error(`No catalogue image is available for ${product.modelCode}.`);
    // Browser layout templates include approximate styling values. They are
    // not evidence of the finish pictured by a fixed catalogue reference.
    // Only a finish mapped to this exact asset may become a text instruction.
    const referenceFinish = roomSceneProductFinish(product.id, {
      materialId: item.materialId,
      color: item.color
    });

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
      verifiedColor: referenceFinish?.color,
      verifiedMaterialId: referenceFinish?.materialId
    } satisfies GroundedVisualizationItem;
  });
}

function horizontalPlacement(x: number) {
  if (x < 34) return "left side";
  if (x > 66) return "right side";
  return "centre";
}

export function normalizedOrientation(rotation: number) {
  const normalized = ((Math.round(rotation / 90) * 90) % 360 + 360) % 360;
  return {
    degrees: normalized,
    label: normalized === 0
      ? "front facing toward the camera"
      : normalized === 90
        ? "turned 90 degrees clockwise, showing its right-side orientation"
        : normalized === 180
          ? "turned away from the camera, showing its back orientation"
          : "turned 90 degrees counter-clockwise, showing its left-side orientation"
  };
}

function wallInstruction(wallPlacement: RoomVisualizationItemInput["wallPlacement"]) {
  if (!wallPlacement || wallPlacement === "free") return "Keep this item in the user-selected free-standing position; do not move it to the centre by default.";
  const wall = wallPlacement === "back" ? "back wall" : `${wallPlacement} wall`;
  return `Place it close to the visible ${wall}, with a realistic residential clearance of approximately 5-15 cm where physically possible. Keep it visibly wall-adjacent; do not pull it toward the middle of the room. Preserve skirting boards, radiators, openings, and other fixed obstacles, and use believable contact shadows and perspective at the wall.`;
}

function compositionInstructions(items: GroundedVisualizationItem[]) {
  const hasSeating = items.some((item) => ["sofa", "sectional", "armchair"].includes(item.category));
  const hasPrimarySeating = items.some((item) => ["sofa", "sectional"].includes(item.category));
  const hasArmchair = items.some((item) => item.category === "armchair");
  const hasCoffeeTable = items.some((item) => item.category === "coffee-table");
  const hasCarpet = items.some((item) => item.category === "carpet");
  const guidance: string[] = [];

  if (hasPrimarySeating && hasCoffeeTable) {
    guidance.push("Form one tight, cohesive seating group: place each selected coffee table directly in front of and comfortably within reach of the sofa or sectional. Keep the nearest edge of the coffee table approximately 25-35 cm from the nearest sofa seat edge; this relationship outranks the table's editor anchor when the anchor leaves a larger gap. The visible floor gap must be narrow and intentional, never a broad empty strip. Never leave a coffee table isolated in the middle of an empty floor.");
  }
  if (hasSeating && hasArmchair) {
    guidance.push("Integrate each selected armchair into the conversation area beside or diagonally opposite the primary seating. Aim it toward the seating group or coffee table, keep a believable walking path, and avoid a detached chair floating deep in the foreground.");
  }
  if (hasCarpet) {
    guidance.push("The selected carpet is required and must remain visibly identifiable. Use it to anchor the furniture group beneath the coffee table and at least the front legs of the main seating; do not omit it, hide it completely, or place it remotely from the group.");
  }
  if (!hasCarpet) {
    if (hasPrimarySeating && hasCoffeeTable) {
      guidance.push("Add one understated, unbranded, neutral low-pile area rug as a non-catalogue styling accessory beneath the coffee table and seating group. Size and position it to anchor the composition: the coffee table must sit fully on it and it should extend beneath at least the front legs of the sofa. Keep it visually quiet so it does not compete with or alter the locked catalogue products; do not present it as a Musterring product.");
    } else {
      guidance.push("No carpet was selected, so do not invent or add one.");
    }
  }
  guidance.push("Maintain practical circulation paths to doors and openings, and avoid large accidental gaps between pieces that are meant to function together.");
  return guidance.join("\n");
}

function placementInstructions(items: GroundedVisualizationItem[]) {
  return items.map((item, index) => {
    const verifiedFinish = [item.verifiedColor, item.verifiedMaterialId].filter(Boolean).join(", ");
    const finish = verifiedFinish
      ? ` The required catalogue finish is ${verifiedFinish}; reproduce that exact colour and material, using reference image ${item.referenceImageIndex} as the visual authority.`
      : ` Copy the exact visible colour, material, texture, and finish from reference image ${item.referenceImageIndex}; do not infer or substitute a finish from the room.`;
    const scalePreference = item.scale < .85
      ? "The editor indicates a somewhat smaller presentation, but keep it realistic."
      : item.scale > 1.15
        ? "The editor indicates a somewhat larger presentation, but keep it realistic and do not overpower larger product categories."
        : "Use a natural room-relative size.";
    const orientation = normalizedOrientation(item.rotation);
    return `${index + 1}. Add exactly one ${item.modelCode} (${item.name}) from reference image ${item.referenceImageIndex}. Use the editor position as a nearby anchor zone, not an exact pixel lock: its chosen anchor is approximately ${Math.round(item.x)}% from the left edge and its floor-contact base approximately ${Math.round(item.y)}% from the top edge (${horizontalPlacement(item.x)}). Keep it recognizably in that part of the room, but move it a modest distance when needed to create a coherent furniture grouping, realistic clearance, and a better composition. Its scale role is ${categoryScaleGuidance[item.category]}. ${scalePreference} Keep the product upright and preserve its chosen general facing direction of ${orientation.degrees} degrees: ${orientation.label}. A subtle perspective-aware adjustment of up to about 15 degrees is allowed only when it makes the furniture group interact more naturally; never flip it to another side. Never rotate or tilt the flat image in the picture plane. ${wallInstruction(item.wallPlacement)}${finish}`;
  }).join("\n");
}

export function buildRoomVisualizationPrompt(items: GroundedVisualizationItem[]) {
  const placements = placementInstructions(items);
  const composition = compositionInstructions(items);

  return `Re-render input image 1 as one complete, cohesive, photorealistic premium interior photograph in a 16:9 landscape composition. Keep every selected product fully inside the frame with comfortable visual breathing room. Do not create a cutout, collage, overlay, isolated furniture layer, before-and-after image, or split view.

Input image 1 is the customer's real room and the high-fidelity source of truth. Keep it unmistakably the same room: preserve the exact camera position, viewing direction, lens perspective, crop, room proportions, wall/floor/ceiling geometry, windows, doors, openings, trim, radiators, built-ins, and exterior view. Do not redesign the architecture, change structural finishes, expand the space, or invent doors or windows. The uploaded original must remain recognizable at a glance.

Create a beautiful, restrained Musterring editorial result across the whole image. Harmonize the room with believable natural light, accurate global illumination, ambient shadows, contact shadows, reflections, depth, and clean photographic detail. The chosen furniture must feel physically present in the room rather than pasted onto it. Keep the scene minimal and uncluttered. Do not add people, text, logos, decorations, plants, or unselected furniture. The only permitted new non-catalogue styling object is the neutral area rug explicitly required by the layout instructions. Existing fixed room features remain; loose objects may only be subtly tidied where needed for a coherent result.

PRODUCT LOCK — this requirement outranks room styling and photographic beautification. Add only the catalogue products listed below. Each product reference image is the canonical visual source of truth. Reproduce every selected product without redesign or reinterpretation: identical base colour and colour temperature, upholstery or surface material, weave or grain, silhouette, module count and arrangement, proportions, seams, piping, tufting, cushions and cushion colours, arms, backrests, legs, feet, hardware, and all other visible details. Do not recolour, desaturate, brighten, darken, coordinate with the room palette, swap fabric or material, add or remove cushions, change modules, or substitute a similar design. Room illumination may create physically natural highlights and shadows, but it must not alter the product's underlying colour or finish. If aesthetic styling conflicts with product fidelity, preserve the product exactly and keep the room treatment simpler.

Place the locked products naturally on the visible floor with correct perspective, credible scale, contact, occlusion, and lighting. Treat wall placement as a hard constraint, rotation as a strong directional constraint, and each x/y position as a local anchor zone that permits tasteful nearby adjustment. Product size is adaptive rather than a hard percentage: choose the most attractive believable scale for the photographed room while maintaining real-world category hierarchy. A single chair must never appear larger than a sofa or sectional; coffee tables must remain lower and smaller than seating; secondary pieces must not overpower primary furniture. You may make an item moderately smaller or larger than its editor preview to improve composition, prevent cropping, and achieve credible perspective. Do not recenter wall-adjacent furniture for a more symmetrical composition. Keep all products completely visible, including arms, chaise ends, legs, and shadows. Never merge products, invent extra modules, or substitute another design.

INTERIOR LAYOUT - organize the selected products as a professional interior stylist while respecting their anchor zones:
${composition}

${placements}

Before returning the image, compare every rendered product against its numbered reference and correct any difference in colour, material, construction, cushions, modules, or visible details. Return a single polished full-room photograph. Prioritize, in order: exact selected-product appearance; the same room architecture and camera; then beautiful unified photographic rendering.`;
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
