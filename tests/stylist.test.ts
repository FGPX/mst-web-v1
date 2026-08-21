import { describe, expect, it } from "vitest";
import { products } from "@/lib/data";
import { stylistOptionsSchema, stylistProviderResultSchema, stylistProviderResultSchemaForCandidates, type StylistProviderResult } from "@/lib/ai/schemas";
import { buildStylistCandidates, groundStylistResult, resolveStylistSlots, selectDeterministicStylistResult, stylistCandidateFacts, stylistPaletteColors, stylistPriorityLabels } from "@/lib/ai/stylist";
import { normalizeStylistQuiz, stylistQuestionsForAnswers, stylistQuizByRoom, validateStylistQuizInput } from "@/lib/ai/stylist-quiz";
import type { StylistPreferences, StylistQuizInput, StylistRoomType, StylistStyle, StylistTarget } from "@/lib/types";

const roomTypes: StylistRoomType[] = ["living-room", "bedroom", "dining-room", "bathroom", "hallway", "kitchen", "outdoor", "home-accessories"];
const styles: StylistStyle[] = [
  "modern-contemporary",
  "minimalist-scandinavian",
  "warm-natural-rustic",
  "classic-elegant-luxury",
  "industrial-urban",
  "retro-decorative"
];

const completeTargets: Record<StylistRoomType, StylistTarget> = {
  "living-room": "complete-living-room", bedroom: "complete-bedroom", "dining-room": "complete-dining-room",
  bathroom: "complete-bathroom-series", hallway: "complete-hallway", kitchen: "complete-kitchen-concept",
  outdoor: "complete-outdoor-set", "home-accessories": "several-accessories"
};

function quizInput(roomType: StylistRoomType = "living-room", target: StylistTarget = completeTargets[roomType]): StylistQuizInput {
  const answers: Record<string, string | string[]> = { target };
  const completePieces: Record<string, string[]> = {
    "living-pieces": ["sofa", "wall-unit"],
    "series-pieces": ["bed", "wardrobe", "bedside-tables", "dresser"],
    "dining-pieces": ["dining-table", "dining-chairs", "dining-bench", "dining-sideboard"]
  };
  for (let pass = 0; pass < 4; pass += 1) {
    for (const question of stylistQuestionsForAnswers(roomType, answers)) {
      if (answers[question.id] !== undefined) continue;
      answers[question.id] = completePieces[question.id]
        ?? (question.minSelections ? question.options.slice(0, question.minSelections).map((choice) => choice.id) : question.options[0].id);
    }
  }
  return { roomType, answers, notes: {}, selectedProductIds: [], maxWidthMm: null, maxDepthMm: null };
}

const preferences = normalizeStylistQuiz(quizInput());

function withPreferences(overrides: Partial<StylistPreferences> = {}): StylistPreferences {
  const roomType = overrides.roomType ?? preferences.roomType;
  const target = overrides.target ?? (overrides.roomType ? completeTargets[roomType] : preferences.target);
  const normalized = normalizeStylistQuiz(quizInput(roomType, target));
  return { ...normalized, ...overrides, answers: { ...normalized.answers, ...(overrides.answers ?? {}), target } };
}

function providerResult(input: StylistPreferences): StylistProviderResult {
  const selections = buildStylistCandidates(input).map(({ slot, candidates }) => ({
    slotId: slot.id,
    productId: candidates[0].id,
    reason: `Selected from the supplied ${slot.label} candidates.`,
    alternatives: candidates.slice(1, 3).map((candidate) => ({ productId: candidate.id, reason: "Grounded catalogue alternative." }))
  }));
  return stylistProviderResultSchema.parse({
    title: "Grounded catalogue composition",
    rationale: "The set follows the selected quiz preferences using only supplied catalogue products.",
    selections
  });
}

describe("Style Finder grounding", () => {
  it.each(roomTypes)("builds active catalogue slots from the selected pieces for %s", (roomType) => {
    const input = withPreferences({ roomType });
    const groups = buildStylistCandidates(input);
    expect(groups).toHaveLength(resolveStylistSlots(input).length);
    expect(groups.map(({ slot }) => slot.id)).toEqual(resolveStylistSlots(input).map((slot) => slot.id));
    expect(groups.every(({ candidates }) => candidates.length >= 1)).toBe(true);
    expect(groups.every(({ slot, candidates }) => candidates.every((candidate) => slot.categories.includes(candidate.category)))).toBe(true);
  });

  it.each(styles)("returns a stable, active shortlist for the %s style", (style) => {
    const input = withPreferences({ style });
    const first = buildStylistCandidates(input);
    const second = buildStylistCandidates(input);
    expect(first).toEqual(second);
    expect(first.flatMap(({ candidates }) => candidates).every((candidate) => products.some((product) => product.active && product.id === candidate.id))).toBe(true);
  });

  it("uses palette, space and priority evidence when ranking", () => {
    const compactLight = buildStylistCandidates(withPreferences({ spaceSize: "compact", palette: "light-neutral", priorities: ["comfort"] }));
    const spaciousDark = buildStylistCandidates(withPreferences({ spaceSize: "large", palette: "dark-tones", priorities: ["flexible-modular"] }));
    expect(compactLight.flatMap(({ candidates }) => candidates).some((candidate) => candidate.preferenceEvidence.some((evidence) => /light neutral colours/i.test(evidence)))).toBe(true);
    expect(spaciousDark.flatMap(({ candidates }) => candidates).some((candidate) => candidate.preferenceEvidence.some((evidence) => /modular/i.test(evidence)))).toBe(true);
    expect(compactLight.map(({ candidates }) => candidates.map((candidate) => candidate.id))).not.toEqual(spaciousDark.map(({ candidates }) => candidates.map((candidate) => candidate.id)));
    expect(JSON.parse(stylistCandidateFacts(withPreferences())).preferences.spaceSize).toBe("compact");
  });

  it("uses authorized subtype wording when the catalogue supports a specific request", () => {
    const input = withPreferences({ roomType: "hallway", target: "mirror" });
    const candidates = buildStylistCandidates(input)[0].candidates;
    expect(candidates.some((candidate) => candidate.preferenceEvidence.some((evidence) => /mirror/i.test(evidence)))).toBe(true);
  });

  it("passes only grounded saved-product context to accessory matching", () => {
    const input = quizInput("home-accessories", "several-accessories");
    input.answers["match-selected"] = "yes";
    input.selectedProductIds = [products.find((product) => product.active)!.id];
    const facts = JSON.parse(stylistCandidateFacts(normalizeStylistQuiz(input)));
    expect(facts.selectedProductContext).toHaveLength(1);
    expect(facts.selectedProductContext[0]).toMatchObject({ id: input.selectedProductIds[0] });
  });

  it("defines every palette and verified priority mapping", () => {
    expect(Object.values(stylistPaletteColors).slice(0, 4).every((colors) => colors.length >= 5)).toBe(true);
    expect(stylistPaletteColors["no-preference"]).toEqual([]);
    expect(Object.keys(stylistPriorityLabels)).toEqual(["comfort", "easy-care", "flexible-modular", "compact-footprint", "relax-functions", "premium-materials"]);
  });

  it("never exposes template colours or styles as verified candidate facts", () => {
    const candidates = buildStylistCandidates(withPreferences({ style: "retro-decorative", palette: "colour-accents" })).flatMap(({ candidates: group }) => group);
    for (const candidate of candidates) {
      const product = products.find((item) => item.id === candidate.id)!;
      expect(candidate.verifiedColors).toEqual(product.verifiedFacts.colors);
      expect(candidate.verifiedStyles).toEqual(product.verifiedFacts.styles);
    }
  });

  it("constrains every AI product ID to candidates from its own slot", () => {
    const input = withPreferences({ roomType: "dining-room" });
    const groups = buildStylistCandidates(input);
    const schema = stylistProviderResultSchemaForCandidates(groups.map(({ slot, candidates }) => ({
      slotId: slot.id,
      candidateIds: candidates.map((candidate) => candidate.id)
    })));
    const valid = providerResult(input);
    expect(schema.safeParse(valid).success).toBe(true);
    const firstIds = new Set(groups[0].candidates.map((candidate) => candidate.id));
    const foreign = groups.slice(1).flatMap(({ candidates }) => candidates).find((candidate) => !firstIds.has(candidate.id));
    expect(foreign).toBeDefined();
    valid.selections[0].alternatives[0].productId = foreign!.id;
    expect(schema.safeParse(valid).success).toBe(false);
  });

  it("creates complete-bedroom slots from explicitly selected piece types", () => {
    const input = withPreferences({ roomType: "bedroom", target: "complete-bedroom", answers: { "series-pieces": ["bed", "dresser"] } });
    expect(resolveStylistSlots(input).map((slot) => slot.id)).toEqual(["bedroom-bed", "bedroom-dresser"]);
  });

  it("creates all four complete-bedroom slots in the chosen order", () => {
    const input = withPreferences({ roomType: "bedroom", target: "complete-bedroom", answers: { "series-pieces": ["bed", "wardrobe", "bedside-tables", "dresser"] } });
    expect(resolveStylistSlots(input).map((slot) => slot.id)).toEqual(["bedroom-bed", "bedroom-wardrobe", "bedroom-bedside", "bedroom-dresser"]);
  });

  it("selects the same product IDs deterministically for the same catalogue and input", () => {
    const input = withPreferences({ roomType: "dining-room" });
    expect(selectDeterministicStylistResult(input)).toEqual(selectDeterministicStylistResult(input));
  });

  it("uses requested dining capacity as chair quantity instead of chair capacity", () => {
    const input = withPreferences({ roomType: "dining-room", target: "dining-chairs", answers: { "table-capacity": "6-8" } });
    const [group] = buildStylistCandidates(input);
    expect(group.candidates.every((candidate) => candidate.recommendedQuantity === 8)).toBe(true);
    expect(group.candidates.every((candidate) => !candidate.unmetPreferences.some((message) => /capacity is below/i.test(message)))).toBe(true);
  });

  it("exposes the exact-capability gate and closest-match contract", () => {
    const input = withPreferences({ roomType: "bedroom", target: "wardrobe" });
    const [group] = buildStylistCandidates(input);
    expect(group.exactCandidateCount).toBeLessThan(3);
    expect(group.exactCapable).toBe(false);
    expect(group.candidates.every((candidate) => candidate.matchLevel === "closest" && candidate.unmetPreferences.length > 0)).toBe(true);
    const grounded = groundStylistResult(input, providerResult(input));
    expect(grounded).toMatchObject({ recommendationMode: "alternatives", matchLevel: "closest" });
    expect(grounded.unmetPreferences.length).toBeGreaterThan(0);
  });

  it.each(roomTypes)("accepts a grounded structured result for every %s blueprint", (roomType) => {
    const input = withPreferences({ roomType });
    const groups = buildStylistCandidates(input);
    const schema = stylistProviderResultSchemaForCandidates(groups.map(({ slot, candidates }) => ({ slotId: slot.id, candidateIds: candidates.map((candidate) => candidate.id) })));
    expect(schema.safeParse(providerResult(input)).success).toBe(true);
    expect(() => groundStylistResult(input, providerResult(input))).not.toThrow();
  });

  it("validates every adaptive room questionnaire and its conditional fields", () => {
    for (const roomType of roomTypes) {
      const input = quizInput(roomType);
      expect(validateStylistQuizInput(input)).toBe(true);
      expect(stylistOptionsSchema.safeParse(input).success).toBe(true);
    }
    const incomplete = quizInput();
    delete incomplete.answers["storage-purpose"];
    expect(stylistOptionsSchema.safeParse(incomplete).success).toBe(false);
    const dimensions = quizInput();
    dimensions.answers.space = "dimensions";
    expect(stylistOptionsSchema.safeParse(dimensions).success).toBe(false);
    dimensions.maxWidthMm = 2400;
    dimensions.maxDepthMm = 1100;
    expect(stylistOptionsSchema.safeParse(dimensions).success).toBe(true);

    const withWrittenDetails = quizInput();
    withWrittenDetails.notes = Object.fromEntries(
      stylistQuestionsForAnswers(withWrittenDetails.roomType, withWrittenDetails.answers).map((question) => [question.id, `Additional preference for ${question.id}.`])
    );
    expect(validateStylistQuizInput(withWrittenDetails)).toBe(true);
    expect(stylistOptionsSchema.safeParse(withWrittenDetails).success).toBe(true);
    expect(stylistCandidateFacts(normalizeStylistQuiz(withWrittenDetails))).toContain("Additional preference");

    withWrittenDetails.notes["unsupported-question"] = "This note must not enter the stylist prompt.";
    expect(stylistOptionsSchema.safeParse(withWrittenDetails).success).toBe(false);
  });

  it("enforces the configured limit for every supported multi-select question", () => {
    const input = quizInput("bedroom", "wardrobe");
    input.answers["wardrobe-interior"] = ["hanging-space", "shelving", "drawers"];
    expect(stylistOptionsSchema.safeParse(input).success).toBe(true);

    input.answers["wardrobe-interior"] = ["hanging-space", "shelving", "drawers", "shoe-storage"];
    expect(stylistOptionsSchema.safeParse(input).success).toBe(false);

    input.answers["wardrobe-interior"] = ["hanging-space", "no-preference"];
    expect(stylistOptionsSchema.safeParse(input).success).toBe(false);

    const singleChoiceQuestion = quizInput();
    singleChoiceQuestion.answers.target = ["sofa"];
    expect(stylistOptionsSchema.safeParse(singleChoiceQuestion).success).toBe(false);

    const hallway = quizInput("hallway");
    hallway.answers["store-items"] = ["coats", "shoes", "bags", "accessories"];
    expect(stylistOptionsSchema.safeParse(hallway).success).toBe(true);

    const bedroom = quizInput("bedroom", "bed");
    bedroom.answers["additional-storage"] = ["under-bed", "no"];
    expect(stylistOptionsSchema.safeParse(bedroom).success).toBe(false);

    const outdoor = quizInput("outdoor");
    outdoor.answers["main-use"] = ["relaxing", "dining", "entertaining"];
    expect(stylistOptionsSchema.safeParse(outdoor).success).toBe(true);

    const accessories = quizInput("home-accessories");
    accessories.answers.goal = ["cosier", "add-colour", "add-lighting"];
    accessories.answers["existing-colours"] = ["light-neutral", "warm-natural", "dark"];
    expect(stylistOptionsSchema.safeParse(accessories).success).toBe(true);
  });

  it("uses target-specific bedroom questions and rejects answers from another branch", () => {
    const wardrobeQuestions = stylistQuestionsForAnswers("bedroom", { target: "wardrobe" });
    expect(wardrobeQuestions.map((question) => question.id)).toEqual([
      "target", "wardrobe-capacity", "wardrobe-doors", "wardrobe-interior", "space", "atmosphere"
    ]);
    expect(wardrobeQuestions.some((question) => question.id === "bed-size")).toBe(false);

    const wardrobe = quizInput("bedroom", "wardrobe");
    expect(validateStylistQuizInput(wardrobe)).toBe(true);
    wardrobe.answers["bed-size"] = "180x200";
    expect(validateStylistQuizInput(wardrobe)).toBe(false);
  });

  it("uses the bathroom finish as its style direction without a duplicate visual-style step", () => {
    const bathroomQuestions = stylistQuestionsForAnswers("bathroom", { target: "complete-bathroom-series" });
    expect(bathroomQuestions.map((question) => question.id)).toEqual([
      "target", "storage-amount", "space", "mounting", "finish"
    ]);
    expect(bathroomQuestions.every((question) => !question.visual)).toBe(true);

    const bathroom = quizInput("bathroom");
    bathroom.answers.finish = "light-wood";
    expect(normalizeStylistQuiz(bathroom).style).toBe("warm-natural-rustic");
  });

  it("recommends one bathroom series and keeps other series as swap alternatives", () => {
    const input = withPreferences({ roomType: "bathroom" });
    const result = groundStylistResult(input, selectDeterministicStylistResult(input));

    expect(result.recommendationMode).toBe("alternatives");
    expect(result.selections).toHaveLength(1);
    expect(result.selections[0].alternatives).toHaveLength(2);
  });

  it("shows conditional complete-room questions only for selected pieces", () => {
    expect(stylistQuestionsForAnswers("living-room", { target: "complete-living-room", "living-pieces": ["coffee-table", "side-table"] }).map((question) => question.id)).not.toContain("seating-capacity");
    expect(stylistQuestionsForAnswers("living-room", { target: "complete-living-room", "living-pieces": ["sofa", "wall-unit"] }).map((question) => question.id)).toEqual(["target", "living-pieces", "seating-capacity", "storage-purpose", "space", "style-colours"]);
    expect(stylistQuestionsForAnswers("bedroom", { target: "complete-bedroom", "series-pieces": ["wardrobe", "dresser"] }).map((question) => question.id)).toEqual(["target", "series-pieces", "wardrobe-doors", "space", "atmosphere"]);
    expect(stylistQuestionsForAnswers("dining-room", { target: "complete-dining-room", "dining-pieces": ["dining-chairs", "dining-sideboard"] }).map((question) => question.id)).toEqual(["target", "dining-pieces", "table-capacity", "space", "style-colours"]);
  });

  it("keeps every product-specific flow concise", () => {
    for (const roomType of roomTypes) {
      const targetQuestion = stylistQuizByRoom[roomType].find((question) => question.id === "target");
      expect(targetQuestion).toBeDefined();
      for (const target of targetQuestion!.options) {
        const questions = stylistQuestionsForAnswers(roomType, { target: target.id });
        expect(questions.length, `${roomType} / ${target.id}`).toBeLessThanOrEqual(6);
        expect(questions.some((question) => question.id === "target")).toBe(true);
      }
    }
  });

  it("carries a style direction into another room without overriding an explicit new choice", () => {
    const diningRoom = quizInput("dining-room");
    diningRoom.styleDirection = "warm-natural-rustic";
    diningRoom.answers["style-colours"] = "not-sure";
    expect(normalizeStylistQuiz(diningRoom).style).toBe("warm-natural-rustic");

    const livingRoom = quizInput("living-room");
    livingRoom.styleDirection = "warm-natural-rustic";
    livingRoom.answers["style-colours"] = "dark-elegant";
    expect(normalizeStylistQuiz(livingRoom).style).toBe("classic-elegant-luxury");
  });

  it("builds one focused slot with several alternatives for a single product request", () => {
    const input = withPreferences({ target: "sofa" });
    const groups = buildStylistCandidates(input);
    expect(groups).toHaveLength(1);
    expect(groups[0].slot.id).toBe("single-product");
    expect(groups[0].candidates.length).toBeGreaterThanOrEqual(3);
    const result = groundStylistResult(input, providerResult(input));
    expect(result.selections).toHaveLength(1);
    expect(result.selections[0].alternatives.length).toBeGreaterThanOrEqual(2);
  });

  it("grounds every selected product and alternative in the supplied shortlist", () => {
    const input = withPreferences({ style: "minimalist-scandinavian" });
    const result = groundStylistResult(input, providerResult(input));
    const ids = new Set(buildStylistCandidates(input).flatMap(({ candidates }) => candidates.map((candidate) => candidate.id)));
    expect(result.selections).toHaveLength(resolveStylistSlots(input).length);
    expect(result.preferences).toEqual(input);
    expect(result.selections.every((selection) => ids.has(selection.product.id))).toBe(true);
    expect(result.selections.flatMap((selection) => selection.alternatives).every((alternative) => ids.has(alternative.product.id))).toBe(true);
  });

  it("never replaces an exact-capable primary with a closest candidate", () => {
    const input = withPreferences({ target: "coffee-table", answers: { "surface-material": "no-preference" } });
    const [group] = buildStylistCandidates(input);
    expect(group.exactCapable).toBe(true);
    const selected = selectDeterministicStylistResult(input).selections[0];
    expect(group.candidates.find((candidate) => candidate.id === selected.productId)?.matchLevel).toBe("exact");
    expect(selected.alternatives.every((alternative) => group.candidates.find((candidate) => candidate.id === alternative.productId)?.matchLevel === "exact")).toBe(true);
  });

  it("marks an unverified multi-product combination as a closest coordinated set", () => {
    const input = withPreferences({ target: "complete-living-room", answers: { "living-pieces": ["sofa", "coffee-table"], "seating-capacity": "1-2" } });
    const result = groundStylistResult(input, selectDeterministicStylistResult(input));
    expect(result.recommendationMode).toBe("set");
    expect(result.matchLevel).toBe("closest");
    expect(result.unmetPreferences.some((message) => /compatibility/i.test(message))).toBe(true);
  });

  it("prioritises a verified compatible combination over a higher isolated slot score", () => {
    const input = normalizeStylistQuiz({
      roomType: "dining-room",
      answers: { target: "complete-dining-room", "dining-pieces": ["dining-table", "dining-chairs"], "table-capacity": "2-4", "table-format": "fixed-rectangular", space: "medium", "style-colours": "not-sure" },
      notes: {}, selectedProductIds: [], maxWidthMm: null, maxDepthMm: null
    });
    const result = groundStylistResult(input, selectDeterministicStylistResult(input));
    expect(result.selections.map((selection) => selection.product.slug)).toEqual(["justb-sp100", "justb-sp500"]);
    expect(result.unmetPreferences.some((message) => /compatibility/i.test(message))).toBe(false);
  });

  it("rejects an AI-invented product ID", () => {
    const input = withPreferences({ roomType: "bedroom" });
    const raw = providerResult(input);
    raw.selections[0].productId = "AI-INVENTED-BED";
    expect(() => groundStylistResult(input, raw)).toThrow(/Invalid catalogue product/);
  });

  it("rejects a valid catalogue product when it was not in the supplied slot shortlist", () => {
    const input = withPreferences({ roomType: "dining-room", style: "classic-elegant-luxury" });
    const raw = providerResult(input);
    const supplied = new Set(buildStylistCandidates(input)[0].candidates.map((candidate) => candidate.id));
    const outOfShortlist = products.find((product) => product.active && product.category === "dining-table" && !supplied.has(product.id));
    expect(outOfShortlist).toBeTruthy();
    raw.selections[0].productId = outOfShortlist!.id;
    expect(() => groundStylistResult(input, raw)).toThrow(/Invalid catalogue product/);
  });
});
