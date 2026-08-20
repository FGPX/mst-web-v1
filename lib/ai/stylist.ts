import { products } from "../data";
import {
  stylistStyleLabels,
  type Category,
  type Product,
  type ProductSubtype,
  type StylistPalette,
  type StylistPreferences,
  type StylistPriority,
  type StylistRoomType,
  type StylistStyle,
  type StylistTarget
} from "../types";
import { stylistProviderResultSchema, stylistSlotIds, type StylistProviderResult } from "./schemas";
import { stylistAnswerLabel, stylistAnswerValues } from "./stylist-quiz";

export type StylistSlot = {
  id: (typeof stylistSlotIds)[number];
  label: string;
  categories: Category[];
  productSubtypes?: ProductSubtype[];
};

export type StylistCandidate = {
  id: string;
  modelCode: string;
  name: string;
  category: Category;
  subtitle: string;
  verifiedColors: string[];
  verifiedStyles: string[];
  catalogueEvidence: string[];
  styleMatch: "strong" | "partial" | "limited";
  preferenceMatch: "strong" | "partial" | "limited";
  styleEvidence: string[];
  preferenceEvidence: string[];
  score: number;
  matchLevel: "exact" | "closest";
  matchedPreferences: string[];
  unmetPreferences: string[];
  recommendedQuantity?: number;
};

export const stylistBlueprints: Record<StylistRoomType, StylistSlot[]> = {
  "living-room": [
    { id: "living-seating", label: "Seating", categories: ["sofa", "sectional"] },
    { id: "living-table", label: "Coffee table", categories: ["coffee-table"] },
    { id: "living-storage", label: "Living storage", categories: ["storage"] }
  ],
  bedroom: [
    { id: "bedroom-bed", label: "Bed", categories: ["bed"] },
    { id: "bedroom-wardrobe", label: "Wardrobe", categories: ["wardrobe"] },
    { id: "bedroom-series", label: "Bedroom collection", categories: ["bedroom-series"] }
  ],
  "dining-room": [
    { id: "dining-table", label: "Dining table", categories: ["dining-table"] },
    { id: "dining-chair", label: "Dining chair", categories: ["dining-chair"] },
    { id: "dining-storage", label: "Dining storage", categories: ["storage"] }
  ],
  bathroom: [{ id: "bathroom-series", label: "Bathroom series", categories: ["bathroom"] }],
  hallway: [
    { id: "hallway-wardrobe", label: "Hallway wardrobe", categories: ["wardrobe"] },
    { id: "hallway-storage", label: "Hallway storage", categories: ["storage"] }
  ],
  kitchen: [
    { id: "kitchen-table", label: "Kitchen dining table", categories: ["dining-table"] },
    { id: "kitchen-seating", label: "Kitchen seating", categories: ["dining-chair"] },
    { id: "kitchen-storage", label: "Kitchen storage", categories: ["storage"] }
  ],
  outdoor: [{ id: "outdoor-set", label: "Outdoor collection", categories: ["outdoor"] }],
  "home-accessories": [
    { id: "accessory-small", label: "Small furniture", categories: ["small-furniture", "coffee-table"] },
    { id: "accessory-carpet", label: "Carpet", categories: ["carpet"] },
    { id: "accessory-lamp", label: "Lamp", categories: ["lamp"] }
  ]
};

const targetSlots: Partial<Record<StylistTarget, StylistSlot>> = {
  sofa: { id: "single-product", label: "Sofa", categories: ["sofa", "sectional"], productSubtypes: ["sofa", "sectional-sofa", "recliner-sofa", "sofa-bed"] },
  armchair: { id: "single-product", label: "Armchair", categories: ["armchair"], productSubtypes: ["armchair", "recliner-armchair", "swivel-armchair"] },
  "coffee-table": { id: "single-product", label: "Coffee table", categories: ["coffee-table"], productSubtypes: ["coffee-table"] },
  "side-table": { id: "single-product", label: "Side table", categories: ["small-furniture", "coffee-table"], productSubtypes: ["side-table"] },
  "wall-unit": { id: "single-product", label: "Wall unit", categories: ["storage"], productSubtypes: ["wall-unit"] },
  sideboard: { id: "single-product", label: "Sideboard", categories: ["storage"], productSubtypes: ["sideboard"] },
  bed: { id: "single-product", label: "Bed", categories: ["bed"], productSubtypes: ["bed", "upholstered-bed", "boxspring-bed"] },
  wardrobe: { id: "single-product", label: "Wardrobe", categories: ["wardrobe"], productSubtypes: ["wardrobe"] },
  "bedside-tables": { id: "single-product", label: "Bedside tables", categories: ["bedroom-series", "wardrobe"], productSubtypes: ["bedside-table"] },
  dresser: { id: "single-product", label: "Dresser", categories: ["bedroom-series", "wardrobe"], productSubtypes: ["dresser"] },
  "bedroom-series": { id: "single-product", label: "Bedroom series", categories: ["bedroom-series"] },
  "dining-table": { id: "single-product", label: "Dining table", categories: ["dining-table", "dining-chair"], productSubtypes: ["dining-table"] },
  "dining-chairs": { id: "single-product", label: "Dining chairs", categories: ["dining-chair", "dining-table"], productSubtypes: ["dining-chair", "dining-armchair"] },
  "dining-bench": { id: "single-product", label: "Dining bench", categories: ["dining-chair", "dining-table"], productSubtypes: ["dining-bench"] },
  "dining-sideboard": { id: "single-product", label: "Dining sideboard", categories: ["storage"], productSubtypes: ["sideboard"] },
  "vanity-unit": { id: "single-product", label: "Vanity unit", categories: ["bathroom"] },
  "washbasin-cabinet": { id: "single-product", label: "Washbasin cabinet", categories: ["bathroom"] },
  "tall-cabinet": { id: "single-product", label: "Tall cabinet", categories: ["bathroom"] },
  "mirror-cabinet": { id: "single-product", label: "Mirror cabinet", categories: ["bathroom"] },
  "bathroom-storage": { id: "single-product", label: "Bathroom storage", categories: ["bathroom"] },
  "hallway-wardrobe": { id: "single-product", label: "Hallway wardrobe", categories: ["wardrobe"] },
  "shoe-storage": { id: "single-product", label: "Shoe storage", categories: ["storage"] },
  "coat-storage": { id: "single-product", label: "Coat storage", categories: ["storage", "wardrobe"] },
  "hallway-bench": { id: "single-product", label: "Hallway bench", categories: ["small-furniture", "storage"] },
  mirror: { id: "single-product", label: "Hallway mirror", categories: ["storage", "bedroom-series", "small-furniture"] },
  "kitchen-storage": { id: "single-product", label: "Kitchen storage", categories: ["storage"] },
  "kitchen-dining-area": { id: "single-product", label: "Kitchen dining area", categories: ["dining-table"] },
  "kitchen-seating": { id: "single-product", label: "Kitchen seating", categories: ["dining-chair"] },
  "kitchen-small-furniture": { id: "single-product", label: "Kitchen small furniture", categories: ["small-furniture", "coffee-table"] },
  "outdoor-sofa": { id: "single-product", label: "Outdoor sofa", categories: ["outdoor"] },
  "outdoor-chairs": { id: "single-product", label: "Outdoor chairs", categories: ["outdoor"] },
  "outdoor-dining-table": { id: "single-product", label: "Outdoor dining table", categories: ["outdoor"] },
  "lounge-furniture": { id: "single-product", label: "Outdoor lounge furniture", categories: ["outdoor"] },
  lounger: { id: "single-product", label: "Lounger", categories: ["outdoor"] },
  "small-furniture": { id: "single-product", label: "Small furniture", categories: ["small-furniture", "coffee-table"] },
  carpet: { id: "single-product", label: "Carpet", categories: ["carpet"] },
  lamp: { id: "single-product", label: "Lamp", categories: ["lamp"] },
  "home-textiles": { id: "single-product", label: "Home textiles", categories: ["home-textile", "carpet"] }
};

export function resolveStylistSlots(preferences: StylistPreferences) {
  const dynamicCompleteTargets = new Set<StylistTarget>(["complete-living-room", "complete-bedroom", "complete-dining-room"]);
  if (dynamicCompleteTargets.has(preferences.target)) {
    const slotByAnswer: Record<string, StylistSlot> = {
      sofa: { id: "living-seating", label: "Sofa", categories: ["sofa", "sectional"], productSubtypes: ["sofa", "sectional-sofa", "recliner-sofa", "sofa-bed"] },
      armchair: { id: "living-armchair", label: "Armchair", categories: ["armchair"], productSubtypes: ["armchair", "recliner-armchair", "swivel-armchair"] },
      "coffee-table": { id: "living-table", label: "Coffee table", categories: ["coffee-table"], productSubtypes: ["coffee-table"] },
      "side-table": { id: "living-side-table", label: "Side table", categories: ["small-furniture", "coffee-table"], productSubtypes: ["side-table"] },
      "wall-unit": { id: "living-storage", label: "Wall unit", categories: ["storage"], productSubtypes: ["wall-unit", "media-unit"] },
      sideboard: { id: "living-sideboard", label: "Sideboard", categories: ["storage"], productSubtypes: ["sideboard"] },
      bed: { id: "bedroom-bed", label: "Bed", categories: ["bed", "bedroom-series"], productSubtypes: ["bed", "upholstered-bed", "boxspring-bed"] },
      wardrobe: { id: "bedroom-wardrobe", label: "Wardrobe", categories: ["wardrobe", "bedroom-series"], productSubtypes: ["wardrobe"] },
      "bedside-tables": { id: "bedroom-bedside", label: "Bedside tables", categories: ["bedroom-series", "wardrobe"], productSubtypes: ["bedside-table"] },
      dresser: { id: "bedroom-dresser", label: "Dresser", categories: ["bedroom-series", "wardrobe"], productSubtypes: ["dresser"] },
      "dining-table": { id: "dining-table", label: "Dining table", categories: ["dining-table", "dining-chair"], productSubtypes: ["dining-table"] },
      "dining-chairs": { id: "dining-chair", label: "Dining chairs", categories: ["dining-chair", "dining-table"], productSubtypes: ["dining-chair", "dining-armchair"] },
      "dining-bench": { id: "dining-bench", label: "Dining bench", categories: ["dining-chair", "dining-table"], productSubtypes: ["dining-bench"] },
      "dining-sideboard": { id: "dining-storage", label: "Dining sideboard", categories: ["storage"], productSubtypes: ["sideboard"] }
    };
    const pieceQuestion = preferences.roomType === "living-room" ? "living-pieces" : preferences.roomType === "bedroom" ? "series-pieces" : "dining-pieces";
    const requested = stylistAnswerValues(preferences.answers[pieceQuestion]);
    const slots = [...new Set(requested)].flatMap((piece) => slotByAnswer[piece] ? [slotByAnswer[piece]!] : []);
    if (slots.length) return slots.slice(0, 4);
  }
  const multiProductTargets = new Set<StylistTarget>(["complete-hallway", "complete-kitchen-concept", "several-accessories"]);
  const seriesTargets = new Set<StylistTarget>(["complete-bathroom-series", "complete-outdoor-set"]);
  if (multiProductTargets.has(preferences.target) || seriesTargets.has(preferences.target)) return stylistBlueprints[preferences.roomType];
  const slot = targetSlots[preferences.target];
  if (!slot) throw new Error(`No catalogue slot is configured for ${preferences.target}.`);
  return [slot];
}

export const stylistStyleProfiles: Record<StylistStyle, { directions: string[]; styles: string[]; colors: string[] }> = {
  "modern-contemporary": {
    directions: ["Modern European", "Italian Contemporary", "Bauhaus / Geometric"],
    styles: ["modern", "contemporary", "architectural", "bauhaus", "geometric"],
    colors: ["grey", "charcoal", "white", "black", "beige"]
  },
  "minimalist-scandinavian": {
    directions: ["Minimalist", "Scandinavian", "Nordic"],
    styles: ["minimal", "clean", "simple", "scandinavian", "nordic"],
    colors: ["white", "cream", "beige", "grey", "natural oak"]
  },
  "warm-natural-rustic": {
    directions: ["Warm Natural Modern", "Modern Rustic", "Mediterranean / Country House"],
    styles: ["natural", "wood", "warm", "soft modern", "rustic", "mediterranean", "country"],
    colors: ["beige", "brown", "oak", "natural", "cream", "taupe", "cognac"]
  },
  "classic-elegant-luxury": {
    directions: ["Classic Contemporary", "Timeless Elegant", "Modern Luxury / Glam"],
    styles: ["classic", "elegant", "timeless", "luxury", "glam", "comfort", "soft"],
    colors: ["beige", "cream", "brown", "taupe", "burgundy", "black"]
  },
  "industrial-urban": {
    directions: ["Industrial", "Urban", "Loft"],
    styles: ["industrial", "urban", "metal", "loft", "geometric"],
    colors: ["charcoal", "black", "grey", "brown", "cognac"]
  },
  "retro-decorative": {
    directions: ["1970s Retro", "Vintage", "Colorful / Playful", "Modern Oriental"],
    styles: ["retro", "vintage", "decorative", "playful", "colorful", "oriental", "1970"],
    colors: ["mustard", "yellow", "cognac", "burgundy", "red", "brown", "black"]
  }
};

export const stylistPaletteColors: Record<StylistPalette, string[]> = {
  "light-neutral": ["white", "warm white", "ivory", "cream", "beige", "sand", "light grey"],
  "warm-natural": ["oak", "natural oak", "natural", "brown", "cognac", "taupe", "wood"],
  "dark-tones": ["black", "black oak", "charcoal", "graphite", "dark stone", "burgundy"],
  "colour-accents": ["mustard", "yellow", "red", "burgundy", "green", "terracotta", "cognac"],
  "no-preference": []
};

export const stylistPriorityLabels: Record<StylistPriority, string> = {
  comfort: "Comfort",
  "easy-care": "Easy care",
  "flexible-modular": "Flexible / modular",
  "compact-footprint": "Compact size",
  "relax-functions": "Relax functions",
  "premium-materials": "Premium materials"
};

function normalized(value: string) {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function termMatches(value: string, term: string) {
  const left = normalized(value);
  const right = normalized(term);
  return Boolean(left && right && (left.includes(right) || right.includes(left)));
}

function hasVerifiedField(product: Product, path: string) {
  return product.dataQuality?.verifiedFields.includes(path) === true;
}

function answerValue(preferences: StylistPreferences, id: string) {
  const value = preferences.answers[id];
  return Array.isArray(value) ? value[0] : value;
}

function requestedCapacity(preferences: StylistPreferences) {
  const value = answerValue(preferences, "seating-capacity") ?? answerValue(preferences, "table-capacity");
  if (!value) return null;
  if (value === "3" || value === "4") return Number(value);
  const ranges: Record<string, number> = { "1-2": 2, "2-4": 4, "4-6": 6, "6-8": 8, "5-plus": 5, "8-plus": 8 };
  return ranges[value] ?? null;
}

function baseHardPreferenceAssessment(product: Product, preferences: StylistPreferences, slot: StylistSlot) {
  const matched: string[] = [];
  const unmet: string[] = [];
  const subtypes = product.productSubtypes ?? [];
  if (slot.productSubtypes?.length) {
    if (!slot.productSubtypes.some((subtype) => subtypes.includes(subtype))) unmet.push(`required subtype ${slot.productSubtypes.join("/")} is unavailable`);
    else if (!hasVerifiedField(product, "productSubtypes")) unmet.push("product subtype is not verified");
    else matched.push(`verified subtype ${subtypes.filter((subtype) => slot.productSubtypes!.includes(subtype)).join(", ")}`);
  }
  if (preferences.spaceSize === "known-dimensions" && preferences.maxWidthMm && preferences.maxDepthMm) {
    const verifiedConfigurations = (product.configurations ?? []).filter((configuration) => configuration.dimensions && configuration.dataQuality.verifiedFields.includes("dimensions"));
    const fits = verifiedConfigurations.some((configuration) => configuration.dimensions!.widthMm <= preferences.maxWidthMm! && configuration.dimensions!.depthMm <= preferences.maxDepthMm!)
      || (hasVerifiedField(product, "dimensions") && product.widthMm <= preferences.maxWidthMm && product.depthMm <= preferences.maxDepthMm);
    if (fits) matched.push("verified configuration dimensions fit the requested maximum");
    else unmet.push(verifiedConfigurations.length || hasVerifiedField(product, "dimensions") ? "no verified configuration fits the requested dimensions" : "configuration dimensions are not verified");
  }
  const minimumCapacity = requestedCapacity(preferences);
  const isDiningChairModel = slot.productSubtypes?.some((subtype) => ["dining-chair", "dining-armchair"].includes(subtype));
  const table = product.specifications?.table;
  const chair = product.specifications?.diningChair;
  const seating = product.specifications?.seating;
  if (minimumCapacity && !isDiningChairModel && (table || chair || seating)) {
    const capacity = table?.capacityMax ?? chair?.seatCapacityMax ?? seating?.seatCapacityMax ?? null;
    const capacityPath = table ? "specifications.table.capacityMax" : chair ? "specifications.diningChair.seatCapacityMax" : "specifications.seating.seatCapacityMax";
    if (!hasVerifiedField(product, capacityPath)) unmet.push("requested minimum capacity is not verified");
    else if (capacity !== null && capacity >= minimumCapacity) matched.push(`verified capacity for at least ${minimumCapacity}`);
    else unmet.push(`verified capacity is below ${minimumCapacity}`);
  }
  return { matched, unmet, exact: unmet.length === 0 };
}

type PreferenceRuleResult = { matched?: string; unmet?: string };
type PreferenceRule = {
  questionIds: string[];
  mode: "hard" | "soft";
  evaluate: (product: Product, preferences: StylistPreferences, slot: StylistSlot) => PreferenceRuleResult | null;
};

function verifiedRule(product: Product, path: string, matches: boolean, matched: string, unmet: string): PreferenceRuleResult {
  if (!hasVerifiedField(product, path)) return { unmet: `${unmet}; ${path} is not verified` };
  return matches ? { matched } : { unmet };
}

function storageLayoutRule(product: Product, preferences: StylistPreferences) {
  const questionId = ["bedside-storage", "dresser-storage", "sideboard-storage"].find((id) => preferences.answers[id] !== undefined);
  const wanted = questionId ? answerValue(preferences, questionId) : null;
  const storage = product.specifications?.storage;
  if (!wanted || wanted === "no-preference" || !storage) return null;
  const drawers = (storage.drawers ?? 0) > 0;
  const doors = (storage.doors ?? 0) > 0;
  const open = (storage.shelves ?? 0) > 0 || storage.internalLayout.some((value) => /open|shelf/i.test(value));
  const matches = wanted === "drawers" || wanted === "mostly-drawers" ? drawers
    : wanted === "doors" ? doors
      : wanted === "open-shelf" || wanted === "open-display" ? open
        : wanted === "minimal" ? !drawers && !doors
          : wanted === "drawers-doors" ? drawers && doors
            : open && (drawers || doors);
  return verifiedRule(product, "specifications.storage.internalLayout", matches, `verified ${wanted.replaceAll("-", " ")} storage layout`, `${wanted.replaceAll("-", " ")} storage layout is unavailable`);
}

const preferenceRuleRegistry: PreferenceRule[] = [
  {
    questionIds: ["sofa-format"], mode: "hard", evaluate(product, preferences) {
      const wanted = answerValue(preferences, "sofa-format");
      const seating = product.specifications?.seating;
      if (!wanted || wanted === "not-sure" || !seating) return null;
      if (wanted === "standard-sofa") return verifiedRule(product, "productSubtypes", product.productSubtypes?.includes("sofa") === true, "verified standard sofa subtype", "standard sofa subtype is unavailable");
      if (wanted === "corner-sofa") return verifiedRule(product, "layoutShapes", product.layoutShapes?.some((shape) => ["corner", "l-shaped"].includes(shape)) === true, "verified corner sofa layout", "corner sofa layout is unavailable");
      if (wanted === "modular-sofa") return verifiedRule(product, "modular", product.modular === true, "verified modular sofa", "modular sofa is unavailable");
      return verifiedRule(product, "specifications.seating.sofaBed", seating.sofaBed, "verified sofa-bed function", "sofa-bed function is unavailable");
    }
  },
  {
    questionIds: ["armchair-function"], mode: "hard", evaluate(product, preferences) {
      const wanted = answerValue(preferences, "armchair-function");
      const seating = product.specifications?.seating;
      if (!wanted || wanted === "no-preference" || !seating) return null;
      if (wanted === "standard") return verifiedRule(product, "productSubtypes", product.productSubtypes?.includes("armchair") === true, "verified standard armchair subtype", "standard armchair subtype is unavailable");
      const path = wanted === "swivel" ? "specifications.seating.swivel" : wanted === "electric-relax" ? "specifications.seating.electricRecliner" : "specifications.seating.recliner";
      const matches = wanted === "swivel" ? seating.swivel : wanted === "electric-relax" ? seating.electricRecliner : seating.recliner;
      return verifiedRule(product, path, matches, `verified ${wanted} function`, `${wanted} function is unavailable`);
    }
  },
  {
    questionIds: ["bed-type"], mode: "hard", evaluate(product, preferences) {
      const wanted = answerValue(preferences, "bed-type");
      const bed = product.specifications?.bed;
      if (!wanted || wanted === "no-preference" || !bed) return null;
      const subtype = wanted === "upholstered" ? "upholstered-bed" : wanted === "boxspring" ? "boxspring-bed" : "bed-frame";
      return verifiedRule(product, "specifications.bed.bedType", bed.bedType.includes(subtype), `verified ${wanted} bed type`, `${wanted} bed type is unavailable`);
    }
  },
  {
    questionIds: ["bed-size"], mode: "hard", evaluate(product, preferences, slot) {
      const size = answerValue(preferences, "bed-size")?.match(/^(\d+)x(\d+)$/);
      if (!size || !slot.productSubtypes?.some((subtype) => ["bed", "upholstered-bed", "boxspring-bed"].includes(subtype))) return null;
      const matches = product.specifications?.bed?.sleepingSizes.some((candidate) => candidate.widthMm === Number(size[1]) * 10 && candidate.lengthMm === Number(size[2]) * 10) === true;
      return verifiedRule(product, "specifications.bed.sleepingSizes", matches, `verified ${size[1]} × ${size[2]} cm sleeping size`, `${size[1]} × ${size[2]} cm sleeping size is unavailable`);
    }
  },
  {
    questionIds: ["additional-storage"], mode: "hard", evaluate(product, preferences) {
      if (!stylistAnswerValues(preferences.answers["additional-storage"]).includes("under-bed") || !product.specifications?.bed) return null;
      return verifiedRule(product, "specifications.bed.underBedStorage", product.specifications.bed.underBedStorage === true, "verified under-bed storage", "under-bed storage is unavailable");
    }
  },
  {
    questionIds: ["wardrobe-capacity"], mode: "hard", evaluate(product, preferences) {
      const wanted = answerValue(preferences, "wardrobe-capacity");
      const wardrobe = product.specifications?.wardrobe;
      if (!wanted || !wardrobe) return null;
      const accepted: Record<string, string[]> = { "compact-one-person": ["compact"], "standard-two-person": ["medium", "large", "configuration-dependent"], generous: ["large", "extra-large", "configuration-dependent"], "wall-to-wall": ["extra-large", "configuration-dependent"] };
      return verifiedRule(product, "specifications.wardrobe.capacityBand", accepted[wanted]?.includes(wardrobe.capacityBand ?? "") === true, "verified requested wardrobe capacity", "requested wardrobe capacity is unavailable");
    }
  },
  {
    questionIds: ["wardrobe-doors"], mode: "hard", evaluate(product, preferences) {
      const wanted = answerValue(preferences, "wardrobe-doors");
      const wardrobe = product.specifications?.wardrobe;
      if (!wanted || wanted === "no-preference" || !wardrobe) return null;
      return verifiedRule(product, "specifications.wardrobe.doorType", wardrobe.doorType.includes(wanted as "hinged" | "sliding" | "folding"), `verified ${wanted} doors`, `${wanted} doors are unavailable`);
    }
  },
  {
    questionIds: ["wardrobe-interior"], mode: "hard", evaluate(product, preferences) {
      const wanted = stylistAnswerValues(preferences.answers["wardrobe-interior"]).filter((value) => value !== "no-preference");
      const wardrobe = product.specifications?.wardrobe;
      if (!wanted.length || !wardrobe) return null;
      const checks = wanted.map((value): [string, boolean] => value === "hanging-space"
        ? ["specifications.wardrobe.interiorModules", wardrobe.interiorModules.some((item) => /rail|hang/i.test(item))]
        : value === "shelving"
          ? ["specifications.wardrobe.interiorModules", wardrobe.interiorModules.some((item) => /shelf/i.test(item))]
          : value === "drawers"
            ? ["specifications.wardrobe.drawers", (wardrobe.drawers ?? 0) > 0]
            : ["specifications.wardrobe.shoeStorage", wardrobe.shoeStorage]);
      return checks.every(([path, matches]) => hasVerifiedField(product, path) && matches)
        ? { matched: `verified wardrobe interior: ${wanted.join(", ")}` }
        : { unmet: "one or more wardrobe interior requirements are unverified or unavailable" };
    }
  },
  {
    questionIds: ["bedside-quantity"], mode: "hard", evaluate(product, preferences) {
      const wanted = answerValue(preferences, "bedside-quantity");
      const storage = product.specifications?.storage;
      if (!wanted || wanted === "not-sure" || !storage) return null;
      const quantity = wanted === "one" ? 1 : 2;
      return verifiedRule(product, "specifications.storage.availableUnitQuantities", storage.availableUnitQuantities?.includes(quantity) === true, `verified ${quantity}-unit option`, `${quantity}-unit option is unavailable`);
    }
  },
  { questionIds: ["bedside-storage", "dresser-storage", "sideboard-storage"], mode: "hard", evaluate: storageLayoutRule },
  {
    questionIds: ["dresser-size"], mode: "hard", evaluate(product, preferences) {
      const wanted = answerValue(preferences, "dresser-size");
      const storage = product.specifications?.storage;
      if (!wanted || !storage) return null;
      return verifiedRule(product, "specifications.storage.sizeBand", storage.sizeBand === wanted, `verified ${wanted} dresser size`, `${wanted} dresser size is unavailable`);
    }
  },
  {
    questionIds: ["table-format"], mode: "hard", evaluate(product, preferences) {
      const wanted = answerValue(preferences, "table-format");
      const table = product.specifications?.table;
      if (!wanted || wanted === "no-preference" || !table) return null;
      const extendable = wanted.startsWith("extendable");
      const shape = wanted.includes("rectangular") ? "rectangular" : wanted;
      if (!hasVerifiedField(product, "specifications.table.extendable") || table.extendable !== extendable) return { unmet: `${extendable ? "extendable" : "fixed"} table is unverified or unavailable` };
      return verifiedRule(product, "specifications.table.tabletopShape", table.tabletopShape.includes(shape), `verified ${extendable ? "extendable" : "fixed"} ${shape} table`, `${shape} table is unavailable`);
    }
  },
  {
    questionIds: ["table-material", "seating-material", "sideboard-material", "material", "surface-material"], mode: "hard", evaluate(product, preferences) {
      const questionId = ["table-material", "seating-material", "sideboard-material", "material", "surface-material"].find((id) => preferences.answers[id] !== undefined);
      const wanted = questionId ? answerValue(preferences, questionId) : null;
      if (!wanted || wanted === "no-preference") return null;
      const aliases: Record<string, string[]> = { "solid-wood": ["solid wood", "solid oak"], "wood-look": ["wood", "veneer", "oak"], wood: ["wood", "oak"], fabric: ["fabric", "textile"], leather: ["leather"], glass: ["glass"], ceramic: ["ceramic"], mixed: [] };
      const tableMaterials = product.specifications?.table?.tabletopMaterials;
      const materials = tableMaterials ?? product.materialTypes ?? [];
      const matches = wanted === "mixed" ? materials.length >= 2 : materials.some((material) => aliases[wanted]?.some((alias) => termMatches(material, alias)));
      return verifiedRule(product, tableMaterials ? "specifications.table.tabletopMaterials" : "materialTypes", matches, `verified ${wanted.replaceAll("-", " ")} material`, `${wanted.replaceAll("-", " ")} material is unavailable`);
    }
  },
  {
    questionIds: ["storage-purpose"], mode: "hard", evaluate(product, preferences) {
      const wanted = answerValue(preferences, "storage-purpose");
      const storage = product.specifications?.storage;
      if (!wanted || !storage) return null;
      const purposes = wanted === "mixed-storage" ? ["display", "closed-storage"] : [wanted];
      const matches = purposes.every((purpose) => storage.purposes?.includes(purpose as "media" | "display" | "closed-storage"));
      return verifiedRule(product, "specifications.storage.purposes", matches, "verified requested storage purpose", "requested storage purpose is unavailable");
    }
  },
  {
    questionIds: ["series-pieces"], mode: "hard", evaluate(product, preferences) {
      if (preferences.target !== "bedroom-series") return null;
      const wanted = stylistAnswerValues(preferences.answers["series-pieces"]).map((value) => value === "bedside-tables" ? "bedside-table" : value) as ProductSubtype[];
      return verifiedRule(product, "seriesSpecifications.availablePieceTypes", wanted.every((subtype) => product.seriesSpecifications?.availablePieceTypes.includes(subtype)), "verified series contains every requested piece", "series does not verify every requested piece");
    }
  },
  {
    questionIds: ["seating-priority"], mode: "soft", evaluate(product, preferences) {
      const wanted = answerValue(preferences, "seating-priority");
      const chair = product.specifications?.diningChair;
      if (!wanted || wanted === "no-preference" || !chair) return null;
      if (wanted === "comfort") return verifiedRule(product, "specifications.diningChair.comfortProfile", Boolean(chair.comfortProfile), "verified comfort profile", "comfort profile is unavailable");
      if (wanted === "easy-care") return verifiedRule(product, "specifications.diningChair.easyCare", chair.easyCare === true, "verified easy-care seating", "easy-care evidence is unavailable");
      return { unmet: `${wanted.replaceAll("-", " ")} remains a soft preference` };
    }
  }
];

function hardPreferenceAssessment(product: Product, preferences: StylistPreferences, slot: StylistSlot) {
  const base = baseHardPreferenceAssessment(product, preferences, slot);
  const matched = [...base.matched];
  const unmet = [...base.unmet];
  const hardUnmet: string[] = base.exact ? [] : [...base.unmet];
  for (const rule of preferenceRuleRegistry) {
    if (!rule.questionIds.some((questionId) => preferences.answers[questionId] !== undefined)) continue;
    const result = rule.evaluate(product, preferences, slot);
    if (result?.matched) matched.push(result.matched);
    if (result?.unmet) {
      unmet.push(result.unmet);
      if (rule.mode === "hard") hardUnmet.push(result.unmet);
    }
  }
  return { matched: [...new Set(matched)], unmet: [...new Set(unmet)], exact: hardUnmet.length === 0 };
}

function authorizedCopy(product: Product) {
  return product.authorizedContent ? `${product.subtitle} ${product.description}`.toLowerCase() : "";
}

function materialEvidence(product: Product, preferences: StylistPreferences) {
  const material = preferences.material;
  if (!material || material === "no-preference") return null;
  const types = product.verifiedFacts.materialTypes;
  const copy = authorizedCopy(product);
  if ((material === "fabric" || material === "leather") && types.includes(material)) return `Verified ${material} option.`;
  if (material === "wood" && /\bwood|oak|veneer|solid[- ]wood\b/.test(copy)) return "Authorized catalogue copy explicitly describes wood or oak.";
  const materialSignals = Number(types.includes("fabric")) + Number(types.includes("leather")) + Number(/\bwood|oak|metal|glass|ceramic|stone\b/.test(copy));
  if (material === "mixed" && materialSignals >= 2) return "Multiple material families are explicitly supported by catalogue evidence.";
  return null;
}

function priorityEvidence(product: Product, priority: StylistPriority) {
  if (priority === "comfort" && product.verifiedFacts.comfort) return "Catalogue-verified comfort features.";
  if (priority === "compact-footprint" && product.verifiedFacts.smallSpaceSuitable) return "Verified as suitable for smaller spaces.";
  if (priority === "flexible-modular" && product.verifiedFacts.modular && product.modular) return "Catalogue-verified modular flexibility.";
  if (priority === "easy-care" && product.verifiedFacts.easyCare) return "Catalogue-verified easy-care option.";
  if (priority === "relax-functions" && product.verifiedFacts.functions.some((value) => /relax|reclin|electric|motor/i.test(value))) return "Verified relax or electric function.";
  if (priority === "premium-materials" && /\bsolid wood|solid oak|leather|boucl[eé]|dekton|ceramic|glass|stone\b/.test(authorizedCopy(product))) {
    return "Authorized catalogue copy explicitly names a distinctive material.";
  }
  return null;
}

function withinKnownDimensions(product: Product, preferences: StylistPreferences) {
  if (preferences.spaceSize !== "known-dimensions") return true;
  return Boolean(product.verifiedFacts.dimensions
    && preferences.maxWidthMm
    && preferences.maxDepthMm
    && product.widthMm <= preferences.maxWidthMm
    && product.depthMm <= preferences.maxDepthMm);
}

function spaceEvidence(product: Product, preferences: StylistPreferences) {
  if (preferences.spaceSize === "compact" && product.verifiedFacts.smallSpaceSuitable) return "Verified as suitable for a compact-space preference.";
  if (preferences.spaceSize === "large" && product.verifiedFacts.modular && product.modular) return "Verified modular system for a larger-space preference.";
  if (preferences.spaceSize === "medium" && product.verifiedFacts.dimensions) return "Verified dimensions are available for medium-space planning.";
  if (preferences.spaceSize === "known-dimensions" && withinKnownDimensions(product, preferences)) {
    return `Verified dimensions stay within ${Math.round(preferences.maxWidthMm! / 10)} × ${Math.round(preferences.maxDepthMm! / 10)} cm.`;
  }
  return null;
}

function assessCandidate(product: Product, preferences: StylistPreferences) {
  const signals = preferences.style === "not-sure" ? null : stylistStyleProfiles[preferences.style];
  const verifiedStyles = product.verifiedFacts.styles;
  const verifiedColors = product.verifiedFacts.colors;
  const catalogueEvidence = product.authorizedContent ? [product.subtitle, product.description].filter(Boolean) : [];
  const styleSources = [...verifiedStyles, ...catalogueEvidence];
  const matchedStyleSignals = signals?.styles.filter((signal) => styleSources.some((value) => termMatches(value, signal))) ?? [];
  const verifiedStyleTags = signals ? verifiedStyles.filter((value) => signals.styles.some((signal) => termMatches(value, signal))) : [];
  const paletteColors = stylistPaletteColors[preferences.palette];
  const matchedColors = verifiedColors.filter((color) => paletteColors.some((value) => termMatches(color, value)));
  const materialMatch = materialEvidence(product, preferences);
  const copy = authorizedCopy(product);
  const targetLabel = stylistAnswerLabel(preferences.roomType, "target", preferences.target);
  const isCollectionRequest = /^complete-|several-accessories$/.test(preferences.target);
  const targetCopyMatch = !isCollectionRequest && termMatches(copy, targetLabel) ? `Authorized catalogue copy explicitly references ${targetLabel.toLowerCase()}.` : null;
  const matchedQuizLabels = Object.entries(preferences.answers)
    .flatMap(([questionId, answer]) => questionId === "target" ? [] : stylistAnswerValues(answer)
      .filter((answerId) => !["yes", "no", "none", "not-sure", "no-preference"].includes(answerId))
      .map((answerId) => stylistAnswerLabel(preferences.roomType, questionId, answerId)))
    .filter((label) => label.length >= 4 && termMatches(copy, label))
    .slice(0, 2);
  const matchedPriorities = preferences.priorities.flatMap((priority) => {
    const evidence = priorityEvidence(product, priority);
    return evidence ? [{ priority, evidence }] : [];
  });
  const sizeMatch = spaceEvidence(product, preferences);
  const styleMatch = preferences.style === "not-sure"
    ? "partial" as const
    : matchedStyleSignals.length >= 2 || verifiedStyleTags.length >= 2
      ? "strong" as const
      : matchedStyleSignals.length || verifiedStyleTags.length
        ? "partial" as const
        : "limited" as const;
  const preferenceSignalCount = Number(matchedColors.length > 0) + Number(Boolean(materialMatch)) + matchedPriorities.length + Number(Boolean(sizeMatch)) + Number(Boolean(targetCopyMatch || matchedQuizLabels.length));
  const preferenceMatch = preferenceSignalCount >= 2 ? "strong" as const : preferenceSignalCount === 1 ? "partial" as const : "limited" as const;
  const styleEvidence = preferences.style === "not-sure"
    ? ["Style was left open; ranking relies on the remaining selected preferences."]
    : [
      ...verifiedStyleTags.map((value) => `Verified style tag: ${value}.`),
      ...matchedStyleSignals
        .filter((signal) => !verifiedStyleTags.some((value) => termMatches(value, signal)))
        .map((signal) => `Authorized catalogue copy supports: ${signal}.`)
    ].slice(0, 4);
  const preferenceEvidence = [
    ...(matchedColors.length ? [`Verified ${preferences.palette.replaceAll("-", " ")} colours: ${matchedColors.join(", ")}.`] : []),
    ...(materialMatch ? [materialMatch] : []),
    ...(sizeMatch ? [sizeMatch] : []),
    ...(targetCopyMatch ? [targetCopyMatch] : []),
    ...matchedQuizLabels.map((label) => `Authorized catalogue copy supports the “${label}” preference.`),
    ...matchedPriorities.map(({ priority, evidence }) => `${stylistPriorityLabels[priority]}: ${evidence}`)
  ].slice(0, 5);
  const score = matchedStyleSignals.length * 24
    + verifiedStyleTags.length * 8
    + Number(matchedColors.length > 0) * 14
    + Number(Boolean(materialMatch)) * 12
    + Number(Boolean(sizeMatch)) * 12
    + Number(Boolean(targetCopyMatch)) * 30
    + matchedQuizLabels.length * 10
    + matchedPriorities.length * 12
    + Number(Boolean(product.authorizedContent)) * 4
    + Math.min(product.imageAssets.length, 4);
  return { verifiedStyles, verifiedColors, catalogueEvidence, styleMatch, preferenceMatch, styleEvidence, preferenceEvidence, score };
}

export function buildStylistCandidates(preferences: StylistPreferences) {
  const slots = resolveStylistSlots(preferences);
  const exactThreshold = slots.length > 1 ? 2 : 3;
  return slots.map((slot) => {
    const assessed = products
      .filter((product) => product.active
        && slot.categories.includes(product.category)
        && (!slot.productSubtypes?.length || slot.productSubtypes.some((subtype) => product.productSubtypes?.includes(subtype))))
      .map((product) => ({ product, assessment: assessCandidate(product, preferences), hard: hardPreferenceAssessment(product, preferences, slot) }));
    const exactCandidateCount = assessed.filter((candidate) => candidate.hard.exact).length;
    return {
      slot,
      exactCapable: exactCandidateCount >= exactThreshold,
      exactCandidateCount,
      candidates: assessed
        .map((candidate) => ({
          ...candidate,
          matchLevel: candidate.hard.exact && exactCandidateCount >= exactThreshold ? "exact" as const : "closest" as const,
          gateUnmet: candidate.hard.exact && exactCandidateCount < exactThreshold ? [`Exact-capable catalogue gate requires ${exactThreshold} verified candidates; ${exactCandidateCount} available.`] : []
        }))
        .sort((left, right) => Number(right.matchLevel === "exact") - Number(left.matchLevel === "exact") || right.assessment.score - left.assessment.score || left.product.modelCode.localeCompare(right.product.modelCode))
        .slice(0, 6)
        .map(({ product, assessment, hard, matchLevel, gateUnmet }): StylistCandidate => ({
          id: product.id,
          modelCode: product.modelCode,
          name: product.name,
          category: product.category,
          subtitle: product.subtitle,
          ...assessment,
          matchLevel,
          matchedPreferences: [...hard.matched, ...assessment.preferenceEvidence, ...assessment.styleEvidence].slice(0, 8),
          unmetPreferences: [...hard.unmet, ...gateUnmet, ...(assessment.styleMatch === "limited" ? ["requested style lacks verified structured evidence"] : []), ...(assessment.preferenceMatch === "limited" ? ["one or more soft preferences lack verified evidence"] : [])],
          ...(slot.productSubtypes?.some((subtype) => ["dining-chair", "dining-armchair"].includes(subtype)) && requestedCapacity(preferences)
            ? { recommendedQuantity: requestedCapacity(preferences)! }
            : {})
        }))
    };
  });
}

function verifiedCompatible(left: Product, right: Product) {
  if (left.seriesId && right.seriesId && left.seriesId === right.seriesId && hasVerifiedField(left, "seriesId") && hasVerifiedField(right, "seriesId")) return true;
  if (hasVerifiedField(left, "seriesSpecifications.compatibleProductIds") && left.seriesSpecifications?.compatibleProductIds.includes(right.id)) return true;
  return Boolean(hasVerifiedField(right, "seriesSpecifications.compatibleProductIds") && right.seriesSpecifications?.compatibleProductIds.includes(left.id));
}

function combinations<T>(groups: T[][]): T[][] {
  return groups.reduce<T[][]>((accumulator, group) => accumulator.flatMap((items) => group.map((item) => [...items, item])), [[]]);
}

export function selectDeterministicStylistResult(preferences: StylistPreferences): StylistProviderResult {
  const groups = buildStylistCandidates(preferences);
  if (groups.some((group) => !group.candidates.length)) throw new Error("Every stylist slot requires at least one catalogue candidate.");
  const pools = groups.map((group) => group.exactCapable ? group.candidates.filter((candidate) => candidate.matchLevel === "exact") : group.candidates);
  let primaryCandidates = pools.map((pool) => pool[0]!);
  if (groups.length > 1) {
    const ranked = combinations(pools.map((pool) => pool.slice(0, 6)))
      .filter((set) => new Set(set.map((candidate) => candidate.id)).size === set.length)
      .map((set) => {
        const catalogueProducts = set.map((candidate) => products.find((product) => product.id === candidate.id)!);
        const pairChecks = catalogueProducts.flatMap((product, index) => catalogueProducts.slice(index + 1).map((other) => verifiedCompatible(product, other)));
        return { set, compatible: pairChecks.every(Boolean), score: set.reduce((total, candidate) => total + candidate.score, 0) };
      })
      .sort((left, right) => Number(right.compatible) - Number(left.compatible) || right.score - left.score || left.set.map((candidate) => candidate.id).join("|").localeCompare(right.set.map((candidate) => candidate.id).join("|")));
    if (ranked[0]) primaryCandidates = ranked[0].set;
  }
  return {
    title: groups.length > 1 ? "Your coordinated catalogue set" : "Your verified catalogue match",
    rationale: groups.length > 1 ? "Selected deterministically from the verified requirements and compatibility evidence." : "Selected deterministically from the verified requirements and ranked preferences.",
    selections: groups.map((group, index) => {
      const primary = primaryCandidates[index]!;
      const pool = pools[index]!;
      return {
        slotId: group.slot.id,
        productId: primary.id,
        reason: primary.matchLevel === "exact" ? "Meets the verified requirements for this slot." : "This is the highest-ranked closest verified option for this slot.",
        alternatives: pool.filter((candidate) => candidate.id !== primary.id).slice(0, 2).map((candidate) => ({
          productId: candidate.id,
          reason: candidate.matchLevel === "exact" ? "Also meets the verified requirements for this slot." : "A grounded alternative from the same required product category."
        }))
      };
    })
  };
}

export function applyStylistNarrative(selection: StylistProviderResult, narrative: StylistProviderResult): StylistProviderResult {
  const reasonsByProduct = new Map<string, string>();
  for (const item of narrative.selections) {
    reasonsByProduct.set(item.productId, item.reason);
    for (const alternative of item.alternatives) reasonsByProduct.set(alternative.productId, alternative.reason);
  }
  return {
    ...selection,
    title: narrative.title,
    rationale: narrative.rationale,
    selections: selection.selections.map((item) => ({
      ...item,
      reason: reasonsByProduct.get(item.productId) ?? item.reason,
      alternatives: item.alternatives.map((alternative) => ({ ...alternative, reason: reasonsByProduct.get(alternative.productId) ?? alternative.reason }))
    }))
  };
}

export function stylistCandidateFacts(preferences: StylistPreferences, selected?: StylistProviderResult) {
  const styleLabel = preferences.style === "not-sure" ? "Not sure / open" : stylistStyleLabels[preferences.style];
  const answerLabels = Object.fromEntries(Object.entries(preferences.answers).map(([questionId, answerId]) => [
    questionId,
    stylistAnswerLabel(preferences.roomType, questionId, answerId)
  ]));
  const selectedProductContext = preferences.selectedProductIds.flatMap((productId) => {
    const product = products.find((candidate) => candidate.active && candidate.id === productId);
    return product ? [{
      id: product.id,
      modelCode: product.modelCode,
      category: product.category,
      verifiedColors: product.verifiedFacts.colors,
      verifiedStyles: product.verifiedFacts.styles,
      authorizedDescription: product.authorizedContent ? product.description.slice(0, 320) : ""
    }] : [];
  });
  return JSON.stringify({
    preferences,
    answerLabels,
    selectedProductContext,
    styleLabel,
    styleDirections: preferences.style === "not-sure" ? [] : stylistStyleProfiles[preferences.style].directions,
    paletteDefinition: stylistPaletteColors[preferences.palette],
    resultMode: resolveStylistSlots(preferences).length > 1 ? "coordinated multi-product set" : "one primary product or series with available alternatives",
    evidencePolicy: "Only verified metadata and explicit authorized catalogue copy may be stated as product facts.",
    slots: buildStylistCandidates(preferences).map(({ slot, candidates, exactCapable, exactCandidateCount }) => ({
      slotId: slot.id,
      slotLabel: slot.label,
      allowedCategories: slot.categories,
      requiredProductSubtypes: slot.productSubtypes ?? [],
      exactCapable,
      exactCandidateCount,
      candidates: candidates.filter((candidate) => {
        if (!selected) return true;
        const selection = selected.selections.find((item) => item.slotId === slot.id);
        return Boolean(selection && [selection.productId, ...selection.alternatives.map((alternative) => alternative.productId)].includes(candidate.id));
      }).map((candidate) => ({
        id: candidate.id,
        modelCode: candidate.modelCode,
        name: candidate.name,
        category: candidate.category,
        verifiedColors: candidate.verifiedColors,
        verifiedStyles: candidate.verifiedStyles,
        styleMatch: candidate.styleMatch,
        preferenceMatch: candidate.preferenceMatch,
        matchLevel: candidate.matchLevel,
        matchedPreferences: candidate.matchedPreferences,
        unmetPreferences: candidate.unmetPreferences,
        evidence: [...candidate.styleEvidence, ...candidate.preferenceEvidence].slice(0, 4),
        authorizedCatalogueCopy: candidate.catalogueEvidence.join(" ").slice(0, 520),
        score: candidate.score
      }))
    }))
  });
}

export function groundStylistResult(preferences: StylistPreferences, raw: StylistProviderResult) {
  const parsed = stylistProviderResultSchema.parse(raw);
  const candidateGroups = buildStylistCandidates(preferences);
  const blueprint = resolveStylistSlots(preferences);
  if (parsed.selections.length !== blueprint.length) throw new Error("Invalid number of stylist selections.");
  const bySlot = new Map(parsed.selections.map((selection) => [selection.slotId, selection]));

  const selections = blueprint.map((slot) => {
    const selection = bySlot.get(slot.id);
    if (!selection) throw new Error(`Missing stylist selection for ${slot.id}.`);
    const group = candidateGroups.find((candidateGroup) => candidateGroup.slot.id === slot.id);
    if (!group) throw new Error(`Missing catalogue candidates for ${slot.id}.`);
    const allowedIds = new Set(group.candidates.map((candidate) => candidate.id));
    if (!allowedIds.has(selection.productId)) throw new Error(`Invalid catalogue product for ${slot.id}.`);
    const alternativeIds = selection.alternatives.map((alternative) => alternative.productId);
    if (new Set([selection.productId, ...alternativeIds]).size !== alternativeIds.length + 1) throw new Error(`Duplicate stylist selection for ${slot.id}.`);
    if (alternativeIds.some((id) => !allowedIds.has(id))) throw new Error(`Invalid catalogue alternative for ${slot.id}.`);
    const product = products.find((candidate) => candidate.active && candidate.id === selection.productId && slot.categories.includes(candidate.category));
    const assessment = group.candidates.find((candidate) => candidate.id === selection.productId);
    if (!product || !assessment) throw new Error(`Missing catalogue evidence for ${slot.id}.`);
    return {
      slotId: slot.id,
      slotLabel: slot.label,
      product,
      reason: selection.reason,
      styleMatch: assessment.styleMatch,
      preferenceMatch: assessment.preferenceMatch,
      matchEvidence: [...assessment.styleEvidence, ...assessment.preferenceEvidence],
      matchLevel: assessment.matchLevel,
      recommendedQuantity: assessment.recommendedQuantity,
      matchedPreferences: assessment.matchedPreferences,
      unmetPreferences: assessment.unmetPreferences,
      alternatives: selection.alternatives.map((alternative) => {
        const alternativeAssessment = group.candidates.find((candidate) => candidate.id === alternative.productId);
        const alternativeProduct = products.find((candidate) => candidate.active && candidate.id === alternative.productId && slot.categories.includes(candidate.category));
        if (!alternativeAssessment || !alternativeProduct) throw new Error(`Missing catalogue evidence for an alternative in ${slot.id}.`);
        return {
          product: alternativeProduct,
          reason: alternative.reason,
          styleMatch: alternativeAssessment.styleMatch,
          preferenceMatch: alternativeAssessment.preferenceMatch,
          matchEvidence: [...alternativeAssessment.styleEvidence, ...alternativeAssessment.preferenceEvidence],
          matchLevel: alternativeAssessment.matchLevel,
          recommendedQuantity: alternativeAssessment.recommendedQuantity,
          matchedPreferences: alternativeAssessment.matchedPreferences,
          unmetPreferences: alternativeAssessment.unmetPreferences
        };
      })
    };
  });
  const matchLevels = selections.flatMap((selection) => [selection.styleMatch, selection.preferenceMatch]);
  const catalogueMatch = matchLevels.includes("limited")
    ? { level: "limited" as const, message: "One or more matches have limited verified evidence for these preferences. These are the closest grounded catalogue options." }
    : matchLevels.includes("partial")
      ? { level: "partial" as const, message: "These recommendations combine explicit and partial catalogue evidence for your preferences." }
      : { level: "strong" as const, message: "Every recommendation has strong catalogue evidence for your style and preferences." };

  const recommendationMode = selections.length > 1 ? "set" as const : "alternatives" as const;
  const compatibilityUnmet = recommendationMode === "set"
    ? selections.flatMap((selection, index) => selections.slice(index + 1).flatMap((other) => {
        const compatible = verifiedCompatible(selection.product, other.product);
        return compatible ? [] : [`Compatibility between ${selection.product.modelCode} and ${other.product.modelCode} is not verified.`];
      }))
    : [];
  const matchedPreferences = [...new Set(selections.flatMap((selection) => selection.matchedPreferences))];
  const unmetPreferences = [...new Set([...selections.flatMap((selection) => selection.unmetPreferences), ...compatibilityUnmet])];
  const matchLevel = selections.every((selection) => selection.matchLevel === "exact") && !compatibilityUnmet.length ? "exact" as const : "closest" as const;
  return { preferences, title: parsed.title, rationale: parsed.rationale, catalogueMatch, recommendationMode, matchLevel, matchedPreferences, unmetPreferences, selections };
}
