import { materials, products } from "../data";
import type { Product } from "../types";

/**
 * Answers about a product the customer is already looking at.
 *
 * The assistant previously said "I don't have any confirmed functions listed
 * for it" about a bed whose product page shows sleeping sizes, mattress
 * firmness, bed type, storage, motorisation, components and care instructions.
 * The facts were in the catalogue all along — they were simply never part of
 * the narrow projection handed to the language model.
 *
 * So detail answers are built here, deterministically, from the full product
 * record. Nothing is invented and nothing published is withheld.
 */

export type DetailAspect = "overview" | "functions" | "sizes" | "materials" | "colours" | "care" | "storage";

const mmToCm = (value: number) => Math.round(value / 10);
const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/** A labelled group of catalogue facts, rendered as its own block in the chat. */
export type DetailGroup = { title: string; rows: Array<{ label: string; value: string }> };

export type ProductDetail = {
  product: Product;
  headline: string;
  groups: DetailGroup[];
  /** Points the retailer must confirm; never presented as product facts. */
  openPoints: string[];
};

/* -------------------------------------------------------------------------- */
/* Resolving which product the customer means                                  */
/* -------------------------------------------------------------------------- */

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Finds the product a message names. Model codes win over names, and longer
 * matches win over shorter ones so "MR 260" never resolves to "MR 2".
 */
export function resolveProduct(text: string, pool: Product[] = products.filter((product) => product.active)): Product | null {
  const haystack = ` ${normalise(text)} `;
  const scored = pool
    .map((product) => {
      const code = normalise(product.modelCode);
      const name = normalise(product.name);
      const byCode = code.length >= 3 && haystack.includes(` ${code} `);
      const byName = name.length >= 4 && haystack.includes(` ${name} `);
      if (!byCode && !byName) return null;
      return { product, weight: Math.max(byCode ? code.length + 2 : 0, byName ? name.length : 0) };
    })
    .filter((entry): entry is { product: Product; weight: number } => Boolean(entry))
    .sort((left, right) => right.weight - left.weight);
  return scored[0]?.product ?? null;
}

const ASPECT_PATTERNS: Array<[DetailAspect, RegExp]> = [
  ["functions", /\b(?:functions?|features?|what can it do|capabilit|options?|adjustab|motoris|electric|recliner?)\b/i],
  ["sizes", /\b(?:size|sizes|dimension|dimensions|measure|measurements|how (?:big|wide|long|tall)|width|length|depth|height|cm\b|centimet)/i],
  ["materials", /\b(?:material|materials|fabric|leather|upholster|cover|wood)\b/i],
  ["colours", /\b(?:colour|color|colours|colors|shade|finish)\b/i],
  ["care", /\b(?:care|clean|cleaning|wash|maintain|maintenance|stain)\b/i],
  ["storage", /\b(?:storage|store|drawer|box spring|under[- ]bed)\b/i]
];

/** Which facet of a product the customer is asking about. */
export function detailAspect(text: string): DetailAspect {
  return ASPECT_PATTERNS.find(([, pattern]) => pattern.test(text))?.[0] ?? "overview";
}

/** True when the message asks about a product rather than for new options. */
const DETAIL_INTENT = /\b(?:tell me more|more about|explain|describe|details?|what about|specs?|specification|how (?:big|wide|long|tall|much)|continue with|go with|proceed with|stick with|take this|choose this|pick this|this one|it)\b/i;

export function asksForDetail(text: string) {
  return DETAIL_INTENT.test(text) || ASPECT_PATTERNS.some(([, pattern]) => pattern.test(text));
}

/* -------------------------------------------------------------------------- */
/* Building the answer                                                         */
/* -------------------------------------------------------------------------- */

function bedGroups(product: Product): DetailGroup[] {
  const bed = product.specifications?.bed;
  if (!bed) return [];
  const rows: Array<{ label: string; value: string }> = [];

  const sizes = bed.sleepingSizes?.length
    ? bed.sleepingSizes.map((size) => `${mmToCm(size.widthMm)} × ${mmToCm(size.lengthMm)} cm`)
    : bed.sleepingWidthsMm?.length && bed.sleepingLengthsMm?.length
      ? bed.sleepingWidthsMm.flatMap((width) => (bed.sleepingLengthsMm ?? []).map((length) => `${mmToCm(width)} × ${mmToCm(length)} cm`))
      : [];
  if (sizes.length) rows.push({ label: "Sleeping sizes", value: sizes.join(" · ") });

  if (bed.outerDimensionsBySleepingSize?.length) {
    rows.push({
      label: "Outer dimensions",
      value: bed.outerDimensionsBySleepingSize
        .map((entry) => `${mmToCm(entry.sleepingSize.widthMm)}×${mmToCm(entry.sleepingSize.lengthMm)} → ${mmToCm(entry.dimensions.widthMm)} × ${mmToCm(entry.dimensions.depthMm)} × ${mmToCm(entry.dimensions.heightMm)} cm`)
        .join(" · ")
    });
  }
  if (bed.bedType?.length) rows.push({ label: "Bed type", value: bed.bedType.map((type) => type.replaceAll("-", " ")).join(", ") });
  if (typeof bed.lyingHeightMm === "number") rows.push({ label: "Lying height", value: `${mmToCm(bed.lyingHeightMm)} cm` });
  if (typeof bed.headboardHeightMm === "number") rows.push({ label: "Headboard height", value: `${mmToCm(bed.headboardHeightMm)} cm` });
  if (bed.mattressFirmnessOptions?.length) rows.push({ label: "Mattress firmness", value: bed.mattressFirmnessOptions.join(", ") });
  if (typeof bed.mattressIncluded === "boolean") rows.push({ label: "Mattress included", value: bed.mattressIncluded ? "yes" : "no" });
  if (typeof bed.slattedBaseCompatible === "boolean") rows.push({ label: "Slatted base", value: bed.slattedBaseCompatible ? `compatible${bed.slattedBaseIncluded ? ", included" : ", not included"}` : "not compatible" });
  if (typeof bed.bedStorage === "boolean") rows.push({ label: "Bed storage", value: bed.bedStorage ? `yes${bed.storageVolumeLitres ? ` (${bed.storageVolumeLitres} l)` : ""}` : "no" });
  if (typeof bed.motorised === "boolean") rows.push({ label: "Motorised adjustment", value: bed.motorised ? "yes" : "no" });

  return rows.length ? [{ title: "Bed specification", rows }] : [];
}

function generalGroups(product: Product): DetailGroup[] {
  const groups: DetailGroup[] = [];
  const build: Array<{ label: string; value: string }> = [];

  const functions = [...new Set([...(product.functions ?? []), ...(product.manualFunctions ?? []), ...(product.comfortFunctions ?? [])])];
  if (functions.length) build.push({ label: "Functions", value: functions.join(", ") });
  if (product.availableComponents?.length) build.push({ label: "Available components", value: product.availableComponents.join(", ") });
  if (product.includedItems?.length) build.push({ label: "Included", value: product.includedItems.join(", ") });
  if (product.orientationOptions?.length) build.push({ label: "Orientation", value: product.orientationOptions.join(", ") });
  if (product.electricFunctions?.length) build.push({ label: "Electric functions", value: product.electricFunctions.join(", ") });
  if (build.length) groups.push({ title: "Functions and components", rows: build });

  const surface: Array<{ label: string; value: string }> = [];
  const materialTypes = product.materialTypes?.length ? product.materialTypes : product.verifiedFacts.materialTypes;
  if (materialTypes?.length) surface.push({ label: "Materials", value: materialTypes.join(", ") });
  if (product.upholsteryMaterial) surface.push({ label: "Upholstery", value: product.upholsteryMaterial });
  if (product.frameMaterial) surface.push({ label: "Frame", value: product.frameMaterial });
  if (product.legMaterial) surface.push({ label: "Legs", value: product.legMaterial });
  if (product.finish) surface.push({ label: "Finish", value: product.finish });
  const colours = product.colorFamilies?.length ? product.colorFamilies : product.colors;
  if (colours?.length) surface.push({ label: "Colours", value: colours.join(", ") });
  const named = materials.filter((material) => product.materials.includes(material.id));
  if (named.length) surface.push({ label: "Catalogue covers", value: named.map((material) => material.name).join(", ") });
  if (surface.length) groups.push({ title: "Materials and colours", rows: surface });

  const planning: Array<{ label: string; value: string }> = [];
  if (product.verifiedFacts.dimensions) {
    planning.push({ label: "Reference footprint", value: `${mmToCm(product.widthMm)} × ${mmToCm(product.depthMm)} × ${mmToCm(product.heightMm)} cm` });
  }
  if (product.numberOfSeatsVerified) planning.push({ label: "Seats", value: String(product.numberOfSeats) });
  if (product.verifiedFacts.seatHeight) planning.push({ label: "Seat height", value: `${mmToCm(product.seatHeightMm)} cm` });
  if (product.layoutShapes?.length) planning.push({ label: "Layouts", value: product.layoutShapes.join(", ") });
  if (product.modular) planning.push({ label: "Modular", value: "yes" });
  if (typeof product.minDoorOpeningMm === "number") planning.push({ label: "Minimum door opening", value: `${mmToCm(product.minDoorOpeningMm)} cm` });
  if (planning.length) groups.push({ title: "Planning", rows: planning });

  return groups;
}

const CARE_FALLBACK = "Vacuum or wipe gently; confirm cover-specific care with the selected retailer.";

export function buildProductDetail(product: Product, aspect: DetailAspect = "overview"): ProductDetail {
  const all = [...bedGroups(product), ...generalGroups(product)];

  const wanted = aspect === "sizes" || aspect === "storage"
    ? all.filter((group) => group.title === "Bed specification" || group.title === "Planning")
    : aspect === "materials" || aspect === "colours"
      ? all.filter((group) => group.title === "Materials and colours")
      : aspect === "functions"
        ? all.filter((group) => group.title === "Functions and components" || group.title === "Bed specification")
        : all;
  const groups = wanted.length ? wanted : all;

  if (aspect === "care") {
    groups.push({ title: "Care", rows: [{ label: "Recommended care", value: CARE_FALLBACK }] });
  }

  const highlights = product.productHighlights?.length ? product.productHighlights : [];
  const headline = [
    product.description || product.subtitle,
    highlights.length ? `Highlights: ${highlights.join(" · ")}.` : ""
  ].filter(Boolean).join(" ");

  const openPoints: string[] = [];
  if (!product.verifiedFacts.dimensions && !product.specifications?.bed) openPoints.push("final dimensions depend on the chosen configuration");
  if (product.configurable) openPoints.push("this is a configurable programme, so the final specification is set with the retailer");
  openPoints.push("price, availability and delivery are confirmed by an authorised Musterring retailer");

  return { product, headline, groups, openPoints };
}

/** Does this product offer a sleeping size matching the requested one? */
export function bedSleepingSizes(product: Product) {
  const bed = product.specifications?.bed;
  if (!bed) return [];
  if (bed.sleepingSizes?.length) return bed.sleepingSizes.map((size) => ({ widthMm: size.widthMm, lengthMm: size.lengthMm }));
  const widths = bed.sleepingWidthsMm ?? [];
  const lengths = bed.sleepingLengthsMm ?? [];
  return widths.flatMap((widthMm) => lengths.map((lengthMm) => ({ widthMm, lengthMm })));
}
