import { materials, products } from "./data";
import { validateConfiguration } from "./configurator";
import { parseSearchQuery, productMatches, searchColorTerms, searchProductsRanked } from "./search";
import type { Configuration, Material, Product } from "./types";
import {
  advisorAnswerSchema, alternativeRequestSchema, alternativeResponseSchema, materialAdviceSchema,
  voiceCommandSchema, type AdvisorAnswer, type AlternativeRequest, type AlternativeResponse,
  type ConversationContext, type MaterialAdvice, type VoiceCommand
} from "./ai/assistant-schemas";

const colors = searchColorTerms;

function requestedAlternative(input: AlternativeRequest, source: Product) {
  const text = input.requestText?.toLowerCase() ?? "";
  const search = parseSearchQuery(input.requestText ?? "");
  const easyCareRequested = /\b(?:easy|easier|easiest)[- ](?:care|clean)|easy to (?:care for|clean)|low[- ]maintenance\b/.test(text);
  const narrower = text.match(/(\d{1,3})\s*cm\s*narrower/);
  const under = text.match(/(?:under|below|maximum|max)\s*(\d{2,3})\s*cm/);
  const price = text.match(/(?:under|below|maximum|max)\s*[€]?\s*(\d{3,5})/);
  return alternativeRequestSchema.parse({
    ...input,
    category: search.category ?? input.category,
    colorFamilies: [...new Set([...(input.colorFamilies ?? []), ...(search.colors ?? [])].map((value) => value.toLowerCase()))],
    styles: [...new Set([...(input.styles ?? []), ...(search.styles ?? [])].map((value) => value.toLowerCase()))],
    numberOfSeats: search.seatCount ?? input.numberOfSeats,
    maxWidthMm: input.maxWidthMm ?? (narrower ? source.widthMm - Number(narrower[1]) * 10 : under ? Number(under[1]) * 10 : /\b(?:smaller|more compact|narrower)\b/.test(text) ? source.widthMm - 10 : undefined),
    minSeatHeightMm: input.minSeatHeightMm ?? (/higher seat|high[- ]seat|tall/.test(text) ? source.seatHeightMm + 10 : undefined),
    maxIndicativePrice: input.maxIndicativePrice ?? (/lower (?:indicative )?price|cheaper/.test(text) ? source.indicativePriceCents - 1 : price ? Number(price[1]) * 100 : undefined),
    requiredFunctions: [...new Set([...(input.requiredFunctions ?? []), ...(/relax/.test(text) ? ["relax"] : []), ...(/modular/.test(text) ? ["modular"] : [])])],
    excludedFunctions: [...new Set([...(input.excludedFunctions ?? []), ...(/without electric|non-electric|no electric/.test(text) ? ["electric"] : [])])],
    materialTags: [...new Set([...(input.materialTags ?? []), ...(/\bleather\b/.test(text) ? ["leather"] : []), ...(/\b(?:fabric|textile|boucle|chenille|velvet)\b/.test(text) ? ["fabric"] : []), ...(easyCareRequested || /children|family|pets?|dog/.test(text) ? ["easy-care"] : [])])],
    preserveStyle: input.preserveStyle ?? /same style|similar style/.test(text),
    preserveComfort: input.preserveComfort ?? /same comfort/.test(text)
  });
}

function hasFunction(product: Product, value: string) {
  if (value === "electric") return product.electricFunctions.length > 0;
  if (value === "modular") return product.modular;
  return product.functions.some((item) => item.toLowerCase().includes(value.toLowerCase()));
}

function hasMaterialTag(product: Product, tag: string) {
  const compatible = materials.filter((material) => product.materials.includes(material.id));
  if (tag === "easy-care") return compatible.some((material) => material.easyCare);
  if (tag === "family") return compatible.some((material) => material.familyFriendly);
  if (tag === "pet") return compatible.some((material) => material.petFriendly);
  return compatible.some((material) => material.type === tag || material.name.toLowerCase().includes(tag.toLowerCase()));
}

const relatedColourGroups = [
  ["red", "burgundy", "barolo", "pink"],
  ["beige", "cream", "ivory", "sand", "taupe", "stone", "natural", "brown", "cognac", "oak"],
  ["black", "charcoal", "graphite", "grey", "gray"],
  ["yellow", "mustard", "orange"]
];

function clampScore(value: number) {
  return Math.max(0, Math.min(1, value));
}

function colourCloseness(requested: string, available: string[]) {
  if (available.includes(requested)) return 1;
  const group = relatedColourGroups.find((values) => values.includes(requested));
  return group && available.some((color) => group.includes(color)) ? 0.55 : 0;
}

function softPreferenceTokens(text: string) {
  const ignored = new Set([
    "this", "that", "with", "from", "like", "need", "want", "find", "show", "product", "option", "alternative",
    "sofa", "couch", "chair", "armchair", "sectional", "table", "smaller", "higher", "lower", "same", "similar",
    ...searchColorTerms
  ]);
  return [...new Set(text.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 3 && !ignored.has(token)))];
}

export function findGroundedAlternatives(raw: AlternativeRequest): AlternativeResponse {
  const source = products.find((product) => product.id === raw.sourceProductId && product.active);
  if (!source) throw new Error("Unknown source Product ID.");
  const request = requestedAlternative(raw, source);
  const requestedCategory = request.category ?? source.category;
  const candidates = products.filter((product) => product.active && product.id !== source.id && product.category === requestedCategory);
  const preferenceTokens = softPreferenceTokens(request.requestText ?? "");
  const ranked = candidates.map((product) => {
    const checks: Array<{ ok: boolean; label: string; closeness: number }> = [];
    for (const value of request.colorFamilies ?? []) {
      const closeness = colourCloseness(value, product.colors);
      checks.push({ ok: closeness === 1, label: `available in ${value}`, closeness });
    }
    for (const value of request.styles ?? []) {
      const exact = product.styles.some((style) => style.toLowerCase().includes(value));
      const related = product.styles.some((style) => style.toLowerCase().split(/\s+/).some((term) => value.includes(term)));
      checks.push({ ok: exact, label: `matches ${value} style`, closeness: exact ? 1 : related ? 0.5 : 0 });
    }
    if (request.numberOfSeats) {
      const difference = Math.abs(product.numberOfSeats - request.numberOfSeats);
      checks.push({ ok: difference === 0, label: `must have ${request.numberOfSeats} seats`, closeness: clampScore(1 - difference / Math.max(2, request.numberOfSeats)) });
    }
    if (request.maxWidthMm) {
      const excess = Math.max(0, product.widthMm - request.maxWidthMm);
      checks.push({ ok: excess === 0, label: `width must be at most ${request.maxWidthMm} mm`, closeness: clampScore(1 - excess / Math.max(500, request.maxWidthMm * 0.35)) });
    }
    if (request.minSeatHeightMm) {
      const deficit = Math.max(0, request.minSeatHeightMm - product.seatHeightMm);
      checks.push({ ok: deficit === 0, label: `seat height must be at least ${request.minSeatHeightMm} mm`, closeness: clampScore(1 - deficit / 120) });
    }
    if (request.maxIndicativePrice) {
      const excess = Math.max(0, product.indicativePriceCents - request.maxIndicativePrice);
      checks.push({ ok: excess === 0, label: "indicative price must be below the requested limit", closeness: clampScore(1 - excess / Math.max(10000, request.maxIndicativePrice * 0.5)) });
    }
    for (const value of request.requiredFunctions ?? []) checks.push({ ok: hasFunction(product, value), label: `requires ${value}`, closeness: hasFunction(product, value) ? 1 : 0 });
    for (const value of request.excludedFunctions ?? []) checks.push({ ok: !hasFunction(product, value), label: `must not include ${value}`, closeness: !hasFunction(product, value) ? 1 : 0 });
    for (const value of request.materialTags ?? []) checks.push({ ok: hasMaterialTag(product, value), label: `requires ${value} material metadata`, closeness: hasMaterialTag(product, value) ? 1 : 0 });
    if (request.preserveStyle) {
      const overlap = source.styles.filter((style) => product.styles.includes(style)).length;
      checks.push({ ok: overlap > 0, label: "preserve style", closeness: clampScore(overlap / Math.max(1, source.styles.length)) });
    }
    if (request.preserveComfort) {
      const overlap = source.comfortOptions.filter((option) => product.comfortOptions.includes(option)).length;
      checks.push({ ok: overlap > 0, label: "preserve comfort options", closeness: clampScore(overlap / Math.max(1, source.comfortOptions.length)) });
    }
    const unmet = checks.filter((check) => !check.ok).map((check) => check.label);
    const productCopy = [product.name, product.subtitle, product.description, ...product.styles, ...product.functions].join(" ").toLowerCase();
    const keywordMatches = preferenceTokens.filter((token) => productCopy.includes(token));
    const requestReasons = [
      `same ${requestedCategory.replace(/-/g, " ")} category`,
      ...((request.colorFamilies ?? []).filter((color) => product.colors.includes(color)).map((color) => `available in ${color}`)),
      ...((request.colorFamilies ?? []).flatMap((color) => {
        if (product.colors.includes(color) || colourCloseness(color, product.colors) === 0) return [];
        const group = relatedColourGroups.find((values) => values.includes(color));
        const related = product.colors.find((available) => group?.includes(available));
        return related ? [`related recorded colour: ${related}`] : [];
      })),
      ...(request.minSeatHeightMm ? [`${Math.round(product.seatHeightMm / 10)} cm recorded seat height`] : []),
      ...(request.maxWidthMm ? [`${Math.round(product.widthMm / 10)} cm recorded width`] : []),
      ...(request.numberOfSeats ? [`${product.numberOfSeats} recorded seats`] : []),
      ...checks.filter((check) => check.ok && /requires|matches|preserve/.test(check.label)).map((check) => check.label.replace(/^requires /, "includes ")),
      ...keywordMatches.slice(0, 2).map((token) => `catalogue description matches “${token}”`)
    ];
    const benefits = [
      ...((request.colorFamilies ?? []).filter((color) => product.colors.includes(color)).map((color) => `available in ${color}`)),
      ...((request.styles ?? []).filter((style) => product.styles.some((productStyle) => productStyle.toLowerCase().includes(style))).map((style) => `${style} style`)),
      ...(product.widthMm < source.widthMm ? [`${Math.round((source.widthMm - product.widthMm) / 10)} cm narrower`] : []),
      ...(product.seatHeightMm > source.seatHeightMm ? [`${Math.round((product.seatHeightMm - source.seatHeightMm) / 10)} cm higher seat`] : []),
      ...(product.indicativePriceCents < source.indicativePriceCents ? ["lower indicative concept price"] : [])
    ];
    const tradeOffs = [
      ...(product.numberOfSeats < source.numberOfSeats ? [`one fewer seat than ${source.modelCode}`] : []),
      ...(product.widthMm > source.widthMm ? ["requires more floor width"] : []),
      ...(!product.modular && source.modular ? ["less modular flexibility"] : [])
    ];
    const differences = [
      `${product.widthMm} mm wide versus ${source.widthMm} mm`,
      `${product.seatHeightMm} mm seat height versus ${source.seatHeightMm} mm`
    ];
    return {
      product,
      exact: unmet.length === 0,
      unmet,
      score: checks.filter((check) => check.ok).length * 100 + checks.reduce((total, check) => total + check.closeness * 50, 0) - unmet.length * 25 + keywordMatches.length * 12 - Math.abs(product.widthMm - source.widthMm) / 1000,
      differences,
      benefits: [...new Set([...benefits, ...requestReasons])],
      tradeOffs
    };
  }).sort((left, right) => right.score - left.score);
  const toMatch = (item: typeof ranked[number]) => ({
    productId: item.product.id,
    exact: item.exact,
    differences: item.differences,
    benefits: item.benefits.length ? item.benefits : ["similar catalogue category and product character"],
    tradeOffs: item.tradeOffs.length ? item.tradeOffs : ["No additional trade-off is established in the connected data."],
    unmetRequirements: item.unmet,
    explanation: item.exact
      ? `${item.product.modelCode} satisfies all selected requirements using available catalogue and material data.`
      : `${item.product.modelCode} is a close alternative, but ${item.unmet.join("; ")}.`
  });
  const exactMatches = ranked.filter((item) => item.exact).slice(0, 6).map(toMatch);
  const closestAlternatives = request.strict ? [] : ranked.filter((item) => !item.exact).slice(0, 6).map(toMatch);
  const interpretedRequirements = [
    ...(request.category ? [request.category.replace(/-/g, " ")] : []),
    ...(request.colorFamilies ?? []).map((value) => `${value} colour`),
    ...(request.styles ?? []).map((value) => `${value} style`),
    ...(request.numberOfSeats ? [`${request.numberOfSeats} seats`] : []),
    ...(request.maxWidthMm ? [`maximum ${Math.round(request.maxWidthMm / 10)} cm wide`] : []),
    ...(request.minSeatHeightMm ? [`seat height at least ${Math.round(request.minSeatHeightMm / 10)} cm`] : []),
    ...(request.requiredFunctions ?? []).map((value) => `${value} function`),
    ...(request.materialTags ?? []).map((value) => `${value} material`),
    ...(request.preserveStyle ? ["preserve style"] : []),
    ...(request.preserveComfort ? ["preserve comfort"] : [])
  ];
  return alternativeResponseSchema.parse({
    sourceProductId: source.id,
    interpretedRequirements: [...new Set(interpretedRequirements)],
    requestedColorFamilies: request.colorFamilies ?? [],
    exactMatches,
    closestAlternatives,
    message: exactMatches.length ? `${exactMatches.length} catalogue alternative${exactMatches.length === 1 ? "" : "s"} satisfy all requirements.` : "No exact alternative was found. The closest catalogue alternatives are labelled with every unmet condition."
  });
}

export function parseMaterialNeeds(textValue: string): MaterialAdvice {
  const text = textValue.toLowerCase();
  const preferredColors = colors.filter((color) => text.includes(color));
  const preferredMaterialGroups = ["leather", "fabric"].filter((group) => text.includes(group));
  const avoidMaterialGroups = (text.match(/(?:avoid|without|no)\s+(leather|fabric)/)?.[1] ? [text.match(/(?:avoid|without|no)\s+(leather|fabric)/)![1]] : []);
  const needs = {
    children: /children|child|kids?|kinder|family/.test(text),
    pets: /pets?|dog|cat|hund|katze/.test(text),
    highUse: /high use|everyday|daily|busy|frequent/.test(text),
    strongSunlight: /strong (?:afternoon )?sunlight|direct sun|sunny/.test(text),
    easyCareRequired: /easy[- ]care|easy clean|cleaning|children|pets?|dog|stain/.test(text),
    preferredColors: preferredColors.length ? preferredColors : undefined,
    preferredMaterialGroups: preferredMaterialGroups.length ? preferredMaterialGroups : undefined,
    avoidMaterialGroups: avoidMaterialGroups.length ? avoidMaterialGroups : undefined
  };
  const scored = materials.map((material) => {
    let score = 0;
    if (needs.children) score += material.familyFriendly ? 4 : -4;
    if (needs.pets) score += material.petFriendly ? 4 : -4;
    if (needs.highUse) score += material.durability;
    if (needs.easyCareRequired) score += material.easyCare ? 4 : -3;
    if (needs.strongSunlight) score += material.lightSensitivity === "low" ? 4 : material.lightSensitivity === "medium" ? 0 : -5;
    if (preferredColors.includes(material.colorFamily)) score += 3;
    if (preferredMaterialGroups.includes(material.type)) score += 3;
    if (avoidMaterialGroups.includes(material.type)) score -= 20;
    return { material, score };
  }).sort((left, right) => right.score - left.score);
  const recommendedMaterialIds = scored.filter(({ score }) => score >= 3).slice(0, 5).map(({ material }) => material.id);
  const materialsToAvoid = scored.filter(({ score }) => score < 0).slice(-4).map(({ material }) => material.id);
  const explanationKeys = [
    ...(needs.children ? ["family-suitability"] : []),
    ...(needs.pets ? ["pet-suitability"] : []),
    ...(needs.easyCareRequired ? ["easy-care"] : []),
    ...(needs.strongSunlight ? ["light-sensitivity"] : []),
    "validated-care-instructions"
  ];
  return materialAdviceSchema.parse({ needs, recommendedMaterialIds, materialsToAvoid, explanationKeys });
}

export function materialReasons(material: Material, advice: MaterialAdvice) {
  const suitable = [
    ...(advice.needs.children && material.familyFriendly ? ["family-suitable metadata"] : []),
    ...(advice.needs.pets && material.petFriendly ? ["pet-suitable metadata"] : []),
    ...(advice.needs.easyCareRequired && material.easyCare ? ["easy-care metadata"] : []),
    ...(advice.needs.strongSunlight && material.lightSensitivity === "low" ? ["low light sensitivity"] : []),
    `durability ${material.durability}/5`
  ];
  const cautions = [
    ...(advice.needs.strongSunlight && material.lightSensitivity !== "low" ? [`${material.lightSensitivity} light sensitivity`] : []),
    ...(advice.needs.pets && !material.petFriendly ? ["not marked pet-suitable"] : []),
    ...(advice.needs.children && !material.familyFriendly ? ["not marked family-suitable"] : []),
    ...(!material.easyCare ? ["more involved care"] : [])
  ];
  return { suitable, cautions };
}

export function parseVoiceCommandDeterministic(transcript: string): VoiceCommand {
  const text = transcript.toLowerCase();
  const searchFilters = parseSearchQuery(transcript);
  let intent: VoiceCommand["intent"] = "ASK_PRODUCT_QUESTION";
  if (/book|consultation/.test(text)) intent = "BOOK_CONSULTATION";
  else if (/retailer|dealer|near me/.test(text)) intent = "FIND_RETAILER";
  else if (/fit|door|through/.test(text)) intent = "OPEN_FIT_CHECK";
  else if (/show .* in .*room|room composer|my room/.test(text)) intent = "OPEN_ROOM_COMPOSER";
  else if (/add .*table|matching table|complementary/.test(text)) intent = "ADD_COMPLEMENTARY_PRODUCT";
  else if (/save .*configuration/.test(text)) intent = "SAVE_TO_PROJECT";
  else if (/save|add .*project/.test(text)) intent = "SAVE_TO_PROJECT";
  else if (/change .*material|fabric|leather/.test(text) && /change|easy-care|grey|beige/.test(text)) intent = "CHANGE_MATERIAL";
  else if (/compare/.test(text)) intent = "COMPARE_PRODUCTS";
  else if (/configur/.test(text)) intent = "CONFIGURE_PRODUCT";
  else if (searchFilters.category || searchFilters.modelCode || /show me|find|search|looking for|recommend/.test(text)) intent = "SEARCH_PRODUCTS";
  const modelCodes = [...transcript.matchAll(/\bMR\s*-?\s*\d{3,4}\b/gi)].map((match) => match[0].replace(/[\s-]+/g, " ").toUpperCase());
  const width = text.match(/(?:under|below|max(?:imum)?)\s*(\d{2,3})\s*(?:cm|centimet)/);
  return voiceCommandSchema.parse({
    intent,
    parameters: { query: transcript, modelCodes, maxWidthMm: width ? Number(width[1]) * 10 : undefined },
    requiresConfirmation: ["SAVE_TO_PROJECT", "ADD_COMPLEMENTARY_PRODUCT", "CHANGE_MATERIAL", "BOOK_CONSULTATION"].includes(intent)
  });
}

function groundedProductIds(ids: string[]) {
  const active = new Set(products.filter((product) => product.active).map((product) => product.id));
  return [...new Set(ids)].filter((id) => active.has(id));
}

const productDiscoveryPattern = /\b(sofa|couch|armchair|chair|recliner|sectional|table|storage|cabinet|sideboard|wardrobe|bed|bathroom|outdoor|garden|carpet|rug|lamp|furniture)\b/;

function supportsMaterialType(product: Product, type: "leather" | "fabric") {
  return materials.some((material) => product.materials.includes(material.id) && material.type === type);
}

function productDiscoveryAnswer(question: string): AdvisorAnswer | null {
  const text = question.toLowerCase();
  const filters = parseSearchQuery(question);
  const discoveryLanguage = /\b(i want|i need|show me|find|search|looking for|recommend|suggest|do you have|available)\b/.test(text);
  const namedProduct = products.find((product) => product.active && (
    text.includes(product.modelCode.toLowerCase()) || text.includes(product.name.toLowerCase())
  ));
  if (!filters.category && !filters.modelCode && !namedProduct && !(discoveryLanguage && productDiscoveryPattern.test(text))) return null;

  const requestedMaterial = /\bleather\b/.test(text) ? "leather" : /\b(fabric|textile|boucle|chenille|velvet)\b/.test(text) ? "fabric" : null;
  const wantsEasyCare = /easy[- ]care|easy to clean|pflegeleicht|family|familie|children|kinder|kids?|pets?|dog|hund|cat|katze/.test(text);
  // The imported catalogue groups corner/sectional models under the broader
  // "sofa" category; modular remains a separate, validated product attribute.
  const catalogueCategory = filters.category === "sectional" ? "sofa" : filters.category;
  const hardFilters = { ...filters, category: catalogueCategory, q: undefined };
  const exactCandidates = products.filter((product) =>
    product.active &&
    (!namedProduct || product.id === namedProduct.id) &&
    productMatches(product, hardFilters) &&
    (!requestedMaterial || supportsMaterialType(product, requestedMaterial)) &&
    (!wantsEasyCare || product.materials.some((id) => materials.find((material) => material.id === id)?.easyCare))
  );
  const rankOrder = new Map(searchProductsRanked(question, products.length).map((match, index) => [match.product.id, index]));
  const exact = exactCandidates
    .sort((left, right) => (rankOrder.get(left.id) ?? 9999) - (rankOrder.get(right.id) ?? 9999) || left.modelCode.localeCompare(right.modelCode))
    .slice(0, 4);
  const requested: string[] = [];
  if (filters.category) requested.push(filters.category.replaceAll("-", " "));
  if (filters.colors?.length) requested.push(`${filters.colors.join(" or ")} colour`);
  if (requestedMaterial) requested.push(requestedMaterial);
  if (filters.maxWidthMm) requested.push(`maximum ${filters.maxWidthMm / 10} cm width`);
  if (filters.modular) requested.push("modular");
  if (filters.smallSpaceSuitable) requested.push("small-space suitable");
  if (filters.relaxFunction) requested.push("relax function");
  if (filters.electricFunctions) requested.push("electric function");
  if (wantsEasyCare) requested.push("easy-care material metadata");

  if (exact.length) {
    const exactIds = exact.map((product) => product.id);
    const wantsComparison = /compare/.test(text);
    const comparisonAlternatives = wantsComparison && exactIds.length < 2
      ? products
          .filter((product) => product.active && product.category === exact[0].category && !exactIds.includes(product.id))
          .sort((left, right) => (rankOrder.get(left.id) ?? 9999) - (rankOrder.get(right.id) ?? 9999))
          .slice(0, 2)
      : [];
    const ids = [...exactIds, ...comparisonAlternatives.map((product) => product.id)];
    const comparisonNote = comparisonAlternatives.length
      ? ` ${exactIds.length === 1 ? "One product is an exact match" : `${exactIds.length} products are exact matches`}; the additional products are clearly labelled comparison alternatives and may not satisfy every filter.`
      : "";
    return advisorAnswerSchema.parse({
      answer: `I found ${exact.length} exact catalogue match${exact.length === 1 ? "" : "es"}${requested.length ? ` for ${requested.join(", ")}` : ""}.${comparisonNote || " Every shown product satisfies the interpreted hard filters in the connected data."}`,
      answerType: "products", productIds: ids, materialIds: [], sources: ["Musterring product catalogue", ...(requestedMaterial || wantsEasyCare ? ["Musterring concept material metadata"] : [])],
      proposedAction: wantsComparison && ids.length > 1 ? { type: "COMPARE_PRODUCTS", label: comparisonAlternatives.length ? "Compare match with alternatives" : "Compare the exact matches", parameters: { productIds: ids.slice(0, 3) }, requiresConfirmation: false } : null,
      suggestedQuestions: ids.length > 1 ? ["Which one is most compact?", "Compare the first three", "Save the first one"] : ["Open the first product", "Find a similar alternative", "Save this product"]
    });
  }

  const sameCategory = products.filter((product) => product.active && (!catalogueCategory || product.category === catalogueCategory));
  const alternatives = sameCategory.map((product) => {
    let score = rankOrder.has(product.id) ? Math.max(0, 30 - (rankOrder.get(product.id) ?? 30)) : 0;
    if (filters.colors?.length && filters.colors.some((color) => product.colors.includes(color))) score += 20;
    if (filters.maxWidthMm && product.widthMm <= filters.maxWidthMm) score += 15;
    if (filters.modular && product.modular) score += 12;
    if (filters.smallSpaceSuitable && product.smallSpaceSuitable) score += 12;
    if (filters.relaxFunction && product.functions.includes("relax")) score += 12;
    if (filters.electricFunctions && product.electricFunctions.length) score += 12;
    if (requestedMaterial && supportsMaterialType(product, requestedMaterial)) score += 10;
    if (wantsEasyCare && product.materials.some((id) => materials.find((material) => material.id === id)?.easyCare)) score += 10;
    return { product, score };
  }).sort((left, right) => right.score - left.score || left.product.modelCode.localeCompare(right.product.modelCode)).slice(0, 4).map(({ product }) => product);
  return advisorAnswerSchema.parse({
    answer: `No catalogue product satisfies every requested condition${requested.length ? ` (${requested.join(", ")})` : ""}. The products below are closest recommendations and must not be treated as exact matches.`,
    answerType: "missing-data", productIds: alternatives.map((product) => product.id), materialIds: [], sources: ["Musterring product catalogue"],
    proposedAction: /compare/.test(text) && alternatives.length > 1 ? { type: "COMPARE_PRODUCTS", label: "Compare the closest recommendations", parameters: { productIds: alternatives.slice(0, 3).map((product) => product.id) }, requiresConfirmation: false } : null,
    suggestedQuestions: ["Remove one filter", "Show another colour", "Find a retailer"]
  });
}

export function answerGroundedQuestion(question: string, context: ConversationContext): AdvisorAnswer {
  const text = question.toLowerCase();
  const conversationalText = text.trim().replace(/[.!?]+$/g, "").trim();
  const referenced = groundedProductIds(context.referencedProductIds);
  const code = question.match(/\bMR\s*-?\s*\d{3,4}\b/i)?.[0].replace(/[\s-]+/g, " ").toUpperCase();
  const current = products.find((product) => product.modelCode === code) ?? products.find((product) => product.id === context.currentProductId);
  const ordinal = /\b(first|1st)\b/.test(text) ? 0 : /\b(second|2nd)\b/.test(text) ? 1 : /\b(third|3rd)\b/.test(text) ? 2 : null;
  const simpleReply = /^(okay |ok )?(thanks|thank you|thank you very much|thanks a lot)$/.test(conversationalText)
    ? "You’re welcome! If you need anything else, I can help you find, compare or configure Musterring products."
    : /^(hi|hello|hey|good morning|good afternoon|good evening)$/.test(conversationalText)
      ? "Hello! How can I help with your Musterring furniture or project today?"
      : /^(ok|okay|alright|got it|understood|sounds good)$/.test(conversationalText)
        ? "Of course. Let me know what you’d like to explore next."
        : /^(bye|goodbye|see you|see you later)$/.test(conversationalText)
          ? "Goodbye! Your Musterring selections will be here when you return."
          : null;
  if (simpleReply) {
    return advisorAnswerSchema.parse({
      answer: simpleReply,
      answerType: "fact", productIds: [], materialIds: [], sources: [],
      proposedAction: null, suggestedQuestions: []
    });
  }
  if (ordinal !== null && referenced[ordinal]) {
    const product = products.find((item) => item.id === referenced[ordinal])!;
    return advisorAnswerSchema.parse({
      answer: `The referenced product is ${product.modelCode}, ${product.name}.`,
      answerType: "fact", productIds: [product.id], materialIds: [], sources: ["Musterring product catalogue"],
      proposedAction: /save/.test(text)
        ? { type: "SAVE_PRODUCT", label: `Save ${product.modelCode} to My Musterring`, parameters: { productId: product.id }, requiresConfirmation: true }
        : /open|details?/.test(text)
          ? { type: "OPEN_PRODUCT", label: `Open ${product.modelCode}`, parameters: { slug: product.slug }, requiresConfirmation: false }
          : null,
      suggestedQuestions: ["Compare it with the first product", "Show its materials"]
    });
  }
  if (/\bsave (this|it|the product)\b/.test(text) && (current || referenced[0])) {
    const product = current ?? products.find((item) => item.id === referenced[0])!;
    return advisorAnswerSchema.parse({
      answer: `I can save ${product.modelCode}, ${product.name}, to My Musterring after confirmation.`,
      answerType: "project", productIds: [product.id], materialIds: [], sources: ["Musterring product catalogue"],
      proposedAction: { type: "SAVE_PRODUCT", label: `Save ${product.modelCode} to My Musterring`, parameters: { productId: product.id }, requiresConfirmation: true },
      suggestedQuestions: ["Open the product", "Prepare my project for a retailer"]
    });
  }
  if (/missing|prepare .*retailer|contact a retailer/.test(text)) {
    return advisorAnswerSchema.parse({
      answer: "Before retailer handover, review the selected retailer, requested action, contact details, room measurements, material choice, configuration validity and unresolved fit warnings. I can prepare this context, but I will not submit it.",
      answerType: "dealer", productIds: referenced, materialIds: context.selectedMaterialIds, sources: ["My Musterring project data", "Saved fit reports"],
      proposedAction: { type: "PREPARE_HANDOVER", label: "Review retailer handover checklist", parameters: {}, requiresConfirmation: true },
      suggestedQuestions: ["Summarize my decisions", "Which room measurements are missing?"]
    });
  }
  if (/material|dog|pet|children|care/.test(text) && !/sofa|couch|armchair|chair|sectional|table|bed|wardrobe|outdoor|carpet|rug|lamp|compare|find|show me|i need|i want/.test(text)) {
    const advice = parseMaterialNeeds(question);
    return advisorAnswerSchema.parse({
      answer: "These recommendations use only recorded material durability, easy-care, family, pet and light-sensitivity attributes. No material is described as stain-proof, scratch-proof or allergy-safe.",
      answerType: "materials", productIds: current ? [current.id] : [], materialIds: advice.recommendedMaterialIds, sources: ["Musterring concept material metadata"],
      proposedAction: { type: "SHOW_MATERIALS", label: "Open Material & Care Advisor", parameters: { query: question }, requiresConfirmation: false },
      suggestedQuestions: ["Why should I avoid another material?", "Show the care plan"]
    });
  }
  if (/\b(fit|door|doorway|delivery route|through)\b/.test(text)) {
    return advisorAnswerSchema.parse({
      answer: current ? `Available product data lists ${current.modelCode} package guidance, but physical fit cannot be confirmed here. Use Will It Fit? with your measured route and retailer verification.` : "Select a product and use Will It Fit? with measured room and delivery-route data.",
      answerType: "fit", productIds: current ? [current.id] : referenced, materialIds: [], sources: ["Product package data", "Will It Fit? deterministic service"],
      proposedAction: current ? { type: "OPEN_FIT_CHECK", label: `Check ${current.modelCode}`, parameters: { slug: current.slug }, requiresConfirmation: false } : null,
      suggestedQuestions: ["Which measurements do I need?", "Prepare a technical fit request"]
    });
  }
  if (/smaller|alternative|same style|better match/.test(text) && current) {
    return advisorAnswerSchema.parse({
      answer: `I can compare ${current.modelCode} with catalogue alternatives and show every unmet requirement rather than silently ignoring it.`,
      answerType: "products", productIds: [current.id], materialIds: [], sources: ["Musterring product catalogue"],
      proposedAction: { type: "SHOW_ALTERNATIVES", label: `Find alternatives to ${current.modelCode}`, parameters: { productId: current.id, requestText: question }, requiresConfirmation: false },
      suggestedQuestions: ["Make it 30 cm narrower", "Require a higher seat"]
    });
  }
  if (/highest seat|lowest seat|smallest|most compact|narrowest|widest|difference|compare/.test(text) && referenced.length >= 2) {
    const selected = products.filter((product) => referenced.includes(product.id));
    const highlighted = /lowest seat/.test(text)
      ? [...selected].sort((a, b) => a.seatHeightMm - b.seatHeightMm)[0]
      : /smallest|most compact|narrowest/.test(text)
        ? [...selected].sort((a, b) => a.widthMm - b.widthMm)[0]
        : /widest/.test(text)
          ? [...selected].sort((a, b) => b.widthMm - a.widthMm)[0]
          : [...selected].sort((a, b) => b.seatHeightMm - a.seatHeightMm)[0];
    const comparisonText = /smallest|most compact|narrowest/.test(text)
      ? `${highlighted.modelCode} is the narrowest referenced product at ${highlighted.widthMm / 10} cm.`
      : /widest/.test(text)
        ? `${highlighted.modelCode} is the widest referenced product at ${highlighted.widthMm / 10} cm.`
        : /lowest seat/.test(text)
          ? `${highlighted.modelCode} has the lowest recorded seat height among these products at ${highlighted.seatHeightMm / 10} cm.`
          : `${highlighted.modelCode} has the highest recorded seat height among these products at ${highlighted.seatHeightMm / 10} cm.`;
    return advisorAnswerSchema.parse({
      answer: `${comparisonText} Final options must be confirmed against validated product data.`,
      answerType: "comparison", productIds: selected.map((product) => product.id), materialIds: [], sources: ["Musterring product catalogue"],
      proposedAction: { type: "COMPARE_PRODUCTS", label: "Open comparison", parameters: { productIds: selected.map((product) => product.id) }, requiresConfirmation: false },
      suggestedQuestions: ["Which is most compact?", "Find a higher-seat alternative"]
    });
  }
  if (current && /seat|dimension|width|depth|height|price|cost|colou?r|material|electric|relax|modular|function/.test(text) && !/\b(i want|i need|show me|find|search|looking for|recommend)\b/.test(text)) {
    const recordedMaterials = materials.filter((material) => current.materials.includes(material.id));
    const facts = /price|cost/.test(text)
      ? `No confirmed price for ${current.modelCode} is available in the connected catalogue data.`
      : /colou?r/.test(text)
        ? `${current.modelCode} has these recorded colour families: ${current.colors.join(", ") || "none recorded"}.`
        : /material/.test(text)
          ? `${current.modelCode} has these validated material options: ${recordedMaterials.map((material) => material.name).join(", ") || "none recorded"}.`
          : /electric|relax|function/.test(text)
            ? `${current.modelCode} has these recorded functions: ${[...current.functions, ...current.electricFunctions].join(", ") || "none recorded"}.`
            : `${current.modelCode} is recorded at ${current.widthMm / 10} cm wide, ${current.depthMm / 10} cm deep and ${current.heightMm / 10} cm high, with a ${current.seatHeightMm / 10} cm seat height. ${current.modular ? "It is marked modular." : "It is not marked modular."}`;
    return advisorAnswerSchema.parse({
      answer: `${facts} Final pricing, availability and technical confirmation are provided by the selected Musterring retailer.`,
      answerType: "fact", productIds: [current.id], materialIds: [], sources: ["Musterring product catalogue"],
      proposedAction: /electric|relax|configur/.test(text) ? { type: "CONFIGURE_PRODUCT", label: `Validate options for ${current.modelCode}`, parameters: { slug: current.slug }, requiresConfirmation: false } : null,
      suggestedQuestions: ["Find a better match", "Explain compatible materials"]
    });
  }
  const discovery = productDiscoveryAnswer(question);
  if (discovery) return discovery;
  return advisorAnswerSchema.parse({
    answer: "Information is not currently available in the connected product data. Ask about Musterring products, materials, configuration, room planning, fit guidance, saved projects or retailer preparation.",
    answerType: "missing-data", productIds: [], materialIds: [], sources: [],
    proposedAction: null, suggestedQuestions: ["Help me find the right sofa", "Choose a material", "Prepare my project for a retailer"]
  });
}

export function validateProposedConfiguration(configuration: Configuration) {
  return validateConfiguration(configuration);
}
