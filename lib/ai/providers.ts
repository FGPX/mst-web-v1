import "server-only";

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import {
  complementaryRecommendationSchema,
  configurationRequirementsSchema,
  matchExplanationSchema,
  retailerProjectDataSchema,
  retailerSummarySchema,
  roomAnalysisSchema,
  searchIntentSchema,
  visualTagsSchema,
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
import { answerGroundedQuestion, findGroundedAlternatives, parseMaterialNeeds, parseVoiceCommandDeterministic } from "../assistant";
import { materials, products } from "../data";

export type ProviderResult<T> = { data: T; provider: "openai" | "demo"; fallback: boolean };

export interface AIProvider {
  readonly name: "openai" | "demo";
  parseSearchIntent(query: string): Promise<SearchIntent>;
  analyzeProductImage(imageDataUrl: string): Promise<VisualTags>;
  analyzeRoomImage(imageDataUrl: string): Promise<RoomAnalysis>;
  suggestConfigurationRequirements(request: string): Promise<ConfigurationRequirements>;
  explainProductMatch(input: { request: string; productFacts: string }): Promise<string>;
  summarizeRetailerProject(project: RetailerProjectData, groundedFacts: string): Promise<string>;
  recommendComplementaryProducts(input: { selectedFacts: string }): Promise<z.infer<typeof complementaryRecommendationSchema>>;
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
    minSeatHeightMm: null, maxSeatDepthMm: null, numberOfSeats: null, modular: null,
    functions: null, styles: null, roomType: null, smallSpaceSuitable: null
  };
}

export class LocalDemoAIProvider implements AIProvider {
  readonly name = "demo" as const;

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
      smallSpaceSuitable: filters.smallSpaceSuitable ?? null
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
    this.model = process.env.AI_MODEL || "gpt-5.6";
    this.imageModel = process.env.AI_IMAGE_MODEL || this.model;
  }

  private async parse<T>(schema: z.ZodType<T>, name: string, system: string, input: OpenAI.Responses.ResponseInput, image = false): Promise<T> {
    const response = await this.client.responses.parse({
      model: image ? this.imageModel : this.model,
      input,
      text: { format: zodTextFormat(schema, name) }
    });
    return schema.parse(response.output_parsed);
  }

  parseSearchIntent(query: string) {
    return this.parse(searchIntentSchema, "search_intent",
      "Extract furniture search requirements. Do not add facts not present. Use null for unknown fields.",
      [{ role: "system", content: "Extract furniture search requirements. Do not add facts not present. Use null for unknown fields." }, { role: "user", content: query }]);
  }

  analyzeProductImage(imageDataUrl: string) {
    return this.parse(visualTagsSchema, "product_visual_tags", "Analyze only the target furniture object. Describe visible traits; do not name products.",
      [{ role: "user", content: [{ type: "input_text", text: "Analyze the furniture object into visual search tags. Do not identify or invent a product." }, { type: "input_image", image_url: imageDataUrl, detail: "low" }] }], true);
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

  async findProductAlternatives(input: AlternativeRequest) {
    const parsed = await this.parse(alternativeRequestSchema, "alternative_requirements",
      "Extract only alternative-product constraints from the supplied request, including category, colorFamilies, styles, seat count, dimensions, materials and functions. Normalize colours and categories to lowercase English catalogue terms. Preserve sourceProductId, requestText and strict exactly. Do not invent product facts or IDs.",
      [{ role: "user", content: JSON.stringify(input) }]);
    return alternativeResponseSchema.parse(findGroundedAlternatives(parsed));
  }

  async adviseMaterials(input: { requestText: string }) {
    const facts = materials.map((material) => ({
      id: material.id, type: material.type, color: material.colorFamily, durability: material.durability,
      easyCare: material.easyCare, petFriendly: material.petFriendly, familyFriendly: material.familyFriendly,
      lightSensitivity: material.lightSensitivity
    }));
    const result = await this.parse(materialAdviceSchema, "material_advice",
      "Recommend only supplied material IDs. Use only supplied metadata. Never claim stain-proof, scratch-proof, allergy-safe or indestructible.",
      [{ role: "user", content: `Household request: ${input.requestText}\nMaterial metadata: ${JSON.stringify(facts)}` }]);
    const validIds = new Set(materials.map((material) => material.id));
    return materialAdviceSchema.parse({
      ...result,
      recommendedMaterialIds: result.recommendedMaterialIds.filter((id) => validIds.has(id)),
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
    if (grounded.answerType !== "missing-data" || grounded.productIds.length || grounded.sources.length) return grounded;
    const candidateIds = [...new Set([...(input.context.referencedProductIds ?? []), ...(input.context.currentProductId ? [input.context.currentProductId] : [])])];
    const facts = products.filter((product) => candidateIds.includes(product.id)).map((product) => ({
      id: product.id, modelCode: product.modelCode, name: product.name, category: product.category,
      widthMm: product.widthMm, depthMm: product.depthMm, heightMm: product.heightMm,
      seatHeightMm: product.seatHeightMm, seatDepthMm: product.seatDepthMm, numberOfSeats: product.numberOfSeats,
      colors: product.colors, materials: product.materials, styles: product.styles,
      functions: product.functions, electricFunctions: product.electricFunctions, modular: product.modular, demoData: product.demoData
    }));
    const result = await this.parse(advisorAnswerSchema, "product_advisor_answer",
      "Answer only from supplied Musterring facts and context. Unknown information must be stated as unavailable. Propose but never execute actions.",
      [{ role: "user", content: `Question: ${input.question}\nContext: ${JSON.stringify(input.context)}\nFacts: ${JSON.stringify(facts)}` }]);
    const validProducts = new Set(products.map((product) => product.id));
    const validMaterials = new Set(materials.map((material) => material.id));
    return advisorAnswerSchema.parse({
      ...result,
      productIds: result.productIds.filter((id) => validProducts.has(id)),
      materialIds: result.materialIds.filter((id) => validMaterials.has(id))
    });
  }

  async recommendProductsFromConversation(input: { conversationSummary: string; candidateProductIds: string[] }) {
    const candidates = products.filter((product) => input.candidateProductIds.includes(product.id)).map((product) => ({ id: product.id, name: product.name, widthMm: product.widthMm, seatHeightMm: product.seatHeightMm }));
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

export function configuredProvider(): AIProvider {
  const enabled = process.env.AI_ENABLED !== "false";
  const wantsOpenAI = (process.env.AI_PROVIDER || "demo").toLowerCase() === "openai";
  return enabled && wantsOpenAI && process.env.OPENAI_API_KEY
    ? new OpenAIProvider(process.env.OPENAI_API_KEY)
    : new LocalDemoAIProvider();
}

export async function withDemoFallback<T>(operation: (provider: AIProvider) => Promise<T>): Promise<ProviderResult<T>> {
  const provider = configuredProvider();
  try {
    return { data: await operation(provider), provider: provider.name, fallback: false };
  } catch (error) {
    if (provider.name === "openai") {
      const safeDetails = error && typeof error === "object"
        ? { name: "name" in error ? String(error.name) : "Error", status: "status" in error ? Number(error.status) : undefined, code: "code" in error ? String(error.code) : undefined }
        : { name: "Error" };
      console.warn("AI provider request failed; using the deterministic catalogue fallback.", safeDetails);
    }
    const demo = new LocalDemoAIProvider();
    return { data: await operation(demo), provider: "demo", fallback: true };
  }
}
