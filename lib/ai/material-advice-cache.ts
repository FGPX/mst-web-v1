import { materials } from "../data";
import { materialMetadataMatches, parseMaterialNeeds } from "../assistant";
import type { MaterialAdvice } from "./assistant-schemas";

type MaterialAdviceSource = "catalogue" | "openai" | "gemini" | "demo";

export type ResolvedMaterialAdvice = {
  data: MaterialAdvice;
  source: MaterialAdviceSource;
  fallback: boolean;
  cached: boolean;
};

type CachedMaterialAdvice = Omit<ResolvedMaterialAdvice, "cached"> & { expiresAt: number };

const CACHE_TTL_MS = 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 250;
const materialAdviceCache = new Map<string, CachedMaterialAdvice>();

// Including every recommendation-relevant field makes cached answers expire
// automatically when the bundled catalogue changes.
const catalogueSnapshot = JSON.stringify(materials.map((material) => ({
  id: material.id,
  type: material.type,
  colorFamily: material.colorFamily,
  texture: material.texture,
  composition: material.composition,
  durability: material.durability,
  easyCare: material.easyCare,
  petFriendly: material.petFriendly,
  familyFriendly: material.familyFriendly,
  lightSensitivity: material.lightSensitivity,
  care: material.care,
  cleaningMethods: material.cleaningMethods,
  maintenance: material.maintenance,
  recommendedUses: material.recommendedUses,
  cautions: material.cautions
})));

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

const catalogueVersion = stableHash(catalogueSnapshot);

function normalizedText(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function localAdvice(requestText: string) {
  const advice = parseMaterialNeeds(requestText);
  const hasStructuredNeed = Boolean(
    advice.needs.children || advice.needs.pets || advice.needs.highUse ||
    advice.needs.strongSunlight || advice.needs.easyCareRequired ||
    advice.needs.preferredColors?.length || advice.needs.preferredMaterialGroups?.length ||
    advice.needs.avoidMaterialGroups?.length
  );
  const metadataMatches = materialMetadataMatches(requestText);
  return { advice, canAnswerLocally: hasStructuredNeed || metadataMatches.length > 0 };
}

function cacheKey(requestText: string, advice: MaterialAdvice, canAnswerLocally: boolean) {
  // Equivalent recognized phrases share a cache entry through their normalized
  // catalogue requirements. Ambiguous requests retain their normalized wording.
  const requestKey = canAnswerLocally
    ? JSON.stringify({ needs: advice.needs, recommendedMaterialIds: advice.recommendedMaterialIds, materialsToAvoid: advice.materialsToAvoid })
    : normalizedText(requestText);
  return `${catalogueVersion}:${requestKey}`;
}

function writeCache(key: string, value: Omit<ResolvedMaterialAdvice, "cached">) {
  if (materialAdviceCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = materialAdviceCache.keys().next().value;
    if (oldestKey) materialAdviceCache.delete(oldestKey);
  }
  materialAdviceCache.set(key, { ...value, expiresAt: Date.now() + CACHE_TTL_MS });
}

export async function resolveMaterialAdvice(
  requestText: string,
  analyzeAmbiguousRequest: () => Promise<Omit<ResolvedMaterialAdvice, "cached">>
): Promise<ResolvedMaterialAdvice> {
  const local = localAdvice(requestText);
  const key = cacheKey(requestText, local.advice, local.canAnswerLocally);
  const cached = materialAdviceCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return { data: cached.data, source: cached.source, fallback: cached.fallback, cached: true };
  }
  if (cached) materialAdviceCache.delete(key);

  const result = local.canAnswerLocally
    ? { data: local.advice, source: "catalogue" as const, fallback: false }
    : await analyzeAmbiguousRequest();
  writeCache(key, result);
  return { ...result, cached: false };
}

export function clearMaterialAdviceCache() {
  materialAdviceCache.clear();
}
