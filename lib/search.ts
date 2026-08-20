import { materials, products } from "./data";
import { productHasCategory, type Product, type SearchFilters } from "./types";

export const searchColorTerms = ["beige", "ivory", "taupe", "stone", "charcoal", "black", "white", "brown", "oak", "natural", "cream", "green", "grey", "graphite", "red", "burgundy", "barolo", "purple", "blue", "orange", "pink", "yellow", "mustard", "cognac", "sand"];
export const searchStyleTerms = ["modern", "minimal", "contemporary", "classic", "industrial", "natural", "elegant", "family"];
const stopWords = new Set(["want", "something", "like", "this", "that", "with", "from", "have", "need", "looking", "product", "piece", "please", "show", "find", "furniture", "maximum", "about"]);
const corrections: Record<string, string> = {
  wnat: "want",
  prodcut: "product",
  couchs: "couch",
  confortable: "comfortable",
  grey: "gray",
  modularer: "modular"
};

const phraseAliases: Array<[RegExp, string]> = [
  [/\bbleck\b|\bblak\b/g, "black"],
  [/\bsettee\b|\bdivan\b/g, "sofa"],
  [/\bloveseat\b/g, "two seat sofa"],
  [/\bcupboard\b|\bside board\b/g, "cabinet"],
  [/\bkueche\b|\bküche\b/g, "kitchen"],
  [/\beckküche\b|\beckkueche\b/g, "l shaped kitchen"],
  [/\bpflegeleicht\b/g, "easy care"],
  [/\bmindestens\b|\bwenigstens\b/g, "at least"],
  [/\bhöchstens\b|\bhoechstens\b/g, "at most"],
  [/\bunter\b|\bbis\b/g, "at most"],
  [/\bmaximale breite\b/g, "maximum width"],
  [/\büber\b|\bueber\b/g, "above"]
];

export function normalizeSearchText(value: string) {
  let normalized = value.toLowerCase().normalize("NFKC");
  for (const [pattern, replacement] of phraseAliases) normalized = normalized.replace(pattern, replacement);
  return normalized
    .replace(/\bbeig(?:e|es|er|en|em)?\b/g, "beige")
    .replace(/\brot(?:es|er|e)?\b/g, "red")
    .replace(/\bgrau(?:es|er|e)?\b/g, "grey")
    .replace(/\bbraun(?:es|er|e)?\b/g, "brown")
    .replace(/\bgr(?:ü|ue)n(?:es|er|e)?\b/g, "green")
    .replace(/\bwei(?:ß|ss)(?:es|er|e)?\b/g, "white");
}

function measurementToMm(value: string, unit: string) {
  const numeric = Number(value.replace(",", "."));
  if (!Number.isFinite(numeric)) return undefined;
  if (/^m(?:etre|eter)?s?$/.test(unit)) return Math.round(numeric * 1000);
  if (/^mm|millimet/.test(unit)) return Math.round(numeric);
  return Math.round(numeric * 10);
}

function widthConstraints(text: string) {
  const amount = "(\\d+(?:[.,]\\d+)?)\\s*(mm|millimet(?:er|re)s?|cm|centimet(?:er|re)s?|m|met(?:er|re)s?)";
  const minimum = text.match(new RegExp(`(?:above|over|more than|at least|minimum|min\\.?|greater than)\\s*${amount}(?:\\s+(?:wide|width))?`, "i"));
  const maximum = text.match(new RegExp(`(?:under|below|less than|at most|maximum(?: width)?|max\\.?(?: width)?|no wider than|up to)\\s*${amount}(?:\\s+(?:wide|width))?`, "i"));
  const approximate = text.match(new RegExp(`(?:around|about|approximately|approx\\.?|roughly)\\s*${amount}(?:\\s+(?:wide|width))?`, "i"));
  const between = text.match(new RegExp(`between\\s*${amount}\\s*(?:and|to|-)\\s*${amount}`, "i"));
  if (between) return { minWidthMm: measurementToMm(between[1], between[2]), maxWidthMm: measurementToMm(between[3], between[4]) };
  if (minimum) return { minWidthMm: measurementToMm(minimum[1], minimum[2]) };
  if (maximum) return { maxWidthMm: measurementToMm(maximum[1], maximum[2]) };
  if (approximate) return { targetWidthMm: measurementToMm(approximate[1], approximate[2]) };
  const bare = text.match(new RegExp(`${amount}(?:\\s+(?:wide|width|sofa|couch|kitchen))`, "i"));
  return bare ? { targetWidthMm: measurementToMm(bare[1], bare[2]) } : {};
}

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
  const text = normalizeSearchText(q);
  const filters: SearchFilters = { q };
  if (/dining chair|dining seat|esszimmerstuhl|stuhl/.test(text)) filters.category = "dining-chair";
  else if (/armchair|accent chair|recliner|\bchair\b|sessel/.test(text)) filters.category = "armchair";
  else if (/sectional|corner sofa|corner couch|chaise|ecksofa|wohnlandschaft/.test(text)) filters.category = "sectional";
  else if (/sofa|couch/.test(text)) filters.category = "sofa";
  else if (/coffee table|side table|couchtisch|beistelltisch/.test(text)) filters.category = "coffee-table";
  else if (/dining table|esstisch/.test(text)) filters.category = "dining-table";
  else if (/wardrobe|closet|kleiderschrank/.test(text)) filters.category = "wardrobe";
  else if (/bedroom series|bedroom furniture|schlafzimmerprogramm/.test(text)) filters.category = "bedroom-series";
  else if (/\bbed\b|upholstered bed|boxspring|mattress|topper|slatted frame|bett/.test(text)) filters.category = "bed";
  else if (/bathroom|bath furniture|badmoebel|badmöbel/.test(text)) filters.category = "bathroom";
  else if (/\bkitchen\b|\bkitchen unit\b|\bkitchen programme\b/.test(text)) filters.category = "kitchen";
  else if (/outdoor|garden furniture|patio|gartenmoebel|gartenmöbel/.test(text)) filters.category = "outdoor";
  else if (/carpet|\brug\b|teppich/.test(text)) filters.category = "carpet";
  else if (/\blamp\b|lighting|leuchte/.test(text)) filters.category = "lamp";
  else if (/home textile|bed linen|bedding|plaid|cushion cover|comforter/.test(text)) filters.category = "home-textile";
  else if (/small furniture|occasional furniture/.test(text)) filters.category = "small-furniture";
  else if (/hallway|cloakroom|coat rack|shoe cupboard|entrance furniture|living wall|wall unit|media unit|tv unit|sideboard|cabinet|storage/.test(text)) filters.category = "storage";
  const code = text.match(/\bmr\s*-?\s*\d{3,4}\b/i)?.[0]?.replace(/[\s-]+/g, " ").toUpperCase();
  if (code) filters.modelCode = code;
  Object.assign(filters, widthConstraints(text));
  const layoutShapes: NonNullable<SearchFilters["layoutShapes"]> = [];
  if (/\bl[- ](?:shaped[- ]?)?(?:sofa|couch)\b/.test(text)) layoutShapes.push("l-shaped");
  if (/\bl[- ]shaped\b|\bl shape\b|\bcorner kitchen\b|\bwinkelk(?:ü|ue)che\b/.test(text)) layoutShapes.push("l-shaped");
  if (/\bu[- ]shaped\b|\bu shape\b/.test(text)) layoutShapes.push("u-shaped");
  if (/\bstraight(?: line)?\b|\bsingle[- ]wall\b|\bkitchen run\b/.test(text)) layoutShapes.push("straight");
  if (/\bisland\b|\bkitchen island\b/.test(text)) layoutShapes.push("island");
  if (layoutShapes.length) filters.layoutShapes = [...new Set(layoutShapes)];
  const seats = text.match(/(\d)\s*(?:seat|seater|sitzer)/);
  const seatWord = text.match(/\b(two|three|four)[- ](?:seat|seater)\b/)?.[1];
  if (seats) filters.seatCount = Number(seats[1]);
  else if (seatWord) filters.seatCount = { two: 2, three: 3, four: 4 }[seatWord];
  const colors = searchColorTerms.filter((color) => new RegExp(`\\b${color.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(text));
  if (colors.length) filters.colors = colors;
  const styles = searchStyleTerms.filter((style) => new RegExp(`\\b${style}\\b`).test(text));
  if (styles.length) filters.styles = styles;
  if (/modular|module|flexible/.test(text)) filters.modular = true;
  if (/small|compact|apartment|wohnung|klein/.test(text)) filters.smallSpaceSuitable = true;
  if (/high[- ]seat|tall person|hohe sitzhÃ¶he|hohe sitzhöhe|gro(?:ÃŸ|ß|ss)e person/.test(text)) filters.minSeatHeightMm = 470;
  if (/relax|recline|lounge|entspannungsfunktion/.test(text)) filters.relaxFunction = true;
  if (/electric|elektrisch|motor|power/.test(text)) filters.electricFunctions = true;
  return filters;
}

export function productMatches(product: Product, filters: SearchFilters) {
  if (filters.modelCode && product.modelCode !== filters.modelCode) return false;
  if (filters.category && !productHasCategory(product, filters.category)) return false;
  if (filters.maxWidthMm && (!product.verifiedFacts.dimensions || product.widthMm > filters.maxWidthMm)) return false;
  if (filters.minWidthMm && (!product.verifiedFacts.dimensions || product.widthMm < filters.minWidthMm)) return false;
  if (filters.targetWidthMm && (!product.verifiedFacts.dimensions || Math.abs(product.widthMm - filters.targetWidthMm) > Math.max(100, Math.round(filters.targetWidthMm * 0.03)))) return false;
  if (filters.maxDepthMm && (!product.verifiedFacts.dimensions || product.depthMm > filters.maxDepthMm)) return false;
  if (filters.minSeatHeightMm && (!product.verifiedFacts.seatHeight || product.seatHeightMm < filters.minSeatHeightMm)) return false;
  if (filters.maxSeatDepthMm && (!product.verifiedFacts.seatDepth || product.seatDepthMm > filters.maxSeatDepthMm)) return false;
  if (filters.seatCount && (!product.numberOfSeatsVerified || product.numberOfSeats !== filters.seatCount)) return false;
  if (filters.modular && (!product.verifiedFacts.modular || !product.modular)) return false;
  if (filters.smallSpaceSuitable && (!product.verifiedFacts.smallSpaceSuitable || !product.smallSpaceSuitable)) return false;
  if (filters.layoutShapes?.length && !filters.layoutShapes.some((shape) => product.layoutShapes?.includes(shape))) return false;
  if (filters.relaxFunction && !product.verifiedFacts.functions.includes("relax")) return false;
  if (filters.electricFunctions && !product.verifiedFacts.functions.includes("electric")) return false;
  if (filters.colors?.length && !filters.colors.some((color) => product.verifiedFacts.colors.includes(color))) return false;
  if (filters.materials?.length && !filters.materials.some((requested) => {
    const requestedType = materials.find((material) => material.id === requested)?.type ?? requested;
    return product.verifiedFacts.materialTypes.includes(requestedType as "fabric" | "leather");
  })) return false;
  if (filters.styles?.length && !filters.styles.some((style) => product.verifiedFacts.styles.includes(style))) return false;
  if (filters.collections?.length && !filters.collections.includes(product.collection)) return false;
  if (filters.q && !filters.modelCode) {
    const haystack = `${product.name} ${product.subtitle} ${product.description} ${product.modelCode} ${(product.categories ?? [product.category]).join(" ")} ${product.colors.join(" ")} ${product.styles.join(" ")} ${product.functions.join(" ")} ${Math.round(product.widthMm / 10)} cm`.toLowerCase();
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
  const active = products.filter((product) => product.active);
  const verifiedMatches = active.filter((product) => productMatches(product, { ...parsed, q: undefined }));
  const candidates = verifiedMatches.length ? verifiedMatches : active.filter((product) =>
    (!requestedCategory || productHasCategory(product, requestedCategory)) &&
    (!parsed.modelCode || product.modelCode === parsed.modelCode)
  );

  return candidates
    .map((product) => {
      const copy = [
        product.modelCode,
        product.name,
        product.subtitle,
        product.description,
        ...(product.categories ?? [product.category]),
        ...product.colors,
        ...product.styles,
        ...product.functions
      ].join(" ").toLowerCase();
      const productTokens = tokens(copy);
      const reasons: string[] = [];
      let score = 1;

      if (requestedCategory) {
        if (!productHasCategory(product, requestedCategory)) score -= 30;
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
