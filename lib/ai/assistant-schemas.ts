import { z } from "zod";

const catalogueCategorySchema = z.enum([
  "sofa", "armchair", "sectional", "storage", "coffee-table", "bedroom-series", "bed", "wardrobe",
  "dining-chair", "dining-table", "bathroom", "kitchen", "outdoor", "small-furniture", "carpet", "lamp", "home-textile"
]);

export const alternativeRequestSchema = z.object({
  sourceProductId: z.string().min(1),
  requestText: z.string().trim().max(1000).optional(),
  category: catalogueCategorySchema.optional(),
  colorFamilies: z.array(z.string().trim().min(1).max(80)).max(12).optional(),
  styles: z.array(z.string().trim().min(1).max(80)).max(12).optional(),
  numberOfSeats: z.number().int().positive().max(20).optional(),
  maxWidthMm: z.number().int().positive().optional(),
  minWidthMm: z.number().int().positive().optional(),
  targetWidthMm: z.number().int().positive().optional(),
  layoutShapes: z.array(z.enum(["straight", "l-shaped", "u-shaped", "corner", "island"])).max(5).optional(),
  minSeatHeightMm: z.number().int().nonnegative().optional(),
  requiredFunctions: z.array(z.string()).max(20).optional(),
  excludedFunctions: z.array(z.string()).max(20).optional(),
  materialTags: z.array(z.string()).max(20).optional(),
  preserveStyle: z.boolean().optional(),
  preserveComfort: z.boolean().optional(),
  strict: z.boolean().optional()
});
export type AlternativeRequest = z.infer<typeof alternativeRequestSchema>;

export const alternativeMatchSchema = z.object({
  productId: z.string(),
  exact: z.boolean(),
  differences: z.array(z.string()),
  benefits: z.array(z.string()),
  tradeOffs: z.array(z.string()),
  unmetRequirements: z.array(z.string()),
  explanation: z.string()
});

export const alternativeResponseSchema = z.object({
  sourceProductId: z.string(),
  interpretedRequirements: z.array(z.string()),
  requestedColorFamilies: z.array(z.string()),
  exactMatches: z.array(alternativeMatchSchema),
  closestAlternatives: z.array(alternativeMatchSchema),
  message: z.string()
});
export type AlternativeResponse = z.infer<typeof alternativeResponseSchema>;

export const materialNeedsSchema = z.object({
  children: z.boolean().optional(),
  pets: z.boolean().optional(),
  highUse: z.boolean().optional(),
  strongSunlight: z.boolean().optional(),
  easyCareRequired: z.boolean().optional(),
  preferredColors: z.array(z.string()).optional(),
  preferredMaterialGroups: z.array(z.string()).optional(),
  avoidMaterialGroups: z.array(z.string()).optional()
});

export const materialAdviceSchema = z.object({
  needs: materialNeedsSchema,
  recommendedMaterialIds: z.array(z.string()),
  materialsToAvoid: z.array(z.string()),
  explanationKeys: z.array(z.string())
});
export type MaterialAdvice = z.infer<typeof materialAdviceSchema>;

export const voiceIntentSchema = z.enum([
  "SEARCH_PRODUCTS", "FILTER_PRODUCTS", "OPEN_PRODUCT", "COMPARE_PRODUCTS", "CONFIGURE_PRODUCT",
  "CHANGE_MATERIAL", "SAVE_TO_PROJECT", "ADD_COMPLEMENTARY_PRODUCT", "OPEN_ROOM_COMPOSER",
  "OPEN_FIT_CHECK", "FIND_RETAILER", "BOOK_CONSULTATION", "ASK_PRODUCT_QUESTION"
]);

export const voiceCommandSchema = z.object({
  intent: voiceIntentSchema,
  parameters: z.record(z.unknown()),
  requiresConfirmation: z.boolean()
});
export type VoiceCommand = z.infer<typeof voiceCommandSchema>;

export const advisorActionSchema = z.object({
  type: z.enum([
    "SEARCH_PRODUCTS", "COMPARE_PRODUCTS", "OPEN_PRODUCT", "CONFIGURE_PRODUCT", "SAVE_PRODUCT",
    "SAVE_CONFIGURATION", "OPEN_ROOM_COMPOSER", "OPEN_FIT_CHECK", "FIND_RETAILER",
    "PREPARE_HANDOVER", "BOOK_CONSULTATION", "SHOW_ALTERNATIVES", "SHOW_MATERIALS"
  ]),
  label: z.string(),
  parameters: z.record(z.unknown()),
  requiresConfirmation: z.boolean()
});
export type AdvisorAction = z.infer<typeof advisorActionSchema>;

export const advisorAnswerSchema = z.object({
  answer: z.string().max(3000),
  answerType: z.enum(["fact", "products", "comparison", "materials", "configuration", "project", "room", "fit", "dealer", "missing-data"]),
  productIds: z.array(z.string()).max(12),
  materialIds: z.array(z.string()).max(12),
  sources: z.array(z.string()).max(12),
  proposedAction: advisorActionSchema.nullable(),
  suggestedQuestions: z.array(z.string()).max(4)
});
export type AdvisorAnswer = z.infer<typeof advisorAnswerSchema>;

export const conversationContextSchema = z.object({
  route: z.string().max(500),
  currentProductId: z.string().nullable().optional(),
  referencedProductIds: z.array(z.string()).max(20).default([]),
  selectedProjectId: z.string().nullable().optional(),
  selectedConfigurationId: z.string().nullable().optional(),
  selectedMaterialIds: z.array(z.string()).max(20).default([]),
  currentFilters: z.record(z.unknown()).default({}),
  approvedPreferences: z.record(z.unknown()).default({})
});
export type ConversationContext = z.infer<typeof conversationContextSchema>;

export const conversationRecommendationSchema = z.object({
  productIds: z.array(z.string()).max(12),
  rationale: z.string().max(1200)
});

export const conversationSummarySchema = z.object({
  summary: z.string().max(3000)
});
