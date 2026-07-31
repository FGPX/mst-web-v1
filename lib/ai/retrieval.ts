import { materials, products } from "../data";
import type { Product } from "../types";
import type { SearchIntent, VisualTags } from "./schemas";

export type GroundedMatch = { product: Product; score: number; reasons: string[] };
export type GroundedSearch = { exactMatches: GroundedMatch[]; closeAlternatives: GroundedMatch[]; exactColorAvailable: boolean };

export interface SemanticRetrievalProvider {
  rank(query: string, candidates: Product[]): Promise<Array<{ id: string; score: number }>>;
}

export class LocalSemanticRetrievalProvider implements SemanticRetrievalProvider {
  async rank(query: string, candidates: Product[]) {
    const terms = [...new Set(query.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 2))];
    return candidates.map((product) => {
      const text = [product.modelCode, product.name, product.subtitle, product.description, product.category, ...product.colors, ...product.styles, ...product.functions].join(" ").toLowerCase();
      const overlap = terms.filter((term) => text.includes(term)).length;
      const trigrams = new Set(Array.from({ length: Math.max(0, query.length - 2) }, (_, index) => query.toLowerCase().slice(index, index + 3)));
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

function structuredScore(product: Product, intent: SearchIntent) {
  let score = 0;
  const reasons: string[] = [];
  if (intent.category) {
    if (product.category !== intent.category) return { score: -1000, reasons };
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
  if (intent.minSeatHeightMm) {
    if (product.seatHeightMm >= intent.minSeatHeightMm) { score += 15; reasons.push(`seat height ${product.seatHeightMm} mm meets the preference`); }
    else score -= 25;
  }
  if (intent.maxSeatDepthMm) {
    if (product.seatDepthMm <= intent.maxSeatDepthMm) score += 10;
    else score -= 15;
  }
  if (intent.numberOfSeats) {
    if (product.numberOfSeats === intent.numberOfSeats) { score += 12; reasons.push(`${product.numberOfSeats} seats`); }
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
  return { score, reasons };
}

export async function hybridCatalogueSearch(intent: SearchIntent, semantic: SemanticRetrievalProvider = new LocalSemanticRetrievalProvider()): Promise<GroundedSearch> {
  const active = products.filter((product) => product.active);
  const code = intent.queryText.match(/\bMR\s*-?\s*\d{3,4}\b/i)?.[0].replace(/[\s-]+/g, " ").toUpperCase();
  const semanticScores = new Map((await semantic.rank(intent.queryText, active)).map((item) => [item.id, item.score]));
  const ranked = active.map((product) => {
    const structured = structuredScore(product, intent);
    const exactCode = code === product.modelCode;
    return {
      product,
      score: structured.score + (semanticScores.get(product.id) ?? 0) + (exactCode ? 200 : 0),
      reasons: exactCode ? [`exact product code ${product.modelCode}`, ...structured.reasons] : structured.reasons
    };
  }).sort((left, right) => right.score - left.score || left.product.modelCode.localeCompare(right.product.modelCode));
  const requestedColors = intent.colorFamilies?.map((color) => color.toLowerCase()) ?? [];
  const exactColorAvailable = !requestedColors.length || active.some((product) =>
    (!intent.category || product.category === intent.category) && requestedColors.some((color) => product.colors.includes(color))
  );
  const exactMatches = ranked.filter(({ product, score }) =>
    score > -100 &&
    (!intent.category || product.category === intent.category) &&
    (!requestedColors.length || requestedColors.some((color) => product.colors.includes(color))) &&
    (!intent.maxWidthMm || product.widthMm <= intent.maxWidthMm) &&
    (!intent.minSeatHeightMm || product.seatHeightMm >= intent.minSeatHeightMm) &&
    (!intent.modular || product.modular) &&
    (!intent.smallSpaceSuitable || product.smallSpaceSuitable) &&
    (!intent.functions?.includes("relax") || product.functions.includes("relax")) &&
    (!intent.functions?.includes("electric") || product.electricFunctions.length > 0) &&
    (!intent.functions?.includes("easy-care") || productFacts(product).materialFacts.some((material) => material.easyCare)) &&
    (!intent.numberOfSeats || product.numberOfSeats === intent.numberOfSeats) &&
    (!intent.materials?.length || intent.materials.some((requested) => materials.some((material) => product.materials.includes(material.id) && (material.id === requested || material.type === requested.toLowerCase() || material.name.toLowerCase().includes(requested.toLowerCase())))))
  ).slice(0, 12);
  const exactIds = new Set(exactMatches.map(({ product }) => product.id));
  const isRelevantAlternative = (product: Product) => {
    const checks: boolean[] = [];
    if (requestedColors.length) checks.push(requestedColors.some((color) => product.colors.includes(color)));
    if (intent.maxWidthMm) checks.push(product.widthMm <= intent.maxWidthMm);
    if (intent.minSeatHeightMm) checks.push(product.seatHeightMm >= intent.minSeatHeightMm);
    if (intent.maxSeatDepthMm) checks.push(product.seatDepthMm <= intent.maxSeatDepthMm);
    if (intent.numberOfSeats) checks.push(product.numberOfSeats === intent.numberOfSeats);
    if (intent.modular) checks.push(product.modular);
    if (intent.smallSpaceSuitable) checks.push(product.smallSpaceSuitable);
    if (intent.functions?.includes("relax")) checks.push(product.functions.includes("relax"));
    if (intent.functions?.includes("electric")) checks.push(product.electricFunctions.length > 0);
    if (intent.functions?.includes("easy-care")) checks.push(productFacts(product).materialFacts.some((material) => material.easyCare));
    if (intent.materials?.length) {
      checks.push(intent.materials.some((requested) =>
        productFacts(product).materialFacts.some((material) =>
          material.id === requested || material.type === requested.toLowerCase() || material.name.toLowerCase().includes(requested.toLowerCase())
        )
      ));
    }
    if (!checks.length) return true;
    const requiredMatches = Math.max(0, checks.length - 1);
    return checks.filter(Boolean).length >= requiredMatches;
  };
  const closeAlternatives = ranked.filter(({ product }) =>
    !exactIds.has(product.id) &&
    (!intent.category || product.category === intent.category) &&
    isRelevantAlternative(product)
  ).slice(0, 6).map((match) => ({
    ...match,
    reasons: requestedColors.length && !requestedColors.some((color) => match.product.colors.includes(color))
      ? [`not available in requested ${requestedColors.join(", ")}`, ...match.reasons]
      : match.reasons
  }));
  return { exactMatches, closeAlternatives, exactColorAvailable };
}

export function searchCatalogueByVisualTags(tags: VisualTags) {
  const active = products.filter((product) => product.active);
  return active.map((product) => {
    let score = 0;
    const reasons: string[] = [];
    if (tags.category && product.category === tags.category) { score += 35; reasons.push("same furniture category"); }
    const colors = tags.colorFamilies.filter((color) => product.colors.includes(color.toLowerCase()));
    if (colors.length) { score += 30; reasons.push(`similar ${colors.join(", ")} colour family`); }
    const styles = tags.style.filter((style) => product.styles.some((candidate) => candidate.includes(style) || style.includes(candidate)));
    if (styles.length) { score += 20; reasons.push("related style"); }
    if (tags.likelyMaterial) {
      const hasMaterial = materials.some((material) => product.materials.includes(material.id) && material.type === tags.likelyMaterial);
      if (hasMaterial) { score += 15; reasons.push(`offers ${tags.likelyMaterial}`); }
    }
    return { product, score, reasons };
  }).filter((match) => !tags.category || match.product.category === tags.category)
    .sort((left, right) => right.score - left.score)
    .slice(0, 12);
}
