import { materials, products } from "./data";
import { productHasCategory, type Product, type SearchFilters } from "./types";

export const searchColorTerms = ["beige", "ivory", "taupe", "stone", "charcoal", "black", "white", "brown", "oak", "natural", "cream", "green", "grey", "graphite", "red", "burgundy", "barolo", "purple", "blue", "orange", "pink", "yellow", "mustard", "cognac", "sand"];
const neutralSearchColorTerms = ["beige", "cream", "ivory", "taupe", "stone", "sand", "grey", "charcoal", "graphite", "black", "white", "brown"];
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
  [/\bledersofa\b/g, "leather sofa"],
  [/\bledersessel\b/g, "leather armchair"],
  [/\bstoffsofa\b/g, "fabric sofa"],
  [/\bstoffsessel\b/g, "fabric armchair"],
  [/\bzweisitzer\b/g, "two seat"],
  [/\bdreisitzer\b/g, "three seat"],
  [/\bviersitzer\b/g, "four seat"],
  [/\bkueche\b|\bküche\b/g, "kitchen"],
  [/\beckküche\b|\beckkueche\b/g, "l shaped kitchen"],
  [/\bpflegeleicht(?:e|er|es|en|em)?\b/g, "easy care"],
  [/\bmodern(?:e|er|es|en|em)?\b/g, "modern"],
  [/\belegant(?:e|er|es|en|em)?\b/g, "elegant"],
  [/\bminimalistisch(?:e|er|es|en|em)?\b/g, "minimal"],
  [/\bzeitgenössisch(?:e|er|es|en|em)?\b|\bzeitgenoessisch(?:e|er|es|en|em)?\b/g, "contemporary"],
  [/\bklassisch(?:e|er|es|en|em)?\b/g, "classic"],
  [/\bindustriell(?:e|er|es|en|em)?\b/g, "industrial"],
  [/\bnatürlich(?:e|er|es|en|em)?\b|\bnatuerlich(?:e|er|es|en|em)?\b/g, "natural"],
  [/\bmindestens\b|\bwenigstens\b/g, "at least"],
  [/\bhöchstens\b|\bhoechstens\b/g, "at most"],
  [/\bnicht breiter als\b/g, "no wider than"],
  [/\bweniger als\b/g, "less than"],
  [/\bmehr als\b/g, "more than"],
  [/\bunter\b|\bbis(?:\s+zu)?\b/g, "at most"],
  [/\bmaximale breite\b|\bmaximal\b/g, "maximum width"],
  [/\büber\b|\bueber\b/g, "above"],
  [/\betwa\b|\bungefähr\b|\bungefaehr\b|\bca\.?\b/g, "around"],
  [/\bzwischen\b/g, "between"]
];

export function normalizeSearchText(value: string) {
  let normalized = value.toLowerCase().normalize("NFKC");
  for (const [pattern, replacement] of phraseAliases) normalized = normalized.replace(pattern, replacement);
  return normalized
    .replace(/\bbeig(?:e|es|er|en|em)?\b/g, "beige")
    .replace(/\brot(?:e|er|es|en|em)?\b/g, "red")
    .replace(/\bgrau(?:e|er|es|en|em)?\b/g, "grey")
    .replace(/\bschwarz(?:e|er|es|en|em)?\b/g, "black")
    .replace(/\bbraun(?:e|er|es|en|em)?\b/g, "brown")
    .replace(/\bgr(?:ü|ue)n(?:e|er|es|en|em)?\b/g, "green")
    .replace(/\bwei(?:ß|ss)(?:e|er|es|en|em)?\b/g, "white")
    .replace(/\bblau(?:e|er|es|en|em)?\b/g, "blue")
    .replace(/\bgelb(?:e|er|es|en|em)?\b/g, "yellow")
    .replace(/\b(?:lila|violett)(?:e|er|es|en|em)?\b/g, "purple")
    .replace(/\brosa(?:farben(?:e|er|es|en|em)?)?\b/g, "pink");
}

function measurementToMm(value: string, unit: string) {
  const numeric = Number(value.replace(",", "."));
  if (!Number.isFinite(numeric)) return undefined;
  if (/^m(?:etre|eter)?s?$/.test(unit)) return Math.round(numeric * 1000);
  if (/^mm|millimet/.test(unit)) return Math.round(numeric);
  return Math.round(numeric * 10);
}

function widthConstraints(text: string) {
  const amount = "(\\d+(?:[.,]\\d+)?)\\s*(mm|millimet(?:er|re)s?|cm|centimet(?:er|re)s?|zentimeter|m|met(?:er|re)s?)";
  const widthWord = "(?:wide|width|breit|breite)";
  const minimum = text.match(new RegExp(`(?:above|over|more than|at least|minimum(?: width)?|min\\.?(?: width)?|greater than)(?:\\s+of)?\\s*${amount}(?:\\s+${widthWord})?`, "i"));
  const comparativeMinimum = text.match(new RegExp(`(?<!no\\s)(?:larger|wider)(?:\\s+(?:sofa|couch|furniture|piece|product))?\\s+than\\s*${amount}`, "i"));
  const comparativeMaximum = text.match(new RegExp(`(?:smaller|narrower)(?:\\s+(?:sofa|couch|furniture|piece|product))?\\s+than\\s*${amount}`, "i"));
  const maximum = comparativeMaximum ?? text.match(new RegExp(`(?:under|below|less than|at most|maximum(?: width)?|max\\.?(?: width)?|no wider than|up to)(?:\\s+of)?\\s*${amount}(?:\\s+${widthWord})?`, "i"));
  const approximate = text.match(new RegExp(`(?:around|about|approximately|approx\\.?|roughly)\\s*${amount}(?:\\s+${widthWord})?`, "i"));
  const between = text.match(new RegExp(`between\\s*${amount}\\s*(?:and|und|to|-)\\s*${amount}`, "i"));
  if (between) return { minWidthMm: measurementToMm(between[1], between[2]), maxWidthMm: measurementToMm(between[3], between[4]) };
  if (minimum) return { minWidthMm: measurementToMm(minimum[1], minimum[2]) };
  if (maximum) return { maxWidthMm: measurementToMm(maximum[1], maximum[2]) };
  if (comparativeMinimum) return { minWidthMm: measurementToMm(comparativeMinimum[1], comparativeMinimum[2]) };
  if (approximate) return { targetWidthMm: measurementToMm(approximate[1], approximate[2]) };
  const bare = text.match(new RegExp(`${amount}(?:\\s+(?:wide|width|breit|breite|sofa|couch|kitchen))`, "i"));
  return bare ? { targetWidthMm: measurementToMm(bare[1], bare[2]) } : {};
}

export type SearchExclusions = {
  colors: string[];
  functions: Array<"relax" | "electric">;
  modular: boolean;
};

function isNegatedTerm(text: string, term: string, optionalSuffix = "") {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b(?:not|no|without)\\s+(?:an?\\s+)?${escaped}${optionalSuffix}\\b|\\bnon[- ]${escaped}${optionalSuffix}\\b|\\banything\\s+but\\s+${escaped}\\b`, "i").test(text);
}

export function parseSearchExclusions(query: string): SearchExclusions {
  const text = normalizeSearchText(query);
  return {
    colors: searchColorTerms.filter((color) => isNegatedTerm(text, color)),
    functions: [
      ...(isNegatedTerm(text, "relax", "(?:ation|ing|ed)?(?:\\s+function)?") ? ["relax" as const] : []),
      ...(isNegatedTerm(text, "electric", "(?:al)?(?:\\s+function)?") || isNegatedTerm(text, "motor", "(?:ized)?") || isNegatedTerm(text, "power") ? ["electric" as const] : [])
    ],
    modular: isNegatedTerm(text, "modular") || isNegatedTerm(text, "module")
  };
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
  const exclusions = parseSearchExclusions(q);
  if (/dining bench|upholstered bench/.test(text)) filters.productSubtypes = ["dining-bench"];
  else if (/bedside table|nightstand/.test(text)) filters.productSubtypes = ["bedside-table"];
  else if (/dresser|chest of drawers/.test(text)) filters.productSubtypes = ["dresser"];
  else if (/side table/.test(text)) filters.productSubtypes = ["side-table"];
  else if (/wall unit|living wall/.test(text)) filters.productSubtypes = ["wall-unit"];
  else if (/sideboard/.test(text)) filters.productSubtypes = ["sideboard"];
  if (/outdoor|garden furniture|patio|gartenmoebel|gartenmöbel/.test(text)) filters.category = "outdoor";
  else if (/dining chair|dining seat|esszimmerstuhl|stuhl/.test(text)) filters.category = "dining-chair";
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
  else if (/carpet|\brug\b|teppich/.test(text)) filters.category = "carpet";
  else if (/\blamp\b|lighting|leuchte/.test(text)) filters.category = "lamp";
  else if (/home textile|bed linen|bedding|plaid|cushion cover|comforter/.test(text)) filters.category = "home-textile";
  else if (/small furniture|occasional furniture/.test(text)) filters.category = "small-furniture";
  else if (/hallway|cloakroom|coat rack|shoe cupboard|entrance furniture|living wall|wall unit|media unit|tv unit|sideboard|cabinet|storage|wohnwand|schrank/.test(text)) filters.category = "storage";
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
  const seats = text.match(/(\d{1,2})\s*[- ]?\s*(?:seat|seater|sitzer)/);
  const seatWord = text.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)[- ](?:seat|seater)\b/)?.[1];
  const peopleCount = text.match(/\b(?:for|seat(?:s|ing)?|accommodat(?:e|es|ing)|family of|household of)\s+(?:a\s+)?(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)(?:\s+(?:people|persons?|adults?|diners?))?\b/)?.[1];
  const numberWords: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
    seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12
  };
  if (seats) filters.seatCount = Number(seats[1]);
  else if (seatWord) filters.seatCount = numberWords[seatWord];
  else if (peopleCount) filters.seatCount = numberWords[peopleCount] ?? Number(peopleCount);
  const colors = searchColorTerms.filter((color) => !exclusions.colors.includes(color) && new RegExp(`\\b${color.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(text));
  if (/\b(?:other\s+)?neutral\s+(?:colou?rs?|tones?|shades?)\b/.test(text)) {
    colors.push(...neutralSearchColorTerms.filter((color) => !exclusions.colors.includes(color)));
  }
  if (colors.length) filters.colors = [...new Set(colors)];
  const styles = searchStyleTerms.filter((style) => new RegExp(`\\b${style}\\b`).test(text));
  if (styles.length) filters.styles = styles;
  if (/\b(?:leather|leder)(?:bezug)?\b/.test(text)) filters.materials = ["leather"];
  else if (/\b(?:fabric|textile?|stoff|polsterstoff)(?:bezug)?\b/.test(text)) filters.materials = ["fabric"];
  if (!exclusions.modular && /\b(?:modular(?:e|er|es|en|em)?|modules?|flexible?)\b/.test(text)) filters.modular = true;
  if (/\b(?:small|compact|apartment|wohnung|klein)\b/.test(text)) filters.smallSpaceSuitable = true;
  if (/high[- ]seat|tall person|hohe(?:r|n|m|s)? sitzh(?:ö|oe)he|gro(?:ß|ss)e(?:r|n|m|s)? person/.test(text)) filters.minSeatHeightMm = 470;
  if (!exclusions.functions.includes("relax") && /\b(?:relax(?:ation|ing|ed|funktion)?|reclin(?:e|er|ing|ed)|lounge|entspannungsfunktion)\b/.test(text)) filters.relaxFunction = true;
  if (!exclusions.functions.includes("electric") && /\b(?:electric(?:al|ally)?|elektrisch(?:e|er|es|en|em)?|motor(?:ized)?|power(?:ed)?)\b/.test(text)) filters.electricFunctions = true;
  if (/\bextendable\b|extension table|auszieh/.test(text)) filters.extendable = true;
  else if (
    filters.category === "dining-table" &&
    /\b(?:weekends?|occasionally|sometimes|grandchildren|guests?|visitors?|friends? visit|family visit|come over)\b/.test(text)
  ) filters.extendable = true;
  if (/sliding door|sliding wardrobe|schwebet(?:u|ü)r|schiebet(?:u|ü)r/.test(text)) filters.slidingDoors = true;
  const bedSize = text.match(/\b(90|120|140|160|180|200)\s*[x×]\s*(190|200|210|220)\b/);
  if (bedSize) filters.bedWidthMm = Number(bedSize[1]) * 10;
  if (/easy[- ]care|easy to clean|pflegeleicht/.test(text)) filters.easyCare = true;
  if (/weather[- ]resistant|weatherproof|wind and weather|wetterfest/.test(text)) filters.weatherResistant = true;
  if (/sofa[- ]bed|sleeper sofa|bed function|schlafsofa/.test(text)) filters.sofaBed = true;
  if (/with storage|integrated storage|storage compartment|bettkasten/.test(text)) filters.integratedStorage = true;
  if (filters.category === "dining-table") {
    const tabletopShapes: NonNullable<SearchFilters["tabletopShapes"]> = [];
    if (/\bround\b|rund/.test(text)) tabletopShapes.push("round");
    if (/\boval\b/.test(text)) tabletopShapes.push("oval");
    if (/\bsquare\b|quadratisch/.test(text)) tabletopShapes.push("square");
    if (/\brectangular\b|rechteckig/.test(text)) tabletopShapes.push("rectangular");
    if (tabletopShapes.length) filters.tabletopShapes = tabletopShapes;
  }
  const lumenTarget = text.match(/(?:around|about|approximately|approx\.?|roughly)?\s*(\d{2,4})\s*(?:lm|lumens?)/);
  if (lumenTarget) { filters.minLumens = Math.max(0, Number(lumenTarget[1]) - 75); filters.maxLumens = Number(lumenTarget[1]) + 75; }
  return filters;
}

export function productMatches(product: Product, filters: SearchFilters) {
  const categorySubtype =
    filters.category === "dining-table"
      ? "dining-table"
      : filters.category === "dining-chair"
        ? "dining-chair"
        : null;
  const verified = (path: string) => product.dataQuality?.verifiedFields.includes(path) === true;
  const verifiedConfigurations = (product.configurations ?? []).filter((configuration) => configuration.dimensions && configuration.dataQuality.verifiedFields.includes("dimensions"));
  if (filters.modelCode && product.modelCode !== filters.modelCode) return false;
  if (
    filters.category &&
    !productHasCategory(product, filters.category) &&
    !(categorySubtype && product.productSubtypes?.includes(categorySubtype))
  ) return false;
  if (filters.productSubtypes?.length && (!verified("productSubtypes") || !filters.productSubtypes.some((subtype) => product.productSubtypes?.includes(subtype)))) return false;
  if (filters.maxWidthMm && !(product.verifiedFacts.dimensions ? product.widthMm <= filters.maxWidthMm : verifiedConfigurations.some((configuration) => configuration.dimensions!.widthMm <= filters.maxWidthMm!))) return false;
  if (filters.minWidthMm && !(product.verifiedFacts.dimensions ? product.widthMm >= filters.minWidthMm : verifiedConfigurations.some((configuration) => configuration.dimensions!.widthMm >= filters.minWidthMm!))) return false;
  if (filters.targetWidthMm && !(product.verifiedFacts.dimensions ? Math.abs(product.widthMm - filters.targetWidthMm) <= Math.max(100, Math.round(filters.targetWidthMm * 0.03)) : verifiedConfigurations.some((configuration) => Math.abs(configuration.dimensions!.widthMm - filters.targetWidthMm!) <= Math.max(100, Math.round(filters.targetWidthMm! * 0.03))))) return false;
  if (filters.maxDepthMm && (!product.verifiedFacts.dimensions || product.depthMm > filters.maxDepthMm)) return false;
  if (filters.minSeatHeightMm && (!product.verifiedFacts.seatHeight || product.seatHeightMm < filters.minSeatHeightMm)) return false;
  if (filters.maxSeatDepthMm && (!product.verifiedFacts.seatDepth || product.seatDepthMm > filters.maxSeatDepthMm)) return false;
  if (filters.seatCount) {
    if (filters.category === "dining-table") {
      const table = product.specifications?.table;
      const capacityVerified = table?.capacityVerified === true && verified("specifications.table.capacityMax");
      if (!capacityVerified || table?.capacityMax == null || table.capacityMax < filters.seatCount) return false;
    } else if (!product.numberOfSeatsVerified || product.numberOfSeats !== filters.seatCount) return false;
  }
  if (filters.modular && (!product.verifiedFacts.modular || !product.modular)) return false;
  if (filters.smallSpaceSuitable && (!product.verifiedFacts.smallSpaceSuitable || !product.smallSpaceSuitable)) return false;
  if (filters.layoutShapes?.length && !filters.layoutShapes.some((shape) => product.layoutShapes?.includes(shape))) return false;
  if (filters.tabletopShapes?.length && (!verified("specifications.table.tabletopShape") || !filters.tabletopShapes.some((shape) => product.specifications?.table?.tabletopShape.includes(shape)))) return false;
  if (filters.extendable && (!verified("specifications.table.extendable") || !product.specifications?.table?.extendable)) return false;
  if (filters.slidingDoors && (!verified("specifications.wardrobe.doorType") || !product.specifications?.wardrobe?.doorType.includes("sliding"))) return false;
  if (filters.bedWidthMm && (!verified("specifications.bed.sleepingWidthsMm") || !product.specifications?.bed?.sleepingWidthsMm.includes(filters.bedWidthMm))) return false;
  if (filters.easyCare && !((verified("specifications.carpet.easyCare") && product.specifications?.carpet?.easyCare) || product.verifiedFacts.easyCare || (verified("easyCare") && product.easyCare))) return false;
  if (filters.weatherResistant && (!verified("specifications.outdoor.weatherResistant") || !product.specifications?.outdoor?.weatherResistant)) return false;
  if (filters.sofaBed && (!verified("specifications.seating.sofaBed") || !product.specifications?.seating?.sofaBed)) return false;
  if (filters.integratedStorage && !((verified("specifications.seating.integratedStorage") && product.specifications?.seating?.integratedStorage) || (verified("specifications.bed.bedStorage") && product.specifications?.bed?.bedStorage))) return false;
  const lumens = product.specifications?.lamp?.lumens;
  if (filters.minLumens && (!verified("specifications.lamp.lumens") || lumens == null || lumens < filters.minLumens)) return false;
  if (filters.maxLumens && (!verified("specifications.lamp.lumens") || lumens == null || lumens > filters.maxLumens)) return false;
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
    const haystack = `${product.name} ${product.subtitle} ${product.description} ${product.modelCode} ${(product.categories ?? [product.category]).join(" ")} ${(product.productSubtypes ?? []).join(" ")} ${product.seriesId ?? ""} ${(product.roomTypes ?? []).join(" ")} ${(product.useCases ?? []).join(" ")} ${product.colors.join(" ")} ${product.styles.join(" ")} ${product.functions.join(" ")} ${(product.keywords ?? []).join(" ")} ${(product.synonyms ?? []).join(" ")} ${(product.availableComponents ?? []).join(" ")} ${(product.specifications?.table?.tabletopShape ?? []).join(" ")} ${(product.specifications?.wardrobe?.doorType ?? []).join(" ")} ${Math.round(product.widthMm / 10)} cm`.toLowerCase();
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
  if (filters.extendable && product.specifications?.table?.extendable) reasons.push("extendable table configuration");
  if (filters.slidingDoors && product.specifications?.wardrobe?.doorType.includes("sliding")) reasons.push("sliding-door wardrobe option");
  if (filters.bedWidthMm && product.specifications?.bed?.sleepingWidthsMm.includes(filters.bedWidthMm)) reasons.push(`${filters.bedWidthMm / 10} cm sleeping width`);
  if (filters.weatherResistant && product.specifications?.outdoor?.weatherResistant) reasons.push("weather-resistant outdoor use");
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
      if (parsed.category === "dining-table" && parsed.seatCount) {
        const table = product.specifications?.table;
        if (table?.capacityVerified && table.capacityMax != null && table.capacityMax >= parsed.seatCount) {
          score += 18;
          reasons.push(`verified dining capacity for at least ${parsed.seatCount}`);
        } else if (table?.demoEstimatedCapacity != null && table.demoEstimatedCapacity >= parsed.seatCount) {
          score += 8;
          reasons.push(`indicative dining capacity for at least ${parsed.seatCount}`);
        }
        if (product.productSubtypes?.includes("dining-chair")) {
          score += 10;
          reasons.push("coordinating dining-chair options in the programme");
        }
      }
      if (parsed.category === "dining-table" && parsed.extendable && product.specifications?.table?.extendable) {
        score += 22;
        reasons.push("extendable table option for occasional guests");
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
