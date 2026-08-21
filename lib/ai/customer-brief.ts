import { products } from "../data";
import { searchColorTerms } from "../search";
import { productHasCategory, type Category, type Product } from "../types";

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

export function requestedCategories(text: string): Category[] {
  const direct = categoryPatterns.filter(([, pattern]) => pattern.test(text)).map(([category]) => category);
  const fromSets = setPatterns.filter(([pattern]) => pattern.test(text)).flatMap(([, categories]) => categories);
  return [...new Set([...direct, ...fromSets])];
}

const unitToMm = (value: string, unit: string) => {
  const numeric = Number(value.replace(",", "."));
  if (!Number.isFinite(numeric)) return null;
  const normalized = unit.toLowerCase();
  if (/^mm|^millimet/.test(normalized)) return Math.round(numeric);
  if (/^cm|^centimet|^zentimet/.test(normalized)) return Math.round(numeric * 10);
  // A bare "2 m" is metres; a bare number without a unit is handled separately.
  return Math.round(numeric * 1000);
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
  // Both values carry a unit: "2 m by 2 m", "200 cm x 90 cm".
  const bothUnits = text.match(new RegExp(`${AMOUNT}\\s*(?:x|×|by|na|auf)\\s*${AMOUNT}`, "i"));
  if (bothUnits) {
    const width = unitToMm(bothUnits[1], bothUnits[2]);
    const depth = unitToMm(bothUnits[3], bothUnits[4]);
    if (width && depth) return { maxWidthMm: Math.max(width, depth), maxDepthMm: Math.min(width, depth) };
  }
  // Only the second value carries a unit: "2 x 2 m", "200 x 90 cm".
  const trailingUnit = text.match(new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*(?:x|×|by)\\s*${AMOUNT}`, "i"));
  if (trailingUnit) {
    const depth = unitToMm(trailingUnit[2], trailingUnit[3]);
    const width = unitToMm(trailingUnit[1], trailingUnit[3]);
    if (width && depth) return { maxWidthMm: Math.max(width, depth), maxDepthMm: Math.min(width, depth) };
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
  if (footprint.maxWidthMm) brief.maxWidthMm = footprint.maxWidthMm;
  if (footprint.maxDepthMm) brief.maxDepthMm = footprint.maxDepthMm;
  const maxWidth = parseMaxWidth(text);
  if (maxWidth) brief.maxWidthMm = maxWidth;

  const colors = searchColorTerms.filter((color) => new RegExp(`\\b${color}\\b`, "i").test(normalized));
  if (colors.length) brief.colors = [...new Set([...brief.colors, ...colors])];

  if (/\bleather\b/i.test(normalized)) brief.materialTypes = [...new Set([...brief.materialTypes, "leather" as const])];
  if (/\b(?:fabric|textile|cloth|stoff)\b/i.test(normalized)) brief.materialTypes = [...new Set([...brief.materialTypes, "fabric" as const])];
  if (/\b(?:wood|wooden|oak|walnut|holz)\b/i.test(normalized)) brief.woodPreference = true;

  const shapes = layoutWords.filter(([, pattern]) => pattern.test(normalized)).map(([shape]) => shape);
  if (shapes.length) brief.layoutShapes = [...new Set([...brief.layoutShapes, ...shapes])];

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

export type ConstraintKey = "category" | "maxWidth" | "maxDepth" | "seats" | "colour" | "material" | "layout" | "easyCare";

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

  return { exact, possible, nearest, unmet };
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

  if ((category === "sofa" || category === "sectional") && !brief.layoutShapes.length) {
    const available = [...new Set(products
      .filter((product) => product.active && productHasCategory(product, category))
      .flatMap((product) => product.layoutShapes ?? []))];
    if (available.length > 1) candidates.push({
      slot: "layout",
      question: "What shape should it be? That changes which programmes I can offer.",
      options: available.map((shape) => shape === "l-shaped" ? "L-shaped" : shape === "u-shaped" ? "U-shaped" : shape.charAt(0).toUpperCase() + shape.slice(1))
    });
  }
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

  return candidates.find((candidate) => !asked.has(candidate.slot)) ?? null;
}

/** A short, human summary of the brief, used in the chat header and the retailer email. */
export function summariseBrief(brief: CustomerBrief): string[] {
  const parts: string[] = [];
  if (brief.categories.length) parts.push(brief.categories.map((category) => category.replaceAll("-", " ")).join(" + "));
  if (brief.seatCount) parts.push(`${brief.seatCount} seats`);
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
