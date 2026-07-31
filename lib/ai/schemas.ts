import { z } from "zod";

const nullableString = z.string().nullable();
const nullableNumber = z.number().int().nonnegative().nullable();
const nullableBoolean = z.boolean().nullable();
const nullableStrings = z.array(z.string()).nullable();

export const searchIntentSchema = z.object({
  queryText: z.string().trim().min(1).max(1000),
  category: z.enum(["sofa", "armchair", "sectional", "storage"]).nullable(),
  colorFamilies: nullableStrings,
  materials: nullableStrings,
  maxWidthMm: nullableNumber,
  minSeatHeightMm: nullableNumber,
  maxSeatDepthMm: nullableNumber,
  numberOfSeats: nullableNumber,
  modular: nullableBoolean,
  functions: nullableStrings,
  styles: nullableStrings,
  roomType: nullableString,
  smallSpaceSuitable: nullableBoolean
});
export type SearchIntent = z.infer<typeof searchIntentSchema>;

export const visualTagsSchema = z.object({
  category: z.enum(["sofa", "armchair", "sectional", "storage"]).nullable(),
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

export const imageUploadSchema = z.object({
  type: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size: z.number().int().positive().max(10 * 1024 * 1024),
  consent: z.literal(true)
});

