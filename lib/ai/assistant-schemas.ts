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
  bedTypes: z.array(z.enum(["bed-frame", "upholstered-bed", "boxspring-bed", "sofa-bed", "mattress", "slatted-base"])).max(6).optional(),
  bedSleepingWidthMm: z.number().int().positive().optional(),
  bedSleepingLengthMm: z.number().int().positive().optional(),
  bedStorage: z.boolean().optional(),
  bedMotorised: z.boolean().optional(),
  layoutShapes: z.array(z.enum(["straight", "l-shaped", "u-shaped", "corner", "island"])).max(5).optional(),
  excludedLayoutShapes: z.array(z.enum(["straight", "l-shaped", "u-shaped", "corner", "island"])).max(5).optional(),
  tabletopShapes: z.array(z.enum(["oval", "round", "square", "rectangular"])).max(4).optional(),
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
  demoFactsUsed: z.array(z.string()),
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

/** One question the assistant asks to narrow an under-specified brief. */
export const clarifyingQuestionSchema = z.object({
  slot: z.string().max(40),
  question: z.string().max(240),
  options: z.array(z.string().max(60)).max(6)
});
export type ClarifyingQuestionPayload = z.infer<typeof clarifyingQuestionSchema>;

/** A hard requirement that no catalogue product could satisfy. */
export const unmetConstraintSchema = z.object({
  key: z.string().max(40),
  requested: z.string().max(160),
  closest: z.string().max(240)
});

/** A near miss, always shown with the exact reason it is not a match. */
export const nearestMatchSchema = z.object({
  productId: z.string(),
  gaps: z.array(z.string().max(200)).max(4)
});

export const advisorAnswerSchema = z.object({
  answer: z.string().max(3000),
  answerType: z.enum(["fact", "products", "comparison", "materials", "configuration", "project", "room", "fit", "dealer", "missing-data", "clarify"]),
  productIds: z.array(z.string()).max(12),
  materialIds: z.array(z.string()).max(12),
  sources: z.array(z.string()).max(12),
  proposedAction: advisorActionSchema.nullable(),
  suggestedQuestions: z.array(z.string()).max(4),
  /** Present when the assistant needs one more detail before recommending. */
  clarify: clarifyingQuestionSchema.nullable().default(null),
  /** Non-empty only when the brief cannot be satisfied by the catalogue. */
  unmet: z.array(unmetConstraintSchema).max(8).default([]),
  /** Deliberate near misses, each labelled with how far it is off. */
  nearest: z.array(nearestMatchSchema).max(3).default([]),
  /** Short chips describing what the assistant currently understands. */
  briefSummary: z.array(z.string().max(60)).max(12).default([])
});
export type AdvisorAnswer = z.infer<typeof advisorAnswerSchema>;

export const conversationContextSchema = z.object({
  route: z.string().max(500),
  currentProductId: z.string().nullable().optional(),
  referencedProductIds: z.array(z.string()).max(20).default([]),
  /** Products explicitly confirmed by the customer in this chat journey. */
  selectedProductIds: z.array(z.string()).max(20).optional(),
  selectedProjectId: z.string().nullable().optional(),
  selectedConfigurationId: z.string().nullable().optional(),
  selectedMaterialIds: z.array(z.string()).max(20).default([]),
  currentFilters: z.record(z.unknown()).default({}),
  approvedPreferences: z.record(z.unknown()).default({}),
  recentMessages: z.array(z.object({
    role: z.enum(["customer", "advisor"]),
    text: z.string().trim().min(1).max(3000)
  })).max(8).optional()
});
export type ConversationContext = z.infer<typeof conversationContextSchema>;

export const conversationRecommendationSchema = z.object({
  productIds: z.array(z.string()).max(12),
  rationale: z.string().max(1200)
});

export const conversationSummarySchema = z.object({
  summary: z.string().max(3000)
});
