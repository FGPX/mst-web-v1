import { describe, expect, it } from "vitest";
import { products } from "@/lib/data";
import { deriveAdvisorPreferences, groundAdvisorConversationTurn } from "@/lib/ai/conversation-memory";
import { selectedProductIdsForVisualization } from "@/lib/ai/visualization";
import type { AdvisorAnswer, ConversationContext } from "@/lib/ai/assistant-schemas";

const emptyAnswer: AdvisorAnswer = {
  answer: "Generic answer",
  answerType: "products",
  productIds: [],
  materialIds: [],
  sources: [],
  proposedAction: null,
  suggestedQuestions: [],
  clarify: null,
  unmet: [],
  nearest: [],
  briefSummary: []
};

const context: ConversationContext = {
  route: "/",
  referencedProductIds: [],
  selectedMaterialIds: [],
  currentFilters: {},
  approvedPreferences: {}
};

describe("advisor conversational memory and follow-ups", () => {
  it("remembers compact-room, seat, colour and material preferences", () => {
    const preferences = deriveAdvisorPreferences("I need a sofa and coffee table for 2 persons in a very small room, with beige, white and wood.");
    expect(preferences).toMatchObject({ spaceSize: "compact", seatCount: 2 });
    expect(preferences.colors).toEqual(expect.arrayContaining(["beige", "white"]));
    expect(preferences.woodPreference).toBe(true);
    expect(preferences.categories).toEqual(expect.arrayContaining(["sofa", "coffee-table"]));
  });

  it("treats a newly requested colour as a replacement, not an addition", () => {
    const previous = deriveAdvisorPreferences("I prefer beige and white");
    const next = deriveAdvisorPreferences("Show me a black coffee table", previous);
    expect(next.colors).toEqual(["black"]);
  });

  it("returns both requested categories and compact products for the initial brief", () => {
    const question = "i want a living room set, sofa and coffy table, for 2 persons, the living room is so small, we dont have so much space, the colurs needs to be warm, beige and white, and wood materials i like";
    const answer = groundAdvisorConversationTurn(question, context, emptyAnswer);
    const selected = answer.productIds.map((id) => products.find((product) => product.id === id)!);
    expect(selected.some((product) => product.category === "sofa")).toBe(true);
    expect(selected.some((product) => product.category === "coffee-table")).toBe(true);
    const selectedSofa = selected.find((product) => product.category === "sofa")!;
    const compactSofaWidths = products
      .filter((product) => product.active && product.category === "sofa" && product.verifiedFacts.dimensions && product.verifiedFacts.smallSpaceSuitable && product.smallSpaceSuitable)
      .map((product) => product.widthMm);
    expect(selectedSofa.verifiedFacts.dimensions).toBe(true);
    expect(selectedSofa.widthMm).toBe(Math.min(...compactSofaWidths));
    expect(selected.every((product) => {
      if (product.verifiedFacts.smallSpaceSuitable && product.smallSpaceSuitable) return true;
      const verifiedWidths = products
        .filter((candidate) => candidate.active && candidate.category === product.category && candidate.verifiedFacts.dimensions)
        .map((candidate) => candidate.widthMm);
      return product.verifiedFacts.dimensions && product.widthMm === Math.min(...verifiedWidths);
    })).toBe(true);
  });

  it("does not repeat a rejected large sofa when the customer asks for smaller", () => {
    const largeSofa = products.find((product) => product.active && product.category === "sofa" && product.verifiedFacts.dimensions && product.widthMm >= 2600)!;
    const preferences = deriveAdvisorPreferences("I need a sofa for a small room");
    const answer = groundAdvisorConversationTurn("I want a smaller sofa, that is too big", {
      ...context,
      referencedProductIds: [largeSofa.id],
      approvedPreferences: preferences
    }, { ...emptyAnswer, productIds: [largeSofa.id] });
    expect(answer.productIds).not.toContain(largeSofa.id);
    expect(answer.productIds.every((id) => products.find((product) => product.id === id)?.category === "sofa")).toBe(true);
    expect(answer.productIds.every((id) => (products.find((product) => product.id === id)?.widthMm ?? Infinity) < largeSofa.widthMm)).toBe(true);
  });

  it("keeps the coffee-table category and excludes the previous table", () => {
    const table = products.find((product) => product.active && product.category === "coffee-table")!;
    const answer = groundAdvisorConversationTurn("A different coffee table please", {
      ...context,
      referencedProductIds: [table.id],
      approvedPreferences: deriveAdvisorPreferences("A coffee table for a small beige room")
    }, { ...emptyAnswer, productIds: [table.id] });
    expect(answer.productIds).not.toContain(table.id);
    expect(answer.productIds.every((id) => products.find((product) => product.id === id)?.category === "coffee-table")).toBe(true);
  });

  it("never cycles back to products already shown during repeated another requests", () => {
    const sofas = products.filter((product) => product.active && product.category === "sofa").slice(0, 2);
    const preferences = { ...deriveAdvisorPreferences("A sofa for a small room"), shownProductIds: sofas.map((product) => product.id) };
    const answer = groundAdvisorConversationTurn("Show me another sofa option", {
      ...context,
      referencedProductIds: [sofas[1].id],
      approvedPreferences: preferences
    }, { ...emptyAnswer, productIds: [sofas[0].id] });
    expect(answer.productIds.every((id) => !preferences.shownProductIds.includes(id))).toBe(true);
  });

  it("does not show a non-black presentation for a black coffee-table request", () => {
    const answer = groundAdvisorConversationTurn("Show me a black coffe table", context, emptyAnswer);
    expect(answer.productIds).toEqual([]);
    expect(answer.answer).toMatch(/matching catalogue presentation/i);
  });

  it("answers a care follow-up directly about the focused product", () => {
    const product = products.find((candidate) => candidate.modelCode === "MR 1370")!;
    const answer = groundAdvisorConversationTurn("is it easy to clean?", {
      ...context,
      referencedProductIds: [product.id],
      approvedPreferences: { ...deriveAdvisorPreferences("I choose MR 1370"), focusProductId: product.id }
    }, { ...emptyAnswer, productIds: [product.id], materialIds: product.materials });

    expect(answer.answerType).toBe("fact");
    expect(answer.productIds).toEqual([product.id]);
    expect(answer.materialIds).toEqual([]);
    expect(answer.answer).toMatch(/^The catalogue does not verify MR 1370 as easy-care\./);
    expect(answer.answer).not.toMatch(/Materials and colours|Catalogue covers|Recommended materials/);
  });

  it("keeps a sofa choice while moving on to a coffee table and summarizes only confirmed selections", () => {
    const initialQuestion = "We have two young children and a dog and I need a sofa that is comfortable and easy to clean, beige colour. What would you recommend?";
    const sofaPreferences = deriveAdvisorPreferences(initialQuestion);
    const sofaAnswer = groundAdvisorConversationTurn(initialQuestion, context, emptyAnswer);
    const sofa = products.find((product) => product.id === sofaAnswer.productIds[0])!;
    expect(sofa.category).toBe("sofa");

    const tableQuestion = "Now I also need a coffee table";
    const tablePreferences = deriveAdvisorPreferences(tableQuestion, {
      ...sofaPreferences,
      shownProductIds: sofaAnswer.productIds,
      focusProductId: sofa.id
    });
    const tableAnswer = groundAdvisorConversationTurn(tableQuestion, {
      ...context,
      referencedProductIds: sofaAnswer.productIds,
      selectedProductIds: [sofa.id],
      approvedPreferences: tablePreferences
    }, emptyAnswer);
    const table = products.find((product) => product.id === tableAnswer.productIds[0])!;
    expect(table.category).toBe("coffee-table");

    const summary = groundAdvisorConversationTurn("Show me which products we selected", {
      ...context,
      selectedProductIds: [sofa.id, table.id],
      approvedPreferences: tablePreferences
    }, emptyAnswer);
    expect(summary.productIds).toEqual([sofa.id, table.id]);
    expect(summary.answer).toContain(sofa.modelCode);
    expect(summary.answer).toContain(table.modelCode);
  });

  it("uses only explicitly selected products for room visualization", () => {
    const active = products.filter((product) => product.active).slice(0, 4);
    expect(selectedProductIdsForVisualization(
      [active[1].id, active[3].id, active[1].id, "not-in-catalogue"],
      [active[0].id, active[1].id, active[3].id],
      active.map((product) => product.id)
    )).toEqual([active[1].id, active[3].id]);
  });
});
