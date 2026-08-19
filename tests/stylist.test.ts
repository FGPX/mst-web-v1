import { describe, expect, it } from "vitest";
import { products } from "@/lib/data";
import { stylistOptionsSchema, stylistProviderResultSchema, stylistProviderResultSchemaForCandidates, type StylistProviderResult } from "@/lib/ai/schemas";
import { buildStylistCandidates, groundStylistResult, stylistBlueprints, stylistCandidateFacts, stylistPaletteColors, stylistPriorityLabels } from "@/lib/ai/stylist";
import { normalizeStylistQuiz, stylistQuizByRoom, validateStylistQuizInput } from "@/lib/ai/stylist-quiz";
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
  const answers = Object.fromEntries(stylistQuizByRoom[roomType].map((question) => [question.id, question.options[0].id]));
  answers.target = target;
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
    alternatives: candidates.slice(1, buildStylistCandidates(input).length > 1 ? 3 : 6).map((candidate) => ({ productId: candidate.id, reason: "Grounded catalogue alternative." }))
  }));
  return stylistProviderResultSchema.parse({
    title: "Grounded catalogue composition",
    rationale: "The set follows the selected quiz preferences using only supplied catalogue products.",
    selections
  });
}

describe("AI Interior Stylist grounding", () => {
  it.each(roomTypes)("builds the configured active catalogue slots for %s", (roomType) => {
    const input = withPreferences({ roomType });
    const groups = buildStylistCandidates(input);
    expect(groups).toHaveLength(stylistBlueprints[roomType].length);
    expect(groups.map(({ slot }) => slot.id)).toEqual(stylistBlueprints[roomType].map((slot) => slot.id));
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
    const input = quizInput("home-accessories", "small-furniture");
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
    valid.selections[0].alternatives[0].productId = groups[1].candidates[0].id;
    expect(schema.safeParse(valid).success).toBe(false);
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
    delete incomplete.answers.material;
    expect(stylistOptionsSchema.safeParse(incomplete).success).toBe(false);
    const dimensions = quizInput();
    dimensions.answers.space = "dimensions";
    expect(stylistOptionsSchema.safeParse(dimensions).success).toBe(false);
    dimensions.maxWidthMm = 2400;
    dimensions.maxDepthMm = 1100;
    expect(stylistOptionsSchema.safeParse(dimensions).success).toBe(true);

    const withWrittenDetails = quizInput();
    withWrittenDetails.notes = Object.fromEntries(
      stylistQuizByRoom[withWrittenDetails.roomType].map((question) => [question.id, `Additional preference for ${question.id}.`])
    );
    expect(validateStylistQuizInput(withWrittenDetails)).toBe(true);
    expect(stylistOptionsSchema.safeParse(withWrittenDetails).success).toBe(true);
    expect(stylistCandidateFacts(normalizeStylistQuiz(withWrittenDetails))).toContain("Additional preference");

    withWrittenDetails.notes["unsupported-question"] = "This note must not enter the stylist prompt.";
    expect(stylistOptionsSchema.safeParse(withWrittenDetails).success).toBe(false);
  });

  it("accepts up to two answers only for supported multi-select questions", () => {
    const input = quizInput();
    input.answers["special-functions"] = ["relax-function", "adjustable-headrest"];
    expect(stylistOptionsSchema.safeParse(input).success).toBe(true);
    expect(normalizeStylistQuiz(input).priorities).toContain("relax-functions");

    input.answers["special-functions"] = ["relax-function", "recliner", "adjustable-headrest"];
    expect(stylistOptionsSchema.safeParse(input).success).toBe(false);

    input.answers["special-functions"] = ["relax-function", "none"];
    expect(stylistOptionsSchema.safeParse(input).success).toBe(false);

    const singleChoiceQuestion = quizInput();
    singleChoiceQuestion.answers.target = ["sofa"];
    expect(stylistOptionsSchema.safeParse(singleChoiceQuestion).success).toBe(false);
  });

  it("carries a style direction into another room without overriding an explicit new choice", () => {
    const diningRoom = quizInput("dining-room");
    diningRoom.styleDirection = "warm-natural-rustic";
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
    expect(result.selections).toHaveLength(3);
    expect(result.preferences).toEqual(input);
    expect(result.selections.every((selection) => ids.has(selection.product.id))).toBe(true);
    expect(result.selections.flatMap((selection) => selection.alternatives).every((alternative) => ids.has(alternative.product.id))).toBe(true);
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
