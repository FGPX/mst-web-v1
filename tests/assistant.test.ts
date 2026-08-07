import { describe, expect, it } from "vitest";
import { materials, products } from "@/lib/data";
import {
  answerGroundedQuestion, findGroundedAlternatives, materialReasons, parseMaterialNeeds,
  parseVoiceCommandDeterministic, validateProposedConfiguration
} from "@/lib/assistant";
import { createConfiguration } from "@/lib/configurator";
import { voiceCommandSchema, type ConversationContext } from "@/lib/ai/assistant-schemas";

const context: ConversationContext = {
  route: "/search", referencedProductIds: [], selectedMaterialIds: [], currentFilters: {}, approvedPreferences: {}
};

describe("connected Musterring assistant grounding", () => {
  it("returns only catalogue-grounded product alternatives", () => {
    const result = findGroundedAlternatives({ sourceProductId: "p1", requestText: "I need something 30 cm narrower with a higher seat." });
    const ids = new Set(products.map((product) => product.id));
    expect([...result.exactMatches, ...result.closestAlternatives].every((match) => ids.has(match.productId))).toBe(true);
    expect([...result.exactMatches, ...result.closestAlternatives].every((match) => match.productId !== "p1")).toBe(true);
  });

  it("does not silently ignore impossible strict requirements", () => {
    const result = findGroundedAlternatives({ sourceProductId: "p1", maxWidthMm: 500, minSeatHeightMm: 900, strict: true });
    expect(result.exactMatches).toHaveLength(0);
    expect(result.closestAlternatives).toHaveLength(0);
    expect(result.message).toMatch(/No exact alternative/);
  });

  it("grounds material recommendations and care reasons in metadata", () => {
    const advice = parseMaterialNeeds("I have two children, a dog and strong afternoon sunlight.");
    const ids = new Set(materials.map((material) => material.id));
    expect(advice.recommendedMaterialIds.every((id) => ids.has(id))).toBe(true);
    expect(advice.needs.children).toBe(true);
    expect(advice.needs.pets).toBe(true);
    expect(advice.needs.strongSunlight).toBe(true);
    const material = materials.find((item) => item.id === advice.recommendedMaterialIds[0])!;
    expect(materialReasons(material, advice).suitable.join(" ")).not.toMatch(/stain-proof|scratch-proof|allergy-safe|indestructible/i);
  });

  it("validates the complete voice intent schema", () => {
    expect(voiceCommandSchema.safeParse(parseVoiceCommandDeterministic("Show me a modular corner sofa in beige.")).success).toBe(true);
  });

  it.each([
    "Save this configuration.",
    "Add a matching table to my Living Room Project.",
    "Book a consultation."
  ])("requires confirmation for important voice action: %s", (transcript) => {
    expect(parseVoiceCommandDeterministic(transcript).requiresConfirmation).toBe(true);
  });

  it("selects a grounded comparison tool for conversational recommendations", () => {
    const answer = answerGroundedQuestion("I need a compact family sofa with easy-care material under 260 cm. Help me compare the best options.", context);
    expect(answer.productIds.every((id) => products.some((product) => product.id === id))).toBe(true);
    expect(answer.proposedAction?.type).toBe("COMPARE_PRODUCTS");
  });

  it("returns only the visually verified red sofa presentation", () => {
    const answer = answerGroundedQuestion("I want a red sofa", context);
    expect(answer.answerType).toBe("products");
    expect(answer.productIds).toHaveLength(1);
    expect(products.find((product) => product.id === answer.productIds[0])?.slug).toBe("mr-260");
    expect(answer.answer).toMatch(/exact catalogue match.*red colour/i);
  });

  it("recognizes black as a hard colour filter and returns the black sofa", () => {
    const answer = answerGroundedQuestion("I want a black sofa", context);
    expect(answer.answerType).toBe("products");
    expect(answer.productIds.length).toBeGreaterThan(0);
    expect(answer.productIds.every((id) => products.find((product) => product.id === id)?.colors.includes("black"))).toBe(true);
    expect(answer.productIds.some((id) => products.find((product) => product.id === id)?.slug === "mr-285")).toBe(true);
    expect(answer.answer).toMatch(/exact catalogue match.*black colour/i);
  });

  it("recognizes a generic chair request as an armchair search", () => {
    const answer = answerGroundedQuestion("I want a chair", context);
    expect(answer.answerType).toBe("products");
    expect(answer.productIds.length).toBeGreaterThan(0);
    expect(answer.productIds.every((id) => products.find((product) => product.id === id)?.category === "armchair")).toBe(true);
  });

  it.each([
    ["Show me a coffee table", "coffee-table"],
    ["I need a dining table", "dining-table"],
    ["Find a dining chair", "dining-chair"],
    ["Show me a bed", "bed"],
    ["I want a wardrobe", "wardrobe"],
    ["Find outdoor garden furniture", "outdoor"],
    ["Show me a rug", "carpet"],
    ["I need a lamp", "lamp"]
  ] as const)("grounds catalogue category query: %s", (query, category) => {
    const answer = answerGroundedQuestion(query, context);
    expect(answer.answerType).toBe("products");
    expect(answer.productIds.length).toBeGreaterThan(0);
    expect(answer.productIds.every((id) => products.find((product) => product.id === id)?.category === category)).toBe(true);
  });

  it.each(["I want a black sofa", "I want a chair", "Show me a coffee table"])("interprets voice product discovery: %s", (transcript) => {
    const command = parseVoiceCommandDeterministic(transcript);
    expect(command.intent).toBe("SEARCH_PRODUCTS");
    expect(command.parameters.query).toBe(transcript);
  });

  it("uses an explicitly named model instead of stale page context", () => {
    const target = products.find((product) => product.modelCode === "MR 285")!;
    const answer = answerGroundedQuestion("What is the width of MR 285?", { ...context, currentProductId: "p1" });
    expect(answer.productIds).toEqual([target.id]);
    expect(answer.answer).toContain(`${target.widthMm / 10} cm`);
  });

  it("opens an ordinal result without confirmation and saves it only with confirmation", () => {
    const referenced = products.filter((product) => product.active && product.category === "sofa").slice(0, 2);
    const opened = answerGroundedQuestion("Open the first product", { ...context, referencedProductIds: referenced.map((product) => product.id) });
    const saved = answerGroundedQuestion("Save the first product", { ...context, referencedProductIds: referenced.map((product) => product.id) });
    expect(opened.proposedAction?.type).toBe("OPEN_PRODUCT");
    expect(opened.proposedAction?.requiresConfirmation).toBe(false);
    expect(saved.proposedAction?.type).toBe("SAVE_PRODUCT");
    expect(saved.proposedAction?.requiresConfirmation).toBe(true);
  });

  it("does not present stale page context as a recommendation for unsupported requests", () => {
    const answer = answerGroundedQuestion("What is the weather on Mars?", { ...context, currentProductId: "p1", referencedProductIds: ["p1"] });
    expect(answer.answerType).toBe("missing-data");
    expect(answer.productIds).toEqual([]);
  });

  it.each([
    ["okay thank you", /you.re welcome/i],
    ["hello", /how can i help/i],
    ["okay", /let me know/i],
    ["goodbye", /goodbye/i]
  ])("answers simple conversation naturally: %s", (message, expected) => {
    const answer = answerGroundedQuestion(message, context);
    expect(answer.answer).toMatch(expected);
    expect(answer.productIds).toEqual([]);
    expect(answer.suggestedQuestions).toEqual([]);
  });

  it("labels other products as recommendations when a colour is unavailable", () => {
    const answer = answerGroundedQuestion("I want a purple sofa", context);
    expect(answer.answerType).toBe("missing-data");
    expect(answer.answer).toMatch(/no catalogue product satisfies every requested condition.*purple colour/i);
    expect(answer.productIds.length).toBeGreaterThan(0);
    expect(answer.productIds.every((id) => !products.find((product) => product.id === id)?.colors.includes("purple"))).toBe(true);
  });

  it("resolves follow-up references without storing raw history", () => {
    const first = products.filter((product) => product.active && product.category === "sofa").slice(0, 2);
    const answer = answerGroundedQuestion("Save the second one.", { ...context, referencedProductIds: first.map((product) => product.id) });
    expect(answer.productIds).toEqual([first[1].id]);
    expect(answer.proposedAction?.type).toBe("SAVE_PRODUCT");
    expect(answer.proposedAction?.requiresConfirmation).toBe(true);
  });

  it("uses deterministic configuration validation for proposed changes", () => {
    const product = products.find((item) => item.id === "p1")!;
    const configuration = createConfiguration(product);
    configuration.electric = true;
    expect(validateProposedConfiguration(configuration).valid).toBe(false);
  });

  it("states when an unsupported question is outside connected data", () => {
    const answer = answerGroundedQuestion("What is the weather on Mars?", context);
    expect(answer.answerType).toBe("missing-data");
    expect(answer.answer).toMatch(/not currently available/i);
    expect(answer.productIds).toEqual([]);
  });
});
