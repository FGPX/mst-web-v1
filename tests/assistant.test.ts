import { describe, expect, it } from "vitest";
import { materials, products } from "@/lib/data";
import {
  answerGroundedQuestion, findGroundedAlternatives, isUnsupportedMaterialComfortQuestion, materialReasons, parseMaterialNeeds,
  parseVoiceCommandDeterministic, validateProposedConfiguration
} from "@/lib/assistant";
import { createConfiguration } from "@/lib/configurator";
import { productImageForColors } from "@/lib/musterring-assets";
import { groundAlternativeRequest } from "@/lib/ai/alternative-grounding";
import { validatedAIAlternativeRequirements } from "@/lib/ai/alternative-intent";
import { voiceCommandSchema, type ConversationContext } from "@/lib/ai/assistant-schemas";
import { productHasCategory } from "@/lib/types";

const context: ConversationContext = {
  route: "/search", referencedProductIds: [], selectedMaterialIds: [], currentFilters: {}, approvedPreferences: {}
};

describe("connected Musterring assistant grounding", () => {
  it("supports room planning as a first-class customer journey", () => {
    const answer = answerGroundedQuestion("Plan a room", context);
    expect(answer.answerType).toBe("room");
    expect(answer.proposedAction?.type).toBe("OPEN_ROOM_COMPOSER");
  });

  it("guides retailer-specific service questions without inventing policy", () => {
    const answer = answerGroundedQuestion("Can you help with delivery and warranty?", context);
    expect(answer.answerType).toBe("dealer");
    expect(answer.proposedAction?.type).toBe("FIND_RETAILER");
    expect(answer.answer).toMatch(/selected retailer/i);
  });

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

  it("does not repeat dimensions or discuss prices in alternative explanations", () => {
    const result = findGroundedAlternatives({ sourceProductId: "p1", requestText: "I need something 30 cm narrower with a higher seat." });
    const matches = [...result.exactMatches, ...result.closestAlternatives];
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((match) => match.differences.length === 0)).toBe(true);
    expect(matches.flatMap((match) => [...match.benefits, ...match.tradeOffs]).join(" ")).not.toMatch(/price|recorded width|recorded seat height|cm narrower|cm higher seat|floor width/i);
  });

  it("does not turn structured relax terms into duplicate catalogue-keyword benefits", () => {
    const result = findGroundedAlternatives({ sourceProductId: "p1", requestText: "Relax function" });
    const benefits = [...result.exactMatches, ...result.closestAlternatives].flatMap((match) => match.benefits);
    expect(benefits).not.toEqual(expect.arrayContaining([
      "catalogue description matches “relax”",
      "catalogue description matches “function”"
    ]));
  });

  it("does not claim MR 720 is a verified three-seat exact match", () => {
    const mr720 = products.find((product) => product.slug === "mr-720")!;
    expect(mr720.numberOfSeatsVerified).toBe(false);
    const result = findGroundedAlternatives({ sourceProductId: "p1", requestText: "Three-seat sofa" });
    expect(result.exactMatches.every((match) => products.find((product) => product.id === match.productId)?.numberOfSeatsVerified)).toBe(true);
    expect(result.exactMatches.some((match) => match.productId === mr720.id)).toBe(false);
  });

  it.each(["red sofa", "sofa red"])("treats colour and category as hard alternative requirements: %s", (requestText) => {
    const result = findGroundedAlternatives({ sourceProductId: "musterring-justb-pm200", requestText });
    expect(result.interpretedRequirements).toEqual(expect.arrayContaining(["sofa", "red colour"]));
    expect(result.requestedColorFamilies).toEqual(["red"]);
    expect(result.exactMatches.length).toBeGreaterThan(0);
    expect(result.exactMatches.every((match) => {
      const product = products.find((item) => item.id === match.productId)!;
      return product.category === "sofa" && product.colors.includes("red");
    })).toBe(true);
    expect(result.exactMatches.some((match) => products.find((item) => item.id === match.productId)?.modelCode === "MR 260")).toBe(true);
    expect(result.closestAlternatives.length).toBeGreaterThan(0);
    expect(result.closestAlternatives.length).toBeLessThanOrEqual(3);
    expect(result.closestAlternatives.every((match) => products.find((product) => product.id === match.productId)?.category === "sofa")).toBe(true);
    expect(result.closestAlternatives.map((match) => match.productId)).not.toEqual(expect.arrayContaining(["musterring-mr-2665", "musterring-mr-4100"]));
    expect(result.closestAlternatives.every((match) => match.unmetRequirements.includes("red colour is not verified for this product"))).toBe(true);
  });

  it("removes AI-invented filters from a simple red sofa request", () => {
    const request = groundAlternativeRequest(
      { sourceProductId: "musterring-justb-pm200", requestText: "red sofa" },
      {
        category: "sofa",
        colorFamilies: ["red"],
        styles: ["modern", "contemporary", "classic"],
        layoutShapes: ["straight", "l-shaped", "u-shaped", "corner"],
        materialTags: ["fabric", "leather", "microfiber", "velvet"]
      }
    );
    expect(request).toMatchObject({ category: "sofa", colorFamilies: ["red"] });
    expect(request.styles).toBeUndefined();
    expect(request.layoutShapes).toBeUndefined();
    expect(request.materialTags).toEqual([]);
    const result = findGroundedAlternatives(request);
    expect(result.exactMatches.some((match) => products.find((product) => product.id === match.productId)?.modelCode === "MR 260")).toBe(true);
  });

  it("normalizes verbose AI material phrases to catalogue material tags", () => {
    const request = groundAlternativeRequest(
      { sourceProductId: "musterring-mr-710", requestText: "three-seat fabric sofa" },
      { materialTags: ["fabric sofa", "fabric material"] }
    );
    expect(request.materialTags).toEqual(["fabric"]);
  });

  it("normalizes verbose AI function phrases and rejects material functions", () => {
    const request = groundAlternativeRequest(
      { sourceProductId: "musterring-mr-710", requestText: "fabric sofa with relax function" },
      { requiredFunctions: ["relax function", "fabric function"] }
    );
    expect(request.requiredFunctions).toEqual(["relax"]);
  });

  it("rejects AI tags placed in the wrong product-data domain", () => {
    const request = groundAlternativeRequest(
      { sourceProductId: "musterring-justb-pm200", requestText: "beige L-shaped modular fabric sofa under 280 cm" },
      { requiredFunctions: ["beige"], materialTags: ["modular"] }
    );
    expect(request.requiredFunctions).toEqual([]);
    expect(request.materialTags).toEqual([]);
  });

  it("does not mistake three-seat width wording for a seat-height request", () => {
    const requestText = "three-seat fabric sofa under 240 cm";
    const inferred = validatedAIAlternativeRequirements(
      { sourceProductId: "musterring-mr-710", requestText },
      {
        category: "sofa", colorFamilies: [], styles: [], numberOfSeats: 3,
        maxWidthMm: 2400, minWidthMm: null, targetWidthMm: null,
        layoutShapes: [], excludedLayoutShapes: [], minSeatHeightMm: 460,
        requiredFunctions: [], excludedFunctions: [], materialTags: ["fabric"],
        preserveStyle: null, preserveComfort: null
      }
    );
    expect(inferred.minSeatHeightMm).toBeUndefined();
  });

  it("classifies catalogue recliners as armchairs rather than sofas", () => {
    expect(products.find((product) => product.id === "musterring-mr-2665")?.category).toBe("armchair");
    expect(products.find((product) => product.id === "musterring-mr-4100")?.category).toBe("armchair");
  });

  it.each(["300 cm sofas", "sofa around 300 cm", "sofa 300 cm"])("preserves a requested width as an exact-match requirement: %s", (requestText) => {
    const result = findGroundedAlternatives({ sourceProductId: "musterring-justb-pm200", requestText });
    expect(result.interpretedRequirements).toEqual(expect.arrayContaining(["sofa", "around 300 cm wide"]));
    expect(result.exactMatches).toHaveLength(0);
    expect(result.closestAlternatives.length).toBeGreaterThan(0);
    expect(result.closestAlternatives.every((match) => match.unmetRequirements.some((requirement) => /width is not verified|width should be around/.test(requirement)))).toBe(true);
  });

  it("keeps an explicit width limit as a maximum rather than a target", () => {
    const result = findGroundedAlternatives({ sourceProductId: "musterring-justb-pm200", requestText: "sofas under 300 cm" });
    expect(result.interpretedRequirements).toEqual(expect.arrayContaining(["sofa", "maximum 300 cm wide"]));
    expect(result.interpretedRequirements).not.toContain("around 300 cm wide");
  });

  it("does not let request text switch the source product to another category", () => {
    const result = findGroundedAlternatives({ sourceProductId: "musterring-mr-lia", requestText: "L shaped kitchen above 300 cm" });
    const sourceCategory = products.find((product) => product.id === "musterring-mr-lia")!.category;
    expect(result.interpretedRequirements).toEqual(expect.arrayContaining([sourceCategory, "l-shaped layout", "minimum 300 cm wide"]));
    expect(result.interpretedRequirements).not.toContain("kitchen");
    expect([...result.exactMatches, ...result.closestAlternatives].every((match) =>
      products.find((product) => product.id === match.productId)?.category === sourceCategory
    )).toBe(true);
  });

  it("uses the verified red catalogue presentation for the red MR 260 match", () => {
    expect(productImageForColors("musterring-mr-260", ["red"])).toEqual({
      src: "/musterring-catalog/mr-260/image-08-hq.jpg",
      matchedColor: "red"
    });
  });

  it("shows catalogue alternatives without claiming an unavailable colour is exact", () => {
    const result = findGroundedAlternatives({ sourceProductId: "musterring-justb-pm200", requestText: "purple sofa" });
    expect(result.exactMatches).toHaveLength(0);
    expect(result.closestAlternatives.length).toBeGreaterThan(0);
    expect(result.closestAlternatives.every((match) => match.unmetRequirements.includes("purple colour is not verified for this product"))).toBe(true);
  });

  it("returns a bounded set of grounded other options for each customer's request", () => {
    const requests = [
      "Similar product with a higher seat",
      "Same style, but smaller",
      "red sofa"
    ];
    const results = requests.map((requestText) => findGroundedAlternatives({
      sourceProductId: "musterring-justb-pm200",
      requestText
    }));
    expect(results.every((result) => result.closestAlternatives.length > 0 && result.closestAlternatives.length <= 3)).toBe(true);
    expect(results.flatMap((result) => result.closestAlternatives).every((match) => products.some((product) => product.id === match.productId))).toBe(true);
    expect(results[2].closestAlternatives.every((match) => match.unmetRequirements.includes("red colour is not verified for this product"))).toBe(true);
  });

  it("locks Discover more like this results to the source product category", () => {
    const source = products.find((product) => product.active && product.category === "dining-table")!;
    expect(source).toBeTruthy();
    const result = findGroundedAlternatives({ sourceProductId: source.id, requestText: "show me a smaller sofa under 250 cm" });
    const matches = [...result.exactMatches, ...result.closestAlternatives];
    expect(result.interpretedRequirements).toContain("dining table");
    expect(result.interpretedRequirements).not.toContain("sofa");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((match) => {
      const product = products.find((item) => item.id === match.productId);
      return product?.category === "dining-table" || (
        product?.dataQuality?.verifiedFields.includes("productSubtypes") === true &&
        product.productSubtypes?.includes("dining-table")
      );
    })).toBe(true);
  });

  it.each(["find me a black sofa", "find me a bleck sofa"])("returns MR 285 for a black-sofa request using its verified black catalogue presentation: %s", (requestText) => {
    const result = findGroundedAlternatives({ sourceProductId: "musterring-justb-pm200", requestText });
    expect(result.interpretedRequirements).toContain("black colour");
    expect(result.exactMatches.map((match) => match.productId)).toContain("musterring-mr-285");
    expect(result.exactMatches.map((match) => match.productId)).not.toContain("musterring-justb-pm100");
    expect(result.closestAlternatives.find((match) => match.productId === "musterring-justb-pm100")?.unmetRequirements)
      .toContain("black colour is available, but no matching catalogue image is verified");
    expect(productImageForColors("musterring-mr-285", ["black"])).toEqual({
      src: "/musterring-catalog/mr-285/image-01.jpg",
      matchedColor: "black"
    });
  });

  it("returns the official red MR DUBAI presentation as an exact bed match", () => {
    const result = findGroundedAlternatives({
      sourceProductId: "musterring-justb-sc100",
      requestText: "Can you show me a red bed?"
    });
    expect(result.interpretedRequirements).toEqual(expect.arrayContaining(["bed", "red colour"]));
    expect(result.exactMatches.map((match) => match.productId)).toContain("musterring-mr-dubai-red");
    expect(productImageForColors("musterring-mr-dubai-red", ["red"])).toEqual({
      src: "/musterring-catalog/mr-dubai/image-05.jpg",
      matchedColor: "red"
    });
  });

  it("uses verified bed type and sleeping-size facts for exact matches", () => {
    const result = findGroundedAlternatives({
      sourceProductId: "musterring-bari",
      requestText: "Show me a box-spring bed in 180 × 200 cm."
    });
    expect(result.interpretedRequirements).toEqual(expect.arrayContaining([
      "bed",
      "boxspring bed",
      "180 × 200 cm sleeping size"
    ]));
    expect(result.exactMatches.map((match) => match.productId)).toContain("musterring-justb-sc100");
    expect(result.exactMatches.every((match) => {
      const product = products.find((item) => item.id === match.productId)!;
      return product.category === "bed"
        && product.productSubtypes?.includes("boxspring-bed")
        && product.specifications?.bed?.sleepingSizes.some((size) => size.widthMm === 1800 && size.lengthMm === 2000);
    })).toBe(true);
  });

  it("uses verified bed colour, type, storage and size together", () => {
    const result = findGroundedAlternatives({
      sourceProductId: "musterring-justb-sc100",
      requestText: "Show me a grey upholstered bed with storage in 160 × 200 cm."
    });
    expect(result.interpretedRequirements).toEqual(expect.arrayContaining([
      "bed",
      "grey colour",
      "upholstered bed",
      "160 × 200 cm sleeping size",
      "bed storage"
    ]));
    expect(result.exactMatches.map((match) => match.productId)).toContain("musterring-delphi-light-grey");
  });

  it("keeps bed alternatives out of bedroom-series records", () => {
    const result = findGroundedAlternatives({
      sourceProductId: "musterring-justb-sc100",
      requestText: "Show me a modern bed."
    });
    const matches = [...result.exactMatches, ...result.closestAlternatives];
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((match) => products.find((product) => product.id === match.productId)?.category === "bed")).toBe(true);
  });

  it.each([
    "Red upholstery",
    "Grey upholstery",
    "Fabric bed",
    "Upholstered bed",
    "Box-spring bed",
    "180 × 200 cm",
    "With bed storage",
    "Motorised adjustment"
  ])("keeps every bed quick suggestion exact-capable: %s", (requestText) => {
    const result = findGroundedAlternatives({ sourceProductId: "musterring-justb-sc100", requestText });
    expect(result.exactMatches.length).toBeGreaterThan(0);
    expect(result.exactMatches.every((match) =>
      products.find((product) => product.id === match.productId)?.category === "bed"
    )).toBe(true);
  });

  it("shows MR 285 as a black alternative without claiming its unverified width is around 300 cm", () => {
    const result = findGroundedAlternatives({ sourceProductId: "musterring-justb-pm200", requestText: "find me a black sofa around 300 cm" });
    const mr285 = result.closestAlternatives.find((match) => match.productId === "musterring-mr-285");
    expect(mr285?.benefits).toContain("verified in black");
    expect(mr285?.unmetRequirements.some((requirement) => /width is not verified.*illustrative value 274 cm.*retailer confirmation/.test(requirement))).toBe(true);
    expect(result.exactMatches.map((match) => match.productId)).not.toContain("musterring-mr-285");
  });

  it.each(["find me some oval tables", "find me some oven tables"])("uses verified structured tabletop shapes for exact matches: %s", (requestText) => {
    const source = products.find((product) => product.id === "musterring-pinero")!;
    const result = findGroundedAlternatives({ sourceProductId: source.id, requestText });
    expect(result.interpretedRequirements).toEqual(expect.arrayContaining(["dining table", "oval tabletop"]));
    expect(result.exactMatches.map((match) => match.productId)).toContain("musterring-nica");
  });

  it("can switch a multi-product series to its verified dining-table subtype and return a round table", () => {
    const result = findGroundedAlternatives({
      sourceProductId: "musterring-kiana",
      requestText: "Show me a round dining table."
    });
    expect(result.interpretedRequirements).toEqual(expect.arrayContaining(["dining table", "round tabletop"]));
    expect(result.exactMatches.map((match) => match.productId)).toContain("musterring-nica");
  });

  it("shows clearly labelled closest table alternatives when no exact shape is available", () => {
    const result = findGroundedAlternatives({
      sourceProductId: "musterring-kiana",
      requestText: "Show me a square dining table."
    });
    expect(result.exactMatches).toHaveLength(0);
    expect(result.closestAlternatives.length).toBeGreaterThan(0);
    expect(result.closestAlternatives.every((match) =>
      match.unmetRequirements.includes("square tabletop shape is not verified for this product")
    )).toBe(true);
    expect(result.message).toContain("closest catalogue alternatives");
  });

  it("treats not L-shaped as an exclusion rather than a positive layout requirement", () => {
    const result = findGroundedAlternatives({
      sourceProductId: "musterring-justb-pm200",
      requestText: "find me a better sofa not L shaped and in grey color"
    });
    expect(result.interpretedRequirements).toContain("not l-shaped layout");
    expect(result.interpretedRequirements).not.toContain("l-shaped layout");
    expect(result.exactMatches.every((match) => {
      const layouts = products.find((product) => product.id === match.productId)?.layoutShapes ?? [];
      return layouts.length > 0 && !layouts.includes("l-shaped");
    })).toBe(true);
  });

  it("recognizes 'L sofa' and returns the verified beige L-shaped PM100 presentation", () => {
    const result = findGroundedAlternatives({
      sourceProductId: "musterring-justb-pm200",
      requestText: "find me a L sofa with beige color",
      strict: true
    });
    expect(result.interpretedRequirements).toEqual(expect.arrayContaining(["sofa", "beige colour", "l-shaped layout"]));
    expect(result.exactMatches.map((match) => match.productId)).toContain("musterring-justb-pm100");
    expect(productImageForColors("musterring-justb-pm100", ["beige"])).toEqual({
      src: "/musterring-catalog/justb-pm100/image-01.jpg",
      matchedColor: "beige"
    });
  });

  it("understands the easier-care quick request as a material requirement", () => {
    const result = findGroundedAlternatives({ sourceProductId: "musterring-justb-pm200", requestText: "Easier-care material" });
    expect(result.interpretedRequirements).toContain("easy-care material");
    expect([...result.exactMatches, ...result.closestAlternatives].every((match) => match.benefits.some((benefit) => /sofa category|easy-care/.test(benefit)))).toBe(true);
  });

  it("grounds material recommendations and care reasons in metadata", () => {
    const advice = parseMaterialNeeds("I have two children, a dog and strong afternoon sunlight.");
    const ids = new Set(materials.map((material) => material.id));
    expect(advice.recommendedMaterialIds.every((id) => ids.has(id))).toBe(true);
    expect(advice.needs.children).toBe(true);
    expect(advice.needs.pets).toBe(true);
    expect(advice.needs.strongSunlight).toBe(true);
    expect(advice.recommendedMaterialIds).toEqual([]);
    const material = materials[0];
    expect(materialReasons(material, advice).suitable.join(" ")).not.toMatch(/stain-proof|scratch-proof|allergy-safe|indestructible/i);
  });

  it("recognizes easy-to-wash phrasing as an easy-care material request", () => {
    const advice = parseMaterialNeeds("easy to wash");
    const easyCareIds = materials.filter((material) => material.easyCare).map((material) => material.id);
    expect(advice.needs.easyCareRequired).toBe(true);
    expect(advice.recommendedMaterialIds).toEqual(easyCareIds);
    expect(advice.recommendedMaterialIds.every((id) => materials.find((material) => material.id === id)?.easyCare)).toBe(true);
  });

  it("matches the material advisor's customer questions to grounded catalogue attributes", () => {
    const allIds = materials.map((material) => material.id);
    const petFriendlyIds = materials.filter((material) => material.petFriendly).map((material) => material.id);
    const familyFriendlyIds = materials.filter((material) => material.familyFriendly).map((material) => material.id);
    const easyCareIds = materials.filter((material) => material.easyCare).map((material) => material.id);
    const lowLightSensitivityIds = materials.filter((material) => material.lightSensitivity === "low").map((material) => material.id);
    const mostDurableIds = materials.filter((material) => material.durability === 5).map((material) => material.id);

    expect(parseMaterialNeeds("Should I choose fabric or leather upholstery?").recommendedMaterialIds).toEqual(allIds);
    expect(parseMaterialNeeds("Which materials are most suitable for a home with pets?").recommendedMaterialIds).toEqual(petFriendlyIds);
    expect(parseMaterialNeeds("Which materials work well for families with children?").recommendedMaterialIds).toEqual(familyFriendlyIds);
    expect(parseMaterialNeeds("Which materials are easiest to clean and maintain?").recommendedMaterialIds).toEqual(easyCareIds);
    expect(parseMaterialNeeds("Which materials are best suited to rooms with direct sunlight?").recommendedMaterialIds).toEqual(lowLightSensitivityIds);
    expect(parseMaterialNeeds("Which materials are most durable for everyday use?").recommendedMaterialIds).toEqual(mostDurableIds);
  });

  it("does not invent material recommendations for unsupported seat-comfort questions", () => {
    const question = "How does the upholstery material affect seating comfort?";
    expect(isUnsupportedMaterialComfortQuestion(question)).toBe(true);
    expect(parseMaterialNeeds(question).recommendedMaterialIds).toEqual([]);
  });

  it("keeps illustrative swatches conservative when exact-cover performance data is unavailable", () => {
    expect(materials.filter((material) => material.easyCare === true).map((material) => material.id)).toEqual(["mat-stone-micro"]);
    expect(materials.every((material) => material.petFriendly == null)).toBe(true);
    expect(materials.every((material) => material.familyFriendly == null)).toBe(true);
    expect(materials.every((material) => material.durability == null)).toBe(true);
    expect(materials.filter((material) => material.type === "leather").every((material) => material.lightSensitivity === "high")).toBe(true);
  });

  it("does not relax an unavailable explicit material colour", () => {
    const advice = parseMaterialNeeds("purple leather");
    expect(advice.needs.preferredColors).toEqual(["purple"]);
    expect(advice.needs.preferredMaterialGroups).toEqual(["leather"]);
    expect(advice.recommendedMaterialIds).toEqual([]);
  });

  it("does not confuse professional cleaning with an easy-care request", () => {
    const advice = parseMaterialNeeds("professional cleaning");
    expect(advice.needs.easyCareRequired).toBe(false);
    expect(advice.recommendedMaterialIds).toEqual([]);
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

  it("turns a broad product request into a warm, grounded discovery brief", () => {
    const answer = answerGroundedQuestion("I need a sofa", context);
    expect(answer.answerType).toBe("products");
    expect(answer.answer).toMatch(/maximum furniture width|who will use it/i);
    expect(answer.suggestedQuestions).toContain("My maximum width is 260 cm");
  });

  it("asks for the essentials before proposing an unscoped configuration", () => {
    const answer = answerGroundedQuestion("Help me configure a sofa", context);
    expect(answer.answerType).toBe("configuration");
    expect(answer.productIds).toEqual([]);
    expect(answer.answer).toMatch(/maximum usable width/i);
  });

  it("gathers a material brief without making unsupported performance claims", () => {
    const answer = answerGroundedQuestion("Which material should I choose?", context);
    expect(answer.answerType).toBe("materials");
    expect(answer.answer).toMatch(/children, pets or frequent use/i);
    expect(answer.answer).not.toMatch(/stain-proof|scratch-proof/i);
  });

  it("collects measurements before offering an unscoped fit conclusion", () => {
    const answer = answerGroundedQuestion("Will it fit through my door?", context);
    expect(answer.answerType).toBe("fit");
    expect(answer.proposedAction).toBeNull();
    expect(answer.answer).toMatch(/cannot confirm physical fit/i);
  });

  it("returns only the visually verified red sofa presentation", () => {
    const answer = answerGroundedQuestion("I want a red sofa", context);
    expect(answer.answerType).toBe("products");
    expect(answer.productIds).toHaveLength(1);
    expect(products.find((product) => product.id === answer.productIds[0])?.slug).toBe("mr-260");
    expect(answer.answer).toMatch(/exact catalogue match.*red colour/i);
  });

  it("returns only verified black sofas when black is available in the connected catalogue", () => {
    const answer = answerGroundedQuestion("I want a black sofa", context);
    expect(answer.answerType).toBe("products");
    expect(answer.productIds.length).toBeGreaterThan(0);
    expect(answer.productIds.every((id) => products.find((product) => product.id === id)?.verifiedFacts.colors.includes("black"))).toBe(true);
    expect(answer.answer).toMatch(/exact catalogue match.*black colour/i);
  });

  it("does not treat generic comfort wording as a verified relax function", () => {
    const result = findGroundedAlternatives({ sourceProductId: "p2", requestText: "Relax function" });
    const blocked = new Set(["MR 300", "MR 1390"]);
    expect(result.exactMatches.every((match) => !blocked.has(products.find((product) => product.id === match.productId)?.modelCode ?? ""))).toBe(true);
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
    ["Find a mattress", "bed"],
    ["I want a wardrobe", "wardrobe"],
    ["Show me a kitchen", "kitchen"],
    ["Find bathroom furniture", "bathroom"],
    ["Find hallway furniture", "storage"],
    ["Find outdoor garden furniture", "outdoor"],
    ["Show me a rug", "carpet"],
    ["I need a lamp", "lamp"],
    ["Show me home textiles", "home-textile"]
  ] as const)("grounds catalogue category query: %s", (query, category) => {
    const answer = answerGroundedQuestion(query, context);
    expect(answer.answerType).toBe("products");
    expect(answer.productIds.length).toBeGreaterThan(0);
    expect(answer.productIds.every((id) => {
      const product = products.find((item) => item.id === id);
      return product ? productHasCategory(product, category) : false;
    })).toBe(true);
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
    expect(answer.answer).toContain("configuration dependent");
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

  it("understands a width-only reply from the preceding product options", () => {
    const sofas = products.filter((product) => product.active && product.category === "sofa").slice(0, 4);
    const answer = answerGroundedQuestion("3 meters", { ...context, referencedProductIds: sofas.map((product) => product.id) });
    expect(answer.productIds.length).toBeGreaterThan(0);
    expect(answer.productIds.every((id) => (products.find((product) => product.id === id)?.widthMm ?? Infinity) <= 3000)).toBe(true);
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
