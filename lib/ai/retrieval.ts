import { materials, products } from "../data";
import { productHasCategory, type Product } from "../types";
import type { SearchIntent, VisualTags } from "./schemas";
import type { SearchExclusions } from "../search";
import { normalizeSearchText, parseSearchQuery } from "../search";
import { hasVerifiedColourPresentation } from "../musterring-assets";

export type GroundedMatch = { product: Product; score: number; reasons: string[] };
export type GroundedSearch = {
  exactMatches: GroundedMatch[];
  closeAlternatives: GroundedMatch[];
  exactColorAvailable: boolean;
  categoryAvailable: boolean;
  unverifiedRequirements: string[];
};

export interface SemanticRetrievalProvider {
  rank(query: string, candidates: Product[]): Promise<Array<{ id: string; score: number }>>;
}

export class LocalSemanticRetrievalProvider implements SemanticRetrievalProvider {
  async rank(query: string, candidates: Product[]) {
    const normalizedQuery = normalizeSearchText(query);
    const terms = [...new Set(normalizedQuery.split(/[^a-z0-9]+/).filter((term) => term.length > 2))];
    return candidates.map((product) => {
      const text = normalizeSearchText([product.modelCode, product.name, product.subtitle, product.description, ...(product.categories ?? [product.category]), ...product.colors, ...product.styles, ...product.functions, ...(product.layoutShapes ?? [])].join(" "));
      const overlap = terms.filter((term) => text.includes(term)).length;
      const trigrams = new Set(Array.from({ length: Math.max(0, normalizedQuery.length - 2) }, (_, index) => normalizedQuery.slice(index, index + 3)));
      const candidateTrigrams = new Set(Array.from({ length: Math.max(0, text.length - 2) }, (_, index) => text.slice(index, index + 3)));
      const semantic = [...trigrams].filter((gram) => candidateTrigrams.has(gram)).length / Math.max(1, trigrams.size);
      return { id: product.id, score: overlap * 8 + semantic * 25 };
    }).sort((left, right) => right.score - left.score);
  }
}

// Integration seam for Azure AI Search, Algolia or Elasticsearch.
export interface ExternalSemanticSearchAdapter extends SemanticRetrievalProvider {
  readonly service: "azure-ai-search" | "algolia" | "elasticsearch";
}

function productFacts(product: Product) {
  const materialFacts = materials.filter((material) => product.materials.includes(material.id));
  return { product, materialFacts };
}

function hasVerifiedMaterial(product: Product, requested: string) {
  const value = requested.toLowerCase();
  const materialType = materials.find((material) => material.id === requested)?.type ?? value;
  return product.verifiedFacts.materialTypes.includes(materialType as "fabric" | "leather");
}

const noSearchExclusions: SearchExclusions = { colors: [], functions: [], modular: false };

function isDiningTableIntent(intent: SearchIntent) {
  return intent.category === "dining-table";
}

function hasVerifiedTableCapacity(product: Product, requested: number) {
  const table = product.specifications?.table;
  return table?.capacityVerified === true &&
    product.dataQuality?.verifiedFields.includes("specifications.table.capacityMax") === true &&
    table.capacityMax != null && table.capacityMax >= requested;
}

function satisfiesSeatRequirement(product: Product, intent: SearchIntent) {
  if (!intent.numberOfSeats) return true;
  if (isDiningTableIntent(intent)) return hasVerifiedTableCapacity(product, intent.numberOfSeats);
  return product.numberOfSeatsVerified && product.numberOfSeats === intent.numberOfSeats;
}

function hasVerifiedExtendableTable(product: Product) {
  return product.dataQuality?.verifiedFields.includes("specifications.table.extendable") === true &&
    product.specifications?.table?.extendable === true;
}

function requestedTabletopShapes(intent: SearchIntent) {
  return isDiningTableIntent(intent) ? parseSearchQuery(intent.queryText).tabletopShapes ?? [] : [];
}

function hasVerifiedTabletopShape(product: Product, requested: string[]) {
  return product.dataQuality?.verifiedFields.includes("specifications.table.tabletopShape") === true &&
    requested.some((shape) => product.specifications?.table?.tabletopShape.includes(shape));
}

function violatesExclusions(product: Product, exclusions: SearchExclusions) {
  return exclusions.colors.some((color) => product.colors.includes(color)) ||
    exclusions.functions.some((fn) => product.functions.includes(fn)) ||
    (exclusions.modular && product.modular);
}

function verifiedWidths(product: Product) {
  const widths: number[] = [];
  if (product.verifiedFacts.dimensions) widths.push(product.widthMm);
  for (const configuration of product.configurations ?? []) {
    if (configuration.dimensions && configuration.dataQuality.verifiedFields.includes("dimensions")) {
      widths.push(configuration.dimensions.widthMm);
    }
  }
  return widths;
}

function hasVerifiedWidthAtMost(product: Product, maximumWidthMm: number) {
  return verifiedWidths(product).some((width) => width <= maximumWidthMm);
}

function colorValueMatches(available: string, requested: string) {
  const normalize = (value: string) => value.toLowerCase().replace(/gray/g, "grey").replace(/[^a-z0-9]+/g, " ").trim();
  const availableValue = normalize(available);
  const requestedValue = normalize(requested);
  return availableValue === requestedValue || availableValue.split(" ").includes(requestedValue);
}

function requestedColorMatchIndex(product: Product, requested: string[], verifiedOnly: boolean) {
  const available = verifiedOnly ? product.verifiedFacts.colors : product.colors;
  return requested.findIndex((color) => available.some((candidate) => colorValueMatches(candidate, color)));
}

function hasRequestedColor(product: Product, requested: string[], verifiedOnly: boolean) {
  return requestedColorMatchIndex(product, requested, verifiedOnly) >= 0;
}

function satisfiesVerifiedIntent(product: Product, intent: SearchIntent) {
  const colors = intent.colorFamilies?.map((color) => color.toLowerCase()) ?? [];
  const requiresExtendableTable = isDiningTableIntent(intent) && parseSearchQuery(intent.queryText).extendable === true;
  const tabletopShapes = requestedTabletopShapes(intent);
  return (
    (!intent.category || productHasCategory(product, intent.category)) &&
    (!colors.length || hasRequestedColor(product, colors, true)) &&
    (!intent.maxWidthMm || hasVerifiedWidthAtMost(product, intent.maxWidthMm)) &&
    (!intent.minWidthMm || (product.verifiedFacts.dimensions && product.widthMm >= intent.minWidthMm)) &&
    (!intent.targetWidthMm || (product.verifiedFacts.dimensions && Math.abs(product.widthMm - intent.targetWidthMm) <= Math.max(100, Math.round(intent.targetWidthMm * 0.03)))) &&
    (!intent.minSeatHeightMm || (product.verifiedFacts.seatHeight && product.seatHeightMm >= intent.minSeatHeightMm)) &&
    (!intent.maxSeatDepthMm || (product.verifiedFacts.seatDepth && product.seatDepthMm <= intent.maxSeatDepthMm)) &&
    satisfiesSeatRequirement(product, intent) &&
    (!requiresExtendableTable || hasVerifiedExtendableTable(product)) &&
    (!tabletopShapes.length || hasVerifiedTabletopShape(product, tabletopShapes)) &&
    (!intent.modular || (product.verifiedFacts.modular && product.modular)) &&
    (!intent.smallSpaceSuitable || (product.verifiedFacts.smallSpaceSuitable && product.smallSpaceSuitable)) &&
    (!intent.functions?.includes("relax") || product.verifiedFacts.functions.includes("relax")) &&
    (!intent.functions?.includes("electric") || product.verifiedFacts.functions.includes("electric")) &&
    (!intent.functions?.includes("easy-care") || product.verifiedFacts.easyCare) &&
    (!intent.materials?.length || intent.materials.some((requested) => hasVerifiedMaterial(product, requested))) &&
    (!intent.styles?.length || intent.styles.some((requested) => product.verifiedFacts.styles.some((style) => style.includes(requested.toLowerCase()) || requested.toLowerCase().includes(style)))) &&
    (!intent.layoutShapes?.length || intent.layoutShapes.some((shape) => product.layoutShapes?.includes(shape)))
  );
}

function verifiedMatchReasons(product: Product, intent: SearchIntent) {
  const reasons: string[] = [];
  if (intent.category && productHasCategory(product, intent.category)) reasons.push(`requested ${intent.category}`);
  if (intent.colorFamilies?.length && hasRequestedColor(product, intent.colorFamilies, true)) {
    const matchedColor = intent.colorFamilies[requestedColorMatchIndex(product, intent.colorFamilies, true)];
    reasons.push(`verified colour: ${matchedColor}`);
  }
  if (intent.maxWidthMm && hasVerifiedWidthAtMost(product, intent.maxWidthMm)) reasons.push("verified width is within the requested limit");
  if (intent.minWidthMm && product.verifiedFacts.dimensions && product.widthMm >= intent.minWidthMm) reasons.push("verified width meets the requested minimum");
  if (intent.numberOfSeats && isDiningTableIntent(intent) && hasVerifiedTableCapacity(product, intent.numberOfSeats)) reasons.push(`verified dining capacity for at least ${intent.numberOfSeats}`);
  else if (intent.numberOfSeats && product.numberOfSeatsVerified && product.numberOfSeats === intent.numberOfSeats) reasons.push(`${product.numberOfSeats} verified seats`);
  if (isDiningTableIntent(intent) && parseSearchQuery(intent.queryText).extendable && hasVerifiedExtendableTable(product)) reasons.push("verified extendable table option");
  const tabletopShapes = requestedTabletopShapes(intent);
  if (tabletopShapes.length && hasVerifiedTabletopShape(product, tabletopShapes)) reasons.push(`verified ${tabletopShapes.join(" or ")} tabletop`);
  if (intent.modular && product.verifiedFacts.modular && product.modular) reasons.push("verified modular programme");
  if (intent.functions?.includes("relax") && product.verifiedFacts.functions.includes("relax")) reasons.push("verified relax function");
  if (intent.functions?.includes("electric") && product.verifiedFacts.functions.includes("electric")) reasons.push("verified electric function");
  if (intent.materials?.some((material) => hasVerifiedMaterial(product, material))) reasons.push("verified requested material type");
  return reasons;
}

function structuredScore(product: Product, intent: SearchIntent) {
  let score = 0;
  const reasons: string[] = [];
  const requiresExtendableTable = isDiningTableIntent(intent) && parseSearchQuery(intent.queryText).extendable === true;
  const tabletopShapes = requestedTabletopShapes(intent);
  if (intent.category) {
    if (!productHasCategory(product, intent.category)) return { score: -1000, reasons };
    score += 25; reasons.push(`requested ${intent.category}`);
  }
  if (intent.colorFamilies?.length) {
    const colorIndex = requestedColorMatchIndex(product, intent.colorFamilies, false);
    if (colorIndex >= 0) {
      score += colorIndex === 0 ? 25 : 15;
      reasons.push(`${colorIndex === 0 ? "preferred" : "acceptable"} colour family: ${intent.colorFamilies[colorIndex]}`);
    } else score -= 35;
  }
  if (intent.maxWidthMm) {
    const knownWidths = verifiedWidths(product);
    const fittingWidth = knownWidths.filter((width) => width <= intent.maxWidthMm!).sort((left, right) => right - left)[0];
    if (fittingWidth != null) { score += 18; reasons.push(`verified width ${fittingWidth} mm is within the limit`); }
    else if (knownWidths.length) score -= 60;
    else score -= 10;
  }
  if (intent.minWidthMm) {
    if (product.widthMm >= intent.minWidthMm) { score += 18; reasons.push(`width ${product.widthMm} mm meets the minimum`); }
    else score -= 60;
  }
  if (intent.targetWidthMm) {
    const tolerance = Math.max(100, Math.round(intent.targetWidthMm * 0.03));
    const difference = Math.abs(product.widthMm - intent.targetWidthMm);
    if (difference <= tolerance) { score += 18; reasons.push(`width ${product.widthMm} mm is near the target`); }
    else score -= Math.min(60, Math.round(difference / 25));
  }
  if (intent.minSeatHeightMm) {
    if (product.seatHeightMm >= intent.minSeatHeightMm) { score += 15; reasons.push(`seat height ${product.seatHeightMm} mm meets the preference`); }
    else score -= 25;
  }
  if (intent.maxSeatDepthMm) {
    if (product.seatDepthMm <= intent.maxSeatDepthMm) score += 10;
    else score -= 15;
  }
  if (intent.numberOfSeats) {
    if (isDiningTableIntent(intent)) {
      const table = product.specifications?.table;
      if (hasVerifiedTableCapacity(product, intent.numberOfSeats)) {
        score += 18; reasons.push(`verified dining capacity for at least ${intent.numberOfSeats}`);
      } else if (table?.demoEstimatedCapacity != null && table.demoEstimatedCapacity >= intent.numberOfSeats) {
        score += 8; reasons.push(`indicative dining capacity for at least ${intent.numberOfSeats}`);
      } else score -= 8;
      if (product.productSubtypes?.includes("dining-chair")) {
        score += 10; reasons.push("coordinating dining-chair options in the programme");
      }
    } else if (product.numberOfSeatsVerified && product.numberOfSeats === intent.numberOfSeats) {
      score += 12; reasons.push(`${product.numberOfSeats} verified seats`);
    } else score -= 8;
  }
  if (requiresExtendableTable) {
    if (product.specifications?.table?.extendable) {
      score += 24; reasons.push(hasVerifiedExtendableTable(product) ? "verified extendable table option" : "extendable table option for occasional guests");
    } else score -= 24;
  }
  if (tabletopShapes.length) {
    if (hasVerifiedTabletopShape(product, tabletopShapes)) {
      score += 35; reasons.push(`verified ${tabletopShapes.join(" or ")} tabletop`);
    } else if (tabletopShapes.some((shape) => product.specifications?.table?.tabletopShape.includes(shape))) {
      score += 6; reasons.push(`indicative ${tabletopShapes.join(" or ")} tabletop option`);
    } else score -= 45;
  }
  if (intent.modular) {
    if (product.modular) { score += 15; reasons.push("modular catalogue flag"); }
    else score -= 25;
  }
  if (intent.smallSpaceSuitable) {
    if (product.smallSpaceSuitable) { score += 15; reasons.push("small-space suitable catalogue flag"); }
    else score -= 20;
  }
  if (intent.functions?.includes("relax")) {
    if (product.functions.includes("relax")) { score += 15; reasons.push("relax function"); }
    else score -= 20;
  }
  if (intent.functions?.includes("electric")) {
    if (product.electricFunctions.length) { score += 15; reasons.push("electric function option"); }
    else score -= 20;
  }
  if (intent.functions?.includes("easy-care")) {
    const easy = productFacts(product).materialFacts.some((material) => material.easyCare);
    if (easy) { score += 12; reasons.push("easy-care material option"); }
  }
  if (intent.materials?.length) {
    const facts = productFacts(product).materialFacts;
    const materialMatch = intent.materials.some((requested) =>
      facts.some((material) => material.id === requested || material.type === requested.toLowerCase() || material.name.toLowerCase().includes(requested.toLowerCase()))
    );
    if (materialMatch) { score += 12; reasons.push(`requested ${intent.materials.join(", ")} material`); }
    else score -= 20;
  }
  if (intent.styles?.length) {
    const styleMatch = intent.styles.some((requested) => product.styles.some((style) => style.includes(requested.toLowerCase()) || requested.toLowerCase().includes(style)));
    if (styleMatch) { score += 10; reasons.push("requested style"); }
    else score -= 8;
  }
  if (intent.layoutShapes?.length) {
    const layoutMatch = intent.layoutShapes.some((shape) => product.layoutShapes?.includes(shape));
    if (layoutMatch) { score += 25; reasons.push(`verified ${intent.layoutShapes.join(", ")} layout`); }
    else score -= 60;
  }
  return { score, reasons };
}

export async function hybridCatalogueSearch(
  intent: SearchIntent,
  semantic: SemanticRetrievalProvider = new LocalSemanticRetrievalProvider(),
  exclusions: SearchExclusions = noSearchExclusions,
  advisorProductIds: string[] = []
): Promise<GroundedSearch> {
  const active = products.filter((product) => product.active);
  const advisorOrder = new Map([...new Set(advisorProductIds)].map((id, index) => [id, index]));
  const categoryProducts = active.filter((product) => !intent.category || productHasCategory(product, intent.category));
  const categoryAvailable = categoryProducts.length > 0;
  const parsedQuery = parseSearchQuery(intent.queryText);
  const unverifiedRequirements = intent.layoutShapes?.filter((shape) =>
    !categoryProducts.some((product) => product.layoutShapes?.includes(shape))
  ).map((shape) => `${shape} layout`) ?? [];
  if (isDiningTableIntent(intent) && intent.numberOfSeats && !categoryProducts.some((product) => hasVerifiedTableCapacity(product, intent.numberOfSeats!))) {
    unverifiedRequirements.push(`table capacity for ${intent.numberOfSeats} people`);
  }
  if (isDiningTableIntent(intent) && parsedQuery.extendable && !categoryProducts.some(hasVerifiedExtendableTable)) {
    unverifiedRequirements.push("an extendable table configuration");
  }
  const tabletopShapes = parsedQuery.tabletopShapes ?? [];
  const exactTabletopShapeAvailable = !tabletopShapes.length || categoryProducts.some((product) => hasVerifiedTabletopShape(product, tabletopShapes));
  if (tabletopShapes.length && !exactTabletopShapeAvailable) {
    unverifiedRequirements.push(`${tabletopShapes.join(" or ")} tabletop shape`);
  }
  const code = intent.queryText.match(/\bMR\s*-?\s*\d{3,4}\b/i)?.[0].replace(/[\s-]+/g, " ").toUpperCase();
  const semanticScores = new Map((await semantic.rank(intent.queryText, active)).map((item) => [item.id, item.score]));
  const ranked = active.map((product) => {
    const structured = structuredScore(product, intent);
    const exactCode = code === product.modelCode;
    return {
      product,
      // Ask Musterring sees the complete validated catalogue. Its grounded
      // product selection is therefore used as a ranking signal here too,
      // while the deterministic checks below still decide whether a result
      // is exact, alternative, excluded or unverified.
      score: structured.score + (semanticScores.get(product.id) ?? 0) + (exactCode ? 200 : 0) +
        (advisorOrder.has(product.id) ? 1200 - Math.min(advisorOrder.get(product.id) ?? 0, 12) * 5 : 0),
      reasons: exactCode ? [`exact product code ${product.modelCode}`, ...verifiedMatchReasons(product, intent)] : verifiedMatchReasons(product, intent)
    };
  }).sort((left, right) => right.score - left.score || left.product.modelCode.localeCompare(right.product.modelCode));
  const requestedColors = intent.colorFamilies?.map((color) => color.toLowerCase()) ?? [];
  const exactColorAvailable = !requestedColors.length || active.some((product) =>
    (!intent.category || productHasCategory(product, intent.category)) &&
    (!intent.maxWidthMm || hasVerifiedWidthAtMost(product, intent.maxWidthMm)) &&
    (!intent.minWidthMm || (product.verifiedFacts.dimensions && product.widthMm >= intent.minWidthMm)) &&
    hasRequestedColor(product, requestedColors, true)
  );
  const exactMatches = ranked.filter(({ product, score }) =>
    score > -100 && !violatesExclusions(product, exclusions) && satisfiesVerifiedIntent(product, intent)
  ).slice(0, 12);
  const exactIds = new Set(exactMatches.map(({ product }) => product.id));
  const isRelevantAlternative = (product: Product) => {
    // A hard maximum-width request requires catalogue-verified dimensions.
    // Demo/reference widths cannot justify a compact-space recommendation.
    if (intent.maxWidthMm && !exactColorAvailable && verifiedWidths(product).length && !hasVerifiedWidthAtMost(product, intent.maxWidthMm)) return false;
    const checks: boolean[] = [];
    if (requestedColors.length) checks.push(hasRequestedColor(product, requestedColors, true));
    if (intent.maxWidthMm) checks.push(hasVerifiedWidthAtMost(product, intent.maxWidthMm));
    if (intent.minWidthMm) checks.push(product.verifiedFacts.dimensions && product.widthMm >= intent.minWidthMm);
    if (intent.targetWidthMm) checks.push(product.verifiedFacts.dimensions && Math.abs(product.widthMm - intent.targetWidthMm) <= Math.max(100, Math.round(intent.targetWidthMm * 0.03)));
    if (intent.minSeatHeightMm) checks.push(product.verifiedFacts.seatHeight && product.seatHeightMm >= intent.minSeatHeightMm);
    if (intent.maxSeatDepthMm) checks.push(product.verifiedFacts.seatDepth && product.seatDepthMm <= intent.maxSeatDepthMm);
    if (intent.numberOfSeats) checks.push(satisfiesSeatRequirement(product, intent));
    if (intent.modular) checks.push(product.verifiedFacts.modular && product.modular);
    if (intent.smallSpaceSuitable) checks.push(product.verifiedFacts.smallSpaceSuitable && product.smallSpaceSuitable);
    if (intent.functions?.includes("relax")) checks.push(product.verifiedFacts.functions.includes("relax"));
    if (intent.functions?.includes("electric")) checks.push(product.verifiedFacts.functions.includes("electric"));
    if (intent.functions?.includes("easy-care")) checks.push(product.verifiedFacts.easyCare);
    if (intent.materials?.length) {
      checks.push(intent.materials.some((requested) => hasVerifiedMaterial(product, requested)));
    }
    if (intent.layoutShapes?.length) checks.push(intent.layoutShapes.some((shape) => product.layoutShapes?.includes(shape)));
    // Same-category products remain eligible as clearly labelled alternatives.
    // Failed or unverified checks must never promote them to exact matches.
    return true;
  };
  const closeAlternatives = ranked.filter(({ product }) =>
    !exactIds.has(product.id) &&
    !violatesExclusions(product, exclusions) &&
    (!intent.maxWidthMm || !intent.smallSpaceSuitable || hasVerifiedWidthAtMost(product, intent.maxWidthMm)) &&
    (!requestedColors.length || !exactColorAvailable || hasRequestedColor(product, requestedColors, false)) &&
    (!isDiningTableIntent(intent) || !parsedQuery.extendable || !productHasCategory(product, "dining-table") || product.specifications?.table?.extendable === true) &&
    (!tabletopShapes.length || !exactTabletopShapeAvailable || hasVerifiedTabletopShape(product, tabletopShapes)) &&
    (advisorOrder.has(product.id) || (
      (!intent.category || productHasCategory(product, intent.category)) &&
      // Preserve an explicitly requested colour whenever the catalogue has that
      // colour in the requested category. A request such as "red sofa" must not
      // be followed by a wall of beige and grey sofas. Wrong-colour alternatives
      // are useful only when the requested colour is unavailable altogether.
      isRelevantAlternative(product)
    ))
  ).slice(0, 6).map((match) => ({
    ...match,
    reasons: advisorOrder.has(match.product.id) && intent.category && !productHasCategory(match.product, intent.category)
      ? [`catalogue ${match.product.category.replaceAll("-", " ")} selected for another part of the request`, ...match.reasons]
      : requestedColors.length && !hasRequestedColor(match.product, requestedColors, true)
      ? hasRequestedColor(match.product, requestedColors, false)
        ? [`catalogue colour option: ${requestedColors[requestedColorMatchIndex(match.product, requestedColors, false)]}; photo may show another finish`, ...match.reasons]
        : [`not available in requested ${requestedColors.join(", ")}`, ...match.reasons]
      : match.reasons.length ? match.reasons : ["same requested category; other requested facts are not verified"]
  }));
  return { exactMatches, closeAlternatives, exactColorAvailable, categoryAvailable, unverifiedRequirements };
}

const visualColorGroups = [
  ["white", "warm white", "off white", "ivory", "cream"],
  ["beige", "sand", "taupe", "stone", "greige", "warm neutral"],
  ["black", "charcoal", "graphite", "anthracite", "onyx", "dark grey"],
  ["grey", "silver", "cool neutral"],
  ["brown", "cognac", "walnut", "oak", "natural oak"],
  ["red", "burgundy", "barolo", "wine"],
  ["blue", "navy", "aqua"],
  ["green", "sage", "olive"],
  ["yellow", "mustard", "gold"],
  ["pink", "rose", "blush"]
];

const normalizeVisualValue = (value: string) => value
  .toLowerCase()
  .normalize("NFKC")
  .replace(/gray/g, "grey")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

export function visualColorsCompatible(detected: string, available: string) {
  const wanted = normalizeVisualValue(detected);
  const candidate = normalizeVisualValue(available);
  if (!wanted || !candidate) return false;
  if (wanted === candidate || wanted.includes(candidate) || candidate.includes(wanted)) return true;
  return visualColorGroups.some((group) => {
    const normalized = group.map(normalizeVisualValue);
    return normalized.includes(wanted) && normalized.includes(candidate);
  });
}

/**
 * Vision providers return colours in dominance order. Keep aliases of the
 * dominant furniture colour, but discard unrelated secondary colours that
 * commonly come from cushions, throws, walls, or the surrounding room.
 */
export function dominantVisualColorFamilies(colors: string[]) {
  const normalized = colors.map((color) => color.trim()).filter(Boolean);
  const dominant = normalized[0];
  if (!dominant) return [];
  return normalized.filter((color) => visualColorsCompatible(dominant, color));
}

export function visualProductGroupId(product: Product) {
  return product.entityLevel === "variant" ? product.productGroupId ?? product.id : product.id;
}

const visualStopWords = new Set([
  "with", "and", "the", "this", "that", "from", "visible", "object", "furniture", "style", "shape",
  "sofa", "bed", "chair", "table", "cabinet", "unit", "profile", "silhouette"
]);

function visualTokens(value: string) {
  return [...new Set(normalizeVisualValue(value).split(" ").filter((token) => token.length > 2 && !visualStopWords.has(token)))];
}

function verifiedVisualShapeReason(product: Product, tags: VisualTags) {
  const silhouette = normalizeVisualValue(tags.silhouette);
  const requestedLayouts = [
    ...(/\b(?:corner|l shaped)\b/.test(silhouette) ? ["l-shaped", "corner"] as const : []),
    ...(/\bu shaped\b/.test(silhouette) ? ["u-shaped"] as const : []),
    ...(/\bstraight\b/.test(silhouette) ? ["straight"] as const : [])
  ];
  if (requestedLayouts.some((shape) => product.layoutShapes?.includes(shape))) return "verified matching layout silhouette";

  const requestedTableShapes = ["round", "oval", "square", "rectangular"].filter((shape) =>
    new RegExp(`\\b${shape}\\b`).test(silhouette)
  );
  const verifiedTableShapes = product.dataQuality?.verifiedFields.includes("specifications.table.tabletopShape")
    ? product.specifications?.table?.tabletopShape ?? []
    : product.tabletopShapes ?? [];
  if (requestedTableShapes.some((shape) => verifiedTableShapes.includes(shape))) return "verified matching tabletop silhouette";

  const verifiedBedTypes = product.dataQuality?.verifiedFields.includes("specifications.bed.bedType")
    ? product.specifications?.bed?.bedType ?? []
    : [];
  if (/\bbox ?spring\b/.test(silhouette) && verifiedBedTypes.includes("boxspring-bed")) return "verified matching box-spring silhouette";
  if (/\bupholster/.test(silhouette) && verifiedBedTypes.includes("upholstered-bed")) return "verified matching upholstered silhouette";
  return null;
}

function visualTextSignals(product: Product, tags: VisualTags) {
  const requested = visualTokens([tags.silhouette, ...tags.notableVisualFeatures].join(" "));
  if (!requested.length) return [];
  const corpus = new Set(visualTokens([
    product.name, product.subtitle, product.description,
    ...(product.productSubtypes ?? []), ...(product.styles ?? []), ...(product.functions ?? []),
    ...(product.layoutShapes ?? []), ...(product.tabletopShapes ?? [])
  ].join(" ")));
  return requested.filter((token) => [...corpus].some((candidate) =>
    candidate === token || (token.length >= 5 && (candidate.startsWith(token) || token.startsWith(candidate)))
  ));
}

export function hasVerifiedVisualMaterial(product: Product, requested: string) {
  const normalized = normalizeVisualValue(requested);
  const aliases = /\b(?:fabric|textile|velvet|boucle|chenille|upholster)/.test(normalized)
    ? ["fabric", "upholstery"]
    : /\bleather\b/.test(normalized)
      ? ["leather"]
      : /\b(?:wood|oak|walnut|timber)\b/.test(normalized)
        ? ["wood", "solid wood", "oak", "walnut"]
        : [normalized];
  return product.verifiedFacts.materialTypes.some((type) => aliases.some((alias) => normalizeVisualValue(type).includes(alias)))
    || materials.some((material) => product.materials.includes(material.id) && aliases.some((alias) => normalizeVisualValue(material.type).includes(alias)));
}

export function searchCatalogueByVisualTags(tags: VisualTags) {
  // An unrelated or unclear upload must never be turned into an arbitrary
  // Musterring recommendation merely because catalogue products exist.
  if (!tags.category) return [];
  const isCompatibleCategory = (productCategory: Product["category"]) =>
    productCategory === tags.category ||
    ((tags.category === "sectional" || tags.category === "sofa") &&
      (productCategory === "sectional" || productCategory === "sofa"));
  const dominantColors = dominantVisualColorFamilies(tags.colorFamilies);
  const detectedColors = dominantColors.map(normalizeVisualValue).filter(Boolean);
  const requiresDarkPresentation = dominantColors.some((color) => visualColorsCompatible(color, "black"));
  const active = products.filter((product) =>
    product.active &&
    isCompatibleCategory(product.category) &&
    (!detectedColors.length || product.colors.some((available) =>
      detectedColors.some((detected) => visualColorsCompatible(detected, available))
    )) &&
    // A programme being configurable in black is not enough for visual search:
    // dark uploads must have catalogue photography verified for that dark option.
    (!requiresDarkPresentation || product.colors.some((available) =>
      detectedColors.some((detected) => visualColorsCompatible(detected, available)) &&
      hasVerifiedColourPresentation(product.id, available)
    ))
  );
  return active.map((product) => {
    let score = 0;
    const reasons: string[] = [];
    if (product.category === tags.category) { score += 35; reasons.push("same furniture category"); }
    else if (isCompatibleCategory(product.category)) { score += 30; reasons.push("same sofa family"); }
    const colors = dominantColors.filter((color) =>
      product.colors.some((available) => visualColorsCompatible(color, available))
    );
    if (colors.length) { score += 30; reasons.push(`similar ${colors.join(", ")} colour family`); }
    const styles = tags.style.filter((style) => product.styles.some((candidate) => {
      const wanted = normalizeVisualValue(style);
      const available = normalizeVisualValue(candidate);
      return wanted.includes(available) || available.includes(wanted);
    }));
    if (styles.length) { score += 20; reasons.push("related style"); }
    if (tags.likelyMaterial) {
      const hasMaterial = hasVerifiedVisualMaterial(product, tags.likelyMaterial);
      if (hasMaterial) { score += 15; reasons.push(`offers ${tags.likelyMaterial}`); }
    }
    const shapeReason = verifiedVisualShapeReason(product, tags);
    if (shapeReason) { score += 20; reasons.push(shapeReason); }
    const textSignals = visualTextSignals(product, tags);
    if (textSignals.length) {
      score += Math.min(15, textSignals.length * 5);
      reasons.push(`catalogue description shares visible features: ${textSignals.slice(0, 3).join(", ")}`);
    }
    if (dominantColors.some((color) => hasVerifiedColourPresentation(product.id, color))) score += 8;
    return { product, score, reasons };
  }).filter((match) => isCompatibleCategory(match.product.category))
    .sort((left, right) => right.score - left.score)
    .filter((match, index, all) => all.findIndex((candidate) => visualProductGroupId(candidate.product) === visualProductGroupId(match.product)) === index)
    .slice(0, 12);
}
