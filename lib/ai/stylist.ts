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
    const slotBySubtype: Partial<Record<ProductSubtype, StylistSlot>> = {
      sofa: { id: "living-seating", label: "Sofa", categories: ["sofa", "sectional"], productSubtypes: ["sofa", "sectional-sofa", "recliner-sofa", "sofa-bed"] },
      "coffee-table": { id: "living-table", label: "Coffee table", categories: ["coffee-table"], productSubtypes: ["coffee-table"] },
      "wall-unit": { id: "living-storage", label: "Living storage", categories: ["storage"], productSubtypes: ["wall-unit", "sideboard", "media-unit"] },
      bed: { id: "bedroom-bed", label: "Bed", categories: ["bed", "bedroom-series"], productSubtypes: ["bed", "upholstered-bed", "boxspring-bed"] },
      wardrobe: { id: "bedroom-wardrobe", label: "Wardrobe", categories: ["wardrobe", "bedroom-series"], productSubtypes: ["wardrobe"] },
      "bedside-table": { id: "bedroom-bedside", label: "Bedside table", categories: ["bedroom-series", "wardrobe"], productSubtypes: ["bedside-table"] },
      dresser: { id: "bedroom-dresser", label: "Dresser", categories: ["bedroom-series", "wardrobe"], productSubtypes: ["dresser"] },
      "dining-table": { id: "dining-table", label: "Dining table", categories: ["dining-table", "dining-chair"], productSubtypes: ["dining-table"] },
      "dining-chair": { id: "dining-chair", label: "Dining chair", categories: ["dining-chair", "dining-table"], productSubtypes: ["dining-chair", "dining-armchair"] },
      "dining-bench": { id: "dining-bench", label: "Dining bench", categories: ["dining-chair", "dining-table"], productSubtypes: ["dining-bench"] },
      sideboard: { id: "dining-storage", label: "Dining sideboard", categories: ["storage"], productSubtypes: ["sideboard"] }
    };
    const selectedPieceTypes = preferences.selectedProductIds.flatMap((productId) => products.find((product) => product.id === productId)?.seriesSpecifications?.availablePieceTypes ?? []);
    const requestedBedroomPieces = stylistAnswerValues(preferences.answers["series-pieces"] ?? []).map((value) => value === "bedside-tables" ? "bedside-table" : value) as ProductSubtype[];
    const defaults: Record<"living-room" | "bedroom" | "dining-room", ProductSubtype[]> = {
      "living-room": ["sofa", "coffee-table", "wall-unit"],
      bedroom: ["bed", "wardrobe", "bedside-table", "dresser"],
      "dining-room": ["dining-table", "dining-chair", "sideboard"]
    };
    const requested = preferences.roomType === "bedroom" && requestedBedroomPieces.length
      ? requestedBedroomPieces
      : selectedPieceTypes.length
        ? selectedPieceTypes
        : defaults[preferences.roomType as keyof typeof defaults] ?? [];
    const slots = [...new Set(requested)].flatMap((subtype) => slotBySubtype[subtype] ? [slotBySubtype[subtype]!] : []);
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

function requestedMinimumCapacity(preferences: StylistPreferences) {
  const value = answerValue(preferences, "seating-capacity") ?? answerValue(preferences, "table-capacity");
  if (!value) return null;
  if (value === "3" || value === "4") return Number(value);
  const match = value.match(/^(\d+)/);
  return match ? Number(match[1]) : null;
}

function hardPreferenceAssessment(product: Product, preferences: StylistPreferences, slot: StylistSlot) {
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
  const bedSize = answerValue(preferences, "bed-size")?.match(/^(\d+)x(\d+)$/);
  if (bedSize && slot.productSubtypes?.some((subtype) => ["bed", "upholstered-bed", "boxspring-bed"].includes(subtype))) {
    const widthMm = Number(bedSize[1]) * 10;
    const lengthMm = Number(bedSize[2]) * 10;
    const sizes = product.specifications?.bed?.sleepingSizes ?? [];
    if (!hasVerifiedField(product, "specifications.bed.sleepingSizes")) unmet.push("supported bed sizes are not verified");
    else if (sizes.some((size) => size.widthMm === widthMm && size.lengthMm === lengthMm)) matched.push(`verified ${bedSize[1]} × ${bedSize[2]} cm sleeping size`);
    else unmet.push(`requested ${bedSize[1]} × ${bedSize[2]} cm sleeping size is unavailable`);
  }
  const minimumCapacity = requestedMinimumCapacity(preferences);
  if (minimumCapacity) {
    const table = product.specifications?.table;
    const chair = product.specifications?.diningChair;
    const seating = product.specifications?.seating;
    const capacity = table?.capacityMax ?? chair?.seatCapacityMax ?? seating?.seatCapacityMax ?? null;
    const capacityPath = table ? "specifications.table.capacityMax" : chair ? "specifications.diningChair.seatCapacityMax" : "specifications.seating.seatCapacityMax";
    if (!hasVerifiedField(product, capacityPath)) unmet.push("requested minimum capacity is not verified");
    else if (capacity !== null && capacity >= minimumCapacity) matched.push(`verified capacity for at least ${minimumCapacity}`);
    else unmet.push(`verified capacity is below ${minimumCapacity}`);
  }
  const wardrobeDoor = answerValue(preferences, "wardrobe-doors");
  if (wardrobeDoor && wardrobeDoor !== "no-preference" && product.specifications?.wardrobe) {
    if (!hasVerifiedField(product, "specifications.wardrobe.doorType")) unmet.push("wardrobe door types are not verified");
    else if (product.specifications.wardrobe.doorType.includes(wardrobeDoor as "hinged" | "sliding" | "folding")) matched.push(`verified ${wardrobeDoor} doors`);
    else unmet.push(`${wardrobeDoor} doors are unavailable`);
  }
  const tableFormat = answerValue(preferences, "table-format");
  if (tableFormat && tableFormat !== "no-preference" && product.specifications?.table) {
    const wantsExtendable = tableFormat.startsWith("extendable");
    const wantedShape = tableFormat.includes("rectangular") ? "rectangular" : tableFormat === "oval" ? "oval" : tableFormat === "round" ? "round" : null;
    if (!hasVerifiedField(product, "specifications.table.extendable")) unmet.push("table extension capability is not verified");
    else if (product.specifications.table.extendable !== wantsExtendable) unmet.push(wantsExtendable ? "extendable table is required" : "fixed table is required");
    else matched.push(`verified ${wantsExtendable ? "extendable" : "fixed"} table`);
    if (wantedShape) {
      if (!hasVerifiedField(product, "specifications.table.tabletopShape")) unmet.push("table shape is not verified");
      else if (product.specifications.table.tabletopShape.includes(wantedShape)) matched.push(`verified ${wantedShape} shape`);
      else unmet.push(`${wantedShape} shape is unavailable`);
    }
  }
  const armchairFunction = answerValue(preferences, "armchair-function");
  if (armchairFunction && !["standard", "no-preference"].includes(armchairFunction) && product.specifications?.seating) {
    const path = armchairFunction === "swivel" ? "specifications.seating.swivel" : armchairFunction === "electric-relax" ? "specifications.seating.electricRecliner" : "specifications.seating.recliner";
    const value = armchairFunction === "swivel" ? product.specifications.seating.swivel : armchairFunction === "electric-relax" ? product.specifications.seating.electricRecliner : product.specifications.seating.recliner;
    if (!hasVerifiedField(product, path)) unmet.push(`${armchairFunction} function is not verified`);
    else if (value) matched.push(`verified ${armchairFunction} function`);
    else unmet.push(`${armchairFunction} function is unavailable`);
  }
  const additionalStorage = stylistAnswerValues(preferences.answers["additional-storage"] ?? []);
  if (additionalStorage.includes("under-bed") && product.specifications?.bed) {
    if (!hasVerifiedField(product, "specifications.bed.underBedStorage")) unmet.push("under-bed storage is not verified");
    else if (product.specifications.bed.underBedStorage) matched.push("verified under-bed storage");
    else unmet.push("under-bed storage is unavailable");
  }
  return { matched, unmet, exact: unmet.length === 0 };
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
          unmetPreferences: [...hard.unmet, ...gateUnmet, ...(assessment.styleMatch === "limited" ? ["requested style lacks verified structured evidence"] : []), ...(assessment.preferenceMatch === "limited" ? ["one or more soft preferences lack verified evidence"] : [])]
        }))
    };
  });
}

export function stylistCandidateFacts(preferences: StylistPreferences) {
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
      candidates: candidates.map((candidate) => ({
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
        const compatible = selection.product.seriesId && other.product.seriesId && (
          selection.product.seriesId === other.product.seriesId
          || selection.product.seriesSpecifications?.compatibleProductIds.includes(other.product.id)
          || other.product.seriesSpecifications?.compatibleProductIds.includes(selection.product.id)
        );
        return compatible ? [] : [`Compatibility between ${selection.product.modelCode} and ${other.product.modelCode} is not verified.`];
      }))
    : [];
  const matchedPreferences = [...new Set(selections.flatMap((selection) => selection.matchedPreferences))];
  const unmetPreferences = [...new Set([...selections.flatMap((selection) => selection.unmetPreferences), ...compatibilityUnmet])];
  const matchLevel = selections.every((selection) => selection.matchLevel === "exact") && !compatibilityUnmet.length ? "exact" as const : "closest" as const;
  return { preferences, title: parsed.title, rationale: parsed.rationale, catalogueMatch, recommendationMode, matchLevel, matchedPreferences, unmetPreferences, selections };
}
