import { products } from "./data";
import type { Product, SearchFilters } from "./types";

const colorTerms = ["beige", "ivory", "taupe", "stone", "charcoal", "brown", "cream", "green", "grey", "graphite", "red", "burgundy", "barolo", "purple"];
const stopWords = new Set(["want", "something", "like", "this", "that", "with", "from", "have", "need", "looking", "product", "piece", "please", "show", "find", "furniture", "maximum", "about"]);
const corrections: Record<string, string> = {
  wnat: "want",
  prodcut: "product",
  couchs: "couch",
  confortable: "comfortable",
  grey: "gray",
  modularer: "modular"
};

export type RankedProduct = {
  product: Product;
  score: number;
  reasons: string[];
};

function tokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => corrections[token] ?? token);
}

function editDistanceAtMostOne(left: string, right: string) {
  if (Math.abs(left.length - right.length) > 1) return false;
  if (left === right) return true;
  let edits = 0;
  for (let i = 0, j = 0; i < left.length && j < right.length;) {
    if (left[i] === right[j]) { i += 1; j += 1; continue; }
    edits += 1;
    if (edits > 1) return false;
    if (left.length > right.length) i += 1;
    else if (right.length > left.length) j += 1;
    else { i += 1; j += 1; }
  }
  return true;
}

function tokenMatches(queryToken: string, candidate: string) {
  return candidate === queryToken ||
    (queryToken.length >= 4 && candidate.startsWith(queryToken)) ||
    (queryToken.length >= 5 && editDistanceAtMostOne(queryToken, candidate));
}

export function parseSearchQuery(query: string): SearchFilters {
  const q = query.trim();
  const text = q.toLowerCase()
    .replace(/\brot(?:es|er|e)?\b/g, "red")
    .replace(/\bgrau(?:es|er|e)?\b/g, "grey")
    .replace(/\bbraun(?:es|er|e)?\b/g, "brown")
    .replace(/\bgrÃ¼n(?:es|er|e)?\b|\bgrün(?:es|er|e)?\b/g, "green")
    .replace(/\bweiÃŸ(?:es|er|e)?\b|\bweiß(?:es|er|e)?\b/g, "white");
  const filters: SearchFilters = { q };
  if (/living wall|wall unit|media unit|tv unit|sideboard|cabinet|storage/.test(text)) filters.category = "storage";
  if (/armchair|chair|sessel/.test(text)) filters.category = "armchair";
  if (/sectional|corner|chaise|eck|wohnlandschaft/.test(text)) filters.category = "sectional";
  if (/sofa|couch/.test(text)) filters.category = "sofa";
  const code = text.match(/\bmr\s?-?\d{4}\b/i)?.[0]?.replace(/\s|-/, " ").toUpperCase();
  if (code) filters.modelCode = code;
  const width = text.match(/(?:max(?:imum)?|under|below|unter|bis|maximale breite|maximum width)?\s*(\d{2,3})\s*(?:cm|centimeter)/);
  if (width) filters.maxWidthMm = Number(width[1]) * 10;
  const seats = text.match(/(\d)\s*(?:seat|seater|sitzer)/);
  const seatWord = text.match(/\b(two|three|four)[- ](?:seat|seater)\b/)?.[1];
  if (seats) filters.seatCount = Number(seats[1]);
  else if (seatWord) filters.seatCount = { two: 2, three: 3, four: 4 }[seatWord];
  const colors = colorTerms.filter((color) => text.includes(color));
  if (colors.length) filters.colors = colors;
  if (/modular|module|flexible/.test(text)) filters.modular = true;
  if (/small|compact|apartment|wohnung|klein/.test(text)) filters.smallSpaceSuitable = true;
  if (/high[- ]seat|tall person|hohe sitzhÃ¶he|hohe sitzhöhe|gro(?:ÃŸ|ß|ss)e person/.test(text)) filters.minSeatHeightMm = 470;
  if (/relax|recline|lounge|entspannungsfunktion/.test(text)) filters.relaxFunction = true;
  if (/electric|elektrisch|motor|power/.test(text)) filters.electricFunctions = true;
  return filters;
}

export function productMatches(product: Product, filters: SearchFilters) {
  if (filters.modelCode && product.modelCode !== filters.modelCode) return false;
  if (filters.category && product.category !== filters.category) return false;
  if (filters.maxWidthMm && product.widthMm > filters.maxWidthMm) return false;
  if (filters.maxDepthMm && product.depthMm > filters.maxDepthMm) return false;
  if (filters.minSeatHeightMm && product.seatHeightMm < filters.minSeatHeightMm) return false;
  if (filters.maxSeatDepthMm && product.seatDepthMm > filters.maxSeatDepthMm) return false;
  if (filters.seatCount && product.numberOfSeats !== filters.seatCount) return false;
  if (filters.modular && !product.modular) return false;
  if (filters.smallSpaceSuitable && !product.smallSpaceSuitable) return false;
  if (filters.relaxFunction && !product.functions.includes("relax")) return false;
  if (filters.electricFunctions && product.electricFunctions.length === 0) return false;
  if (filters.colors?.length && !filters.colors.some((color) => product.colors.includes(color))) return false;
  if (filters.materials?.length && !filters.materials.some((id) => product.materials.includes(id))) return false;
  if (filters.styles?.length && !filters.styles.some((style) => product.styles.includes(style))) return false;
  if (filters.collections?.length && !filters.collections.includes(product.collection)) return false;
  if (filters.q && !filters.modelCode) {
    const haystack = `${product.name} ${product.subtitle} ${product.description} ${product.modelCode} ${product.category} ${product.colors.join(" ")}`.toLowerCase();
    const usefulTerms = filters.q.toLowerCase().split(/\W+/).filter((term) => term.length > 2 && !["need", "with", "for", "the", "and", "maximum"].includes(term));
    return usefulTerms.length === 0 || usefulTerms.some((term) => haystack.includes(term));
  }
  return true;
}

export function searchProducts(filters: SearchFilters) {
  return products.filter((product) => product.active && productMatches(product, filters));
}

export function matchExplanation(product: Product, filters: SearchFilters) {
  const reasons = [];
  if (filters.modular && product.modular) reasons.push("modular");
  if (filters.maxWidthMm && product.widthMm <= filters.maxWidthMm) reasons.push(`available below ${Math.round(filters.maxWidthMm / 10)} cm`);
  if (filters.colors?.some((color) => product.colors.includes(color))) reasons.push(`offered in ${filters.colors.join(", ")} tones`);
  if (product.smallSpaceSuitable) reasons.push("suited to smaller rooms");
  return reasons.length ? `Strong match because this model is ${reasons.join(", ")}.` : "Recommended from validated product data.";
}

export function searchProductsRanked(query: string, limit = 12): RankedProduct[] {
  const normalized = query.trim().toLowerCase();
  const parsed = parseSearchQuery(query);
  const queryTokens = tokens(query).filter((token) => token.length > 2 && !stopWords.has(token));
  const requestedCategory = parsed.category;
  const wantsLeather = /\bleather\b/.test(normalized);
  const wantsFabric = /\bfabric|textile|boucle|chenille|velvet\b/.test(normalized);
  const wantsComfort = /\bcomfort|comfortable|cosy|cozy|soft|relax|recline|lounge\b/.test(normalized);
  const wantsModern = /\bmodern|minimal|clean|contemporary|design\b/.test(normalized);

  return products
    .filter((product) => product.active)
    .filter((product) => !parsed.colors?.length || parsed.colors.some((color) => product.colors.includes(color)))
    .map((product) => {
      const copy = [
        product.modelCode,
        product.name,
        product.subtitle,
        product.description,
        product.category,
        ...product.colors,
        ...product.styles,
        ...product.functions
      ].join(" ").toLowerCase();
      const productTokens = tokens(copy);
      const reasons: string[] = [];
      let score = 1;

      if (requestedCategory) {
        if (product.category !== requestedCategory) score -= 30;
        else { score += 25; reasons.push(`matches the requested ${requestedCategory}`); }
      }
      const modelDigits = normalized.match(/\b\d{3,4}\b/)?.[0];
      if (modelDigits && product.modelCode.includes(modelDigits)) {
        score += 80;
        reasons.push(`exact model ${product.modelCode}`);
      }

      let lexicalMatches = 0;
      for (const token of queryTokens) {
        if (productTokens.some((candidate) => tokenMatches(token, candidate))) {
          lexicalMatches += 1;
          score += 5;
        }
      }
      if (lexicalMatches) reasons.push(`${lexicalMatches} description keyword${lexicalMatches === 1 ? "" : "s"} matched`);

      if (parsed.colors?.some((color) => product.colors.includes(color))) {
        score += 14;
        reasons.push(`available in the requested colour family`);
      }
      if (parsed.modular && /modular|module|configur|flexib|system|programme/.test(copy)) {
        score += 18;
        reasons.push("flexible or modular configuration");
      }
      if (parsed.smallSpaceSuitable && /compact|small|apartment|space-saving|little floor/.test(copy)) {
        score += 18;
        reasons.push("described for compact spaces");
      }
      if (parsed.relaxFunction && /relax|reclin|comfort|lounge/.test(copy)) {
        score += 16;
        reasons.push("relaxation-focused comfort");
      }
      if (parsed.electricFunctions && /electric|motor|power/.test(copy)) {
        score += 18;
        reasons.push("motorised or electric functions");
      }
      if (wantsLeather && /leather/.test(copy)) { score += 10; reasons.push("leather options"); }
      if (wantsFabric && /fabric|textile|cover|boucle|chenille|velvet/.test(copy)) { score += 10; reasons.push("fabric-led upholstery"); }
      if (wantsComfort && /comfort|cosy|cozy|soft|relax|lounge/.test(copy)) score += 8;
      if (wantsModern && /modern|design|clean|contemporary|elegant/.test(copy)) score += 7;

      return { product, score, reasons: [...new Set(reasons)].slice(0, 3) };
    })
    .filter((result) => result.score > -10)
    .sort((left, right) => right.score - left.score || left.product.modelCode.localeCompare(right.product.modelCode))
    .slice(0, limit);
}
