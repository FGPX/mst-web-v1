import { products } from "../data";
import { parseSearchExclusions, parseSearchQuery, searchColorTerms, searchStyleTerms } from "../search";
import type { SearchIntent } from "./schemas";

const catalogueColors = new Set([
  ...searchColorTerms.map(normalizeValue),
  ...products.flatMap((product) => product.verifiedFacts.colors.map(normalizeValue))
]);
const catalogueStyles = new Set([
  ...searchStyleTerms.map(normalizeValue),
  ...products.flatMap((product) => product.verifiedFacts.styles.map(normalizeValue))
]);

function normalizeValue(value: string) {
  return value.trim().toLowerCase().normalize("NFKC").replace(/\s+/g, " ");
}

function canonicalColor(value: string) {
  const normalized = normalizeValue(value);
  const aliases: Array<[RegExp, string]> = [
    [/^rot(?:e|er|es|en|em)?$/, "red"],
    [/^grau(?:e|er|es|en|em)?$/, "grey"],
    [/^schwarz(?:e|er|es|en|em)?$/, "black"],
    [/^wei(?:ß|ss)(?:e|er|es|en|em)?$/, "white"],
    [/^braun(?:e|er|es|en|em)?$/, "brown"],
    [/^grün(?:e|er|es|en|em)?$/, "green"],
    [/^blau(?:e|er|es|en|em)?$/, "blue"],
    [/^gelb(?:e|er|es|en|em)?$/, "yellow"],
    [/^(?:lila|violett)(?:e|er|es|en|em)?$/, "purple"],
    [/^rosa(?:farbene|farbener|farbenes|farbenen|farbenem)?$/, "pink"]
  ];
  return aliases.find(([pattern]) => pattern.test(normalized))?.[1]
    ?? (catalogueColors.has(normalized) ? normalized : null);
}

function canonicalMaterial(value: string) {
  const normalized = normalizeValue(value);
  if (/^(?:leather|leder)(?:bezug)?$/.test(normalized)) return "leather";
  if (/^(?:fabric|textile?|stoff|polsterstoff)(?:bezug)?$/.test(normalized)) return "fabric";
  return normalized === "leather" || normalized === "fabric" ? normalized : null;
}

function canonicalFunction(value: string) {
  const normalized = normalizeValue(value);
  if (/relax|reclin|liegefunktion|entspannungsfunktion/.test(normalized)) return "relax";
  if (/electric|elektrisch|motorisiert|motor|power/.test(normalized)) return "electric";
  if (/easy[ -]?care|pflegeleicht/.test(normalized)) return "easy-care";
  return null;
}

function canonicalStyle(value: string) {
  const normalized = normalizeValue(value);
  const aliases: Array<[RegExp, string]> = [
    [/^minimalistisch(?:e|er|es|en|em)?$/, "minimal"],
    [/^zeitgen(?:ö|oe)ssisch(?:e|er|es|en|em)?$/, "contemporary"],
    [/^klassisch(?:e|er|es|en|em)?$/, "classic"],
    [/^industriell(?:e|er|es|en|em)?$/, "industrial"],
    [/^nat(?:ü|ue)rlich(?:e|er|es|en|em)?$/, "natural"],
    [/^modern(?:e|er|es|en|em)?$/, "modern"],
    [/^elegant(?:e|er|es|en|em)?$/, "elegant"]
  ];
  const canonical = aliases.find(([pattern]) => pattern.test(normalized))?.[1] ?? normalized;
  return catalogueStyles.has(canonical) ? canonical : null;
}

function canonicalRoomType(value: string | null) {
  if (!value) return null;
  const normalized = normalizeValue(value);
  if (/familie.*wohnzimmer|familienwohnzimmer/.test(normalized)) return "family living room";
  if (/wohnzimmer/.test(normalized)) return "living room";
  if (/schlafzimmer/.test(normalized)) return "bedroom";
  if (/esszimmer/.test(normalized)) return "dining room";
  if (/badezimmer|badzimmer/.test(normalized)) return "bathroom";
  if (/küche|kueche/.test(normalized)) return "kitchen";
  if (/flur|diele/.test(normalized)) return "hallway";
  if (/wohnung/.test(normalized)) return /klein/.test(normalized) ? "small apartment" : "apartment";
  return normalized;
}

function canonicalList(values: string[] | null, normalize: (value: string) => string | null) {
  if (!values) return null;
  const canonical = [...new Set(values.map(normalize).filter((value): value is string => Boolean(value)))];
  return canonical.length ? canonical : null;
}

/**
 * Converts English or German provider vocabulary to the English catalogue
 * taxonomy. User-facing search copy remains English; queryText stays verbatim.
 */
export function canonicalizeSearchIntent(intent: SearchIntent): SearchIntent {
  return {
    ...intent,
    colorFamilies: canonicalList(intent.colorFamilies, canonicalColor),
    materials: canonicalList(intent.materials, canonicalMaterial),
    functions: canonicalList(intent.functions, canonicalFunction),
    styles: canonicalList(intent.styles, canonicalStyle),
    roomType: canonicalRoomType(intent.roomType)
  };
}

/**
 * Grounds every catalogue-filtering field in deterministic query evidence.
 * Provider output may improve language understanding, but it cannot silently
 * add a colour, function, dimension or suitability requirement.
 */
export function groundSearchIntent(query: string, providerIntent: SearchIntent): SearchIntent {
  const parsed = parseSearchQuery(query);
  const exclusions = parseSearchExclusions(query);
  const functions = [
    ...(parsed.relaxFunction ? ["relax"] : []),
    ...(parsed.electricFunctions ? ["electric"] : []),
    ...(parsed.easyCare ? ["easy-care"] : [])
  ];
  return {
    ...canonicalizeSearchIntent(providerIntent),
    queryText: query,
    category: parsed.category ?? providerIntent.category,
    colorFamilies: parsed.colors ?? null,
    materials: parsed.materials ?? null,
    maxWidthMm: parsed.maxWidthMm ?? null,
    minWidthMm: parsed.minWidthMm ?? null,
    targetWidthMm: parsed.targetWidthMm ?? null,
    minSeatHeightMm: parsed.minSeatHeightMm ?? null,
    maxSeatDepthMm: parsed.maxSeatDepthMm ?? null,
    numberOfSeats: parsed.seatCount ?? null,
    modular: exclusions.modular ? false : parsed.modular ?? null,
    functions: functions.length ? functions : null,
    styles: parsed.styles ?? null,
    smallSpaceSuitable: parsed.smallSpaceSuitable ?? null,
    layoutShapes: parsed.layoutShapes ?? null
  };
}
