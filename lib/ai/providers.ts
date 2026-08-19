import "server-only";

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import {
  complementaryRecommendationSchema,
  comparisonSummarySchema,
  configurationRequirementsSchema,
  matchExplanationSchema,
  retailerProjectDataSchema,
  retailerSummarySchema,
  roomAnalysisSchema,
  searchIntentSchema,
  visualTagsSchema,
  type ComparisonSummary,
  type ComparisonSummaryInput,
  type ConfigurationRequirements,
  type RetailerProjectData,
  type RoomAnalysis,
  type SearchIntent,
  type VisualTags
} from "./schemas";
import { parseSearchQuery } from "../search";
import {
  advisorAnswerSchema, alternativeRequestSchema, alternativeResponseSchema, conversationRecommendationSchema,
  conversationSummarySchema, materialAdviceSchema, voiceCommandSchema,
  type AdvisorAnswer, type AlternativeRequest, type AlternativeResponse, type ConversationContext,
  type MaterialAdvice, type VoiceCommand
} from "./assistant-schemas";
import { deterministicComparisonSummary, validateComparisonSummary } from "./comparison-summary";
import { validatedAIAlternativeRequirements } from "./alternative-intent";
import { answerGroundedQuestion, findGroundedAlternatives, materialMatchesNeeds, materialMetadataMatches, parseMaterialNeeds, parseVoiceCommandDeterministic } from "../assistant";
import { materials, products } from "../data";
import { catalogueCategories } from "../types";

export type AIProviderName = "openai" | "gemini" | "demo";
export type ProviderResult<T> = { data: T; provider: AIProviderName; fallback: boolean };

const advisorNarrativeSchema = z.object({
  answer: z.string().trim().min(1).max(3000),
  suggestedQuestions: z.array(z.string().trim().min(1).max(180)).max(4)
});

// Structured Outputs requires every object property to be present. Nullable
// fields are normalized back to the app's optional MaterialAdvice shape below.
const openAIMaterialAdviceSchema = z.object({
  needs: z.object({
    children: z.boolean().nullable(),
    pets: z.boolean().nullable(),
    highUse: z.boolean().nullable(),
    strongSunlight: z.boolean().nullable(),
    easyCareRequired: z.boolean().nullable(),
    preferredColors: z.array(z.string()).nullable(),
    preferredMaterialGroups: z.array(z.string()).nullable(),
    avoidMaterialGroups: z.array(z.string()).nullable()
  }),
  recommendedMaterialIds: z.array(z.string()),
  materialsToAvoid: z.array(z.string()),
  explanationKeys: z.array(z.string())
});

const visualCategoryList = catalogueCategories.join(", ");

export interface AIProvider {
  readonly name: AIProviderName;
  parseSearchIntent(query: string): Promise<SearchIntent>;
  analyzeProductImage(imageDataUrl: string): Promise<VisualTags>;
  analyzeRoomImage(imageDataUrl: string): Promise<RoomAnalysis>;
  suggestConfigurationRequirements(request: string): Promise<ConfigurationRequirements>;
  explainProductMatch(input: { request: string; productFacts: string }): Promise<string>;
  summarizeRetailerProject(project: RetailerProjectData, groundedFacts: string): Promise<string>;
  recommendComplementaryProducts(input: { selectedFacts: string }): Promise<z.infer<typeof complementaryRecommendationSchema>>;
  summarizeProductComparison(input: ComparisonSummaryInput): Promise<ComparisonSummary>;
  findProductAlternatives(input: AlternativeRequest): Promise<AlternativeResponse>;
  adviseMaterials(input: { requestText: string }): Promise<MaterialAdvice>;
  parseVoiceCommand(transcript: string): Promise<VoiceCommand>;
  answerProductQuestion(input: { question: string; context: ConversationContext }): Promise<AdvisorAnswer>;
  recommendProductsFromConversation(input: { conversationSummary: string; candidateProductIds: string[] }): Promise<z.infer<typeof conversationRecommendationSchema>>;
  suggestNextQuestion(input: { answer: string; route: string }): Promise<string[]>;
  summarizeConversationForProject(input: { referencedProductIds: string[]; preferences: Record<string, unknown> }): Promise<string>;
  summarizeConversationForRetailer(input: { referencedProductIds: string[]; preferences: Record<string, unknown>; unresolvedQuestions: string[] }): Promise<string>;
}

function emptyIntent(queryText: string): SearchIntent {
  return {
    queryText, category: null, colorFamilies: null, materials: null, maxWidthMm: null,
    minWidthMm: null, targetWidthMm: null,
    minSeatHeightMm: null, maxSeatDepthMm: null, numberOfSeats: null, modular: null,
    functions: null, styles: null, roomType: null, smallSpaceSuitable: null, layoutShapes: null
  };
}

export class LocalDemoAIProvider implements AIProvider {
  readonly name: AIProviderName = "demo";

  async parseSearchIntent(query: string) {
    const filters = parseSearchQuery(query);
    const text = query.toLowerCase();
    const extraColor = text.match(/\b(purple|blue|yellow|orange|pink|black|white)\b/)?.[1];
    return searchIntentSchema.parse({
      ...emptyIntent(query.trim()),
      category: filters.category ?? null,
      colorFamilies: filters.colors ?? (extraColor ? [extraColor] : null),
      materials: filters.materials ?? (/leather/.test(text) ? ["leather"] : /fabric|easy-care/.test(text) ? ["fabric"] : null),
      maxWidthMm: filters.maxWidthMm ?? null,
      minWidthMm: filters.minWidthMm ?? null,
      targetWidthMm: filters.targetWidthMm ?? null,
      minSeatHeightMm: /high[- ]seat|tall person|gro(?:ÃŸ|ß|ss)e person|easy.{0,8}(stand|rise)/.test(text) ? 470 : null,
      maxSeatDepthMm: /upright/.test(text) ? 560 : null,
      numberOfSeats: filters.seatCount ?? (text.match(/\bfour[- ]seat/) ? 4 : null),
      modular: filters.modular ?? null,
      functions: ([
        ...(filters.relaxFunction ? ["relax"] : []),
        ...(filters.electricFunctions ? ["electric"] : []),
        ...(/easy[- ]care|pflegeleicht|family|familie|kinder/.test(text) ? ["easy-care"] : [])
      ] as string[]).filter(Boolean).length ? [
        ...(filters.relaxFunction ? ["relax"] : []),
        ...(filters.electricFunctions ? ["electric"] : []),
        ...(/easy[- ]care|pflegeleicht|family|familie|kinder/.test(text) ? ["easy-care"] : [])
      ] : null,
      styles: /modern heritage/.test(text) ? ["modern heritage"] : /modern|minimal|contemporary/.test(text) ? ["modern"] : null,
      roomType: /apartment|wohnung/.test(text) ? "small apartment" : /family|familie/.test(text) ? "family living room" : null,
      smallSpaceSuitable: filters.smallSpaceSuitable ?? null,
      layoutShapes: filters.layoutShapes ?? null
    });
  }

  async analyzeProductImage(imageDataUrl: string) {
    const fingerprint = imageFingerprint(imageDataUrl);
    const palettes = [["beige", "sand"], ["charcoal", "grey"], ["brown", "cognac"], ["cream", "ivory"], ["green", "natural"]];
    return visualTagsSchema.parse({
      category: fingerprint % 5 === 0 ? "armchair" : "sofa",
      colorFamilies: palettes[fingerprint % palettes.length],
      likelyMaterial: fingerprint % 3 === 0 ? "leather" : "fabric",
      style: fingerprint % 2 ? ["modern heritage", "minimal"] : ["contemporary", "soft modern"],
      silhouette: fingerprint % 5 === 0 ? "compact upright silhouette" : "wide low horizontal silhouette",
      notableVisualFeatures: ["defined arm profile", fingerprint % 2 ? "soft tailored upholstery" : "clean geometric seams"]
    });
  }

  async analyzeRoomImage(imageDataUrl: string) {
    const fingerprint = imageFingerprint(imageDataUrl);
    return roomAnalysisSchema.parse({
      roomType: fingerprint % 4 === 0 ? "open-plan living and dining room" : "living room",
      visibleFloorRegion: "central floor area visible; boundaries are approximate",
      approximateWallAreas: ["main wall behind seating", "partial side wall"],
      windows: fingerprint % 3 ? ["one likely window on the brighter side"] : [],
      doors: ["one possible doorway; please confirm"],
      existingMajorFurniture: ["sofa or large seating", "low table"],
      dominantColors: fingerprint % 2 ? ["warm neutral", "beige", "wood"] : ["cool neutral", "grey", "white"],
      styleTags: ["modern", "calm", "residential"],
      lightingDescription: fingerprint % 2 ? "soft natural side light" : "balanced ambient light"
    });
  }

  async suggestConfigurationRequirements(request: string) {
    const intent = await this.parseSearchIntent(request);
    const text = request.toLowerCase();
    return configurationRequirementsSchema.parse({
      customerRequest: request,
      category: intent.category && ["sofa", "armchair", "sectional"].includes(intent.category) ? intent.category : null,
      colorFamily: intent.colorFamilies?.[0] ?? null,
      materialType: /leather/.test(text) ? "leather" : /fabric|easy[- ]care/.test(text) ? "fabric" : null,
      easyCare: /easy[- ]care|pflegeleicht|dog|pet|family|familie|children|kinder/.test(text),
      maxWidthMm: intent.maxWidthMm,
      numberOfSeats: intent.numberOfSeats,
      modular: intent.modular,
      relaxFunction: /relax|reclin/.test(text),
      electricFunction: /electric|motor|power/.test(text),
      comfort: /firm/.test(text) ? "firm" : /soft/.test(text) ? "soft" : null,
      posture: /upright/.test(text) ? "upright" : /relaxed|lounge/.test(text) ? "relaxed" : null
    });
  }

  async explainProductMatch(input: { request: string; productFacts: string }) {
    return matchExplanationSchema.parse({ explanation: `Grounded match for “${input.request.slice(0, 100)}”: ${input.productFacts}` }).explanation;
  }

  async summarizeRetailerProject(project: RetailerProjectData, groundedFacts: string) {
    const warnings = project.fitWarnings.length ? ` Fit warnings: ${project.fitWarnings.join("; ")}.` : " No fit validation has been claimed.";
    return retailerSummarySchema.parse({
      summary: `Customer intent: ${project.customerIntent || "Consultation requested"}. ${groundedFacts}.${warnings} Requested retailer action: ${project.requestedRetailerAction}.`
    }).summary;
  }

  async recommendComplementaryProducts(input: { selectedFacts: string }) {
    return complementaryRecommendationSchema.parse({
      categories: ["armchair", "storage"],
      colorFamilies: /charcoal|grey/.test(input.selectedFacts) ? ["grey", "charcoal"] : ["beige", "taupe", "stone"],
      styles: ["modern heritage"],
      rationale: "Complements the selected catalogue pieces by category, palette and shared style."
    });
  }

  async summarizeProductComparison(input: ComparisonSummaryInput) {
    return deterministicComparisonSummary(input);
  }

  async findProductAlternatives(input: AlternativeRequest) {
    return findGroundedAlternatives(input);
  }

  async adviseMaterials(input: { requestText: string }) {
    return parseMaterialNeeds(input.requestText);
  }

  async parseVoiceCommand(transcript: string) {
    return parseVoiceCommandDeterministic(transcript);
  }

  async answerProductQuestion(input: { question: string; context: ConversationContext }) {
    return answerGroundedQuestion(input.question, input.context);
  }

  async recommendProductsFromConversation(input: { conversationSummary: string; candidateProductIds: string[] }) {
    const groundedIds = input.candidateProductIds.filter((id) => products.some((product) => product.active && product.id === id)).slice(0, 6);
    return conversationRecommendationSchema.parse({ productIds: groundedIds, rationale: "Recommendations are limited to the supplied active catalogue candidates." });
  }

  async suggestNextQuestion(input: { answer: string; route: string }) {
    return input.route.includes("configurator")
      ? ["Explain why an option is unavailable", "Suggest a compatible material", "Reduce the total width"]
      : ["Find a smaller alternative", "Which material is easier to care for?", "Prepare my project for a retailer"];
  }

  async summarizeConversationForProject(input: { referencedProductIds: string[]; preferences: Record<string, unknown> }) {
    const groundedIds = input.referencedProductIds.filter((id) => products.some((product) => product.id === id));
    return conversationSummarySchema.parse({ summary: `Referenced Product IDs: ${groundedIds.join(", ") || "none"}. Approved preferences: ${JSON.stringify(input.preferences)}.` }).summary;
  }

  async summarizeConversationForRetailer(input: { referencedProductIds: string[]; preferences: Record<string, unknown>; unresolvedQuestions: string[] }) {
    const groundedIds = input.referencedProductIds.filter((id) => products.some((product) => product.id === id));
    return conversationSummarySchema.parse({ summary: `Retailer preparation references Product IDs ${groundedIds.join(", ") || "none"}. Approved preferences: ${JSON.stringify(input.preferences)}. Unresolved questions: ${input.unresolvedQuestions.join("; ") || "none recorded"}.` }).summary;
  }
}

export class GeminiVisionProvider extends LocalDemoAIProvider {
  override readonly name: AIProviderName = "gemini";

  constructor(private readonly apiKey: string) {
    super();
  }

  override async analyzeProductImage(imageDataUrl: string) {
    const match = imageDataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/s);
    if (!match) throw new Error("Gemini vision received an invalid image payload.");
    const model = process.env.GEMINI_IMAGE_MODEL || "gemini-3.6-flash";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": this.apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: match[1], data: match[2] } },
            { text: `Analyze the most prominent furniture or home-accessory object for catalogue matching. Supported categories are: ${visualCategoryList}. If none is clearly visible, category must be null. Return only JSON with exactly these fields: category (supported category or null), colorFamilies (string array), likelyMaterial (fabric, leather, wood, metal, glass or null), style (string array), silhouette (string), notableVisualFeatures (string array). Describe only visible traits and never identify or invent a product.` }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      })
    });
    const payload = await response.json().catch(() => null) as {
      error?: { message?: string };
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    } | null;
    if (!response.ok) throw new Error(payload?.error?.message || `Gemini vision failed with status ${response.status}.`);
    const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    if (!text) throw new Error("Gemini vision returned no structured analysis.");
    const normalized = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    return visualTagsSchema.parse(JSON.parse(normalized));
  }
}

function imageFingerprint(dataUrl: string) {
  let value = 17;
  const sample = dataUrl.slice(-4096);
  for (let index = 0; index < sample.length; index += 17) value = (value * 31 + sample.charCodeAt(index)) >>> 0;
  return value;
}

export class OpenAIProvider implements AIProvider {
  readonly name = "openai" as const;
  private client: OpenAI;
  private model: string;
  private imageModel: string;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey, baseURL: process.env.OPENAI_BASE_URL || undefined });
    this.model = process.env.AI_MODEL || "gpt-5-nano";
    this.imageModel = process.env.AI_IMAGE_MODEL || this.model;
  }

  private async parse<T>(schema: z.ZodType<T>, name: string, system: string, input: OpenAI.Responses.ResponseInput, image = false): Promise<T> {
    const response = await this.client.responses.parse({
      model: image ? this.imageModel : this.model,
      input,
      store: false,
      text: { format: zodTextFormat(schema, name) }
    });
    return schema.parse(response.output_parsed);
  }

  parseSearchIntent(query: string) {
    return this.parse(searchIntentSchema, "search_intent",
      "Extract furniture search requirements. Distinguish minimum, maximum and approximate target widths. Normalize L-shaped, U-shaped, straight, corner and island layouts. Do not add facts not present. Use null for unknown fields.",
      [{ role: "system", content: "Extract furniture search requirements. Distinguish minimum, maximum and approximate target widths. Normalize L-shaped, U-shaped, straight, corner and island layouts. Do not add facts not present. Use null for unknown fields." }, { role: "user", content: query }]);
  }

  analyzeProductImage(imageDataUrl: string) {
    return this.parse(visualTagsSchema, "product_visual_tags",
      `Analyze only the most prominent target furniture or home-accessory object. Allowed categories are: ${visualCategoryList}. Set category to null when none of those objects is clearly visible. Describe only visible traits; never identify or invent a product.`,
      [{ role: "user", content: [{ type: "input_text", text: "Analyze the selected image area for visual catalogue matching. Return the catalogue category, visible colour families, likely material, style, silhouette and notable features. If no supported catalogue object is clearly visible, set category to null." }, { type: "input_image", image_url: imageDataUrl, detail: "auto" }] }], true);
  }

  analyzeRoomImage(imageDataUrl: string) {
    return this.parse(roomAnalysisSchema, "room_analysis", "Describe visible room features. Dimensions and boundaries are approximate and must not be presented as measurements.",
      [{ role: "user", content: [{ type: "input_text", text: "Analyze visible room features. Treat geometry as approximate." }, { type: "input_image", image_url: imageDataUrl, detail: "low" }] }], true);
  }

  suggestConfigurationRequirements(request: string) {
    return this.parse(configurationRequirementsSchema, "configuration_requirements",
      "Extract requirements only. Never select modules, validate compatibility, calculate dimensions or prices.",
      [{ role: "user", content: request }]);
  }

  async explainProductMatch(input: { request: string; productFacts: string }) {
    const result = await this.parse(matchExplanationSchema, "match_explanation",
      "Explain the match using only the provided catalogue facts. Never add dimensions, prices, availability or IDs.",
      [{ role: "user", content: `Request: ${input.request}\nValidated catalogue facts: ${input.productFacts}` }]);
    return result.explanation;
  }

  async summarizeRetailerProject(project: RetailerProjectData, groundedFacts: string) {
    retailerProjectDataSchema.parse(project);
    const result = await this.parse(retailerSummarySchema, "retailer_project_summary",
      "Write a concise consultation summary using only supplied structured data and grounded facts. Do not infer fit, price, availability or delivery feasibility.",
      [{ role: "user", content: `Structured project: ${JSON.stringify(project)}\nGrounded catalogue facts: ${groundedFacts}` }]);
    return result.summary;
  }

  recommendComplementaryProducts(input: { selectedFacts: string }) {
    return this.parse(complementaryRecommendationSchema, "complementary_requirements",
      "Suggest complementary search criteria only. Never create product names or IDs.",
      [{ role: "user", content: input.selectedFacts }]);
  }

  async summarizeProductComparison(input: ComparisonSummaryInput) {
    const baseline = deterministicComparisonSummary(input);
    const result = await this.parse(
      comparisonSummarySchema,
      "product_comparison_summary",
      "Summarize only the supplied verified catalogue facts.",
      [
        {
          role: "system",
          content: "You are Musterring's concise product comparison editor. Rewrite the supplied baseline into natural, useful English using only the verified catalogue facts provided. Keep every productId exactly unchanged and include each product exactly once. Do not add or infer dimensions, seating, materials, functions, modularity, prices, availability, compatibility, quality, comfort or physical fit. When data is missing, preserve the configuration-dependent wording. The recommendation must explain tradeoffs and must require retailer confirmation for exact configuration and room fit."
        },
        {
          role: "user",
          content: `Verified catalogue facts: ${JSON.stringify(input)}\nAuthoritative baseline: ${JSON.stringify(baseline)}`
        }
      ]
    );
    return validateComparisonSummary(result, input);
  }

  async findProductAlternatives(input: AlternativeRequest) {
    const shape = alternativeRequestSchema.shape;
    const extractionSchema = z.object({
      category: shape.category.unwrap().nullable(),
      colorFamilies: shape.colorFamilies.unwrap(),
      styles: shape.styles.unwrap(),
      numberOfSeats: shape.numberOfSeats.unwrap().nullable(),
      maxWidthMm: shape.maxWidthMm.unwrap().nullable(),
      minWidthMm: shape.minWidthMm.unwrap().nullable(),
      targetWidthMm: shape.targetWidthMm.unwrap().nullable(),
      layoutShapes: shape.layoutShapes.unwrap(),
      excludedLayoutShapes: shape.excludedLayoutShapes.unwrap(),
      minSeatHeightMm: shape.minSeatHeightMm.unwrap().nullable(),
      requiredFunctions: shape.requiredFunctions.unwrap(),
      excludedFunctions: shape.excludedFunctions.unwrap(),
      materialTags: shape.materialTags.unwrap(),
      preserveStyle: shape.preserveStyle.unwrap().nullable(),
      preserveComfort: shape.preserveComfort.unwrap().nullable()
    });
    const extracted = await this.parse(extractionSchema, "alternative_requirements",
      "Extract only alternative-product constraints from the supplied request, including category, colorFamilies, styles, seat count, dimensions, included and excluded layout shapes, materials and functions. Put negated layouts such as 'not L-shaped' only in excludedLayoutShapes, never in layoutShapes. Use minWidthMm for 'above/over/at least', targetWidthMm for a requested approximate size, and maxWidthMm only for an explicit upper bound. Normalize colours, categories and layout shapes to the schema vocabulary. Use null or an empty array when a requirement is unknown. Do not invent product facts or IDs.",
      [{ role: "user", content: JSON.stringify(input) }]);
    const inferred = validatedAIAlternativeRequirements(input, extracted);
    // Explicit structured filters from the UI are authoritative; AI only fills
    // constraints that can be verified in the free text. IDs and request text
    // never come from AI.
    const parsed = alternativeRequestSchema.parse({ ...inferred, ...input });
    return alternativeResponseSchema.parse(findGroundedAlternatives(parsed));
  }

  async adviseMaterials(input: { requestText: string }) {
    const facts = materials.map((material) => ({
      id: material.id, name: material.name, type: material.type, color: material.colorFamily,
      texture: material.texture, composition: material.composition, durability: material.durability,
      easyCare: material.easyCare, petFriendly: material.petFriendly, familyFriendly: material.familyFriendly,
      lightSensitivity: material.lightSensitivity, careInstruction: material.care,
      cleaningMethods: material.cleaningMethods, maintenance: material.maintenance,
      recommendedUses: material.recommendedUses, cautions: material.cautions
    }));
    const instructions = "Analyze the customer's complete request against every supplied material record. Return every supplied material ID that is relevant and satisfies all explicit requirements; exclude records that contradict any explicit requirement. Use only supplied metadata. Return an empty list when none match. Never create IDs or claim stain-proof, scratch-proof, allergy-safe, indestructible, availability, price, or physical compatibility.";
    const result = await this.parse(openAIMaterialAdviceSchema, "material_advice", instructions,
      [{ role: "system", content: instructions }, { role: "user", content: `Material metadata: ${JSON.stringify(facts)}\nHousehold request: ${input.requestText}` }]);
    const deterministic = parseMaterialNeeds(input.requestText);
    const metadataMatchIds = materialMetadataMatches(input.requestText);
    const validIds = new Set(materials.map((material) => material.id));
    const aiMaterialIds = result.recommendedMaterialIds.filter((id) => {
      if (!validIds.has(id)) return false;
      const material = materials.find((item) => item.id === id);
      return Boolean(material && materialMatchesNeeds(material, deterministic.needs) && (!metadataMatchIds.length || metadataMatchIds.includes(material.id)));
    });
    const recommendedMaterialIds = [...new Set([...aiMaterialIds, ...deterministic.recommendedMaterialIds, ...metadataMatchIds])];
    return materialAdviceSchema.parse({
      ...result,
      needs: {
        ...deterministic.needs,
        ...result.needs,
        children: Boolean(result.needs.children || deterministic.needs.children),
        pets: Boolean(result.needs.pets || deterministic.needs.pets),
        highUse: Boolean(result.needs.highUse || deterministic.needs.highUse),
        strongSunlight: Boolean(result.needs.strongSunlight || deterministic.needs.strongSunlight),
        easyCareRequired: Boolean(result.needs.easyCareRequired || deterministic.needs.easyCareRequired),
        preferredColors: deterministic.needs.preferredColors ?? result.needs.preferredColors ?? undefined,
        preferredMaterialGroups: deterministic.needs.preferredMaterialGroups ?? result.needs.preferredMaterialGroups ?? undefined,
        avoidMaterialGroups: deterministic.needs.avoidMaterialGroups ?? result.needs.avoidMaterialGroups ?? undefined
      },
      recommendedMaterialIds,
      materialsToAvoid: result.materialsToAvoid.filter((id) => validIds.has(id))
    });
  }

  parseVoiceCommand(transcript: string) {
    return this.parse(voiceCommandSchema, "voice_command",
      "Map the transcript to one allowed website intent. State-changing or booking actions require confirmation. Never execute an action.",
      [{ role: "user", content: transcript }]);
  }

  async answerProductQuestion(input: { question: string; context: ConversationContext }) {
    const grounded = answerGroundedQuestion(input.question, input.context);
    const answerProducts = products.filter((product) => grounded.productIds.includes(product.id)).map((product) => ({
      id: product.id, modelCode: product.modelCode, name: product.name, category: product.category,
      widthMm: product.verifiedFacts.dimensions ? product.widthMm : null,
      depthMm: product.verifiedFacts.dimensions ? product.depthMm : null,
      heightMm: product.verifiedFacts.dimensions ? product.heightMm : null,
      seatHeightMm: product.verifiedFacts.seatHeight ? product.seatHeightMm : null,
      seatDepthMm: product.verifiedFacts.seatDepth ? product.seatDepthMm : null,
      numberOfSeats: product.numberOfSeatsVerified ? product.numberOfSeats : null,
      colors: product.verifiedFacts.colors, materials: product.verifiedFacts.materialTypes, styles: product.verifiedFacts.styles,
      functions: product.verifiedFacts.functions, modular: product.verifiedFacts.modular ? product.modular : null, demoData: product.demoData
    }));
    const answerMaterials = materials.filter((material) => grounded.materialIds.includes(material.id)).map((material) => ({
      id: material.id, name: material.name, type: material.type, colorFamily: material.colorFamily,
      durability: material.durability, easyCare: material.easyCare, petFriendly: material.petFriendly,
      familyFriendly: material.familyFriendly, lightSensitivity: material.lightSensitivity
    }));
    const broadDiscovery = grounded.answerType === "products" && /\b(i want|i need|show me|find|looking for|recommend)\b/i.test(input.question) &&
      !/\b\d{2,3}\s*(?:cm|centimet)|\b(?:fabric|leather|modular|relax|electric|pet|dog|cat|child|family)\b/i.test(input.question);
    const decisionForNarrative = {
      answerType: grounded.answerType,
      productIds: grounded.productIds,
      materialIds: grounded.materialIds,
      sources: grounded.sources,
      proposedAction: grounded.proposedAction
    };
    const replyBrief = broadDiscovery
      ? "This is a broad discovery request. Begin naturally with 'Absolutely' or an equivalent in the customer's language. Ask only for their maximum sofa width as the next essential detail. For example: 'Absolutely — what maximum width can the sofa have in your room?' Do not mention how many matches exist, catalogue matches, filters, data, generic recommendations, or product cards."
      : "Give the most useful next response for this specific request.";
    const narrative = await this.parse(advisorNarrativeSchema, "product_advisor_narrative",
      "You are Ask Musterring, an exceptional interior advisor: warm, perceptive and concise. Write a natural reply in the customer's language, not a system explanation. The authoritative decision is binding: do not change its product IDs, material IDs, answer type, source boundaries or proposed action. Use only supplied facts. Never invent products, dimensions, prices, availability, compatibility or physical fit. Do not claim fit; direct customers to the fit check when appropriate. Do not execute or imply that an action has executed. For a broad request such as 'I want a sofa', do not say 'I found catalogue matches', do not mention filters or data, and do not list the product cards; they are shown separately. Instead, acknowledge the goal warmly, then ask one clear, human question that will make the next recommendation more useful. Prefer the customer's maximum width as the first question, unless they have already supplied it. Keep the reply under 70 words. Suggested questions must be short, natural answers the customer can choose; offer up to four. If the decision says information is unavailable, say so clearly and offer only supported next steps.",
      [{ role: "user", content: `Customer question: ${input.question}\nConversation context: ${JSON.stringify(input.context)}\nResponse brief: ${replyBrief}\nAuthoritative decision: ${JSON.stringify(decisionForNarrative)}\nValidated product facts: ${JSON.stringify(answerProducts)}\nValidated material facts: ${JSON.stringify(answerMaterials)}` }]);
    return advisorAnswerSchema.parse({ ...grounded, ...narrative });
  }

  async recommendProductsFromConversation(input: { conversationSummary: string; candidateProductIds: string[] }) {
    const candidates = products.filter((product) => input.candidateProductIds.includes(product.id)).map((product) => ({
      id: product.id,
      name: product.name,
      widthMm: product.verifiedFacts.dimensions ? product.widthMm : null,
      seatHeightMm: product.verifiedFacts.seatHeight ? product.seatHeightMm : null
    }));
    const result = await this.parse(conversationRecommendationSchema, "conversation_product_recommendations",
      "Choose only IDs from the supplied candidates. Do not add product facts.",
      [{ role: "user", content: `Summary: ${input.conversationSummary}\nCandidates: ${JSON.stringify(candidates)}` }]);
    const valid = new Set(candidates.map((candidate) => candidate.id));
    return conversationRecommendationSchema.parse({ ...result, productIds: result.productIds.filter((id) => valid.has(id)) });
  }

  async suggestNextQuestion(input: { answer: string; route: string }) {
    const schema = z.object({ questions: z.array(z.string()).max(4) });
    const result = await this.parse(schema, "next_questions", "Suggest concise Musterring product-journey follow-up questions only.",
      [{ role: "user", content: `Route: ${input.route}\nAnswer: ${input.answer}` }]);
    return result.questions;
  }

  async summarizeConversationForProject(input: { referencedProductIds: string[]; preferences: Record<string, unknown> }) {
    const validIds = input.referencedProductIds.filter((id) => products.some((product) => product.id === id));
    const result = await this.parse(conversationSummarySchema, "project_conversation_summary",
      "Summarize only supplied Product IDs and approved preferences. Do not infer facts.",
      [{ role: "user", content: JSON.stringify({ ...input, referencedProductIds: validIds }) }]);
    return result.summary;
  }

  async summarizeConversationForRetailer(input: { referencedProductIds: string[]; preferences: Record<string, unknown>; unresolvedQuestions: string[] }) {
    const validIds = input.referencedProductIds.filter((id) => products.some((product) => product.id === id));
    const result = await this.parse(conversationSummarySchema, "retailer_conversation_summary",
      "Prepare but do not submit a retailer summary using only supplied IDs, preferences and unresolved questions.",
      [{ role: "user", content: JSON.stringify({ ...input, referencedProductIds: validIds }) }]);
    return result.summary;
  }
}

export function configuredProvider(options: { capability?: "vision" } = {}): AIProvider {
  const enabled = process.env.AI_ENABLED !== "false";
  const providerName = (process.env.AI_PROVIDER || "openai").toLowerCase();
  const openAIKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || (openAIKey?.startsWith("AQ.") ? openAIKey : undefined);
  const wantsGeminiVision = options.capability === "vision" && (providerName === "gemini" || Boolean(openAIKey?.startsWith("AQ.")));
  if (enabled && wantsGeminiVision && geminiKey) return new GeminiVisionProvider(geminiKey);
  const wantsOpenAI = providerName === "openai" && !openAIKey?.startsWith("AQ.");
  return enabled && wantsOpenAI && openAIKey
    ? new OpenAIProvider(openAIKey)
    : new LocalDemoAIProvider();
}

export async function withDemoFallback<T>(
  operation: (provider: AIProvider) => Promise<T>,
  options: { allowOpenAI?: boolean; capability?: "vision"; fallbackOnError?: boolean } = {}
): Promise<ProviderResult<T>> {
  const provider = options.allowOpenAI ? configuredProvider({ capability: options.capability }) : new LocalDemoAIProvider();
  try {
    return { data: await operation(provider), provider: provider.name, fallback: false };
  } catch (error) {
    if (provider.name === "openai" || provider.name === "gemini") {
      const safeDetails = error && typeof error === "object"
        ? { name: "name" in error ? String(error.name) : "Error", status: "status" in error ? Number(error.status) : undefined, code: "code" in error ? String(error.code) : undefined }
        : { name: "Error" };
      console.warn("AI provider request failed; using the deterministic catalogue fallback.", safeDetails);
    }
    if (options.fallbackOnError === false) throw error;
    const demo = new LocalDemoAIProvider();
    return { data: await operation(demo), provider: "demo", fallback: true };
  }
}
