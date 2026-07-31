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
