import { z } from "zod";
import { catalogueCategories, stylistRoomTypes, stylistStylePreferences } from "../types";
import { validateStylistQuizInput } from "./stylist-quiz";

const nullableString = z.string().nullable();
const nullableNumber = z.number().int().nonnegative().nullable();
const nullableBoolean = z.boolean().nullable();
const nullableStrings = z.array(z.string()).nullable();
const layoutShapeSchema = z.enum(["straight", "l-shaped", "u-shaped", "corner", "island"]);

export const searchIntentSchema = z.object({
  queryText: z.string().trim().min(1).max(1000),
  category: z.enum(catalogueCategories).nullable(),
  colorFamilies: nullableStrings,
  materials: nullableStrings,
  maxWidthMm: nullableNumber,
  minWidthMm: nullableNumber,
  targetWidthMm: nullableNumber,
  minSeatHeightMm: nullableNumber,
  maxSeatDepthMm: nullableNumber,
  numberOfSeats: nullableNumber,
  modular: nullableBoolean,
  functions: nullableStrings,
  styles: nullableStrings,
  roomType: nullableString,
  smallSpaceSuitable: nullableBoolean,
  layoutShapes: z.array(layoutShapeSchema).nullable()
});
export type SearchIntent = z.infer<typeof searchIntentSchema>;

export const visualTagsSchema = z.object({
  category: z.enum(catalogueCategories).nullable(),
  colorFamilies: z.array(z.string()),
  likelyMaterial: nullableString,
  style: z.array(z.string()),
  silhouette: z.string(),
  notableVisualFeatures: z.array(z.string())
});
export type VisualTags = z.infer<typeof visualTagsSchema>;

export const roomAnalysisSchema = z.object({
  roomType: z.string(),
  visibleFloorRegion: z.string(),
  approximateWallAreas: z.array(z.string()),
  windows: z.array(z.string()),
  doors: z.array(z.string()),
  existingMajorFurniture: z.array(z.string()),
  dominantColors: z.array(z.string()),
  styleTags: z.array(z.string()),
  lightingDescription: z.string()
});
export type RoomAnalysis = z.infer<typeof roomAnalysisSchema>;

export const roomSizeExplanationSchema = z.object({
  summary: z.string().trim().min(1).max(500),
  considerations: z.array(z.string().trim().min(1).max(300)).min(2).max(5)
});
export type RoomSizeExplanation = z.infer<typeof roomSizeExplanationSchema>;

export const roomSizeVisionRecommendationSchema = z.object({
  minimumWidthMm: z.number().int().min(1500).max(15000).describe("Compact room width from left to right across the back wall in the image."),
  minimumLengthMm: z.number().int().min(1500).max(15000).describe("Compact room length from the back wall toward the camera."),
  recommendedWidthMm: z.number().int().min(2000).max(15000).describe("Comfortable room width from left to right across the back wall in the image."),
  recommendedLengthMm: z.number().int().min(2000).max(15000).describe("Comfortable room length from the back wall toward the camera."),
  minimumSummary: z.string().trim().min(1).max(320),
  recommendedSummary: z.string().trim().min(1).max(320),
  summary: z.string().trim().min(1).max(500),
  layoutRelationships: z.array(z.string().trim().min(1).max(260)).min(2).max(5),
  reasoning: z.array(z.string().trim().min(1).max(300)).min(2).max(5),
  confidence: z.enum(["medium", "high"])
});
export type RoomSizeVisionRecommendation = z.infer<typeof roomSizeVisionRecommendationSchema>;

export const configurationRequirementsSchema = z.object({
  customerRequest: z.string(),
  category: z.enum(["sofa", "armchair", "sectional"]).nullable(),
  colorFamily: nullableString,
  materialType: z.enum(["fabric", "leather"]).nullable(),
  easyCare: nullableBoolean,
  maxWidthMm: nullableNumber,
  numberOfSeats: nullableNumber,
  modular: nullableBoolean,
  relaxFunction: nullableBoolean,
  electricFunction: nullableBoolean,
  comfort: z.enum(["soft", "balanced", "firm"]).nullable(),
  posture: z.enum(["upright", "relaxed"]).nullable()
});
export type ConfigurationRequirements = z.infer<typeof configurationRequirementsSchema>;

export const comfortPreferencesSchema = z.object({
  sourceText: z.string(),
  tallUser: z.boolean(),
  comfort: z.enum(["soft", "balanced", "firm"]),
  posture: z.enum(["upright", "relaxed"]),
  pets: z.boolean(),
  children: z.boolean(),
  easyCare: z.boolean(),
  electric: z.boolean(),
  maxWidthMm: nullableNumber,
  numberOfSeats: nullableNumber
});
export type ComfortPreferences = z.infer<typeof comfortPreferencesSchema>;

export const matchExplanationSchema = z.object({
  explanation: z.string().max(600)
});

export const complementaryRecommendationSchema = z.object({
  categories: z.array(z.enum(["sofa", "armchair", "sectional", "storage"])),
  colorFamilies: z.array(z.string()),
  styles: z.array(z.string()),
  rationale: z.string()
});

export const retailerProjectDataSchema = z.object({
  customerIntent: z.string().max(2000),
  productIds: z.array(z.string()).max(50),
  configurationIds: z.array(z.string()).max(50),
  materialIds: z.array(z.string()).max(50),
  roomPlan: z.record(z.unknown()).nullable(),
  fitWarnings: z.array(z.string()).max(50),
  requestedRetailerAction: z.string().max(500)
});
export type RetailerProjectData = z.infer<typeof retailerProjectDataSchema>;

export const retailerSummarySchema = z.object({
  summary: z.string().max(3000)
});

export const comparisonProductFactsSchema = z.object({
  productId: z.string().trim().min(1).max(160),
  modelCode: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(80),
  verifiedWidthCm: z.number().int().positive().nullable(),
  verifiedSeatCount: z.number().int().positive().nullable(),
  verifiedMaterialTypes: z.array(z.string().trim().min(1).max(80)).max(10),
  verifiedFunctions: z.array(z.string().trim().min(1).max(120)).max(20),
  verifiedModular: z.boolean(),
  verifiedSmallSpaceSuitable: z.boolean(),
  verifiedDetails: z.array(z.object({
    label: z.string().trim().min(1).max(100),
    value: z.string().trim().min(1).max(300)
  })).max(20),
  comparisonHighlights: z.array(z.string().trim().min(1).max(160)).max(4)
});

export const comparisonSummaryInputSchema = z.object({
  products: z.array(comparisonProductFactsSchema).min(2).max(3)
});
export type ComparisonSummaryInput = z.infer<typeof comparisonSummaryInputSchema>;

export const comparisonSummarySchema = z.object({
  products: z.array(z.object({
    productId: z.string().trim().min(1).max(160),
    summary: z.string().trim().min(1).max(160),
    bestFor: z.string().trim().min(1).max(160),
    facts: z.array(z.string().trim().min(1).max(220)).min(1).max(2)
  })).min(2).max(3),
  glance: z.array(z.string().trim().min(1).max(180)).min(1).max(2),
  recommendation: z.string().trim().min(1).max(600)
});
export type ComparisonSummary = z.infer<typeof comparisonSummarySchema>;

export const imageUploadSchema = z.object({
  type: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size: z.number().int().positive().max(10 * 1024 * 1024),
  consent: z.literal(true)
});

export const stylistOptionsSchema = z.object({
  roomType: z.enum(stylistRoomTypes),
  answers: z.record(z.union([
    z.string().trim().min(1).max(80),
    z.array(z.string().trim().min(1).max(80)).min(1).max(4).refine((values) => new Set(values).size === values.length)
  ])).refine((value) => Object.keys(value).length <= 10),
  notes: z.record(z.string().trim().max(240)).refine((value) => Object.keys(value).length <= 10),
  selectedProductIds: z.array(z.string().trim().min(1).max(180)).max(20).refine((values) => new Set(values).size === values.length),
  maxWidthMm: z.number().int().min(300).max(10_000).nullable(),
  maxDepthMm: z.number().int().min(300).max(10_000).nullable(),
  styleDirection: z.enum(stylistStylePreferences).nullable().optional()
}).strict().superRefine((value, context) => {
  if (!validateStylistQuizInput(value)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["answers"], message: "Complete the supported questions for the selected room." });
});

export const stylistSlotIds = [
  "living-seating", "living-armchair", "living-table", "living-side-table", "living-storage", "living-sideboard",
  "bedroom-bed", "bedroom-wardrobe", "bedroom-series", "bedroom-bedside", "bedroom-dresser",
  "dining-table", "dining-chair", "dining-bench", "dining-storage",
  "single-product", "hallway-wardrobe", "hallway-storage",
  "kitchen-table", "kitchen-seating", "kitchen-storage",
  "accessory-small", "accessory-carpet", "accessory-lamp",
  "bathroom-series", "outdoor-set"
] as const;

export const stylistProviderResultSchema = z.object({
  title: z.string().trim().min(1).max(120),
  rationale: z.string().trim().min(1).max(600),
  selections: z.array(z.object({
    slotId: z.enum(stylistSlotIds),
    productId: z.string().trim().min(1).max(180),
    reason: z.string().trim().min(1).max(320),
    alternatives: z.array(z.object({
      productId: z.string().trim().min(1).max(180),
      reason: z.string().trim().min(1).max(260)
    })).max(2)
  })).min(1).max(4)
});

export type StylistProviderResult = z.infer<typeof stylistProviderResultSchema>;

export function stylistProviderResultSchemaForCandidates(constraints: Array<{
  slotId: (typeof stylistSlotIds)[number];
  candidateIds: string[];
}>) {
  if (constraints.length < 1 || constraints.length > 4 || constraints.some((constraint) => constraint.candidateIds.length < 1)) {
    throw new Error("Every stylist slot requires at least one catalogue candidate.");
  }
  const variants = constraints.map((constraint) => {
    const candidateIdSchema = z.enum(constraint.candidateIds as [string, ...string[]]);
    const availableAlternatives = Math.max(0, constraint.candidateIds.length - 1);
    const alternativeLimits = { min: Math.min(constraints.length === 1 ? 2 : 1, availableAlternatives), max: Math.min(2, availableAlternatives) };
    return z.object({
      slotId: z.literal(constraint.slotId),
      productId: candidateIdSchema,
      reason: z.string().trim().min(1).max(320),
      alternatives: z.array(z.object({
        productId: candidateIdSchema,
        reason: z.string().trim().min(1).max(260)
      })).min(alternativeLimits.min).max(alternativeLimits.max)
    });
  });
  const selectionVariant = variants.length === 1
    ? variants[0]!
    : z.union(variants as [typeof variants[number], typeof variants[number], ...Array<typeof variants[number]>]);
  return stylistProviderResultSchema.extend({
    selections: z.array(selectionVariant).length(constraints.length)
  });
}

