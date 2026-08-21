import { materials, products } from "./data";
import { validateConfiguration } from "./configurator";
import { parseSearchQuery, productMatches, searchColorTerms, searchProductsRanked } from "./search";
import { productHasCategory, type Category, type Configuration, type Material, type Product, type ProductSubtype } from "./types";
import {
  advisorAnswerSchema, alternativeRequestSchema, alternativeResponseSchema, materialAdviceSchema,
  voiceCommandSchema, type AdvisorAnswer, type AlternativeRequest, type AlternativeResponse,
  type ConversationContext, type MaterialAdvice, type VoiceCommand
} from "./ai/assistant-schemas";
import { extractExcludedLayoutShapes } from "./ai/alternative-intent";
import { extractBedAlternativeRequirements, extractTabletopShapes } from "./ai/alternative-grounding";
import { hasDemoColourPresentation, hasVerifiedColourPresentation } from "./musterring-assets";
import { demoFactsFor } from "./demo-search-metadata";

const colors = searchColorTerms;

const alternativeCategorySubtypes: Partial<Record<Category, ProductSubtype[]>> = {
  sofa: ["sofa", "recliner-sofa", "sofa-bed"],
  sectional: ["sectional-sofa"],
  armchair: ["armchair", "recliner-armchair", "swivel-armchair"],
  storage: ["wall-unit", "sideboard", "media-unit", "display-cabinet", "bedside-table", "dresser", "shoe-storage"],
  "coffee-table": ["coffee-table", "side-table"],
  "bedroom-series": ["bedroom-series"],
  bed: ["bed", "upholstered-bed", "boxspring-bed", "sofa-bed"],
  wardrobe: ["wardrobe"],
  "dining-chair": ["dining-chair", "dining-armchair", "dining-bench", "bar-stool"],
  "dining-table": ["dining-table"],
  bathroom: ["bathroom-storage"],
  outdoor: ["outdoor-seating", "outdoor-table"],
  "small-furniture": ["small-furniture"],
  carpet: ["carpet"],
  lamp: ["lamp"],
  "home-textile": ["home-textile"]
};

function productSupportsAlternativeCategory(product: Product, category: Category) {
  // A bedroom programme may list a bed among its available pieces, but it is
  // not itself a bed alternative. Keep bed discovery on actual bed records.
  if (category === "bed") return product.category === "bed";
  if (productHasCategory(product, category)) return true;
  const subtypes = alternativeCategorySubtypes[category] ?? [];
  const subtypesAreVerified = product.dataQuality?.verifiedFields.includes("productSubtypes") === true;
  return subtypesAreVerified && subtypes.some((subtype) => product.productSubtypes?.includes(subtype));
}

function verifiedTabletopShapes(product: Product) {
  const legacyShapes = product.tabletopShapes ?? [];
  const structuredShapes = product.dataQuality?.verifiedFields.includes("specifications.table.tabletopShape")
    ? product.specifications?.table?.tabletopShape ?? []
    : [];
  return [...new Set([...legacyShapes, ...structuredShapes])];
}

function verifiedBedTypes(product: Product) {
  const types = new Set<NonNullable<AlternativeRequest["bedTypes"]>[number]>();
  if (product.dataQuality?.verifiedFields.includes("specifications.bed.bedType")) {
    for (const type of product.specifications?.bed?.bedType ?? []) types.add(type);
  }
  if (product.dataQuality?.verifiedFields.includes("productSubtypes")) {
    for (const type of product.productSubtypes ?? []) {
      if (["bed-frame", "upholstered-bed", "boxspring-bed", "sofa-bed", "mattress", "slatted-base"].includes(type)) {
        types.add(type as NonNullable<AlternativeRequest["bedTypes"]>[number]);
      }
    }
  }
  return [...types];
}

export function materialMatchesNeeds(material: Material, needs: MaterialAdvice["needs"]) {
  if (needs.easyCareRequired && material.easyCare !== true) return false;
  if (needs.children && material.familyFriendly !== true) return false;
  if (needs.pets && material.petFriendly !== true) return false;
  if (needs.highUse && material.durability == null) return false;
  if (needs.strongSunlight && material.lightSensitivity !== "low") return false;
  if (needs.preferredColors?.length && !needs.preferredColors.includes(material.colorFamily)) return false;
  if (needs.preferredMaterialGroups?.length && !needs.preferredMaterialGroups.includes(material.type)) return false;
  if (needs.avoidMaterialGroups?.includes(material.type)) return false;
  return true;
}

const materialQueryStopWords = new Set(["the", "and", "for", "with", "that", "this", "from", "material", "materials", "something", "want", "need", "looking", "show", "find"]);

export function materialMetadataMatches(requestText: string) {
  const tokens = requestText.toLowerCase().match(/[a-z0-9]+/g)?.filter((token) => token.length > 2 && !materialQueryStopWords.has(token)) ?? [];
  if (!tokens.length) return [];
  return materials.filter((material) => {
    const attributeLabels = [
      material.easyCare === true ? "easy care easy to clean easy to wash washable" : material.easyCare === false ? "specialist care" : "care performance unverified",
      material.petFriendly === true ? "pet friendly pets dog cat" : material.petFriendly === false ? "not pet friendly" : "pet suitability unverified",
      material.familyFriendly === true ? "family friendly children kids" : material.familyFriendly === false ? "not family friendly" : "family suitability unverified",
      material.lightSensitivity === "unknown" ? "light sensitivity unverified" : `${material.lightSensitivity} light sensitivity`
    ];
    const corpus = [material.name, material.type, material.colorFamily, material.texture, material.composition, material.care, material.maintenance, ...material.cleaningMethods, ...material.recommendedUses, ...material.cautions, ...attributeLabels].join(" ").toLowerCase();
    return tokens.every((token) => corpus.includes(token));
  }).map((material) => material.id);
}

export function isUnsupportedMaterialComfortQuestion(requestText: string) {
  return /\b(?:seat(?:ing)?\s+)?comfort\b/i.test(requestText);
}

export type MaterialGuidanceItem = {
  key: "pets" | "children" | "cleaning" | "sunlight" | "comfort" | "durability";
  title: string;
  answer: string;
};

/**
 * Customer-facing guidance for the advisor's supported question set. These
 * statements deliberately describe only the connected catalogue metadata and
 * Musterring's recorded category-level care guidance; they never turn general
 * material advice into an exact-cover performance claim.
 */
export function materialGuidance(requestText: string, advice: MaterialAdvice): MaterialGuidanceItem[] {
  const text = requestText.toLowerCase();
  const items: MaterialGuidanceItem[] = [];
  const hasPetMatch = advice.recommendedMaterialIds.some((id) => materials.find((material) => material.id === id)?.petFriendly === true);
  const hasFamilyMatch = advice.recommendedMaterialIds.some((id) => materials.find((material) => material.id === id)?.familyFriendly === true);
  const hasSunlightMatch = advice.recommendedMaterialIds.some((id) => materials.find((material) => material.id === id)?.lightSensitivity === "low");
  const hasDurabilityMatch = advice.recommendedMaterialIds.some((id) => materials.find((material) => material.id === id)?.durability != null);

  if (advice.needs.pets) items.push({
    key: "pets",
    title: "For homes with pets",
    answer: hasPetMatch
      ? "The matches below are marked pet-suitable in the illustrative planning profiles. Confirm the exact cover specification before ordering and vacuum loose hair with the care method provided for that cover."
      : "Pet suitability is not recorded for the connected swatches, so no specific cover can be recommended yet. Ask the retailer to confirm the exact cover's cleanability and pet-use guidance; pet damage is not covered by Musterring's guarantee."
  });
  if (advice.needs.children) items.push({
    key: "children",
    title: "For families with children",
    answer: hasFamilyMatch
      ? "The matches below are marked family-suitable in the illustrative planning profiles. Check the exact cover's cleaning instructions before ordering."
      : "Family suitability is not recorded for the connected swatches. Compare exact-cover cleaning instructions and verified durability data with a retailer before choosing."
  });
  if (advice.needs.easyCareRequired) items.push({
    key: "cleaning",
    title: "For easier cleaning and maintenance",
    answer: advice.recommendedMaterialIds.length
      ? "The planning matches below are profiled for lower-maintenance use. This means easier care, not machine washability: confirm the exact cover care code before spot cleaning or washing any removable cover."
      : "No connected swatch has enough easy-care evidence for this request. Follow the exact cover's care code; for fabrics, Musterring recommends regular low-power vacuuming with an upholstery nozzle."
  });
  if (advice.needs.strongSunlight) items.push({
    key: "sunlight",
    title: "For rooms with direct sunlight",
    answer: hasSunlightMatch
      ? "The planning matches below have low light sensitivity in the illustrative profile. Even so, reduce prolonged direct exposure and confirm the exact cover's lightfastness specification."
      : "No connected swatch has verified low light sensitivity. The leather profiles are recorded as highly light-sensitive, and Musterring advises keeping leather furniture out of direct sunlight and UV light."
  });
  if (isUnsupportedMaterialComfortQuestion(requestText)) items.push({
    key: "comfort",
    title: "How upholstery affects seat comfort",
    answer: "The cover changes the surface feel, warmth and how the upholstery drapes, but the connected material records do not measure seating comfort. Compare the product's padding construction and comfort option, then use a physical swatch to judge the cover feel."
  });
  if (/\b(?:durab(?:le|ility)|everyday use|daily use|high use)\b/.test(text) || advice.needs.highUse) items.push({
    key: "durability",
    title: "For durable everyday use",
    answer: hasDurabilityMatch
      ? "The matches below have the highest durability score in the illustrative planning profiles. Confirm the exact cover's abrasion, pilling and lightfastness results before ordering."
      : "The connected swatches do not include verified durability ratings. Ask the retailer for the exact cover's abrasion, pilling and lightfastness test results before ranking materials for everyday use."
  });

  return items;
}

function requestedTargetWidthMm(text: string) {
  const match =
    text.match(/\b(?:around|about|approximately|approx\.?|roughly)\s*(\d{2,3})\s*cm(?:\s+(?:wide|width))?\b/) ??
    text.match(/\b(\d{2,3})\s*cm\s*(?:wide|width|sofas?|couches?)\b/) ??
    text.match(/\b(?:sofas?|couches?)\b.{0,24}\b(\d{2,3})\s*cm\b/);
  return match ? Number(match[1]) * 10 : undefined;
}

function requestedAlternative(input: AlternativeRequest, source: Product) {
  const text = input.requestText?.toLowerCase() ?? "";
  const search = parseSearchQuery(input.requestText ?? "");
  const excludedLayoutShapes = extractExcludedLayoutShapes(input.requestText ?? "");
  const requestedLayoutShapes = (search.layoutShapes ?? input.layoutShapes ?? []).filter((shape) => !excludedLayoutShapes.includes(shape));
  const parsedTabletopShapes = extractTabletopShapes(input.requestText ?? "");
  const bedRequirements = extractBedAlternativeRequirements(input.requestText ?? "");
  const easyCareRequested = /\b(?:easy|easier|easiest)[- ](?:care|clean)|easy to (?:care for|clean)|low[- ]maintenance\b/.test(text);
  const narrower = text.match(/(\d{1,3})\s*cm\s*narrower/);
  const parsedWidth = search.minWidthMm !== undefined || search.maxWidthMm !== undefined || search.targetWidthMm !== undefined;
  const targetWidthMm = !narrower && !parsedWidth ? requestedTargetWidthMm(text) : search.targetWidthMm;
  const explicitlyRequestedCategory = search.category ?? input.category;
  const category = explicitlyRequestedCategory && productSupportsAlternativeCategory(source, explicitlyRequestedCategory)
    ? explicitlyRequestedCategory
    : source.category;
  return alternativeRequestSchema.parse({
    ...input,
    // "Discover more like this" is scoped to the product being viewed. A
    // request may refine that category, but it must never switch the panel to
    // sofas, beds or another unrelated catalogue category.
    category,
    colorFamilies: [...new Set([...(input.colorFamilies ?? []), ...(search.colors ?? [])].map((value) => value.toLowerCase()))],
    styles: [...new Set([...(input.styles ?? []), ...(search.styles ?? [])].map((value) => value.toLowerCase()))],
    layoutShapes: requestedLayoutShapes.length ? requestedLayoutShapes : undefined,
    excludedLayoutShapes: [...new Set([...(input.excludedLayoutShapes ?? []), ...excludedLayoutShapes])],
    tabletopShapes: input.tabletopShapes ?? (parsedTabletopShapes.length ? parsedTabletopShapes : undefined),
    numberOfSeats: search.seatCount ?? input.numberOfSeats,
    maxWidthMm: narrower ? source.widthMm - Number(narrower[1]) * 10 : parsedWidth ? search.maxWidthMm : input.maxWidthMm ?? (/\b(?:smaller|more compact|narrower)\b/.test(text) ? source.widthMm - 10 : undefined),
    minWidthMm: parsedWidth ? search.minWidthMm : input.minWidthMm,
    targetWidthMm: parsedWidth ? targetWidthMm : input.targetWidthMm ?? targetWidthMm,
    bedTypes: input.bedTypes ?? bedRequirements.bedTypes,
    bedSleepingWidthMm: input.bedSleepingWidthMm ?? bedRequirements.bedSleepingWidthMm,
    bedSleepingLengthMm: input.bedSleepingLengthMm ?? bedRequirements.bedSleepingLengthMm,
    bedStorage: input.bedStorage ?? bedRequirements.bedStorage,
    bedMotorised: input.bedMotorised ?? bedRequirements.bedMotorised,
    minSeatHeightMm: input.minSeatHeightMm ?? (/higher seat|high[- ]seat|tall/.test(text) ? source.seatHeightMm + 10 : undefined),
    requiredFunctions: [...new Set([
      ...(category === "bed" && bedRequirements.bedMotorised
        ? (input.requiredFunctions ?? []).filter((value) => value !== "electric")
        : input.requiredFunctions ?? []),
      ...(/\b(?:relax|recline|lounge)\b/.test(text) ? ["relax"] : []),
      ...(category !== "bed" && /\b(?:electric|motor(?:ized|ised)?|power)\b/.test(text) ? ["electric"] : []),
      ...(/\b(?:modular|module|flexible)\b/.test(text) ? ["modular"] : [])
    ])],
    excludedFunctions: [...new Set([...(input.excludedFunctions ?? []), ...(/without electric|non-electric|no electric/.test(text) ? ["electric"] : [])])],
    materialTags: [...new Set([...(input.materialTags ?? []), ...(/\bleather\b/.test(text) ? ["leather"] : []), ...(/\b(?:fabric|textile|boucle|chenille|velvet)\b/.test(text) ? ["fabric"] : []), ...(easyCareRequested || /children|family[- ]friendly|family household|pets?|dog/.test(text) ? ["easy-care"] : [])])],
    preserveStyle: input.preserveStyle ?? /same style|similar style/.test(text),
    preserveComfort: input.preserveComfort ?? /same comfort/.test(text)
  });
}

function hasFunction(product: Product, value: string) {
  if (value === "modular") return product.verifiedFacts.modular && product.modular;
  return product.verifiedFacts.functions.some((item) => item.toLowerCase().includes(value.toLowerCase()));
}

function functionMatch(product: Product, value: string) {
  if (hasFunction(product, value)) return { ok: true, demo: false };
  const functions = demoFactsFor(product.id)?.functions ?? [];
  const ok = functions.some((item) => item.toLowerCase().includes(value.toLowerCase()));
  return { ok, demo: ok };
}

function hasMaterialTag(product: Product, tag: string) {
  if (tag === "easy-care" || tag === "family" || tag === "pet") return product.verifiedFacts.easyCare;
  return product.verifiedFacts.materialTypes.includes(tag as "fabric" | "leather");
}

function materialTagMatch(product: Product, tag: string) {
  if (hasMaterialTag(product, tag)) return { ok: true, demo: false };
  const demo = demoFactsFor(product.id);
  const ok = tag === "easy-care" || tag === "family" || tag === "pet"
    ? demo?.easyCare === true
    : demo?.materialTypes?.includes(tag as "fabric" | "leather") ?? false;
  return { ok, demo: ok };
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
  if (available.some((color) => color === requested || color.split(/[^a-z]+/).includes(requested))) return 1;
  const group = relatedColourGroups.find((values) => values.includes(requested));
  return group && available.some((color) => group.includes(color)) ? 0.55 : 0;
}

function hasVerifiedColour(product: Product, requested: string) {
  return product.verifiedFacts.colors.some((color) => color === requested || color.split(/[^a-z]+/).includes(requested));
}

function softPreferenceTokens(text: string) {
  const ignored = new Set([
    "this", "that", "with", "from", "like", "need", "want", "find", "show", "product", "option", "alternative",
    "sofa", "couch", "chair", "armchair", "sectional", "table", "smaller", "higher", "lower", "same", "similar",
    "function", "functions", "relax", "recline", "electric", "modular", "design", "seat", "seating", "upright",
    "easy", "care", "material",
    ...searchColorTerms
  ]);
  return [...new Set(text.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 3 && !ignored.has(token)))];
}

export function findGroundedAlternatives(raw: AlternativeRequest, preferredProductIds: string[] = []): AlternativeResponse {
  const source = products.find((product) => product.id === raw.sourceProductId && product.active);
  if (!source) throw new Error("Unknown source Product ID.");
  const request = requestedAlternative(raw, source);
  const requestedCategory = request.category ?? source.category;
  const candidates = products.filter((product) => product.active && product.id !== source.id && productSupportsAlternativeCategory(product, requestedCategory));
  const preferenceTokens = softPreferenceTokens(request.requestText ?? "");
  const preferredOrder = new Map([...new Set(preferredProductIds)].map((id, index) => [id, index]));
  const ranked = candidates.map((product) => {
    const demo = demoFactsFor(product.id);
    const checks: Array<{ ok: boolean; label: string; closeness: number; demoFact?: string }> = [];
    for (const value of request.colorFamilies ?? []) {
      const closeness = colourCloseness(value, product.verifiedFacts.colors);
      const verified = hasVerifiedColour(product, value);
      const hasMatchingPresentation = verified && hasVerifiedColourPresentation(product.id, value);
      const demoColor = demo?.colors?.some((color) => color === value || color.split(/[^a-z]+/).includes(value)) ?? false;
      const hasDemoPresentation = !hasMatchingPresentation && demoColor && hasDemoColourPresentation(product.id, value);
      checks.push({
        ok: verified || hasDemoPresentation,
        label: hasMatchingPresentation
          ? `verified in ${value}`
          : verified
            ? `verified available in ${value}`
          : hasDemoPresentation
            ? `illustrative ${value} presentation`
            : `${value} colour is not verified for this product`,
        closeness: verified || hasDemoPresentation ? 1 : closeness,
        demoFact: hasDemoPresentation ? `${value} colour presentation` : undefined
      });
    }
    for (const value of request.styles ?? []) {
      const exact = product.verifiedFacts.styles.some((style) => style.toLowerCase().includes(value));
      const related = product.verifiedFacts.styles.some((style) => style.toLowerCase().split(/\s+/).some((term) => value.includes(term)));
      const demoExact = !exact && (demo?.styles?.some((style) => style.toLowerCase().includes(value)) ?? false);
      checks.push({
        ok: exact || demoExact,
        label: exact || demoExact ? `matches ${value} style` : `${value} style is not verified for this product`,
        closeness: exact || demoExact ? 1 : related ? 0.5 : 0,
        demoFact: demoExact ? `${value} style` : undefined
      });
    }
    if (request.numberOfSeats) {
      const seatCount = product.numberOfSeatsVerified ? product.numberOfSeats : demo?.numberOfSeats;
      const difference = seatCount === undefined ? request.numberOfSeats : Math.abs(seatCount - request.numberOfSeats);
      checks.push({
        ok: seatCount !== undefined && difference === 0,
        label: seatCount !== undefined ? `must have ${request.numberOfSeats} seats` : "seat count is not verified in the connected catalogue",
        closeness: seatCount !== undefined ? clampScore(1 - difference / Math.max(2, request.numberOfSeats)) : 0,
        demoFact: !product.numberOfSeatsVerified && seatCount !== undefined ? `${request.numberOfSeats}-seat configuration` : undefined
      });
    }
    if (request.maxWidthMm) {
      const width = product.verifiedFacts.dimensions ? product.widthMm : demo?.widthMm;
      const excess = width === undefined ? request.maxWidthMm : Math.max(0, width - request.maxWidthMm);
      checks.push({ ok: width !== undefined && excess === 0, label: width !== undefined ? `width must be at most ${Math.round(request.maxWidthMm / 10)} cm` : "width is not verified in the connected catalogue", closeness: width !== undefined ? clampScore(1 - excess / Math.max(500, request.maxWidthMm * 0.35)) : 0, demoFact: !product.verifiedFacts.dimensions && width !== undefined ? `width is not verified in the connected catalogue; illustrative value ${Math.round(width / 10)} cm` : undefined });
    }
    if (request.minWidthMm) {
      const width = product.verifiedFacts.dimensions ? product.widthMm : demo?.widthMm;
      const deficit = width === undefined ? request.minWidthMm : Math.max(0, request.minWidthMm - width);
      checks.push({ ok: width !== undefined && deficit === 0, label: width !== undefined ? `width must be at least ${Math.round(request.minWidthMm / 10)} cm` : "width is not verified in the connected catalogue", closeness: width !== undefined ? clampScore(1 - deficit / Math.max(500, request.minWidthMm * 0.35)) : 0, demoFact: !product.verifiedFacts.dimensions && width !== undefined ? `width is not verified in the connected catalogue; illustrative value ${Math.round(width / 10)} cm` : undefined });
    }
    if (request.targetWidthMm) {
      const width = product.verifiedFacts.dimensions ? product.widthMm : demo?.widthMm;
      const difference = width === undefined ? request.targetWidthMm : Math.abs(width - request.targetWidthMm);
      const tolerance = Math.max(100, Math.round(request.targetWidthMm * 0.03));
      checks.push({
        ok: width !== undefined && difference <= tolerance,
        label: width !== undefined ? `width should be around ${Math.round(request.targetWidthMm / 10)} cm` : "width is not verified in the connected catalogue",
        closeness: width !== undefined ? clampScore(1 - difference / Math.max(500, request.targetWidthMm * 0.25)) : 0,
        demoFact: !product.verifiedFacts.dimensions && width !== undefined ? `width is not verified in the connected catalogue; illustrative value ${Math.round(width / 10)} cm` : undefined
      });
    }
    if (request.minSeatHeightMm) {
      const seatHeight = product.verifiedFacts.seatHeight ? product.seatHeightMm : demo?.seatHeightMm;
      const deficit = seatHeight === undefined ? request.minSeatHeightMm : Math.max(0, request.minSeatHeightMm - seatHeight);
      checks.push({ ok: seatHeight !== undefined && deficit === 0, label: seatHeight !== undefined ? `seat height must be at least ${request.minSeatHeightMm} mm` : "seat height is not verified in the connected catalogue", closeness: seatHeight !== undefined ? clampScore(1 - deficit / 120) : 0, demoFact: !product.verifiedFacts.seatHeight && seatHeight !== undefined ? `illustrative ${Math.round(seatHeight / 10)} cm seat height` : undefined });
    }
    for (const value of request.layoutShapes ?? []) {
      const verifiedShape = product.layoutShapes?.includes(value) ?? false;
      const demoShape = !verifiedShape && (demo?.layoutShapes?.includes(value) ?? false);
      checks.push({ ok: verifiedShape || demoShape, label: `requires ${value} layout`, closeness: verifiedShape || demoShape ? 1 : 0, demoFact: demoShape ? `${value} layout` : undefined });
    }
    for (const value of request.excludedLayoutShapes ?? []) {
      const verifiedLayouts = product.layoutShapes ?? [];
      const hasVerifiedLayout = verifiedLayouts.length > 0;
      const hasExcludedLayout = verifiedLayouts.includes(value);
      checks.push({
        ok: hasVerifiedLayout && !hasExcludedLayout,
        label: hasExcludedLayout ? `must not use ${value} layout` : `a non-${value} layout is not verified for this product`,
        closeness: hasVerifiedLayout && !hasExcludedLayout ? 1 : 0
      });
    }
    for (const value of request.tabletopShapes ?? []) {
      const verifiedShapes = verifiedTabletopShapes(product);
      const matchesShape = verifiedShapes.includes(value);
      checks.push({
        ok: matchesShape,
        label: matchesShape ? `verified ${value} tabletop` : `${value} tabletop shape is not verified for this product`,
        closeness: matchesShape ? 1 : 0
      });
    }
    for (const value of request.bedTypes ?? []) {
      const types = verifiedBedTypes(product);
      const matchesType = types.includes(value);
      checks.push({
        ok: matchesType,
        label: matchesType ? `verified ${value.replace(/-/g, " ")}` : `${value.replace(/-/g, " ")} type is not verified for this product`,
        closeness: matchesType ? 1 : 0
      });
    }
    if (request.bedSleepingWidthMm && request.bedSleepingLengthMm) {
      const sizesVerified = product.dataQuality?.verifiedFields.includes("specifications.bed.sleepingSizes") === true;
      const matchesSize = sizesVerified && (product.specifications?.bed?.sleepingSizes ?? []).some((size) =>
        size.widthMm === request.bedSleepingWidthMm && size.lengthMm === request.bedSleepingLengthMm
      );
      checks.push({
        ok: matchesSize,
        label: matchesSize
          ? `verified ${request.bedSleepingWidthMm / 10} × ${request.bedSleepingLengthMm / 10} cm sleeping size`
          : `${request.bedSleepingWidthMm / 10} × ${request.bedSleepingLengthMm / 10} cm sleeping size is not verified for this product`,
        closeness: matchesSize ? 1 : 0
      });
    }
    if (request.bedStorage !== undefined) {
      const bedStorageVerified = product.dataQuality?.verifiedFields.includes("specifications.bed.bedStorage") === true;
      const underBedStorageVerified = product.dataQuality?.verifiedFields.includes("specifications.bed.underBedStorage") === true;
      const hasVerifiedStorageValue = bedStorageVerified || underBedStorageVerified;
      const hasStorage = (bedStorageVerified && product.specifications?.bed?.bedStorage === true)
        || (underBedStorageVerified && product.specifications?.bed?.underBedStorage === true);
      const matchesStorage = hasVerifiedStorageValue && hasStorage === request.bedStorage;
      checks.push({
        ok: matchesStorage,
        label: matchesStorage
          ? request.bedStorage ? "verified bed storage" : "verified without bed storage"
          : request.bedStorage ? "bed storage is not verified for this product" : "storage-free configuration is not verified for this product",
        closeness: matchesStorage ? 1 : 0
      });
    }
    if (request.bedMotorised !== undefined) {
      const motorisedVerified = product.dataQuality?.verifiedFields.includes("specifications.bed.motorised") === true;
      const matchesMotorised = motorisedVerified && product.specifications?.bed?.motorised === request.bedMotorised;
      checks.push({
        ok: matchesMotorised,
        label: matchesMotorised
          ? request.bedMotorised ? "verified motorised bed adjustment" : "verified without motorised bed adjustment"
          : request.bedMotorised ? "motorised bed adjustment is not verified for this product" : "non-motorised adjustment is not verified for this product",
        closeness: matchesMotorised ? 1 : 0
      });
    }
    for (const value of request.requiredFunctions ?? []) {
      const match = functionMatch(product, value);
      checks.push({ ok: match.ok, label: `requires ${value}`, closeness: match.ok ? 1 : 0, demoFact: match.demo ? `${value} function` : undefined });
    }
    for (const value of request.excludedFunctions ?? []) {
      const match = functionMatch(product, value);
      checks.push({ ok: !match.ok, label: `must not include ${value}`, closeness: !match.ok ? 1 : 0 });
    }
    for (const value of request.materialTags ?? []) {
      const match = materialTagMatch(product, value);
      checks.push({ ok: match.ok, label: `requires ${value} material metadata`, closeness: match.ok ? 1 : 0, demoFact: match.demo ? `${value} material` : undefined });
    }
    if (request.preserveStyle) {
      const overlap = source.verifiedFacts.styles.filter((style) => product.verifiedFacts.styles.includes(style)).length;
      checks.push({ ok: overlap > 0, label: "style is not verified as equivalent", closeness: clampScore(overlap / Math.max(1, source.verifiedFacts.styles.length)) });
    }
    if (request.preserveComfort) {
      const overlap = source.verifiedFacts.comfort && product.verifiedFacts.comfort ? source.comfortOptions.filter((option) => product.comfortOptions.includes(option)).length : 0;
      checks.push({ ok: overlap > 0, label: "comfort equivalence is not verified", closeness: clampScore(overlap / Math.max(1, source.comfortOptions.length)) });
    }
    const demoFactsUsed = [...new Set(checks.filter((check) => check.demoFact).map((check) => check.demoFact!))];
    const unmet = [
      ...checks.filter((check) => !check.ok).map((check) => check.label),
      ...demoFactsUsed.map((fact) => `${fact} uses illustrative concept data and requires retailer confirmation`)
    ];
    const productCopy = [product.name, product.subtitle, product.description].join(" ").toLowerCase();
    const keywordMatches = preferenceTokens.filter((token) => productCopy.includes(token));
    const requestReasons = [
      `same ${requestedCategory.replace(/-/g, " ")} category`,
      ...((request.colorFamilies ?? []).filter((color) => hasVerifiedColour(product, color)).map((color) =>
        hasVerifiedColourPresentation(product.id, color) ? `verified in ${color}` : `available in ${color}`
      )),
      ...((request.colorFamilies ?? []).flatMap((color) => {
        if (hasVerifiedColour(product, color) || colourCloseness(color, product.verifiedFacts.colors) === 0) return [];
        const group = relatedColourGroups.find((values) => values.includes(color));
        const related = product.verifiedFacts.colors.find((available) => group?.includes(available));
        return related ? [`related recorded colour: ${related}`] : [];
      })),
      ...(request.numberOfSeats && product.numberOfSeatsVerified ? [`${product.numberOfSeats} verified seats`] : []),
      ...checks.filter((check) => check.ok && /requires|matches|preserve/.test(check.label)).map((check) => check.label.replace(/^requires /, "includes ")),
      ...keywordMatches.slice(0, 2).map((token) => `catalogue description matches “${token}”`)
    ];
    const benefits = [
      ...((request.colorFamilies ?? []).filter((color) => hasVerifiedColour(product, color)).map((color) =>
        hasVerifiedColourPresentation(product.id, color) ? `verified in ${color}` : `available in ${color}`
      )),
      ...((request.styles ?? []).filter((style) => product.verifiedFacts.styles.some((productStyle) => productStyle.toLowerCase().includes(style))).map((style) => `${style} style`))
    ];
    const tradeOffs = [
      ...(product.numberOfSeatsVerified && source.numberOfSeatsVerified && product.numberOfSeats < source.numberOfSeats ? [`one fewer seat than ${source.modelCode}`] : []),
      ...(!product.modular && source.modular ? ["less modular flexibility"] : [])
    ];
    return {
      product,
      exact: unmet.length === 0,
      failedRequirementCount: checks.filter((check) => !check.ok).length,
      unmet,
      score: checks.filter((check) => check.ok).length * 100
        + checks.reduce((total, check) => total + check.closeness * 50, 0)
        + (request.colorFamilies ?? []).filter((color) => hasVerifiedColourPresentation(product.id, color)).length * 30
        - unmet.length * 25
        + keywordMatches.length * 12
        + (preferredOrder.has(product.id) ? 60 - Math.min(preferredOrder.get(product.id) ?? 0, 10) * 4 : 0)
        - Math.abs(product.widthMm - (request.targetWidthMm ?? source.widthMm)) / 1000,
      differences: [],
      benefits: [...new Set([...benefits, ...requestReasons])],
      tradeOffs,
      demoFactsUsed
    };
  }).sort((left, right) =>
    Number(right.exact) - Number(left.exact) ||
    left.failedRequirementCount - right.failedRequirementCount ||
    right.score - left.score
  );
  const toMatch = (item: typeof ranked[number]) => ({
    productId: item.product.id,
    exact: item.exact,
    differences: item.differences,
    benefits: item.benefits.length ? item.benefits : ["similar catalogue category and product character"],
    tradeOffs: item.tradeOffs.length ? item.tradeOffs : ["No additional trade-off is established in the connected data."],
    unmetRequirements: item.unmet,
    demoFactsUsed: item.demoFactsUsed,
    explanation: item.exact
      ? `${item.product.modelCode} satisfies all selected requirements using available catalogue and material data.`
      : item.demoFactsUsed.length && item.unmet.every((requirement) => requirement.includes("illustrative concept data"))
        ? `${item.product.modelCode} is a concept match using illustrative attributes that require retailer confirmation.`
      : `${item.product.modelCode} is a close alternative, but ${item.unmet.join("; ")}.`
  });
  const uniqueProductPrograms = (items: typeof ranked) => {
    const seen = new Set<string>();
    return items.filter((item) => {
      const productGroupId = item.product.entityLevel === "variant" ? item.product.productGroupId ?? item.product.id : item.product.id;
      if (seen.has(productGroupId)) return false;
      seen.add(productGroupId);
      return true;
    });
  };
  const exactRanked = uniqueProductPrograms(ranked.filter((item) => item.exact));
  const exactProductGroups = new Set(exactRanked.map((item) => item.product.entityLevel === "variant" ? item.product.productGroupId ?? item.product.id : item.product.id));
  const exactMatches = exactRanked.slice(0, 6).map(toMatch);
  // Exact requirements determine the exact-match bucket. The best remaining
  // same-category products are still useful recommendations when they are
  // clearly labelled with every unmet requirement (for example, an unverified
  // requested colour). Keep this group deliberately small and ranked.
  // When the requested tabletop shape is unavailable, keep the best
  // same-category products visible as clearly labelled alternatives. This is
  // more useful than an empty result and the unmet shape remains explicit.
  const closestAlternatives = request.strict
    ? []
    : uniqueProductPrograms(ranked.filter((item) => !item.exact && !exactProductGroups.has(item.product.entityLevel === "variant" ? item.product.productGroupId ?? item.product.id : item.product.id))).slice(0, 3).map(toMatch);
  const interpretedRequirements = [
    ...(request.category ? [request.category.replace(/-/g, " ")] : []),
    ...(request.colorFamilies ?? []).map((value) => `${value} colour`),
    ...(request.styles ?? []).map((value) => `${value} style`),
    ...(request.numberOfSeats ? [`${request.numberOfSeats} seats`] : []),
    ...(request.maxWidthMm ? [`maximum ${Math.round(request.maxWidthMm / 10)} cm wide`] : []),
    ...(request.minWidthMm ? [`minimum ${Math.round(request.minWidthMm / 10)} cm wide`] : []),
    ...(request.targetWidthMm ? [`around ${Math.round(request.targetWidthMm / 10)} cm wide`] : []),
    ...(request.bedTypes ?? []).map((value) => value.replace(/-/g, " ")),
    ...(request.bedSleepingWidthMm && request.bedSleepingLengthMm ? [`${request.bedSleepingWidthMm / 10} × ${request.bedSleepingLengthMm / 10} cm sleeping size`] : []),
    ...(request.bedStorage === true ? ["bed storage"] : request.bedStorage === false ? ["without bed storage"] : []),
    ...(request.bedMotorised === true ? ["motorised bed adjustment"] : request.bedMotorised === false ? ["without motorised bed adjustment"] : []),
    ...(request.layoutShapes ?? []).map((value) => `${value} layout`),
    ...(request.excludedLayoutShapes ?? []).map((value) => `not ${value} layout`),
    ...(request.tabletopShapes ?? []).map((value) => `${value} tabletop`),
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
    message: exactMatches.length
      ? `${exactMatches.length} catalogue alternative${exactMatches.length === 1 ? " satisfies" : "s satisfy"} all requirements.`
      : closestAlternatives.length
        ? "No exact alternative was found. The closest catalogue alternatives show their main differences."
        : "No exact alternative was found in the connected catalogue."
  });
}

export function parseMaterialNeeds(textValue: string): MaterialAdvice {
  const text = textValue.toLowerCase();
  const preferredColors = colors.filter((color) => text.includes(color));
  const preferredMaterialGroups = ["leather", "fabric"].filter((group) => text.includes(group));
  const avoidMaterialGroups = (text.match(/(?:avoid|without|no)\s+(leather|fabric)/)?.[1] ? [text.match(/(?:avoid|without|no)\s+(leather|fabric)/)![1]] : []);
  const highestDurabilityRequired = /\b(?:most durable|highest durability|maximum durability|best durability)\b/.test(text);
  const highestVerifiedDurability = Math.max(...materials.map((material) => material.durability ?? 0));
  const needs = {
    children: /children|child|kids?|kinder|family/.test(text),
    pets: /pets?|dog|cat|hund|katze/.test(text),
    highUse: /high use|everyday|daily|busy|frequent/.test(text),
    strongSunlight: /strong (?:afternoon )?sunlight|direct sun|sunny/.test(text),
    easyCareRequired: /\b(?:easy|easier|easiest)(?:\s+to)?\s+(?:care(?:\s+for)?|clean|wash|maintain)|\beasy[- ]care\b|\bwashable\b|\bstain(?:s|ed|ing)?\b/.test(text),
    preferredColors: preferredColors.length ? preferredColors : undefined,
    preferredMaterialGroups: preferredMaterialGroups.length ? preferredMaterialGroups : undefined,
    avoidMaterialGroups: avoidMaterialGroups.length ? avoidMaterialGroups : undefined
  };
  const scored = materials.map((material) => {
    let score = 0;
    if (needs.children) score += material.familyFriendly === true ? 4 : -4;
    if (needs.pets) score += material.petFriendly === true ? 4 : -4;
    if (needs.highUse) score += material.durability ?? 0;
    if (needs.easyCareRequired) score += material.easyCare === true ? 4 : -3;
    if (needs.strongSunlight) score += material.lightSensitivity === "low" ? 4 : material.lightSensitivity === "medium" ? 0 : -5;
    if (preferredColors.includes(material.colorFamily)) score += 3;
    if (preferredMaterialGroups.includes(material.type)) score += 3;
    if (avoidMaterialGroups.includes(material.type)) score -= 20;
    return { material, score };
  }).sort((left, right) => right.score - left.score);
  const scoredMaterialIds = scored
    .filter(({ material, score }) => score >= 3 && materialMatchesNeeds(material, needs) && (!highestDurabilityRequired || (highestVerifiedDurability > 0 && material.durability === highestVerifiedDurability)))
    .map(({ material }) => material.id);
  const hasStructuredNeed = Boolean(needs.children || needs.pets || needs.highUse || needs.strongSunlight || needs.easyCareRequired || preferredColors.length || preferredMaterialGroups.length || avoidMaterialGroups.length);
  const recommendedMaterialIds = hasStructuredNeed ? scoredMaterialIds : materialMetadataMatches(textValue);
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
    ...(advice.needs.children && material.familyFriendly === true ? ["family-suitable planning profile"] : []),
    ...(advice.needs.pets && material.petFriendly === true ? ["pet-suitable planning profile"] : []),
    ...(advice.needs.easyCareRequired && material.easyCare === true ? ["lower-maintenance planning profile"] : []),
    ...(advice.needs.strongSunlight && material.lightSensitivity === "low" ? ["low light-sensitivity planning profile"] : []),
    ...(material.durability != null ? [`durability planning score ${material.durability}/5`] : []),
    ...(!advice.needs.children && !advice.needs.pets && !advice.needs.easyCareRequired && !advice.needs.strongSunlight ? [`recorded ${material.type} category`] : [])
  ];
  const cautions = [
    ...(advice.needs.strongSunlight && material.lightSensitivity !== "low" ? [`${material.lightSensitivity} light sensitivity`] : []),
    ...(advice.needs.pets && material.petFriendly !== true ? ["pet suitability is unverified"] : []),
    ...(advice.needs.children && material.familyFriendly !== true ? ["family suitability is unverified"] : []),
    ...(material.easyCare === false ? ["more involved care"] : material.easyCare == null ? ["care performance is unverified"] : [])
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

const productDiscoveryPattern = /\b(sofa|couch|armchair|chair|recliner|sectional|table|storage|cabinet|sideboard|wardrobe|bed|mattress|topper|bathroom|kitchen|hallway|outdoor|garden|carpet|rug|lamp|textile|bedding|furniture)\b/;

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
    (!requestedMaterial || product.verifiedFacts.materialTypes.includes(requestedMaterial)) &&
    (!wantsEasyCare || product.verifiedFacts.easyCare)
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
          .filter((product) => product.active && productHasCategory(product, exact[0].category) && !exactIds.includes(product.id))
          .sort((left, right) => (rankOrder.get(left.id) ?? 9999) - (rankOrder.get(right.id) ?? 9999))
          .slice(0, 2)
      : [];
    const ids = [...exactIds, ...comparisonAlternatives.map((product) => product.id)];
    const comparisonNote = comparisonAlternatives.length
      ? ` ${exactIds.length === 1 ? "One product is an exact match" : `${exactIds.length} products are exact matches`}; the additional products are clearly labelled comparison alternatives and may not satisfy every filter.`
      : "";
    const needsBrief = requested.length === 1 && Boolean(filters.category) && !namedProduct;
    return advisorAnswerSchema.parse({
      answer: needsBrief
        ? `I found ${exact.length} catalogue match${exact.length === 1 ? "" : "es"} for ${requested[0]}. To make this feel personal rather than generic, tell me the room width or maximum furniture width, who will use it, and any must-have comfort or material preference.${comparisonNote}`
        : `I found ${exact.length} exact catalogue match${exact.length === 1 ? "" : "es"}${requested.length ? ` for ${requested.join(", ")}` : ""}.${comparisonNote || " Every shown product satisfies the interpreted hard filters in the connected data."}`,
      answerType: "products", productIds: ids, materialIds: [], sources: ["Musterring product catalogue", ...(requestedMaterial || wantsEasyCare ? ["Musterring concept material metadata"] : [])],
      proposedAction: wantsComparison && ids.length > 1 ? { type: "COMPARE_PRODUCTS", label: comparisonAlternatives.length ? "Compare match with alternatives" : "Compare the exact matches", parameters: { productIds: ids.slice(0, 3) }, requiresConfirmation: false } : null,
      suggestedQuestions: needsBrief
        ? ["My maximum width is 260 cm", "It is for a family with children or pets", "I prefer an upright, supportive seat"]
        : ids.length > 1 ? ["Which one is most compact?", "Compare the first three", "Save the first one"] : ["Open the first product", "Find a similar alternative", "Save this product"]
    });
  }

  const sameCategory = products.filter((product) => product.active && (!catalogueCategory || productHasCategory(product, catalogueCategory)));
  const alternatives = sameCategory.map((product) => {
    let score = rankOrder.has(product.id) ? Math.max(0, 30 - (rankOrder.get(product.id) ?? 30)) : 0;
    if (filters.colors?.length && filters.colors.some((color) => product.verifiedFacts.colors.includes(color))) score += 20;
    if (filters.maxWidthMm && product.verifiedFacts.dimensions && product.widthMm <= filters.maxWidthMm) score += 15;
    if (filters.modular && product.verifiedFacts.modular && product.modular) score += 12;
    if (filters.smallSpaceSuitable && product.verifiedFacts.smallSpaceSuitable && product.smallSpaceSuitable) score += 12;
    if (filters.relaxFunction && product.verifiedFacts.functions.includes("relax")) score += 12;
    if (filters.electricFunctions && product.verifiedFacts.functions.includes("electric")) score += 12;
    if (requestedMaterial && product.verifiedFacts.materialTypes.includes(requestedMaterial)) score += 10;
    if (wantsEasyCare && product.verifiedFacts.easyCare) score += 10;
    return { product, score };
  }).sort((left, right) => right.score - left.score || left.product.modelCode.localeCompare(right.product.modelCode)).slice(0, 4).map(({ product }) => product);
  return advisorAnswerSchema.parse({
    answer: `No catalogue product satisfies every requested condition${requested.length ? ` (${requested.join(", ")})` : ""}. The products below are closest recommendations and must not be treated as exact matches.`,
    answerType: "missing-data", productIds: alternatives.map((product) => product.id), materialIds: [], sources: ["Musterring product catalogue"],
    proposedAction: /compare/.test(text) && alternatives.length > 1 ? { type: "COMPARE_PRODUCTS", label: "Compare the closest recommendations", parameters: { productIds: alternatives.slice(0, 3).map((product) => product.id) }, requiresConfirmation: false } : null,
    suggestedQuestions: ["Remove one filter", "Show another colour", "Find a retailer"]
  });
}

function customerJourneyAnswer(question: string, context: ConversationContext): AdvisorAnswer | null {
  const text = question.toLowerCase();
  const referenced = groundedProductIds(context.referencedProductIds);

  if (/\b(plan|design|style|arrange|furnish|layout|visuali[sz]e)\b.*\b(room|space|living room|bedroom|dining room)\b|\broom (?:planner|planning|layout|design)\b/.test(text)) {
    return advisorAnswerSchema.parse({
      answer: "I can help plan your room step by step. Start with the room type and measurements, then add doors, windows and existing furniture. The room planner can explore layouts with catalogue products; use the fit check before treating any placement as physically confirmed.",
      answerType: "room", productIds: referenced, materialIds: context.selectedMaterialIds, sources: ["Musterring room-planning tools"],
      proposedAction: { type: "OPEN_ROOM_COMPOSER", label: "Open the room planner", parameters: {}, requiresConfirmation: false },
      suggestedQuestions: ["What measurements do I need?", "Help me plan a living room", "How much walking space should I record?"]
    });
  }

  if (/\b(my project|saved project|saved items?|my musterring|my selections?|my decisions?)\b/.test(text)) {
    return advisorAnswerSchema.parse({
      answer: "My Musterring keeps your saved catalogue products, configurations, room concepts and planning decisions together. I can help review what is selected, identify missing project details and prepare the information for a retailer. Nothing is changed or submitted without your confirmation.",
      answerType: "project", productIds: referenced, materialIds: context.selectedMaterialIds, sources: ["My Musterring project data"],
      proposedAction: null,
      suggestedQuestions: ["What is missing from my project?", "Summarize my decisions", "Prepare my project for a retailer"]
    });
  }

  if (/\b(retailer|dealer|store|showroom|consultation|appointment|where (?:can|do) i (?:buy|see)|buy in person)\b/.test(text)) {
    const wantsBooking = /\b(book|appointment|consultation)\b/.test(text);
    return advisorAnswerSchema.parse({
      answer: wantsBooking
        ? "A Musterring retailer can confirm local availability, pricing, delivery, configuration details and your final room requirements. I can take you to the consultation handover, where you can review everything before any personal details are submitted."
        : "Use the retailer finder to choose a Musterring retailer. The retailer can confirm local availability, pricing, delivery, samples and final configuration details.",
      answerType: "dealer", productIds: referenced, materialIds: context.selectedMaterialIds, sources: ["Musterring retailer service"],
      proposedAction: wantsBooking
        ? { type: "BOOK_CONSULTATION", label: "Prepare a consultation request", parameters: {}, requiresConfirmation: true }
        : { type: "FIND_RETAILER", label: "Find a retailer", parameters: {}, requiresConfirmation: false },
      suggestedQuestions: ["What should I prepare for a consultation?", "Can a retailer confirm availability?", "Prepare my project for a retailer"]
    });
  }

  if (/\b(delivery|shipping|lead time|stock|availability|available now|price|cost|discount|payment|finance|warranty|guarantee|repair|spare part|return|refund|complaint|damaged|customer service|support|contact)\b/.test(text)) {
    return advisorAnswerSchema.parse({
      answer: "Pricing, availability, delivery, payment, warranty, returns and after-sales support depend on the selected retailer and order. I cannot verify those details here, but I can help you find a retailer or prepare the relevant product and project information for a clear enquiry.",
      answerType: "dealer", productIds: referenced, materialIds: context.selectedMaterialIds, sources: ["Musterring retailer service"],
      proposedAction: { type: "FIND_RETAILER", label: "Find a retailer", parameters: {}, requiresConfirmation: false },
      suggestedQuestions: ["Prepare my retailer enquiry", "What information should I include?", "Find a retailer"]
    });
  }

  if (/\b(how (?:does|do|can) (?:this|the) (?:site|website)|where (?:is|can i find)|navigate|website help|what can you do|help me use)\b/.test(text)) {
    return advisorAnswerSchema.parse({
      answer: "I can guide you across the Musterring journey: discover and compare products, understand materials, prepare configurations, plan a room, start a fit check, review saved project decisions, find a retailer and prepare a consultation handover.",
      answerType: "fact", productIds: referenced, materialIds: context.selectedMaterialIds, sources: ["Musterring website"],
      proposedAction: null,
      suggestedQuestions: ["Help me plan a room", "Help me find furniture", "Show me how to prepare for a retailer"]
    });
  }

  return null;
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
  const widthFollowUp = text.trim().match(/^(?:yes[,.! ]*)?(?:width[ :,-]*)?(\d+(?:[.,]\d+)?)\s*(m|metres?|meters?|cm|centimetres?|centimeters?)\b/i);
  if (widthFollowUp && referenced.length) {
    const unit = widthFollowUp[2].toLowerCase();
    const centimetres = Number(widthFollowUp[1].replace(",", ".")) * (unit.startsWith("m") && unit !== "mm" ? 100 : 1);
    const referencedCategories = [...new Set(products.filter((product) => referenced.includes(product.id)).map((product) => product.category))];
    if (Number.isFinite(centimetres) && centimetres > 0 && centimetres <= 1000 && referencedCategories.length === 1) {
      const continuation = productDiscoveryAnswer(`I need a ${referencedCategories[0]} under ${centimetres} cm`);
      if (continuation) return continuation;
    }
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
  const journey = customerJourneyAnswer(question, context);
  if (journey) return journey;
  if (/configur|build (?:a |my )?(?:sofa|sectional|chair|bed)|plan (?:a |my )?(?:sofa|sectional|chair|bed)/.test(text)) {
    if (current) {
      return advisorAnswerSchema.parse({
        answer: `I can take you to the validated configurator for ${current.modelCode}. Tell me your maximum width, preferred material and required functions first if you would like help narrowing the options. Compatibility, dimensions and any indicative price remain the configurator's job.`,
        answerType: "configuration", productIds: [current.id], materialIds: [], sources: ["Musterring product catalogue", "Configuration validation service"],
        proposedAction: { type: "CONFIGURE_PRODUCT", label: `Configure ${current.modelCode}`, parameters: { slug: current.slug }, requiresConfirmation: false },
        suggestedQuestions: ["My maximum width is 260 cm", "I need an easy-care material", "I would like a relax function"]
      });
    }
    return advisorAnswerSchema.parse({
      answer: "I’d be happy to help shape a configuration brief. What would you like to configure, what is the maximum usable width in centimetres, and which of these matters most: modular flexibility, an upright or relaxed sit, easy-care material, or a relax function? I will only propose a product after those needs can be checked against the catalogue.",
      answerType: "configuration", productIds: [], materialIds: [], sources: ["Musterring product catalogue", "Configuration validation service"],
      proposedAction: null,
      suggestedQuestions: ["I want a modular sofa under 260 cm", "I prefer an upright seat", "I need an easy-care material for pets"]
    });
  }
  if (/material|fabric|leather|upholstery/.test(text) && /help|choose|which|what/.test(text) && !/dog|pet|children|care|sun|family|colour|color/.test(text)) {
    return advisorAnswerSchema.parse({
      answer: "I can help you choose from recorded material attributes. To make the recommendation useful, how will the furniture be used (children, pets or frequent use), is it in strong sunlight, and do you prefer fabric or leather? I will keep the advice to recorded care and suitability metadata.",
      answerType: "materials", productIds: current ? [current.id] : [], materialIds: [], sources: ["Musterring concept material metadata"],
      proposedAction: { type: "SHOW_MATERIALS", label: "Explore materials and care", parameters: { query: question }, requiresConfirmation: false },
      suggestedQuestions: ["We have children and a dog", "The room has strong afternoon sun", "I prefer the feel of fabric"]
    });
  }
  if (/material|dog|pet|children|care/.test(text) && !/sofa|couch|armchair|chair|sectional|table|bed|mattress|topper|wardrobe|bathroom|kitchen|hallway|outdoor|carpet|rug|lamp|textile|bedding|compare|find|show me|i need|i want/.test(text)) {
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
      answer: current ? `Available product data lists ${current.modelCode} package guidance, but physical fit cannot be confirmed here. Use Will It Fit? with your measured route and retailer verification.` : "I can help prepare a fit check, but I cannot confirm physical fit without the fit engine. Which product are you considering, and what are the narrowest doorway width and height, stair or lift constraints, and usable room width and depth?",
      answerType: "fit", productIds: current ? [current.id] : referenced, materialIds: [], sources: ["Product package data", "Will It Fit? deterministic service"],
      proposedAction: null,
      suggestedQuestions: current ? ["Which measurements do I need?", "Prepare a technical fit request"] : ["I am considering MR 285", "My doorway is 82 cm wide and 198 cm high", "What measurements does the fit check need?"]
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
  if (current && /seat|dimension|width|depth|height|colou?r|material|electric|relax|modular|function/.test(text) && !/\b(i want|i need|show me|find|search|looking for|recommend)\b/.test(text)) {
    const facts = /colou?r/.test(text)
      ? `${current.modelCode} has these verified colour families: ${current.verifiedFacts.colors.join(", ") || "none in the connected data"}.`
      : /material/.test(text)
        ? `${current.modelCode} has these verified material types: ${current.verifiedFacts.materialTypes.join(", ") || "none in the connected data"}.`
        : /electric|relax|function/.test(text)
          ? `${current.modelCode} has these verified functions: ${current.verifiedFacts.functions.join(", ") || "none in the connected data"}.`
          : current.verifiedFacts.dimensions
            ? `${current.modelCode} has verified dimensions of ${current.widthMm / 10} cm wide, ${current.depthMm / 10} cm deep and ${current.heightMm / 10} cm high.${current.verifiedFacts.seatHeight ? ` Its verified seat height is ${current.seatHeightMm / 10} cm.` : " Seat height is configuration dependent."}`
            : `Dimensions and seat geometry for ${current.modelCode} are configuration dependent in the connected data.`;
    return advisorAnswerSchema.parse({
      answer: `${facts} Availability and technical confirmation are provided by the selected Musterring retailer.`,
      answerType: "fact", productIds: [current.id], materialIds: [], sources: ["Musterring product catalogue"],
      proposedAction: /electric|relax|configur/.test(text) ? { type: "CONFIGURE_PRODUCT", label: `Validate options for ${current.modelCode}`, parameters: { slug: current.slug }, requiresConfirmation: false } : null,
      suggestedQuestions: ["Discover more like this", "Explain compatible materials"]
    });
  }
  const discovery = productDiscoveryAnswer(question);
  if (discovery) return discovery;
  return advisorAnswerSchema.parse({
    answer: "I can help with anything across your Musterring journey: products, rooms, materials, configuration, fit preparation, saved projects, retailers and customer-service handover. Verified information for that request is not currently available, so tell me what you are trying to achieve and I will guide you to the right next step.",
    answerType: "missing-data", productIds: [], materialIds: [], sources: [],
    proposedAction: null, suggestedQuestions: ["Help me find the right sofa", "Choose a material", "Prepare my project for a retailer"]
  });
}

export function validateProposedConfiguration(configuration: Configuration) {
  return validateConfiguration(configuration);
}
