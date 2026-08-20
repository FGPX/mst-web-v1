import { materials, products } from "../data";
import { productHasCategory, type Product } from "../types";
import type { SearchIntent, VisualTags } from "./schemas";
import { normalizeSearchText } from "../search";

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

function satisfiesVerifiedIntent(product: Product, intent: SearchIntent) {
  const colors = intent.colorFamilies?.map((color) => color.toLowerCase()) ?? [];
  return (
    (!intent.category || productHasCategory(product, intent.category)) &&
    (!colors.length || colors.some((color) => product.verifiedFacts.colors.includes(color))) &&
    (!intent.maxWidthMm || (product.verifiedFacts.dimensions && product.widthMm <= intent.maxWidthMm)) &&
    (!intent.minWidthMm || (product.verifiedFacts.dimensions && product.widthMm >= intent.minWidthMm)) &&
    (!intent.targetWidthMm || (product.verifiedFacts.dimensions && Math.abs(product.widthMm - intent.targetWidthMm) <= Math.max(100, Math.round(intent.targetWidthMm * 0.03)))) &&
    (!intent.minSeatHeightMm || (product.verifiedFacts.seatHeight && product.seatHeightMm >= intent.minSeatHeightMm)) &&
    (!intent.maxSeatDepthMm || (product.verifiedFacts.seatDepth && product.seatDepthMm <= intent.maxSeatDepthMm)) &&
    (!intent.numberOfSeats || (product.numberOfSeatsVerified && product.numberOfSeats === intent.numberOfSeats)) &&
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
  if (intent.colorFamilies?.some((color) => product.verifiedFacts.colors.includes(color.toLowerCase()))) reasons.push(`verified colour: ${intent.colorFamilies.join(", ")}`);
  if (intent.maxWidthMm && product.verifiedFacts.dimensions && product.widthMm <= intent.maxWidthMm) reasons.push("verified width is within the requested limit");
  if (intent.minWidthMm && product.verifiedFacts.dimensions && product.widthMm >= intent.minWidthMm) reasons.push("verified width meets the requested minimum");
  if (intent.numberOfSeats && product.numberOfSeatsVerified && product.numberOfSeats === intent.numberOfSeats) reasons.push(`${product.numberOfSeats} verified seats`);
  if (intent.modular && product.verifiedFacts.modular && product.modular) reasons.push("verified modular programme");
  if (intent.functions?.includes("relax") && product.verifiedFacts.functions.includes("relax")) reasons.push("verified relax function");
  if (intent.functions?.includes("electric") && product.verifiedFacts.functions.includes("electric")) reasons.push("verified electric function");
  if (intent.materials?.some((material) => hasVerifiedMaterial(product, material))) reasons.push("verified requested material type");
  return reasons;
}

function structuredScore(product: Product, intent: SearchIntent) {
  let score = 0;
  const reasons: string[] = [];
  if (intent.category) {
    if (!productHasCategory(product, intent.category)) return { score: -1000, reasons };
    score += 25; reasons.push(`requested ${intent.category}`);
  }
  if (intent.colorFamilies?.length) {
    if (intent.colorFamilies.some((color) => product.colors.includes(color.toLowerCase()))) {
      score += 25; reasons.push(`requested colour family: ${intent.colorFamilies.join(", ")}`);
    } else score -= 35;
  }
  if (intent.maxWidthMm) {
    if (product.widthMm <= intent.maxWidthMm) { score += 18; reasons.push(`width ${product.widthMm} mm is within the limit`); }
    else score -= 60;
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
    if (product.numberOfSeatsVerified && product.numberOfSeats === intent.numberOfSeats) { score += 12; reasons.push(`${product.numberOfSeats} verified seats`); }
    else score -= 8;
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

export async function hybridCatalogueSearch(intent: SearchIntent, semantic: SemanticRetrievalProvider = new LocalSemanticRetrievalProvider()): Promise<GroundedSearch> {
  const active = products.filter((product) => product.active);
  const categoryProducts = active.filter((product) => !intent.category || productHasCategory(product, intent.category));
  const categoryAvailable = categoryProducts.length > 0;
  const unverifiedRequirements = intent.layoutShapes?.filter((shape) =>
    !categoryProducts.some((product) => product.layoutShapes?.includes(shape))
  ).map((shape) => `${shape} layout`) ?? [];
  const code = intent.queryText.match(/\bMR\s*-?\s*\d{3,4}\b/i)?.[0].replace(/[\s-]+/g, " ").toUpperCase();
  const semanticScores = new Map((await semantic.rank(intent.queryText, active)).map((item) => [item.id, item.score]));
  const ranked = active.map((product) => {
    const structured = structuredScore(product, intent);
    const exactCode = code === product.modelCode;
    return {
      product,
      score: structured.score + (semanticScores.get(product.id) ?? 0) + (exactCode ? 200 : 0),
      reasons: exactCode ? [`exact product code ${product.modelCode}`, ...verifiedMatchReasons(product, intent)] : verifiedMatchReasons(product, intent)
    };
  }).sort((left, right) => right.score - left.score || left.product.modelCode.localeCompare(right.product.modelCode));
  const requestedColors = intent.colorFamilies?.map((color) => color.toLowerCase()) ?? [];
  const exactColorAvailable = !requestedColors.length || active.some((product) =>
    (!intent.category || productHasCategory(product, intent.category)) && requestedColors.some((color) => product.verifiedFacts.colors.includes(color))
  );
  const exactMatches = ranked.filter(({ product, score }) =>
    score > -100 && satisfiesVerifiedIntent(product, intent)
  ).slice(0, 12);
  const exactIds = new Set(exactMatches.map(({ product }) => product.id));
  const isRelevantAlternative = (product: Product) => {
    const checks: boolean[] = [];
    if (requestedColors.length) checks.push(requestedColors.some((color) => product.verifiedFacts.colors.includes(color)));
    if (intent.maxWidthMm) checks.push(product.verifiedFacts.dimensions && product.widthMm <= intent.maxWidthMm);
    if (intent.minWidthMm) checks.push(product.verifiedFacts.dimensions && product.widthMm >= intent.minWidthMm);
    if (intent.targetWidthMm) checks.push(product.verifiedFacts.dimensions && Math.abs(product.widthMm - intent.targetWidthMm) <= Math.max(100, Math.round(intent.targetWidthMm * 0.03)));
    if (intent.minSeatHeightMm) checks.push(product.verifiedFacts.seatHeight && product.seatHeightMm >= intent.minSeatHeightMm);
    if (intent.maxSeatDepthMm) checks.push(product.verifiedFacts.seatDepth && product.seatDepthMm <= intent.maxSeatDepthMm);
    if (intent.numberOfSeats) checks.push(product.numberOfSeatsVerified && product.numberOfSeats === intent.numberOfSeats);
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
    (!intent.category || productHasCategory(product, intent.category)) &&
    // Preserve an explicitly requested colour whenever the catalogue has that
    // colour in the requested category. A request such as "red sofa" must not
    // be followed by a wall of beige and grey sofas. Wrong-colour alternatives
    // are useful only when the requested colour is unavailable altogether.
    (!requestedColors.length || !exactColorAvailable || requestedColors.some((color) => product.verifiedFacts.colors.includes(color))) &&
    isRelevantAlternative(product)
  ).slice(0, 6).map((match) => ({
    ...match,
    reasons: requestedColors.length && !requestedColors.some((color) => match.product.verifiedFacts.colors.includes(color))
      ? [`not available in requested ${requestedColors.join(", ")}`, ...match.reasons]
      : match.reasons.length ? match.reasons : ["same requested category; other requested facts are not verified"]
  }));
  return { exactMatches, closeAlternatives, exactColorAvailable, categoryAvailable, unverifiedRequirements };
}

export function searchCatalogueByVisualTags(tags: VisualTags) {
  // An unrelated or unclear upload must never be turned into an arbitrary
  // Musterring recommendation merely because catalogue products exist.
  if (!tags.category) return [];
  const isCompatibleCategory = (productCategory: Product["category"]) =>
    productCategory === tags.category ||
    ((tags.category === "sectional" || tags.category === "sofa") &&
      (productCategory === "sectional" || productCategory === "sofa"));
  const active = products.filter((product) => product.active);
  return active.map((product) => {
    let score = 0;
    const reasons: string[] = [];
    if (product.category === tags.category) { score += 35; reasons.push("same furniture category"); }
    else if (isCompatibleCategory(product.category)) { score += 30; reasons.push("same sofa family"); }
    const colors = tags.colorFamilies.filter((color) => product.colors.includes(color.toLowerCase()));
    if (colors.length) { score += 30; reasons.push(`similar ${colors.join(", ")} colour family`); }
    const styles = tags.style.filter((style) => product.styles.some((candidate) => candidate.includes(style) || style.includes(candidate)));
    if (styles.length) { score += 20; reasons.push("related style"); }
    if (tags.likelyMaterial) {
      const hasMaterial = materials.some((material) => product.materials.includes(material.id) && material.type === tags.likelyMaterial);
      if (hasMaterial) { score += 15; reasons.push(`offers ${tags.likelyMaterial}`); }
    }
    return { product, score, reasons };
  }).filter((match) => isCompatibleCategory(match.product.category))
    .sort((left, right) => right.score - left.score)
    .slice(0, 12);
}
