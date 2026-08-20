import { normalizeSearchText, parseSearchQuery } from "../search";
import { alternativeRequestSchema, type AlternativeRequest } from "./assistant-schemas";

const partialAlternativeRequestSchema = alternativeRequestSchema.partial();

function unique(values: string[]) {
  return [...new Set(values.map((value) => value.toLowerCase()))];
}

export function extractTabletopShapes(value: string) {
  const text = normalizeSearchText(value);
  const shapes: NonNullable<AlternativeRequest["tabletopShapes"]> = [];
  // "oven table" is a common typo for "oval table". Keep this
  // correction deliberately table-scoped so an appliance request is not
  // silently reinterpreted elsewhere.
  if (/\boval\b|\boven\s+(?:dining\s+)?tables?\b/.test(text)) shapes.push("oval");
  if (/\bround\b|\bcircular\b/.test(text)) shapes.push("round");
  if (/\bsquare\b/.test(text)) shapes.push("square");
  if (/\brectang(?:le|ular)\b/.test(text)) shapes.push("rectangular");
  return [...new Set(shapes)];
}

function functionIsExplicit(value: string, text: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("relax") || normalized.includes("recline") || normalized.includes("lounge")) return /\b(?:relax|recline|lounge)\b/.test(text);
  if (normalized.includes("electric") || normalized.includes("motor") || normalized.includes("power")) return /\b(?:electric|motor(?:ized|ised)?|power)\b/.test(text);
  if (normalized.includes("modular")) return /\b(?:modular|module|flexible)\b/.test(text);
  return false;
}

export function canonicalFunctionTags(value: string) {
  const normalized = value.toLowerCase();
  const tags: string[] = [];
  if (/\b(?:electric|motor(?:ized|ised)?|power)\b/.test(normalized)) tags.push("electric");
  if (/\b(?:relax|recline|lounge)\b/.test(normalized)) tags.push("relax");
  if (/\b(?:modular|module|flexible)\b/.test(normalized)) tags.push("modular");
  return tags.length ? tags : [normalized];
}

function materialIsExplicit(value: string, text: string) {
  const normalized = value.toLowerCase();
  if (normalized === "easy-care") return /\b(?:easy|easier|low)[- ](?:care|clean|maintenance)|easy to (?:care for|clean)|children|family[- ]friendly|family household|pets?|dog\b/.test(text);
  if (normalized === "fabric") return /\b(?:fabric|textile|boucle|chenille|velvet|microfiber)\b/.test(text);
  if (normalized === "leather") return /\bleather\b/.test(text);
  return false;
}

export function canonicalMaterialTag(value: string) {
  const normalized = value.toLowerCase();
  if (/\bleather\b/.test(normalized)) return "leather";
  if (/\b(?:fabric|textile|boucle|chenille|velvet|microfiber)\b/.test(normalized)) return "fabric";
  if (/\b(?:easy[- ]?care|easy[- ]?clean|low[- ]?maintenance)\b/.test(normalized)) return "easy-care";
  return normalized;
}

export function groundAlternativeRequest(input: AlternativeRequest, rawExtraction: unknown): AlternativeRequest {
  const extraction = partialAlternativeRequestSchema.safeParse(rawExtraction);
  const inferred = extraction.success ? extraction.data : {};
  const text = normalizeSearchText(input.requestText ?? "");
  const deterministic = parseSearchQuery(text);
  const inferredFunctions = (inferred.requiredFunctions ?? [])
    .flatMap(canonicalFunctionTags)
    .filter((value) => functionIsExplicit(value, text));
  const inferredExcludedFunctions = (inferred.excludedFunctions ?? [])
    .flatMap(canonicalFunctionTags)
    .filter((value) => /\b(?:without|no|non[- ]|exclude|avoid)\b/.test(text) && functionIsExplicit(value, text));
  const inferredMaterials = (inferred.materialTags ?? [])
    .map(canonicalMaterialTag)
    .filter((value) => materialIsExplicit(value, text));
  const tabletopShapes = extractTabletopShapes(text);

  return alternativeRequestSchema.parse({
    ...input,
    category: input.category ?? deterministic.category,
    colorFamilies: input.colorFamilies ?? deterministic.colors,
    styles: input.styles ?? deterministic.styles,
    numberOfSeats: input.numberOfSeats ?? deterministic.seatCount,
    maxWidthMm: input.maxWidthMm ?? deterministic.maxWidthMm,
    minWidthMm: input.minWidthMm ?? deterministic.minWidthMm,
    targetWidthMm: input.targetWidthMm ?? deterministic.targetWidthMm,
    layoutShapes: input.layoutShapes ?? deterministic.layoutShapes,
    tabletopShapes: input.tabletopShapes ?? (tabletopShapes.length ? tabletopShapes : undefined),
    minSeatHeightMm: input.minSeatHeightMm ?? deterministic.minSeatHeightMm,
    requiredFunctions: unique([...(input.requiredFunctions ?? []).flatMap(canonicalFunctionTags), ...inferredFunctions]),
    excludedFunctions: unique([...(input.excludedFunctions ?? []).flatMap(canonicalFunctionTags), ...inferredExcludedFunctions]),
    materialTags: unique([...(input.materialTags ?? []).map(canonicalMaterialTag), ...inferredMaterials]),
    preserveStyle: input.preserveStyle ?? /\b(?:same|similar|preserve) style\b/.test(text),
    preserveComfort: input.preserveComfort ?? /\b(?:same|similar|preserve) comfort\b/.test(text)
  });
}
