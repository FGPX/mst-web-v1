import { normalizeSearchText, parseSearchQuery } from "../search";
import { alternativeRequestSchema, type AlternativeRequest } from "./assistant-schemas";

const partialAlternativeRequestSchema = alternativeRequestSchema.partial();

function unique(values: string[]) {
  return [...new Set(values.map((value) => value.toLowerCase()))];
}

function functionIsExplicit(value: string, text: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("relax") || normalized.includes("recline") || normalized.includes("lounge")) return /\b(?:relax|recline|lounge)\b/.test(text);
  if (normalized.includes("electric") || normalized.includes("motor") || normalized.includes("power")) return /\b(?:electric|motor(?:ized|ised)?|power)\b/.test(text);
  if (normalized.includes("modular")) return /\b(?:modular|module|flexible)\b/.test(text);
  return normalized.split(/[^a-z0-9]+/).filter((token) => token.length > 2).some((token) => text.includes(token));
}

function materialIsExplicit(value: string, text: string) {
  const normalized = value.toLowerCase();
  if (normalized === "easy-care") return /\b(?:easy|easier|low)[- ](?:care|clean|maintenance)|easy to (?:care for|clean)|children|family|pets?|dog\b/.test(text);
  if (normalized === "fabric") return /\b(?:fabric|textile|boucle|chenille|velvet|microfiber)\b/.test(text);
  if (normalized === "leather") return /\bleather\b/.test(text);
  return normalized.split(/[^a-z0-9]+/).filter((token) => token.length > 2).some((token) => text.includes(token));
}

export function groundAlternativeRequest(input: AlternativeRequest, rawExtraction: unknown): AlternativeRequest {
  const extraction = partialAlternativeRequestSchema.safeParse(rawExtraction);
  const inferred = extraction.success ? extraction.data : {};
  const text = normalizeSearchText(input.requestText ?? "");
  const deterministic = parseSearchQuery(text);
  const inferredFunctions = (inferred.requiredFunctions ?? []).filter((value) => functionIsExplicit(value, text));
  const inferredExcludedFunctions = (inferred.excludedFunctions ?? []).filter((value) =>
    /\b(?:without|no|non[- ]|exclude|avoid)\b/.test(text) && functionIsExplicit(value, text)
  );
  const inferredMaterials = (inferred.materialTags ?? []).filter((value) => materialIsExplicit(value, text));

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
    minSeatHeightMm: input.minSeatHeightMm ?? deterministic.minSeatHeightMm,
    requiredFunctions: unique([...(input.requiredFunctions ?? []), ...inferredFunctions]),
    excludedFunctions: unique([...(input.excludedFunctions ?? []), ...inferredExcludedFunctions]),
    materialTags: unique([...(input.materialTags ?? []), ...inferredMaterials]),
    preserveStyle: input.preserveStyle ?? /\b(?:same|similar|preserve) style\b/.test(text),
    preserveComfort: input.preserveComfort ?? /\b(?:same|similar|preserve) comfort\b/.test(text)
  });
}
