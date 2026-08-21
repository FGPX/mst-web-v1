import { products } from "../data";
import { searchColorTerms } from "../search";
import { productHasCategory, type Category, type Product } from "../types";
import { bedSleepingSizes } from "./product-detail";

/**
 * The customer brief is the cumulative, structured reading of everything the
 * customer has told us across the whole conversation — not just the newest
 * message. It separates HARD constraints (measurable against verified
 * catalogue facts: dimensions, seats, colour, material type, easy-care) from
 * SOFT preferences (style, warmth, mood), because the two must be enforced
 * differently.
 *
 * A hard constraint is never silently dropped. If nothing in the catalogue
 * satisfies it, the assistant says so and names the constraint that failed —
 * it does not quietly widen the search and present an oversized product as if
 * it matched. That behaviour was the single most damaging bug in the previous
 * implementation.
 */

export type LayoutShape = "straight" | "l-shaped" | "u-shaped" | "corner" | "island";

export type CustomerBrief = {
  /** Every category the customer has asked for, in the order first requested. */
  categories: Category[];
  lastCategory?: Category;
  /* --- hard, measurable --- */
  maxWidthMm?: number;
  maxDepthMm?: number;
  /** For beds the customer's numbers are a mattress size, not a footprint. */
  sleepingWidthMm?: number;
  sleepingLengthMm?: number;
  minWidthMm?: number;
  targetWidthMm?: number;
  seatCount?: number;
  colors: string[];
  materialTypes: Array<"fabric" | "leather">;
  layoutShapes: LayoutShape[];
  easyCareRequired?: boolean;
  /* --- soft, subjective --- */
  spaceSize?: "compact" | "large";
  woodPreference?: boolean;
  styleWords: string[];
  hasKids?: boolean;
  hasPets?: boolean;
  /* --- bookkeeping --- */
  shownProductIds: string[];
  rejectedProductIds: string[];
  /** Slots the customer was already asked about, so we never ask twice. */
  askedSlots: string[];
  /** The product the conversation is currently about, if any. */
  focusProductId?: string;
  /** The customer's own words, kept verbatim for the retailer handover. */
  quotes: string[];
};

export const emptyBrief: CustomerBrief = {
  categories: [], colors: [], materialTypes: [], layoutShapes: [],
  styleWords: [], shownProductIds: [], rejectedProductIds: [], askedSlots: [], quotes: []
};

const categoryPatterns: Array<[Category, RegExp]> = [
  ["coffee-table", /\b(?:coffee|coffe|coffy|cofee|couch|side)\s*[- ]?\s*table\b/i],
  ["dining-table", /\bdining\s+table\b/i],
  ["dining-chair", /\bdining\s+(?:chair|seat|bench)\b/i],
  ["armchair", /\b(?:armchair|recliner|accent chair)\b/i],
  ["sectional", /\b(?:sectional|corner sofa|corner couch|chaise)\b/i],
  ["sofa", /\b(?:sofa|couch|loveseat|settee)\b/i],
  ["storage", /\b(?:storage|cabinet|sideboard|wall unit|shelf|shelving)\b/i],
  ["wardrobe", /\b(?:wardrobe|closet)\b/i],
  ["bed", /\b(?:bed|mattress|topper)\b/i],
  ["carpet", /\b(?:carpet|rug)\b/i],
  ["lamp", /\b(?:lamp|lighting|light fixture)\b/i]
];

/** "living room set" and friends expand into the pieces a set is made of. */
const setPatterns: Array<[RegExp, Category[]]> = [
  [/\bliving\s*room\s*(?:set|suite|package|furniture)\b/i, ["sofa", "coffee-table"]],
  [/\bdining\s*(?:room\s*)?(?:set|suite)\b/i, ["dining-table", "dining-chair"]],
  [/\bbedroom\s*(?:set|suite)\b/i, ["bed", "wardrobe"]]
];

/** Single-word category cues that speech-to-text and typing commonly mangle. */
const fuzzyCategoryWords: Array<[Category, string]> = [
  ["bed", "bed"], ["sofa", "sofa"], ["sofa", "couch"], ["armchair", "chair"],
  ["wardrobe", "wardrobe"], ["carpet", "carpet"], ["carpet", "rug"], ["lamp", "lamp"]
];

/**
 * Misspellings an edit-distance check cannot reach. "bat" is two edits from
 * "bed", yet it is exactly what a customer types — or what dictation hears —
 * when they mean a bed.
 */
const categoryTypos: Record<string, Category> = {
  bat: "bed", bet: "bed", bad: "bed", bde: "bed", bedd: "bed",
  sofe: "sofa", sopha: "sofa", sofá: "sofa", coach: "sofa", couche: "sofa",
  tabel: "dining-table", tabl: "dining-table",
  chari: "armchair", chiar: "armchair",
  wardrop: "wardrobe", wardobe: "wardrobe"
};

function withinOneEdit(left: string, right: string) {
  if (left === right) return true;
  if (Math.abs(left.length - right.length) > 1) return false;
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

export function requestedCategories(text: string): Category[] {
  const direct = categoryPatterns.filter(([, pattern]) => pattern.test(text)).map(([category]) => category);
  const fromSets = setPatterns.filter(([pattern]) => pattern.test(text)).flatMap(([, categories]) => categories);
  // "find me a bat" should reach the bed catalogue rather than a clarification
  // loop. Only applied when no exact category word was found, so a real match
  // is never overridden by a near miss.
  const tokens = direct.length || fromSets.length ? [] : text.toLowerCase().split(/[^a-zá]+/).filter((token) => token.length >= 3);
  const fuzzy = tokens.flatMap((token) => {
    const mapped = categoryTypos[token];
    if (mapped) return [mapped];
    return fuzzyCategoryWords.filter(([, word]) => withinOneEdit(token, word)).map(([category]) => category);
  });
  return [...new Set([...direct, ...fromSets, ...fuzzy])];
}

/**
 * Converts a spoken or typed measurement to millimetres.
 *
 * A missing unit is the common case in real messages ("140 with 2 meters",
 * "200 x 90"), so magnitude decides: furniture numbers under 10 are metres,
 * up to 400 are centimetres, and anything larger is already millimetres.
 */
const unitToMm = (value: string, unit?: string | null) => {
  const numeric = Number(value.replace(",", "."));
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  const normalized = (unit ?? "").toLowerCase();
  if (/^mm|^millimet/.test(normalized)) return Math.round(numeric);
  if (/^cm|^centimet|^zentimet/.test(normalized)) return Math.round(numeric * 10);
  if (/^m$|^met/.test(normalized)) return Math.round(numeric * 1000);
  if (numeric < 10) return Math.round(numeric * 1000);
  if (numeric <= 400) return Math.round(numeric * 10);
  return Math.round(numeric);
};

const AMOUNT = "(\\d+(?:[.,]\\d+)?)\\s*(mm|millimet(?:er|re)s?|cm|centimet(?:er|re)s?|zentimeter|m|met(?:er|re)s?)";

/**
 * Reads a footprint written as "2 m by 2 m", "2m x 2m", "200 x 200 cm" or
 * "2 x 2 metres" into a width AND depth limit. The previous parser only
 * understood "under X wide" style phrasing, so a customer who wrote
 * "a sofa 2 m by 2 m" produced no constraint at all — which is why oversized
 * sofas came back as if they matched.
 */
export function parseFootprint(text: string): { maxWidthMm?: number; maxDepthMm?: number } {
  // Speech-to-text turns "by" into "with" more often than not, and customers
  // write "and" just as readily, so all three separate a pair of measurements.
  const separator = "(?:x|×|by|with|and|na|auf)";
  const bare = "(\\d+(?:[.,]\\d+)?)";
  const unit = "(mm|millimet(?:er|re)s?|cm|centimet(?:er|re)s?|zentimeter|m|met(?:er|re)s?)";

  // Both sides carry a unit: "2 m by 2 m", "200 cm x 90 cm".
  const both = text.match(new RegExp(`${bare}\\s*${unit}\\s*${separator}\\s*${bare}\\s*${unit}`, "i"));
  if (both) {
    const first = unitToMm(both[1], both[2]);
    const second = unitToMm(both[3], both[4]);
    if (first && second) return { maxWidthMm: Math.max(first, second), maxDepthMm: Math.min(first, second) };
  }
  // Only the second carries a unit: "140 with 2 meters", "200 x 90 cm".
  const trailing = text.match(new RegExp(`${bare}\\s*${separator}\\s*${bare}\\s*${unit}`, "i"));
  if (trailing) {
    const first = unitToMm(trailing[1], null);
    const second = unitToMm(trailing[2], trailing[3]);
    if (first && second) return { maxWidthMm: Math.max(first, second), maxDepthMm: Math.min(first, second) };
  }
  // Neither carries a unit: "140 x 200", "140 by 200". "and" is excluded here
  // because two bare numbers joined by "and" are usually not a measurement.
  const neither = text.match(new RegExp(`${bare}\\s*(?:x|×|by|with)\\s*${bare}(?!\\s*\\w)`, "i"));
  if (neither) {
    const first = unitToMm(neither[1], null);
    const second = unitToMm(neither[2], null);
    if (first && second) return { maxWidthMm: Math.max(first, second), maxDepthMm: Math.min(first, second) };
  }
  return {};
}

/** A single measurement used as an upper bound: "under 200 cm", "max 2 m". */
export function parseMaxWidth(text: string): number | undefined {
  const bounded = text.match(new RegExp(`(?:under|below|less than|at most|maximum|max\\.?|no wider than|not wider than|up to|smaller than|narrower than)\\s*(?:width\\s*)?${AMOUNT}`, "i"));
  if (bounded) return unitToMm(bounded[1], bounded[2]) ?? undefined;
  const suffixed = text.match(new RegExp(`${AMOUNT}\\s*(?:wide|width|broad|breit|breite)\\b`, "i"));
  if (suffixed) return unitToMm(suffixed[1], suffixed[2]) ?? undefined;
  return undefined;
}

const layoutWords: Array<[LayoutShape, RegExp]> = [
  ["l-shaped", /\b(?:l[-\s]?shape[d]?|l[-\s]?form|chaise|corner sofa|corner couch)\b/i],
  ["u-shaped", /\b(?:u[-\s]?shape[d]?|u[-\s]?form)\b/i],
  ["corner", /\bcorner\b/i],
  ["island", /\bisland\b/i],
  ["straight", /\b(?:straight|two[-\s]seater|three[-\s]seater|standard sofa|normal sofa)\b/i]
];

const styleWords = ["modern", "classic", "scandinavian", "minimal", "minimalist", "rustic", "industrial", "cosy", "cozy", "warm", "elegant", "timeless", "natural"];

/**
 * Folds one new customer message into the running brief. Later statements win
 * over earlier ones for single-valued slots; list-valued slots accumulate.
 */
export function updateBrief(previous: CustomerBrief, text: string): CustomerBrief {
  const brief: CustomerBrief = {
    ...emptyBrief, ...previous,
    categories: [...(previous.categories ?? [])],
    colors: [...(previous.colors ?? [])],
    materialTypes: [...(previous.materialTypes ?? [])],
    layoutShapes: [...(previous.layoutShapes ?? [])],
    styleWords: [...(previous.styleWords ?? [])],
    shownProductIds: [...(previous.shownProductIds ?? [])],
    rejectedProductIds: [...(previous.rejectedProductIds ?? [])],
    askedSlots: [...(previous.askedSlots ?? [])],
    quotes: [...(previous.quotes ?? [])]
  };
  const normalized = text.toLowerCase();

  const categories = requestedCategories(text);
  if (categories.length) {
    brief.categories = [...new Set([...brief.categories, ...categories])];
    brief.lastCategory = categories.at(-1);
  }

  const footprint = parseFootprint(text);
  const aboutBed = brief.categories.includes("bed") || categories.includes("bed");
  // The customer often gives the numbers before naming the piece. When the
  // category arrives later, reinterpret what we already stored.
  if (aboutBed && !brief.sleepingWidthMm && brief.maxWidthMm && brief.maxDepthMm) {
    brief.sleepingWidthMm = Math.min(brief.maxWidthMm, brief.maxDepthMm);
    brief.sleepingLengthMm = Math.max(brief.maxWidthMm, brief.maxDepthMm);
    brief.maxWidthMm = undefined;
    brief.maxDepthMm = undefined;
  }
  if (aboutBed && footprint.maxWidthMm && footprint.maxDepthMm) {
    // "140 with 2 meters" for a bed is a mattress size, not a room footprint:
    // the smaller number is the sleeping width, the larger the length.
    brief.sleepingWidthMm = footprint.maxDepthMm;
    brief.sleepingLengthMm = footprint.maxWidthMm;
  } else {
    if (footprint.maxWidthMm) brief.maxWidthMm = footprint.maxWidthMm;
    if (footprint.maxDepthMm) brief.maxDepthMm = footprint.maxDepthMm;
  }
  const maxWidth = parseMaxWidth(text);
  if (maxWidth) brief.maxWidthMm = maxWidth;

  // These slots hold one decision, not a growing wish list. When the customer
  // names a colour, material or shape they are REPLACING the previous answer —
  // accumulating meant that clicking "L-shaped" and later asking for a straight
  // sofa left both in the brief, so the filter matched either and the customer
  // got L-shaped results back.
  const colors = searchColorTerms.filter((color) => new RegExp(`\\b${color}\\b`, "i").test(normalized));
  if (colors.length) brief.colors = [...new Set(colors)];

  const namedMaterials: Array<"fabric" | "leather"> = [];
  if (/\bleather\b/i.test(normalized)) namedMaterials.push("leather");
  if (/\b(?:fabric|textile|cloth|stoff)\b/i.test(normalized)) namedMaterials.push("fabric");
  if (namedMaterials.length) brief.materialTypes = namedMaterials;
  if (/\bno preference\b/i.test(normalized)) brief.materialTypes = [];
  if (/\b(?:wood|wooden|oak|walnut|holz)\b/i.test(normalized)) brief.woodPreference = true;

  const shapes = layoutWords.filter(([, pattern]) => pattern.test(normalized)).map(([shape]) => shape);
  if (shapes.length) brief.layoutShapes = [...new Set(shapes)];

  const numericSeats = normalized.match(/\b([1-9])\s*(?:persons?|people|seats?|seater|pax)\b/)?.[1];
  const wordSeats = normalized.match(/\b(one|two|three|four|five|six)\s*(?:persons?|people|seats?|seater)\b/)?.[1];
  const seatWords = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 } as const;
  if (numericSeats) brief.seatCount = Number(numericSeats);
  else if (wordSeats) brief.seatCount = seatWords[wordSeats as keyof typeof seatWords];

  if (/\b(?:easy[-\s]?to[-\s]?clean|easy[-\s]?clean|easy[-\s]?care|washable|wipeable|stain[-\s]?resistant|pflegeleicht)\b/i.test(normalized)) brief.easyCareRequired = true;
  if (/\b(?:kids?|children|child|toddler|baby|babies)\b/i.test(normalized)) { brief.hasKids = true; brief.easyCareRequired = true; }
  if (/\b(?:dog|dogs|cat|cats|pet|pets)\b/i.test(normalized)) { brief.hasPets = true; brief.easyCareRequired = true; }

  if (/\b(?:small|compact|tiny|narrow|limited space|not much space|no much space|don'?t have (?:so )?much space|less space|smaller|too big)\b/i.test(normalized)) brief.spaceSize = "compact";
  else if (/\b(?:large|spacious|big room|big space|lots of space)\b/i.test(normalized) && !/\btoo big\b/i.test(normalized)) brief.spaceSize = "large";

  const styles = styleWords.filter((word) => new RegExp(`\\b${word}\\b`, "i").test(normalized));
  if (styles.length) brief.styleWords = [...new Set([...brief.styleWords, ...styles])];

  const trimmed = text.trim();
  if (trimmed.length > 12 && !brief.quotes.includes(trimmed)) brief.quotes = [...brief.quotes, trimmed].slice(-12);

  return brief;
}

/* ------------------------------------------------------------------------ */
/* Matching                                                                   */
/* ------------------------------------------------------------------------ */

export type ConstraintKey = "category" | "maxWidth" | "maxDepth" | "seats" | "colour" | "material" | "layout" | "easyCare" | "sleepingSize";

/**
 * Every constraint resolves to one of three verdicts against a product, never
 * two. The distinction is what keeps the assistant both honest and useful:
 *
 *  - `pass`    verified catalogue data satisfies the requirement
 *  - `fail`    verified catalogue data contradicts it — the product is out
 *  - `unknown` the catalogue publishes no verified value, so nothing can be claimed
 *
 * Treating `unknown` as `fail` would hide most of the catalogue (only 5 of 36
 * sofas carry verified dimensions today). Treating it as `pass` would let the
 * assistant imply facts it cannot support. So unknowns are surfaced as
 * unverified, in their own tier, always labelled.
 */
export type Verdict = "pass" | "fail" | "unknown";

export type UnmetConstraint = {
  key: ConstraintKey;
  /** Customer-facing description of what was asked for. */
  requested: string;
  /** What the catalogue actually offers, e.g. "the narrowest verified option is 232 cm". */
  closest: string;
};

export type ScoredProduct = {
  product: Product;
  /** Plain-language reasons this product misses a verified requirement. */
  gaps: string[];
  /** Requirements the catalogue cannot confirm either way for this product. */
  unverified: string[];
};

export type BriefMatch = {
  /** Verified against every requirement. May legitimately be empty. */
  exact: Product[];
  /** Contradicts nothing, but some requirements are unpublished. */
  possible: ScoredProduct[];
  /** Verifiably misses at least one requirement. Never shown as a match. */
  nearest: ScoredProduct[];
  /** Requirements that every product in the category verifiably fails. */
  unmet: UnmetConstraint[];
  /**
   * Requirements every product in the category satisfies. These narrow nothing,
   * so presenting the result as "filtered by your shape" would be misleading.
   */
  uninformative: Array<{ key: ConstraintKey; label: string; note: string }>;
};

const mmToCm = (value: number) => Math.round(value / 10);
const verifiedWidth = (product: Product) => (product.verifiedFacts.dimensions ? product.widthMm : null);
const verifiedDepth = (product: Product) => (product.verifiedFacts.dimensions ? product.depthMm : null);

/** "cream beige" satisfies a request for "beige"; "light grey" does not. */
const colourMatches = (verified: string, requested: string) =>
  verified === requested || verified.includes(requested) || requested.includes(verified);

type Constraint = {
  key: ConstraintKey;
  /** What the customer asked for, in their terms. */
  label: string;
  /** The unpublished fact, as a noun phrase: "width", "the colour range". */
  unknownLabel: string;
  evaluate: (product: Product) => Verdict;
};

function constraintsFor(brief: CustomerBrief, category: Category): Constraint[] {
  const seatingCategory = ["sofa", "sectional", "armchair"].includes(category);
  const list: Constraint[] = [];

  // A bed's usable size is its mattress size, which the catalogue publishes
  // separately from the outer frame dimensions. Checking widthMm here would
  // reject BARI for a 140 x 200 request even though it offers exactly that.
  if (brief.sleepingWidthMm && brief.sleepingLengthMm) list.push({
    key: "sleepingSize",
    label: `${mmToCm(brief.sleepingWidthMm)} × ${mmToCm(brief.sleepingLengthMm)} cm sleeping size`,
    unknownLabel: "sleeping sizes",
    evaluate: (product) => {
      const sizes = bedSleepingSizes(product);
      if (!sizes.length) return "unknown";
      return sizes.some((size) => size.widthMm === brief.sleepingWidthMm && size.lengthMm === brief.sleepingLengthMm) ? "pass" : "fail";
    }
  });
  if (brief.maxWidthMm) list.push({
    key: "maxWidth", label: `max ${mmToCm(brief.maxWidthMm)} cm wide`, unknownLabel: "width",
    evaluate: (product) => {
      const width = verifiedWidth(product);
      if (width === null) return "unknown";
      return width <= brief.maxWidthMm! ? "pass" : "fail";
    }
  });
  if (brief.maxDepthMm) list.push({
    key: "maxDepth", label: `max ${mmToCm(brief.maxDepthMm)} cm deep`, unknownLabel: "depth",
    evaluate: (product) => {
      const depth = verifiedDepth(product);
      if (depth === null) return "unknown";
      return depth <= brief.maxDepthMm! ? "pass" : "fail";
    }
  });
  if (brief.seatCount && seatingCategory) list.push({
    key: "seats", label: `${brief.seatCount} seats`, unknownLabel: "seat count",
    evaluate: (product) => {
      if (!product.numberOfSeatsVerified) return "unknown";
      return product.numberOfSeats === brief.seatCount ? "pass" : "fail";
    }
  });
  if (brief.colors.length) list.push({
    key: "colour", label: brief.colors.join(" or "), unknownLabel: "the colour range",
    evaluate: (product) => {
      if (!product.verifiedFacts.colors.length) return "unknown";
      return product.verifiedFacts.colors.some((verified) => brief.colors.some((wanted) => colourMatches(verified, wanted))) ? "pass" : "fail";
    }
  });
  if (brief.materialTypes.length) list.push({
    key: "material", label: brief.materialTypes.join(" or "), unknownLabel: "material type",
    evaluate: (product) => {
      if (!product.verifiedFacts.materialTypes.length) return "unknown";
      return brief.materialTypes.some((type) => product.verifiedFacts.materialTypes.includes(type)) ? "pass" : "fail";
    }
  });
  if (brief.layoutShapes.length) list.push({
    key: "layout", label: brief.layoutShapes.join(" or "), unknownLabel: "layout shape",
    evaluate: (product) => {
      const shapes = product.layoutShapes ?? [];
      if (!shapes.length) return "unknown";
      return brief.layoutShapes.some((shape) => shapes.includes(shape)) ? "pass" : "fail";
    }
  });
  if (brief.easyCareRequired) list.push({
    key: "easyCare", label: "easy to clean", unknownLabel: "an easy-care rating",
    evaluate: (product) => {
      if (!product.verifiedFacts.easyCare) return "unknown";
      return product.easyCare === true ? "pass" : "fail";
    }
  });
  return list;
}

/** Describes what the catalogue can actually offer for a requirement nothing satisfies. */
function closestOffer(key: ConstraintKey, pool: Product[]): string {
  if (key === "sleepingSize") {
    const sizes = [...new Set(pool.flatMap((product) => bedSleepingSizes(product).map((size) => `${mmToCm(size.widthMm)} × ${mmToCm(size.lengthMm)} cm`)))];
    return sizes.length ? `sleeping sizes available: ${sizes.join(", ")}` : "no sleeping size is published in this category";
  }
  if (key === "maxWidth") {
    const widths = pool.map(verifiedWidth).filter((value): value is number => value !== null);
    return widths.length ? `the narrowest verified option is ${mmToCm(Math.min(...widths))} cm` : "no verified width is published in this category";
  }
  if (key === "maxDepth") {
    const depths = pool.map(verifiedDepth).filter((value): value is number => value !== null);
    return depths.length ? `the shallowest verified option is ${mmToCm(Math.min(...depths))} cm` : "no verified depth is published in this category";
  }
  if (key === "seats") {
    const counts = [...new Set(pool.filter((product) => product.numberOfSeatsVerified).map((product) => product.numberOfSeats))].sort((a, b) => a - b);
    return counts.length ? `verified seat counts available: ${counts.join(", ")}` : "no verified seat count is published in this category";
  }
  if (key === "colour") {
    const colours = [...new Set(pool.flatMap((product) => product.verifiedFacts.colors))].slice(0, 8);
    return colours.length ? `verified colours available: ${colours.join(", ")}` : "no verified colour is published in this category";
  }
  if (key === "material") {
    const types = [...new Set(pool.flatMap((product) => product.verifiedFacts.materialTypes))];
    return types.length ? `verified material types available: ${types.join(", ")}` : "no verified material type is published in this category";
  }
  if (key === "layout") {
    const shapes = [...new Set(pool.flatMap((product) => product.layoutShapes ?? []))];
    return shapes.length ? `verified layouts available: ${shapes.join(", ")}` : "no verified layout shape is published in this category";
  }
  if (key === "easyCare") return "no easy-care rating is verified in this category";
  return "this category is not in the connected catalogue";
}

/** How far one product misses a requirement, in the customer's own units. */
function gapFor(constraint: Constraint, product: Product, brief: CustomerBrief): string {
  if (constraint.key === "sleepingSize") {
    const sizes = bedSleepingSizes(product).map((size) => `${mmToCm(size.widthMm)} × ${mmToCm(size.lengthMm)} cm`);
    return `offers ${sizes.join(", ")} — not ${mmToCm(brief.sleepingWidthMm ?? 0)} × ${mmToCm(brief.sleepingLengthMm ?? 0)} cm`;
  }
  if (constraint.key === "maxWidth" && brief.maxWidthMm) {
    return `${mmToCm(product.widthMm)} cm wide — ${mmToCm(product.widthMm - brief.maxWidthMm)} cm over your ${mmToCm(brief.maxWidthMm)} cm limit`;
  }
  if (constraint.key === "maxDepth" && brief.maxDepthMm) {
    return `${mmToCm(product.depthMm)} cm deep — ${mmToCm(product.depthMm - brief.maxDepthMm)} cm over your ${mmToCm(brief.maxDepthMm)} cm limit`;
  }
  if (constraint.key === "seats") return `${product.numberOfSeats} verified seats, not ${brief.seatCount}`;
  if (constraint.key === "colour") return `verified in ${product.verifiedFacts.colors.slice(0, 3).join(", ")} — not ${brief.colors.join(" or ")}`;
  if (constraint.key === "material") return `verified in ${product.verifiedFacts.materialTypes.join(", ")} — not ${brief.materialTypes.join(" or ")}`;
  if (constraint.key === "layout") return `verified as ${(product.layoutShapes ?? []).join(", ")} — not ${brief.layoutShapes.join(" or ")}`;
  if (constraint.key === "easyCare") return "verified as not easy-care";
  return `does not meet ${constraint.label}`;
}

/**
 * Applies every requirement against verified catalogue data and sorts the
 * category into three honest tiers.
 *
 * There is deliberately no `if (filtered.length) candidates = filtered`
 * fallback here. That pattern — silently discarding a requirement whenever it
 * emptied the list — is what made the assistant answer a "2 m by 2 m" request
 * with a 268 cm sofa. A requirement that nothing satisfies is reported, never
 * dropped.
 */
export function matchBrief(brief: CustomerBrief, category: Category, options: { excludeIds?: string[] } = {}): BriefMatch {
  const excluded = new Set([...(options.excludeIds ?? []), ...brief.rejectedProductIds]);
  const pool = products.filter((product) => product.active && productHasCategory(product, category) && !excluded.has(product.id));
  const constraints = constraintsFor(brief, category);

  const scored = pool.map((product) => {
    const verdicts = constraints.map((constraint) => ({ constraint, verdict: constraint.evaluate(product) }));
    return {
      product,
      gaps: verdicts.filter((entry) => entry.verdict === "fail").map((entry) => gapFor(entry.constraint, product, brief)),
      unverified: verdicts.filter((entry) => entry.verdict === "unknown").map((entry) => entry.constraint.unknownLabel)
    };
  });

  // A requirement is unmet only when no product passes it and none is unknown —
  // that is, the catalogue positively contradicts it everywhere.
  const unmet: UnmetConstraint[] = constraints
    .filter((constraint) => pool.length > 0 && pool.every((product) => constraint.evaluate(product) === "fail"))
    .map((constraint) => ({ key: constraint.key, requested: constraint.label, closest: closestOffer(constraint.key, pool) }));
  if (!pool.length) {
    unmet.push({ key: "category", requested: category.replaceAll("-", " "), closest: closestOffer("category", pool) });
  }

  const preferNarrow = brief.spaceSize === "compact" || Boolean(brief.maxWidthMm);
  const byFit = (left: Product, right: Product) => {
    if (brief.spaceSize === "large") return (verifiedWidth(right) ?? 0) - (verifiedWidth(left) ?? 0);
    if (preferNarrow) return (verifiedWidth(left) ?? Number.MAX_SAFE_INTEGER) - (verifiedWidth(right) ?? Number.MAX_SAFE_INTEGER);
    return left.modelCode.localeCompare(right.modelCode);
  };

  const exact = scored
    .filter((entry) => !entry.gaps.length && !entry.unverified.length)
    .map((entry) => entry.product)
    .sort(byFit)
    .slice(0, 6);

  const possible = scored
    .filter((entry) => !entry.gaps.length && entry.unverified.length)
    // Fewest unpublished facts first: the closer to fully verified, the more
    // confidently the assistant can present it.
    .sort((left, right) => left.unverified.length - right.unverified.length || byFit(left.product, right.product))
    .slice(0, 6);

  const nearest = scored
    .filter((entry) => entry.gaps.length)
    .sort((left, right) => left.gaps.length - right.gaps.length || byFit(left.product, right.product))
    .slice(0, 3);

  // A requirement that nothing fails and nothing leaves unknown has not
  // narrowed the catalogue at all. Every Musterring sofa programme lists
  // straight, L-shaped and corner, so "find me a straight sofa" matches all of
  // them — and the customer then sees corner photos and thinks it was ignored.
  const uninformative = constraints
    .filter((constraint) => pool.length > 1 && pool.every((product) => constraint.evaluate(product) === "pass"))
    .map((constraint) => ({
      key: constraint.key,
      label: constraint.label,
      note: constraint.key === "layout"
        ? `every ${category.replaceAll("-", " ")} programme in the catalogue can be configured this way, so it does not narrow the choice — the photos show one possible configuration`
        : `all ${pool.length} products in this category satisfy it, so it does not narrow the choice`
    }));

  return { exact, possible, nearest, unmet, uninformative };
}

/** Backwards-compatible helper: the gaps already computed for a scored product. */
export function describeGap(scored: ScoredProduct): string[] {
  return scored.gaps;
}

/* ------------------------------------------------------------------------ */
/* Clarifying questions                                                       */
/* ------------------------------------------------------------------------ */

export type ClarifyingQuestion = { slot: string; question: string; options: string[] };

/**
 * The one question most worth asking next, given what the brief still lacks.
 * Ordered by how much the answer narrows the catalogue. Returns null when the
 * brief is complete enough to recommend, or when the slot was already asked.
 */
export function nextQuestion(brief: CustomerBrief, category: Category): ClarifyingQuestion | null {
  const asked = new Set(brief.askedSlots);
  const candidates: ClarifyingQuestion[] = [];

  if (["sofa", "sectional", "armchair"].includes(category) && !brief.seatCount) candidates.push({
    slot: "seats",
    question: "How many people should sit on it comfortably?",
    options: ["2 people", "3 people", "4 people", "5 or more"]
  });
  if (["sofa", "sectional", "armchair", "bed"].includes(category) && !brief.materialTypes.length) candidates.push({
    slot: "material",
    question: "Fabric or leather?",
    options: ["Fabric", "Leather", "No preference"]
  });
  if (!brief.maxWidthMm && !brief.spaceSize) candidates.push({
    slot: "space",
    question: "How much wall space do you have for it?",
    options: ["Under 200 cm", "200–260 cm", "260–320 cm", "More than 320 cm"]
  });
  if (!brief.colors.length) {
    const available = [...new Set(products
      .filter((product) => product.active && productHasCategory(product, category))
      .flatMap((product) => product.verifiedFacts.colors))].slice(0, 4);
    if (available.length > 1) candidates.push({
      slot: "colour",
      question: "Which colour direction do you have in mind?",
      options: available.map((color) => color.charAt(0).toUpperCase() + color.slice(1))
    });
  }

  if ((category === "sofa" || category === "sectional") && !brief.layoutShapes.length) {
    const pool = products.filter((product) => product.active && productHasCategory(product, category));
    const available = [...new Set(pool.flatMap((product) => product.layoutShapes ?? []))];
    // Offer only the shapes that actually split the catalogue. Every sofa
    // programme currently lists straight and corner, so putting those on a chip
    // promises a narrowing the data cannot deliver. With fewer than two real
    // choices left the question is not worth a turn at all.
    const options = available.filter((shape) => {
      const count = pool.filter((product) => (product.layoutShapes ?? []).includes(shape)).length;
      return count > 0 && count < pool.length;
    });
    if (options.length > 1) candidates.push({
      slot: "layout",
      question: "What shape should it be? That changes which programmes I can offer.",
      options: options.map((shape) => shape === "l-shaped" ? "L-shaped" : shape === "u-shaped" ? "U-shaped" : shape.charAt(0).toUpperCase() + shape.slice(1))
    });
  }

  return candidates.find((candidate) => !asked.has(candidate.slot)) ?? null;
}

/** A short, human summary of the brief, used in the chat header and the retailer email. */
export function summariseBrief(brief: CustomerBrief): string[] {
  const parts: string[] = [];
  if (brief.categories.length) parts.push(brief.categories.map((category) => category.replaceAll("-", " ")).join(" + "));
  if (brief.seatCount) parts.push(`${brief.seatCount} seats`);
  if (brief.sleepingWidthMm && brief.sleepingLengthMm) parts.push(`${mmToCm(brief.sleepingWidthMm)} × ${mmToCm(brief.sleepingLengthMm)} cm sleeping size`);
  if (brief.maxWidthMm && brief.maxDepthMm) parts.push(`max ${mmToCm(brief.maxWidthMm)} × ${mmToCm(brief.maxDepthMm)} cm`);
  else if (brief.maxWidthMm) parts.push(`max ${mmToCm(brief.maxWidthMm)} cm wide`);
  if (brief.layoutShapes.length) parts.push(brief.layoutShapes.join("/"));
  if (brief.colors.length) parts.push(brief.colors.join("/"));
  if (brief.materialTypes.length) parts.push(brief.materialTypes.join("/"));
  if (brief.woodPreference) parts.push("wood accents");
  if (brief.easyCareRequired) parts.push("easy to clean");
  if (brief.hasKids) parts.push("children in the home");
  if (brief.hasPets) parts.push("pets in the home");
  if (brief.spaceSize === "compact") parts.push("compact room");
  if (brief.styleWords.length) parts.push(brief.styleWords.join("/"));
  return parts;
}
