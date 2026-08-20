import type { AlternativeRequest } from "./assistant-schemas";
import { normalizeSearchText, parseSearchQuery } from "../search";
import { canonicalFunctionTags, canonicalMaterialTag } from "./alternative-grounding";

type ExtractedAlternativeRequirements = {
  category: AlternativeRequest["category"] | null;
  colorFamilies: string[];
  styles: string[];
  numberOfSeats: number | null;
  maxWidthMm: number | null;
  minWidthMm: number | null;
  targetWidthMm: number | null;
  layoutShapes: NonNullable<AlternativeRequest["layoutShapes"]>;
  excludedLayoutShapes: NonNullable<AlternativeRequest["excludedLayoutShapes"]>;
  minSeatHeightMm: number | null;
  requiredFunctions: string[];
  excludedFunctions: string[];
  materialTags: string[];
  preserveStyle: boolean | null;
  preserveComfort: boolean | null;
};

const layoutNegationPatterns: Array<[NonNullable<AlternativeRequest["excludedLayoutShapes"]>[number], RegExp]> = [
  ["l-shaped", /\b(?:not|without|no)\s+(?:an?\s+)?l[- ]shaped\b|\bnon[- ]l[- ]shaped\b/],
  ["u-shaped", /\b(?:not|without|no)\s+(?:an?\s+)?u[- ]shaped\b|\bnon[- ]u[- ]shaped\b/],
  ["straight", /\b(?:not|without|no)\s+(?:a\s+)?straight(?: line)?\b|\bnon[- ]straight\b/],
  ["corner", /\b(?:not|without|no)\s+(?:a\s+)?corner(?: layout| sofa| kitchen)?\b|\bnon[- ]corner\b/],
  ["island", /\b(?:not|without|no)\s+(?:an?\s+)?island\b|\bnon[- ]island\b/]
];

export function extractExcludedLayoutShapes(value: string) {
  const text = normalizeSearchText(value);
  return layoutNegationPatterns.filter(([, pattern]) => pattern.test(text)).map(([shape]) => shape);
}

function explicitFunction(text: string, value: string) {
  const normalized = value.toLowerCase();
  if (normalized === "modular") return /\bmodular|\bmodule|\bflexible\b/.test(text);
  if (normalized === "relax") return /\brelax|\brecline|\blounge\b/.test(text);
  if (normalized === "electric") return /\belectric|\bmotor|\bpower\b/.test(text);
  if (normalized === "easy-care") return /\beasy[- ]care|\beasy to clean|\blow[- ]maintenance\b/.test(text);
  return false;
}

function explicitlyExcludedFunction(text: string, value: string) {
  const escaped = value.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:without|no|non[- ]?)\\s*${escaped}\\b`).test(text);
}

function explicitMaterial(text: string, value: string) {
  const normalized = value.toLowerCase();
  if (normalized === "fabric") return /\bfabric|\btextile|\bboucle|\bchenille|\bvelvet\b/.test(text);
  if (normalized === "leather") return /\bleather\b/.test(text);
  if (normalized === "easy-care") return /\beasy[- ]care|\beasy to clean|\blow[- ]maintenance\b/.test(text);
  if (normalized === "family") return /\bfamily|\bchildren|\bkids?\b/.test(text);
  if (normalized === "pet") return /\bpets?|\bdogs?|\bcats?\b/.test(text);
  return false;
}

/**
 * Structured output guarantees shape, not that a model-derived requirement was
 * actually stated. Only constraints with deterministic evidence in the user's
 * text are allowed to reach catalogue matching. Explicit UI fields are merged
 * separately by the provider and remain authoritative.
 */
export function validatedAIAlternativeRequirements(
  input: AlternativeRequest,
  extracted: ExtractedAlternativeRequirements
): Partial<AlternativeRequest> {
  const text = normalizeSearchText(input.requestText ?? "");
  const parsed = parseSearchQuery(text);
  const excludedLayouts = extractExcludedLayoutShapes(text);
  const result: Partial<AlternativeRequest> = {};

  if (extracted.category && extracted.category === parsed.category) result.category = extracted.category;

  const colors = extracted.colorFamilies
    .map((value) => value.toLowerCase())
    .filter((value) => parsed.colors?.includes(value));
  if (colors.length) result.colorFamilies = [...new Set(colors)];

  const styles = extracted.styles
    .map((value) => value.toLowerCase())
    .filter((value) => parsed.styles?.includes(value));
  if (styles.length) result.styles = [...new Set(styles)];

  if (extracted.numberOfSeats && extracted.numberOfSeats === parsed.seatCount) result.numberOfSeats = extracted.numberOfSeats;
  if (extracted.maxWidthMm && extracted.maxWidthMm === parsed.maxWidthMm) result.maxWidthMm = extracted.maxWidthMm;
  if (extracted.minWidthMm && extracted.minWidthMm === parsed.minWidthMm) result.minWidthMm = extracted.minWidthMm;
  if (extracted.targetWidthMm && extracted.targetWidthMm === parsed.targetWidthMm) result.targetWidthMm = extracted.targetWidthMm;

  const layouts = extracted.layoutShapes.filter((value) => parsed.layoutShapes?.includes(value) && !excludedLayouts.includes(value));
  if (layouts.length) result.layoutShapes = [...new Set(layouts)];

  const modelExcludedLayouts = extracted.excludedLayoutShapes.filter((value) => excludedLayouts.includes(value));
  const validatedExcludedLayouts = [...new Set([...excludedLayouts, ...modelExcludedLayouts])];
  if (validatedExcludedLayouts.length) result.excludedLayoutShapes = validatedExcludedLayouts;

  // Relative wording such as "higher seat" is resolved against the source
  // product by the deterministic matcher. AI may only supply an absolute seat
  // height when the user wrote an explicit number.
  const hasExplicitSeatHeight = /\bseat height\s*(?:(?:of|at least|minimum|min\.?|over|above)\s*)?\d{2,3}\s*(?:cm|mm)\b/.test(text)
    || /\b\d{2,3}\s*(?:cm|mm)\s+seat height\b/.test(text);
  if (extracted.minSeatHeightMm && hasExplicitSeatHeight) {
    result.minSeatHeightMm = extracted.minSeatHeightMm;
  }

  const requiredFunctions = extracted.requiredFunctions
    .flatMap(canonicalFunctionTags)
    .filter((value) => explicitFunction(text, value));
  if (requiredFunctions.length) result.requiredFunctions = [...new Set(requiredFunctions)];

  const excludedFunctions = extracted.excludedFunctions
    .flatMap(canonicalFunctionTags)
    .filter((value) => explicitlyExcludedFunction(text, value));
  if (excludedFunctions.length) result.excludedFunctions = [...new Set(excludedFunctions)];

  const materialTags = extracted.materialTags
    .map(canonicalMaterialTag)
    .filter((value) => explicitMaterial(text, value));
  if (materialTags.length) result.materialTags = [...new Set(materialTags)];

  if (extracted.preserveStyle && /\b(?:same|similar|preserve|keep)\s+(?:the\s+)?style\b/.test(text)) result.preserveStyle = true;
  if (extracted.preserveComfort && /\b(?:same|similar|preserve|keep)\s+(?:the\s+)?comfort\b/.test(text)) result.preserveComfort = true;

  return result;
}
