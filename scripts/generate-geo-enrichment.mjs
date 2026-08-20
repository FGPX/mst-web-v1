import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const catalog = JSON.parse(await readFile(path.join(root, "lib/generated/musterring-catalog.json"), "utf8"));
const verifiedBatch = JSON.parse(await readFile(path.join(root, "mst_geo_verified_enrichment_batch1.json"), "utf8").catch(() => "{\"products\":[]}"));
const pilotVerified = JSON.parse(await readFile(path.join(root, "lib/catalog-enrichment/musterring-pilot-verified.json"), "utf8").catch(() => "{\"products\":[]}"));
const generatedAt = new Date().toISOString();

const unique = (values) => [...new Set(values.filter(Boolean))];
const words = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
const boolFromOverview = (overview, pattern) => overview.some((value) => pattern.test(value));
const normalizedComponent = (value) => value.toLowerCase().replace(/\s+/g, " ").trim();
const componentSubtype = (value) => {
  const text = normalizedComponent(value);
  if (/box spring bed/.test(text)) return "boxspring-bed";
  if (/upholstered bed/.test(text)) return "upholstered-bed";
  if (/bedside/.test(text)) return "bedside-table";
  if (/chests? of drawers|dresser/.test(text)) return "dresser";
  if (/wardrobe/.test(text)) return "wardrobe";
  if (/\bbeds?\b|bed frame/.test(text)) return "bed";
  if (/reclining armchair/.test(text)) return "recliner-armchair";
  if (/\barmchairs?\b/.test(text)) return "armchair";
  if (/corner sofa|add-on sofa|chaise longue/.test(text)) return "sectional-sofa";
  if (/\bsofas?\b/.test(text)) return "sofa";
  if (/coffee table/.test(text)) return "coffee-table";
  if (/side table/.test(text)) return "side-table";
  if (/wall unit|living wall/.test(text)) return "wall-unit";
  if (/lowboard|media/.test(text)) return "media-unit";
  if (/sideboard/.test(text)) return "sideboard";
  if (/display cabinet|highboard/.test(text)) return "display-cabinet";
  if (/dining table|high table/.test(text)) return "dining-table";
  if (/\bbenches\b|upholstered bench/.test(text)) return "dining-bench";
  if (/bar|counter stool/.test(text)) return "bar-stool";
  if (/\bchairs?\b|cantilever|four-legged|quadpod|spider base|sled base/.test(text)) return "dining-chair";
  if (/shoe cupboard/.test(text)) return "shoe-storage";
  if (/cloakroom bench/.test(text)) return "hallway-bench";
  if (/carpet|rug/.test(text)) return "carpet";
  if (/lamp|light/.test(text)) return "lamp";
  return null;
};
const categorySubtype = {
  sofa: "sofa", sectional: "sectional-sofa", armchair: "armchair", storage: "sideboard", "coffee-table": "coffee-table",
  "bedroom-series": "bedroom-series", bed: "bed", wardrobe: "wardrobe", "dining-chair": "dining-chair", "dining-table": "dining-table",
  bathroom: "bathroom-storage", outdoor: "outdoor-seating", "small-furniture": "small-furniture", carpet: "carpet", lamp: "lamp", "home-textile": "home-textile"
};
const inferredSubtypes = (product) => {
  return unique([categorySubtype[product.category] ?? "small-furniture", ...(product.productOverview ?? []).map(componentSubtype)]);
};
const explicitSubtypes = (product) => unique([categorySubtype[product.category] ?? "small-furniture", ...(product.productOverview ?? []).map(componentSubtype)]);
const demoColours = {
  sofa: ["beige", "grey", "anthracite"], sectional: ["sand", "grey", "taupe"], armchair: ["cognac", "grey", "beige"],
  storage: ["natural oak", "white", "graphite"], "coffee-table": ["natural oak", "walnut", "black"],
  "bedroom-series": ["natural oak", "white", "graphite"], bed: ["beige", "grey", "cream"], wardrobe: ["white", "graphite", "natural oak"],
  "dining-chair": ["beige", "cognac", "anthracite"], "dining-table": ["natural oak", "walnut", "black"],
  bathroom: ["white", "natural oak", "graphite"], kitchen: ["white", "natural oak", "graphite"], outdoor: ["ivory", "anthracite", "sand"],
  "small-furniture": ["natural oak", "black", "white"], carpet: ["beige", "grey", "blue"], lamp: ["black", "white", "blue"], "home-textile": ["beige", "grey", "green"]
};

const categoryProfiles = {
  sofa: { dimensions: [2240, 980, 850], room: "living-room", use: ["everyday seating", "living-room planning"], synonyms: ["sofa", "couch", "settee"], material: "upholstery", space: "configuration-dependent" },
  sectional: { dimensions: [2900, 1900, 850], room: "living-room", use: ["family seating", "open-plan living"], synonyms: ["sectional", "corner sofa", "modular sofa"], material: "upholstery", space: "large" },
  armchair: { dimensions: [800, 900, 1050], room: "living-room", use: ["individual seating", "reading and relaxation"], synonyms: ["armchair", "lounge chair", "recliner"], material: "upholstery", space: "medium" },
  storage: { dimensions: [2400, 450, 1900], room: "living-room", use: ["living-room storage", "media organisation"], synonyms: ["sideboard", "wall unit", "storage cabinet"], material: "wood-based material", space: "configuration-dependent" },
  "coffee-table": { dimensions: [1050, 650, 420], room: "living-room", use: ["living-room surface", "occasional table"], synonyms: ["coffee table", "side table", "occasional table"], material: "wood or composite", space: "medium" },
  "bedroom-series": { dimensions: [2800, 600, 2200], room: "bedroom", use: ["coordinated bedroom planning", "bedroom storage"], synonyms: ["bedroom programme", "bedroom set", "bedroom furniture"], material: "wood-based material", space: "configuration-dependent" },
  bed: { dimensions: [1860, 2150, 1150], room: "bedroom", use: ["sleeping", "bedroom planning"], synonyms: ["bed", "upholstered bed", "boxspring bed"], material: "upholstery and wood-based material", space: "configuration-dependent" },
  wardrobe: { dimensions: [2500, 600, 2200], room: "bedroom", use: ["clothing storage", "bedroom organisation"], synonyms: ["wardrobe", "closet", "clothes cabinet"], material: "wood-based material", space: "configuration-dependent" },
  "dining-chair": { dimensions: [580, 620, 880], room: "dining-room", use: ["dining seating", "long-table gatherings"], synonyms: ["dining chair", "chair", "armchair dining chair"], material: "upholstery and metal", space: "medium" },
  "dining-table": { dimensions: [1800, 950, 760], room: "dining-room", use: ["dining", "gathering"], synonyms: ["dining table", "table", "extendable table"], material: "wood or ceramic", space: "medium" },
  bathroom: { dimensions: [1600, 500, 1850], room: "bathroom", use: ["bathroom storage", "washbasin planning"], synonyms: ["bathroom furniture", "vanity unit", "bathroom cabinet"], material: "moisture-suitable furniture board", space: "configuration-dependent" },
  kitchen: { dimensions: [3000, 650, 2200], room: "kitchen", use: ["kitchen planning", "food preparation and storage"], synonyms: ["kitchen", "kitchen programme", "kitchen units"], material: "furniture board and worktop material", space: "configuration-dependent" },
  outdoor: { dimensions: [1800, 800, 820], room: "outdoor", use: ["terrace seating", "garden living"], synonyms: ["outdoor furniture", "garden furniture", "patio furniture"], material: "outdoor-suitable material", space: "configuration-dependent" },
  "small-furniture": { dimensions: [550, 450, 550], room: "home-accessories", use: ["flexible storage", "occasional use"], synonyms: ["small furniture", "occasional furniture", "side furniture"], material: "wood or metal", space: "compact" },
  carpet: { dimensions: [2000, 3000, 20], room: "home-accessories", use: ["floor covering", "room zoning"], synonyms: ["carpet", "rug", "floor textile"], material: "textile", space: "configuration-dependent" },
  lamp: { dimensions: [300, 300, 500], room: "home-accessories", use: ["ambient lighting", "task lighting"], synonyms: ["lamp", "light", "luminaire"], material: "metal", space: "compact" },
  "home-textile": { dimensions: [1300, 1700, 10], room: "home-accessories", use: ["soft furnishing", "decorative layering"], synonyms: ["home textile", "throw", "cushion"], material: "textile", space: "compact" }
};

function demoSpecifications(category, overview, index) {
  const copy = overview.join(" ").toLowerCase();
  if (["sofa", "sectional", "armchair"].includes(category)) {
    const armchair = category === "armchair";
    const electric = /motorised|electric/.test(copy);
    const manual = /manual/.test(copy);
    return { seating: {
      seatingSubtype: armchair ? (/reclin/.test(copy) ? "recliner" : /swivel|turn/.test(copy) ? "swivel" : "standard") : (/bed function|sofa bed/.test(copy) ? "sofa-bed" : electric ? "electric-relax" : "standard"),
      seatCapacityMin: armchair ? 1 : 2, seatCapacityMax: armchair ? 1 : 4, configurationIds: [], upholsteryOptions: ["cover-dependent"],
      seatWidthMm: armchair ? 520 : null, seatDepthMm: 540 + (index % 3) * 20, seatHeightMm: 440 + (index % 3) * 10,
      backrestHeightMm: null, armrestHeightMm: null, armrestWidthMm: null, comfortLevel: "balanced",
      seatFirmnessOptions: ["medium"], seatQualityOptions: boolFromOverview(overview, /seat qualit/i) ? ["standard", "comfort"] : ["standard"],
      seatHeightOptionsMm: [440], seatDepthOptionsMm: [560], ergonomicSizes: [],
      headrestAdjustable: /headrest|head cushion/i.test(copy), seatDepthAdjustable: /seat depth/i.test(copy), backrestAdjustable: /backrest|reclin/i.test(copy), armrestAdjustable: /armrest/i.test(copy),
      recliner: electric || manual || /reclin|relax/.test(copy), manualRecliner: manual, electricRecliner: electric, liftAssist: false,
      swivel: armchair && /swivel|turn/.test(copy), swivelDegrees: null, sofaBed: /bed function|sofa bed/.test(copy), sleepingArea: null,
      integratedStorage: /storage/.test(copy), chaiseAvailable: /chaise|longchair/.test(copy), footstoolAvailable: /stool/.test(copy),
      leftHandAvailable: /add-on|corner|chaise/.test(copy), rightHandAvailable: /add-on|corner|chaise/.test(copy), reversible: false
    }};
  }
  if (category === "bed") return { bed: {
    bedType: [copy.includes("boxspring") ? "boxspring-bed" : "upholstered-bed"], sleepingWidthsMm: [1400, 1600, 1800], sleepingLengthsMm: [2000],
    sleepingSizes: [1400, 1600, 1800].map((widthMm) => ({ widthMm, lengthMm: 2000 })), outerDimensions: [], lyingHeightMm: 550,
    headboardHeightMm: 1100, mattressIncluded: false, mattressTypes: [], mattressFirmnessOptions: ["medium", "firm"], slattedBaseIncluded: false,
    slattedBaseCompatible: true, bedStorage: /storage|bed box/.test(copy), storageVolumeLitres: null, motorised: /motor/.test(copy),
    outerDimensionsBySleepingSize: [], underBedStorage: /storage|bed box/.test(copy)
  }};
  if (category === "wardrobe") return { wardrobe: {
    wardrobeType: ["modular wardrobe"], doorType: [copy.includes("sliding") ? "sliding" : "hinged"], doorCountOptions: [2, 3, 4],
    widthOptionsMm: [2000, 2500, 3000], heightOptionsMm: [2160, 2360], depthOptionsMm: [600], interiorModules: ["shelves", "clothes rails"],
    shelves: null, drawers: null, clothesRails: null, adjustableShelves: true, shoeStorage: false, trouserRack: false, tieRack: false,
    clothesLift: false, mirrorOption: /mirror/.test(copy), lightingOption: /light|led/.test(copy), cornerConfiguration: /corner/.test(copy),
    capacityBand: "configuration-dependent", recommendedUserMin: null, recommendedUserMax: null
  }};
  if (["dining-table", "coffee-table"].includes(category)) return { table: {
    tableSubtype: category,
    tabletopShape: copy.includes("round") ? ["round"] : ["rectangular"], tabletopMaterials: [], tabletopThicknessMm: null,
    widthOptionsMm: category === "dining-table" ? [1600, 1800, 2000] : [800, 1000, 1200], depthOptionsMm: category === "dining-table" ? [900, 1000] : [600],
    diameterOptionsMm: copy.includes("round") ? [1000, 1200] : [], heightMm: category === "dining-table" ? 760 : 420,
    extendable: /extend|extension/.test(copy), extensionMechanism: null, minLengthMm: null, maxLengthMm: null,
    capacityMin: null, capacityMax: null, capacityVerified: false, demoEstimatedCapacity: category === "dining-table" ? 6 : null, edgeProfiles: [], baseVariants: []
  }};
  if (category === "dining-chair") return { diningChair: {
    chairSubtype: copy.includes("benches") ? "dining-bench" : copy.includes("armchair") ? "dining-armchair" : "dining-chair", seatCapacityMin: 1, seatCapacityMax: copy.includes("benches") ? 3 : 1,
    chairType: "dining chair", seatHeightMm: 480, seatWidthMm: 470, seatDepthMm: 450, armrests: /armchair|armrest/.test(copy),
    swivel: /swivel|turn/.test(copy), swivelDegrees: null, baseType: ["four-leg"], frameMaterial: [], upholsteryAvailable: /fabric|leather|upholster/.test(copy),
    maxLoadKg: null, stackable: false, comfortProfile: "balanced demo dining comfort", easyCare: null
  }};
  if (["storage", "bedroom-series", "bathroom", "kitchen"].includes(category)) return { storage: {
    storageSubtype: /lowboard|media|tv/.test(copy) ? "media-unit" : /wall unit|living wall/.test(copy) ? "wall-unit" : /bedside/.test(copy) ? "bedside-table" : /chest of drawers/.test(copy) ? "dresser" : "sideboard",
    purposes: unique([/media|tv/.test(copy) ? "media" : null, /shelf|display|wall board/.test(copy) ? "display" : null, "closed-storage"]),
    storageType: overview.length ? overview.map(normalizedComponent) : ["modular storage"], doors: null, drawers: null, shelves: null, compartments: null,
    wallMounted: /wall cabinet|wall-mounted|wall shelf/.test(copy), floorStanding: true, mountingType: /wall cabinet|wall shelf/.test(copy) ? ["wall-mounted", "floor-standing"] : ["floor-standing"],
    mediaCompatible: /media|tv|lowboard/.test(copy), cableManagement: /media|tv/.test(copy), lightingAvailable: /light|led/.test(copy), qiChargingAvailable: /qi charging/.test(copy),
    internalLayout: [], maximumShelfLoadKg: null
  }};
  if (category === "outdoor") return { outdoor: {
    weatherResistant: true, uvResistant: false, waterResistant: true, frostResistant: false, corrosionResistant: false,
    outdoorMaterial: [], frameMaterial: null, surfaceTreatment: null, protectiveCoverIncluded: false, protectiveCoverAvailable: true,
    drainage: false, indoorOutdoorUse: true, careInstructions: "Use a suitable protective cover and follow retailer care guidance."
  }};
  if (category === "carpet") return { carpet: {
    carpetShape: ["rectangular"], dimensionsAvailable: [{ widthMm: 1600, lengthMm: 2300 }, { widthMm: 2000, lengthMm: 3000 }],
    widthMm: 2000, lengthMm: 3000, diameterMm: null, pileHeightMm: null, composition: null, construction: null, backing: null,
    underfloorHeatingSuitable: false, easyCare: false, outdoorSuitable: false, colorOptions: [], designOptions: []
  }};
  if (category === "lamp") return { lamp: {
    lampType: ["table lamp"], dimensions: { widthMm: 300, depthMm: 300, heightMm: 500 }, material: null, lightSourceType: null,
    wattageW: null, lumens: null, colourTemperatureKelvin: null, colourTemperatureMinKelvin: null, colourTemperatureMaxKelvin: null,
    cri: null, dimmable: false, dimmingType: null, integratedLed: false, batteryPowered: false, batteryRuntimeHours: null,
    usbCharging: false, usbC: false, protectionRating: null, energyEfficiencyClass: null
  }};
  return {};
}

function makeDemo(product, index) {
  const profile = categoryProfiles[product.category] ?? categoryProfiles["small-furniture"];
  const overview = product.productOverview ?? [];
  const compact = /compact|small|little floor space|any living room/i.test(`${product.tagline} ${product.description}`);
  const base = profile.dimensions;
  const dimensions = { widthMm: compact ? Math.min(base[0], 1980) : base[0] + (index % 4) * 100, depthMm: base[1], heightMm: base[2] };
  const imageRoles = ["hero", "roomset", "perspective", "detail", "side", "gallery", "gallery", "gallery"];
  const configurable = overview.length > 1 || /programme|system|modular|configur|choice|range/i.test(`${product.tagline} ${product.description}`);
  const sourceSubtypes = explicitSubtypes(product);
  const resolvedSubtypes = inferredSubtypes(product);
  const seriesId = configurable || product.category === "bedroom-series" ? `musterring-series:${product.slug}` : null;
  const coordinatedFinishIds = unique([
    /oak/i.test(product.description) ? "finish:oak" : null,
    /glass/i.test(product.description) ? "finish:glass" : null,
    /lacquer/i.test(product.description) ? "finish:lacquer" : null,
    /slate/i.test(product.description) ? "finish:slate-look" : null
  ]);
  const authorized = ["id", "slug", "modelCode", "name", "tagline", "shortDescription", "description", "category", "categories", "canonicalUrl", "sourceUrl", "availableComponents", "media"];
  const demo = [
    "dimensions", "referenceConfiguration", "numberOfSeats", "packageDimensions", "primaryMaterial", "materialTypes",
    "colors", "colorFamilies", "styles", "styleTags", "bestFor", "notIdealFor", "spaceProfile", "smallSpaceReason",
    "comfortProfile", "functions", "manualFunctions", "electricFunctions", "comfortFunctions", "armrestOptions",
    "feetOptions", "seatQualityOptions", "specifications"
  ];
  return {
    id: product.appProductId, slug: product.slug, modelCode: product.modelCode, name: product.name, category: product.category, categories: product.categories ?? [product.category],
    productSubtypes: resolvedSubtypes, seriesId,
    seriesSpecifications: seriesId && resolvedSubtypes.length > 1 ? {
      seriesId, availablePieceTypes: resolvedSubtypes, memberProductIds: [], compatibleProductIds: [], coordinatedFinishIds,
      includedProductIds: [], optionalProductIds: []
    } : undefined,
    brand: "Musterring", manufacturer: "Musterring", entityLevel: configurable ? "programme" : "product", productGroupId: `musterring:${product.slug}`,
    sku: null, mpn: null, gtin: null, ean: null, canonicalUrl: product.sourceUrl,
    tagline: product.tagline, shortDescription: product.description, description: product.description,
    productHighlights: unique([product.tagline, ...overview.slice(0, 4)]), roomTypes: [profile.room], useCases: profile.use,
    bestFor: unique([configurable ? "customers who want configuration choices" : "customers seeking a defined furniture piece", ...profile.use]),
    notIdealFor: [configurable ? "customers who need a final size without selecting a configuration" : "projects requiring unlisted custom dimensions"],
    styles: ["modern"], styleTags: ["contemporary furniture"], keywords: unique([...words(product.name), ...words(product.tagline), product.category, ...overview.flatMap(words)]), synonyms: profile.synonyms,
    dimensions, dimensionRange: configurable ? { minWidthMm: null, maxWidthMm: null, minDepthMm: null, maxDepthMm: null, minHeightMm: null, maxHeightMm: null } : undefined,
    referenceConfiguration: { name: "Demo reference configuration", dimensions, note: "Presentation-only dimensions; select and verify a sellable configuration before fit confirmation." },
    configurations: [{
      id: `${product.appProductId}:demo-reference`, name: "Demo reference configuration", subtype: resolvedSubtypes[0], dimensions,
      seatCapacityMin: ["sofa", "sectional"].includes(product.category) ? 2 : ["armchair", "dining-chair"].includes(product.category) ? 1 : null,
      seatCapacityMax: product.category === "sofa" ? 4 : product.category === "sectional" ? 6 : ["armchair", "dining-chair"].includes(product.category) ? 1 : null,
      dataQuality: { level: "demo", verifiedFields: [], authorizedSourceFields: [], derivedFields: [], demoFields: ["dimensions", "seatCapacityMin", "seatCapacityMax"] }
    }],
    weightKg: null, maxLoadKg: null, minDoorOpeningMm: Math.min(dimensions.depthMm, 850), requiredWallClearanceMm: 50, floorClearanceMm: null,
    primaryMaterial: profile.material, materialTypes: [profile.material], materialComposition: null, upholsteryMaterial: ["sofa", "sectional", "armchair", "dining-chair", "bed"].includes(product.category) ? "cover-dependent" : null,
    frameMaterial: null, tabletopMaterial: ["dining-table", "coffee-table"].includes(product.category) ? "configuration-dependent" : null, legMaterial: null, finish: null, surfaceTreatment: null,
    colors: demoColours[product.category] ?? ["neutral"], colorFamilies: demoColours[product.category] ?? ["neutral"], configurable, modular: configurable && boolFromOverview(overview, /add-on|corner|module|individual sofa|chaise/i),
    availableComponents: overview.map(normalizedComponent), includedItems: [], layoutShapes: [], orientationOptions: [], armrestOptions: [], feetOptions: [], seatQualityOptions: [], seatHeightOptions: [], seatDepthOptions: [],
    manualFunctions: [], electricFunctions: boolFromOverview(overview, /motorised/i) ? ["motorised function available"] : [], comfortFunctions: [], accessories: [], optionalAccessories: [],
    compatibilityRules: [], incompatibilityRules: [], requirements: ["Final dimensions and compatibility require a selected retailer configuration."],
    spaceProfile: compact ? "compact" : profile.space, smallSpaceReason: compact ? ["official description uses compact or space-saving language"] : ["space requirement depends on the selected configuration"],
    comfortProfile: ["sofa", "sectional", "armchair", "dining-chair", "bed"].includes(product.category) ? "balanced demo comfort profile" : "not applicable",
    specifications: demoSpecifications(product.category, overview, index),
    media: { primaryImage: product.images[0], images: product.images.map((url, imageIndex) => ({ url, alt: `${product.name} ${product.category.replaceAll("-", " ")} ${imageIndex === 0 ? "product view" : `gallery view ${imageIndex + 1}`}`, role: imageRoles[imageIndex] ?? "gallery" })), videos: [] },
    documents: {}, sourceUrl: product.sourceUrl, sourceDocumentUrl: undefined, sourceDocumentId: undefined,
    lastVerifiedAt: catalog.importedAt, validFrom: undefined, validTo: undefined, verificationStatus: "authorized-catalogue-with-demo-enrichment", stale: Boolean(product.stale),
    dataQuality: {
      level: "mixed",
      verifiedFields: sourceSubtypes.length ? ["productSubtypes", ...(seriesId && resolvedSubtypes.length > 1 ? ["seriesId", "seriesSpecifications.availablePieceTypes"] : [])] : [],
      authorizedSourceFields: authorized,
      derivedFields: compact ? ["spaceProfile", "smallSpaceReason"] : ["configurable", "modular"],
      demoFields: [...demo, "configurations", ...(sourceSubtypes.length ? [] : ["productSubtypes"]), ...(seriesId && resolvedSubtypes.length > 1 ? ["seriesSpecifications.compatibleProductIds", "seriesSpecifications.includedProductIds", "seriesSpecifications.optionalProductIds"] : [])],
      unknownFields: ["sku", "mpn", "gtin", "ean", "price", "availability", ...(seriesId && resolvedSubtypes.length > 1 ? ["seriesSpecifications.memberProductIds"] : [])], lastVerifiedAt: catalog.importedAt
    }
  };
}

function findProduct(enrichment) {
  const directId = catalog.products.find((product) => product.appProductId === enrichment.id);
  if (directId) return directId;
  const slug = enrichment.id.replace(/^musterring-/, "").replace(/-cannon-table-deep-blue$/, "");
  return catalog.products.find((product) => product.slug === slug) ?? catalog.products.find((product) => product.modelCode.toLowerCase() === enrichment.modelCode.toLowerCase());
}

function markVerified(record, paths, enrichment) {
  record.dataQuality.verifiedFields = unique([...record.dataQuality.verifiedFields, ...paths]);
  record.dataQuality.demoFields = record.dataQuality.demoFields.filter((field) => !paths.some((path) => field === path || field.startsWith(`${path}.`)));
  record.dataQuality.level = record.dataQuality.demoFields.length ? "mixed" : "verified";
  record.dataQuality.lastVerifiedAt = enrichment.sourceValidFrom ?? generatedAt.slice(0, 10);
  record.lastVerifiedAt = record.dataQuality.lastVerifiedAt;
  record.verificationStatus = enrichment.verificationStatus;
  record.canonicalUrl = enrichment.canonicalUrl ?? record.canonicalUrl;
  record.sourceDocumentUrl = enrichment.sourceDocumentUrl;
  record.validFrom = enrichment.sourceValidFrom;
  if (enrichment.sourceDocumentUrl) record.documents.priceListUrl = enrichment.sourceDocumentUrl;
}

function applyVerified(record, enrichment) {
  const data = enrichment.verifiedData;
  const paths = [];
  record.entityLevel = enrichment.entityLevel === "product-program" ? "programme" : enrichment.entityLevel;
  if (data.availableComponents) { record.availableComponents = data.availableComponents.map(normalizedComponent); paths.push("availableComponents"); }
  if (data.optionalAccessories) { record.optionalAccessories = data.optionalAccessories; paths.push("optionalAccessories"); }
  if (data.exampleConfiguration) {
    const c = data.exampleConfiguration;
    record.referenceConfiguration = { name: "Official example configuration", dimensions: { widthMm: c.widthMm, depthMm: c.depthMm, heightMm: c.heightMm }, note: c.composition?.join(" + ") };
    record.dimensions = record.referenceConfiguration.dimensions;
    paths.push("referenceConfiguration", "dimensions");
  }
  const seating = record.specifications.seating;
  if (seating) {
    if (data.seatHeightOptionsMm) { seating.seatHeightOptionsMm = data.seatHeightOptionsMm; record.seatHeightOptions = data.seatHeightOptionsMm; paths.push("specifications.seating.seatHeightOptionsMm"); }
    if (data.seatDepthOptionsMm) { seating.seatDepthOptionsMm = data.seatDepthOptionsMm; record.seatDepthOptions = data.seatDepthOptionsMm; paths.push("specifications.seating.seatDepthOptionsMm"); }
    if (data.seatFirmnessOptions) { seating.seatFirmnessOptions = data.seatFirmnessOptions; paths.push("specifications.seating.seatFirmnessOptions"); }
    if (data.ergonomicSizes) { seating.ergonomicSizes = data.ergonomicSizes; paths.push("specifications.seating.ergonomicSizes"); }
    if (data.coverMaterialTypes) { record.materialTypes = data.coverMaterialTypes; paths.push("materialTypes"); }
    if (data.bedFunctionAvailable !== undefined) { seating.sofaBed = data.bedFunctionAvailable; paths.push("specifications.seating.sofaBed"); }
    if (data.functions) {
      record.comfortFunctions = data.functions;
      seating.electricRecliner = data.functions.some((value) => /motor/i.test(value)); seating.manualRecliner = data.functions.some((value) => /manual/i.test(value));
      seating.recliner = seating.electricRecliner || seating.manualRecliner; seating.liftAssist = data.functions.some((value) => /lift/i.test(value));
      seating.headrestAdjustable = data.functions.some((value) => /head/i.test(value));
      paths.push("comfortFunctions", "specifications.seating.electricRecliner", "specifications.seating.manualRecliner", "specifications.seating.recliner", "specifications.seating.liftAssist", "specifications.seating.headrestAdjustable");
    }
    if (data.dimensionsByVariant) {
      const variants = data.dimensionsByVariant;
      record.dimensionRange = {
        minWidthMm: Math.min(...variants.map((v) => v.widthMm)), maxWidthMm: Math.max(...variants.map((v) => v.widthMm)),
        minDepthMm: Math.min(...variants.map((v) => v.depthMm)), maxDepthMm: Math.max(...variants.map((v) => v.reclinedDepthMm ?? v.depthMm)),
        minHeightMm: Math.min(...variants.map((v) => v.heightMm)), maxHeightMm: Math.max(...variants.map((v) => v.heightMm))
      };
      record.variants = variants.map((variant) => ({ id: `${record.id}-${variant.variant.toLowerCase()}`, productId: record.id, productGroupId: record.productGroupId, sku: null, gtin: null, mpn: null, configurationName: variant.variant, color: { name: "Configuration dependent", family: "unspecified" }, dimensions: { widthMm: variant.widthMm, depthMm: variant.depthMm, heightMm: variant.heightMm }, imageAssets: record.media.images.map((image) => image.url), active: true, demoData: false, dataQuality: { level: "verified", verifiedFields: ["configurationName", "dimensions"], authorizedSourceFields: [], derivedFields: [], demoFields: [] } }));
      const medium = variants.find((variant) => variant.variant === "MEDIUM") ?? variants[0];
      record.referenceConfiguration = { name: medium.variant, dimensions: { widthMm: medium.widthMm, depthMm: medium.depthMm, heightMm: medium.heightMm }, note: "Verified ergonomic variant" };
      record.dimensions = record.referenceConfiguration.dimensions;
      paths.push("dimensionRange", "variants", "referenceConfiguration", "dimensions");
    }
  }
  if (record.specifications.bed && data.sleepingSurfaceOptionsMm) {
    const bed = record.specifications.bed;
    bed.sleepingSizes = data.sleepingSurfaceOptionsMm.map(([widthMm, lengthMm]) => ({ widthMm, lengthMm })); bed.sleepingWidthsMm = unique(bed.sleepingSizes.map((size) => size.widthMm)); bed.sleepingLengthsMm = unique(bed.sleepingSizes.map((size) => size.lengthMm));
    bed.bedType = (data.bedTypes ?? []).map((type) => type.includes("boxspring") ? "boxspring-bed" : "upholstered-bed"); bed.headboardHeightMm = data.headboardHeightMm; bed.storageVolumeLitres = data.storageVolumeLitresAt180x200; bed.bedStorage = Boolean(data.storageVolumeLitresAt180x200); bed.mattressFirmnessOptions = data.mattressFirmnessOptions ?? []; bed.motorised = Boolean(data.motorisedHeadAndFootAdjustmentAvailable);
    record.floorClearanceMm = data.floorClearanceMm; bed.outerDimensions = (data.upholsteredFrameExternalDimensionsByWidth ?? []).map((size) => ({ widthMm: size.externalWidthMm, depthMm: size.depthMm, heightMm: size.heightMm }));
    paths.push("specifications.bed.sleepingSizes", "specifications.bed.sleepingWidthsMm", "specifications.bed.sleepingLengthsMm", "specifications.bed.bedType", "specifications.bed.outerDimensions", "specifications.bed.headboardHeightMm", "specifications.bed.bedStorage", "specifications.bed.storageVolumeLitres", "specifications.bed.mattressFirmnessOptions", "specifications.bed.motorised", "floorClearanceMm");
  }
  if (record.specifications.wardrobe && data.doorTypes) {
    const wardrobe = record.specifications.wardrobe; wardrobe.doorType = data.doorTypes; wardrobe.widthOptionsMm = data.slidingWardrobeWidthOptionsMm ?? []; wardrobe.heightOptionsMm = data.heightOptionsMm ?? []; wardrobe.interiorModules = data.interiorAccessories ?? [];
    wardrobe.lightingOption = Boolean(data.lightingAvailable); wardrobe.mirrorOption = (data.frontFinishes ?? []).some((value) => /mirror/.test(value)); wardrobe.clothesLift = wardrobe.interiorModules.includes("clothes lift"); wardrobe.trouserRack = wardrobe.interiorModules.includes("trouser rack"); wardrobe.tieRack = wardrobe.interiorModules.includes("tie rack"); wardrobe.shoeStorage = wardrobe.interiorModules.includes("shoe rack");
    if (data.exampleWardrobeDimensionsMm) { record.referenceConfiguration = { name: "Official example wardrobe", dimensions: data.exampleWardrobeDimensionsMm }; record.dimensions = data.exampleWardrobeDimensionsMm; paths.push("dimensions", "referenceConfiguration"); }
    paths.push("specifications.wardrobe.doorType", "specifications.wardrobe.widthOptionsMm", "specifications.wardrobe.heightOptionsMm", "specifications.wardrobe.interiorModules", "specifications.wardrobe.lightingOption", "specifications.wardrobe.mirrorOption");
  }
  if (record.specifications.table && data.topShapes) {
    const table = record.specifications.table; table.tabletopShape = data.topShapes; table.tabletopMaterials = data.topMaterials ?? []; table.tabletopThicknessMm = data.solidWoodTopThicknessMm ?? null; table.extendable = data.extendable; table.capacityMin = data.capacityPeople; table.capacityMax = data.capacityPeople; table.capacityVerified = data.capacityPeople !== null; table.demoEstimatedCapacity = null;
    table.widthOptionsMm = (data.sizeOptionsCm ?? []).filter((value) => /^\d+x\d+$/.test(value)).map((value) => Number(value.split("x")[0]) * 10); table.depthOptionsMm = (data.sizeOptionsCm ?? []).filter((value) => /^\d+x\d+$/.test(value)).map((value) => Number(value.split("x")[1]) * 10); table.diameterOptionsMm = (data.sizeOptionsCm ?? []).filter((value) => /^D\d+$/.test(value)).map((value) => Number(value.slice(1)) * 10);
    record.frameMaterial = data.frameMaterial; paths.push("specifications.table.tabletopShape", "specifications.table.tabletopMaterials", "specifications.table.tabletopThicknessMm", "specifications.table.extendable", "specifications.table.capacityMin", "specifications.table.capacityMax", "specifications.table.widthOptionsMm", "specifications.table.depthOptionsMm", "specifications.table.diameterOptionsMm", "frameMaterial");
  }
  if (record.specifications.storage && (data.mountingTypes || data.availableComponents)) {
    const storage = record.specifications.storage; storage.storageType = (data.availableComponents ?? record.availableComponents).map(normalizedComponent); storage.mountingType = data.mountingTypes ?? storage.mountingType; storage.wallMounted = storage.mountingType.some((value) => /wall/.test(value)); storage.floorStanding = storage.mountingType.some((value) => /standing/.test(value)); storage.qiChargingAvailable = (data.optionalAccessories ?? []).some((value) => /qi/i.test(value));
    paths.push("specifications.storage");
  }
  if (record.specifications.outdoor && data.weatherResistanceClaim) {
    const outdoor = record.specifications.outdoor; outdoor.weatherResistant = true; outdoor.protectiveCoverIncluded = Boolean(data.protectiveCoversIncluded); outdoor.protectiveCoverAvailable = true; outdoor.frameMaterial = data.chair?.frameMaterial ?? data.table?.frameMaterial ?? null; outdoor.outdoorMaterial = unique([data.chair?.seatConstruction, data.chair?.frameMaterial, data.table?.topMaterial]);
    if (data.chair) { record.referenceConfiguration = { name: "Official chair reference", dimensions: { widthMm: data.chair.widthMm, depthMm: data.chair.depthMm, heightMm: data.chair.heightMm } }; record.dimensions = record.referenceConfiguration.dimensions; }
    paths.push("specifications.outdoor.weatherResistant", "specifications.outdoor.protectiveCoverIncluded", "specifications.outdoor.protectiveCoverAvailable", "specifications.outdoor.frameMaterial", "specifications.outdoor.outdoorMaterial", "referenceConfiguration", "dimensions");
  }
  if (record.specifications.carpet && data.composition) {
    const carpet = record.specifications.carpet; carpet.composition = data.composition; carpet.carpetShape = data.shapes ?? []; carpet.easyCare = Boolean(data.easyToCleanClaim); carpet.underfloorHeatingSuitable = data.underfloorHeatingCompatibility === true; carpet.colorOptions = data.variousColours ? ["various authorised colours"] : [];
    if (data.exampleVariant) { carpet.widthMm = data.exampleVariant.widthMm; carpet.lengthMm = data.exampleVariant.lengthMm; carpet.pileHeightMm = data.exampleVariant.pileHeightMm; record.dimensions = { widthMm: data.exampleVariant.widthMm, depthMm: data.exampleVariant.lengthMm, heightMm: data.exampleVariant.pileHeightMm }; }
    record.materialComposition = data.composition; paths.push("specifications.carpet.composition", "specifications.carpet.carpetShape", "specifications.carpet.easyCare", "specifications.carpet.underfloorHeatingSuitable", "specifications.carpet.colorOptions", "specifications.carpet.widthMm", "specifications.carpet.lengthMm", "specifications.carpet.pileHeightMm", "materialComposition", "dimensions");
  }
  if (record.specifications.lamp && data.luminousFluxLm !== undefined) {
    const lamp = record.specifications.lamp; lamp.lampType = [data.lampType]; lamp.material = data.material; lamp.dimensions = { widthMm: data.diameterMm, depthMm: data.diameterMm, heightMm: data.heightMm, diameterMm: data.diameterMm }; lamp.wattageW = data.wattageW; lamp.lumens = data.luminousFluxLm; lamp.colourTemperatureMinKelvin = data.colourTemperatureRangeK?.[0]; lamp.colourTemperatureMaxKelvin = data.colourTemperatureRangeK?.[1]; lamp.dimmable = data.dimmable; lamp.batteryPowered = data.batteryPowered; lamp.batteryRuntimeHours = data.batteryRuntimeHoursAtFullBrightness; lamp.usbCharging = data.usbCCharging; lamp.usbC = data.usbCCharging; lamp.protectionRating = null; lamp.energyEfficiencyClass = null;
    record.variants = [{ id: enrichment.id, productId: record.id, productGroupId: record.productGroupId, sku: null, gtin: null, mpn: null, configurationName: "CANNON table lamp, deep blue", color: { name: data.colour, family: "blue" }, dimensions: { widthMm: data.diameterMm, depthMm: data.diameterMm, heightMm: data.heightMm }, imageAssets: record.media.images.map((image) => image.url), active: true, demoData: false, dataQuality: { level: "verified", verifiedFields: ["configurationName", "color", "dimensions"], authorizedSourceFields: [], derivedFields: [], demoFields: [] } }];
    record.dimensions = record.variants[0].dimensions; paths.push("specifications.lamp.lampType", "specifications.lamp.material", "specifications.lamp.dimensions", "specifications.lamp.wattageW", "specifications.lamp.lumens", "specifications.lamp.colourTemperatureMinKelvin", "specifications.lamp.colourTemperatureMaxKelvin", "specifications.lamp.dimmable", "specifications.lamp.batteryPowered", "specifications.lamp.batteryRuntimeHours", "specifications.lamp.usbCharging", "specifications.lamp.usbC", "variants", "dimensions");
  }
  if (data.mainMaterials) { record.materialTypes = data.mainMaterials; paths.push("materialTypes"); }
  if (data.includedItems) { record.includedItems = data.includedItems; paths.push("includedItems"); }
  markVerified(record, paths, enrichment);
}

function applyPilotVerified(record, pilot) {
  const facts = pilot.facts ?? {};
  const paths = ["roomTypes", "useCases"];
  record.sourceDocumentUrl = pilot.sourceDocumentUrl;
  record.lastVerifiedAt = pilotVerified.verifiedAt;
  record.verificationStatus = "verified-official-pilot-source";
  if (facts.productSubtypes) { record.productSubtypes = facts.productSubtypes; paths.push("productSubtypes"); }
  if (facts.styleTags) { record.styleTags = facts.styleTags; record.styles = facts.styleTags; paths.push("styleTags", "styles"); }
  if (facts.colorFamilies) { record.colorFamilies = facts.colorFamilies; record.colors = facts.colorFamilies; paths.push("colorFamilies", "colors"); }
  if (facts.materialTypes) { record.materialTypes = facts.materialTypes; paths.push("materialTypes"); }
  if (facts.upholsteryOptions) {
    record.upholsteryMaterial = facts.upholsteryOptions.join(", ");
    record.materialTypes = unique([...record.materialTypes, ...facts.upholsteryOptions]);
    paths.push("upholsteryMaterial", "materialTypes");
  }
  if (facts.easyCare !== undefined) { record.easyCare = facts.easyCare; paths.push("easyCare"); }
  if (record.specifications.wardrobe && facts.doorTypes) {
    const wardrobe = record.specifications.wardrobe;
    wardrobe.doorType = facts.doorTypes;
    wardrobe.widthOptionsMm = facts.widthOptionsMm;
    wardrobe.heightOptionsMm = facts.heightOptionsMm;
    wardrobe.depthOptionsMm = facts.depthOptionsMm;
    wardrobe.interiorModules = facts.interiorModules;
    wardrobe.capacityBand = facts.capacityBand;
    wardrobe.recommendedUserMin = null;
    wardrobe.recommendedUserMax = null;
    paths.push("specifications.wardrobe.doorType", "specifications.wardrobe.widthOptionsMm", "specifications.wardrobe.heightOptionsMm", "specifications.wardrobe.depthOptionsMm", "specifications.wardrobe.interiorModules", "specifications.wardrobe.capacityBand");
  }
  if (record.specifications.bed && facts.sleepingSizes) {
    const bed = record.specifications.bed;
    bed.sleepingSizes = facts.sleepingSizes;
    bed.sleepingWidthsMm = unique(facts.sleepingSizes.map((size) => size.widthMm));
    bed.sleepingLengthsMm = unique(facts.sleepingSizes.map((size) => size.lengthMm));
    bed.outerDimensionsBySleepingSize = facts.outerDimensionsBySleepingSize ?? [];
    bed.outerDimensions = bed.outerDimensionsBySleepingSize.map((entry) => entry.dimensions);
    bed.underBedStorage = facts.underBedStorage;
    bed.bedStorage = facts.underBedStorage;
    record.configurations = facts.sleepingSizes.map((sleepingSize) => {
      const outer = bed.outerDimensionsBySleepingSize.find((entry) => entry.sleepingSize.widthMm === sleepingSize.widthMm && entry.sleepingSize.lengthMm === sleepingSize.lengthMm);
      return {
        id: `${record.id}:${sleepingSize.widthMm}x${sleepingSize.lengthMm}`,
        name: `${sleepingSize.widthMm / 10} × ${sleepingSize.lengthMm / 10} cm sleeping size`, subtype: record.productSubtypes.includes("boxspring-bed") ? "boxspring-bed" : "upholstered-bed",
        dimensions: outer?.dimensions ?? null, sleepingSize,
        dataQuality: { level: "verified", verifiedFields: ["sleepingSize", ...(outer ? ["dimensions"] : [])], authorizedSourceFields: [], derivedFields: [], demoFields: [], unknownFields: outer ? [] : ["dimensions"] }
      };
    });
    paths.push("specifications.bed.sleepingSizes", "specifications.bed.sleepingWidthsMm", "specifications.bed.sleepingLengthsMm", "specifications.bed.underBedStorage", "configurations");
    if (bed.outerDimensionsBySleepingSize.length) paths.push("specifications.bed.outerDimensionsBySleepingSize", "specifications.bed.outerDimensions");
  }
  if (record.specifications.diningChair && facts.seatCapacityMin !== undefined) {
    const chair = record.specifications.diningChair;
    chair.chairSubtype = facts.productSubtypes.includes("dining-bench") ? "dining-bench" : facts.productSubtypes.includes("dining-armchair") ? "dining-armchair" : "dining-chair";
    chair.seatCapacityMin = facts.seatCapacityMin;
    chair.seatCapacityMax = facts.seatCapacityMax;
    if (facts.seatHeightMm) chair.seatHeightMm = facts.seatHeightMm;
    if (facts.swivelDegrees) { chair.swivel = true; chair.swivelDegrees = facts.swivelDegrees; }
    chair.upholsteryAvailable = Boolean(facts.upholsteryOptions?.length);
    if (facts.comfortProfile) chair.comfortProfile = facts.comfortProfile;
    paths.push("specifications.diningChair.chairSubtype", "specifications.diningChair.seatCapacityMin", "specifications.diningChair.seatCapacityMax", "specifications.diningChair.upholsteryAvailable");
    if (facts.seatHeightMm) paths.push("specifications.diningChair.seatHeightMm");
    if (facts.swivelDegrees) paths.push("specifications.diningChair.swivel", "specifications.diningChair.swivelDegrees");
    if (facts.comfortProfile) paths.push("specifications.diningChair.comfortProfile");
    if (facts.overallDepthMm && facts.overallHeightMm) {
      record.referenceConfiguration = { name: "Official chair reference", dimensions: { widthMm: facts.overallWidthMm, depthMm: facts.overallDepthMm, heightMm: facts.overallHeightMm } };
      record.dimensions = record.referenceConfiguration.dimensions;
      paths.push("referenceConfiguration", "dimensions");
    }
    record.configurations = facts.productSubtypes.filter((subtype) => ["dining-chair", "dining-armchair", "dining-bench"].includes(subtype)).map((subtype) => ({
      id: `${record.id}:${subtype}`,
      name: subtype.replaceAll("-", " "), subtype,
      dimensions: facts.overallDepthMm && facts.overallHeightMm ? { widthMm: facts.overallWidthMm, depthMm: facts.overallDepthMm, heightMm: facts.overallHeightMm } : null,
      seatCapacityMin: subtype === "dining-bench" ? 2 : 1,
      seatCapacityMax: subtype === "dining-bench" ? facts.seatCapacityMax : 1,
      dataQuality: {
        level: "verified", verifiedFields: ["seatCapacityMin", "seatCapacityMax", ...(facts.overallDepthMm ? ["dimensions"] : [])],
        authorizedSourceFields: [], derivedFields: [], demoFields: [], unknownFields: facts.overallDepthMm ? [] : ["dimensions"]
      }
    }));
    paths.push("configurations");
  }
  if ((facts.tableShapes || facts.tabletopMaterials) && !record.specifications.table) record.specifications.table = {
    tableSubtype: "dining-table", tabletopShape: [], tabletopMaterials: [], tabletopThicknessMm: null, widthOptionsMm: [], depthOptionsMm: [], diameterOptionsMm: [], heightMm: null,
    extendable: false, extensionMechanism: null, minLengthMm: null, maxLengthMm: null, capacityMin: null, capacityMax: null, capacityVerified: false, demoEstimatedCapacity: null, edgeProfiles: [], baseVariants: []
  };
  if (record.specifications.table && (facts.tableShapes || facts.tabletopMaterials)) {
    const table = record.specifications.table;
    table.tableSubtype = "dining-table";
    table.tabletopShape = facts.tableShapes ?? table.tabletopShape;
    table.tabletopMaterials = facts.tabletopMaterials ?? table.tabletopMaterials;
    table.widthOptionsMm = facts.tableWidthOptionsMm ?? table.widthOptionsMm;
    table.depthOptionsMm = facts.tableDepthOptionsMm ?? table.depthOptionsMm;
    table.diameterOptionsMm = facts.tableDiameterOptionsMm ?? table.diameterOptionsMm;
    table.heightMm = facts.tableHeightMm ?? table.heightMm;
    if (facts.extendable !== undefined) table.extendable = facts.extendable;
    paths.push("specifications.table.tableSubtype", "specifications.table.tabletopShape", "specifications.table.tabletopMaterials");
    if (facts.tableWidthOptionsMm) paths.push("specifications.table.widthOptionsMm", "specifications.table.depthOptionsMm", "specifications.table.diameterOptionsMm", "specifications.table.heightMm", "specifications.table.extendable");
  }
  if (facts.configurationDimensions) {
    record.configurations = [...(record.configurations ?? []).filter((configuration) => configuration.dataQuality.level === "verified"), ...facts.configurationDimensions.map((configuration) => ({
      ...configuration, subtype: "dining-table", seatCapacityMin: null, seatCapacityMax: null,
      dataQuality: { level: "verified", verifiedFields: ["dimensions"], authorizedSourceFields: [], derivedFields: [], demoFields: [] }
    }))];
    record.referenceConfiguration = { name: facts.configurationDimensions[0].name, dimensions: facts.configurationDimensions[0].dimensions };
    record.dimensions = record.referenceConfiguration.dimensions;
    paths.push("configurations", "referenceConfiguration", "dimensions");
  }
  record.dataQuality.verifiedFields = unique([...record.dataQuality.verifiedFields, ...paths]);
  record.dataQuality.demoFields = record.dataQuality.demoFields.filter((field) => !paths.includes(field));
  record.dataQuality.level = record.dataQuality.demoFields.length ? "mixed" : "verified";
  record.dataQuality.lastVerifiedAt = pilotVerified.verifiedAt;
}

const records = catalog.products.map(makeDemo);
const unmatchedVerified = [];
for (const enrichment of verifiedBatch.products ?? []) {
  const product = findProduct(enrichment);
  if (!product) { unmatchedVerified.push(enrichment.id); continue; }
  applyVerified(records.find((record) => record.id === product.appProductId), enrichment);
}
for (const pilot of pilotVerified.products ?? []) {
  const record = records.find((candidate) => candidate.slug === pilot.slug);
  if (record) applyPilotVerified(record, pilot);
}

const linkSeries = (seriesId, slugs) => {
  const members = records.filter((record) => slugs.includes(record.slug));
  for (const record of members) {
    record.seriesId = seriesId;
    record.seriesSpecifications = {
      seriesId,
      availablePieceTypes: unique(members.flatMap((member) => member.productSubtypes)),
      memberProductIds: members.map((member) => member.id),
      compatibleProductIds: members.filter((member) => member.id !== record.id).map((member) => member.id),
      coordinatedFinishIds: unique(members.flatMap((member) => member.seriesSpecifications?.coordinatedFinishIds ?? [])),
      includedProductIds: [], optionalProductIds: []
    };
    record.dataQuality.verifiedFields = unique([...record.dataQuality.verifiedFields, "seriesId", "seriesSpecifications.availablePieceTypes", "seriesSpecifications.memberProductIds", "seriesSpecifications.compatibleProductIds"]);
  }
};
linkSeries("musterring-series:justb-sp100-sp500", ["justb-sp100", "justb-sp500"]);
linkSeries("musterring-series:mr-2985", ["mr-2985", "mr-2986"]);

await writeFile(path.join(root, "lib/generated/musterring-geo-enrichment.json"), `${JSON.stringify({ generatedAt, catalogueImportedAt: catalog.importedAt, sourceBatch: "mst_geo_verified_enrichment_batch1.json", unmatchedVerified, products: records }, null, 2)}\n`);

const issueRows = [];
const slugGroups = new Map();
for (const product of catalog.products) {
  slugGroups.set(product.slug, [...(slugGroups.get(product.slug) ?? []), product]);
  const add = (issue, severity, fix) => issueRows.push({ product: `${product.modelCode} (${product.slug})`, issue, severity, fix });
  if (!product.description?.trim()) add("Empty official description", "High", "Correct the source page/import; retain the product but do not invent an authorised description.");
  else if (product.description.length < 35 || /(?:doesn|isn|whether it)$|\bWhether it$/i.test(product.description)) add("Official description appears truncated", "High", "Re-import the full meta description or approved editorial copy.");
  if (/translate-to-(?:en|english)/.test(product.slug)) add("Legacy translation prefix in slug", "Medium", "Add a clean canonical alias while preserving the imported source record.");
  if (product.stale) add("Product is marked stale", "Medium", "Confirm lifecycle state in PIM before public feed inclusion.");
  if ((product.images ?? []).length < 3) add(`Incomplete image set (${product.images?.length ?? 0} images)`, "Medium", "Add authorised front, detail and room-set assets in DAM.");
  if (!(product.categories ?? [product.category]).includes(product.category)) add("Primary category is absent from categories", "High", "Correct taxonomy mapping in the importer.");
}
for (const [slug, duplicates] of slugGroups) if (duplicates.length > 1) issueRows.push({ product: slug, issue: "Duplicate slug", severity: "High", fix: "Resolve identity in PIM/importer." });
for (const id of unmatchedVerified) issueRows.push({ product: id, issue: "Verified batch record did not match the catalogue", severity: "High", fix: "Add an explicit parent/variant mapping." });
const gatedSubtypes = ["sofa", "armchair", "coffee-table", "side-table", "wall-unit", "sideboard", "bed", "wardrobe", "bedside-table", "dresser", "dining-table", "dining-chair", "dining-bench"];
const subtypeCoverage = Object.fromEntries(gatedSubtypes.map((subtype) => [subtype, records.filter((record) => record.productSubtypes.includes(subtype) && record.dataQuality.verifiedFields.includes("productSubtypes")).length]));
for (const [subtype, count] of Object.entries(subtypeCoverage)) {
  if (count < 3) issueRows.push({ product: `Target: ${subtype}`, issue: `Only ${count} verified subtype candidates; single-product exact mode requires 3`, severity: "Medium", fix: "Keep the target in closest-match mode until another official programme is structured and verified." });
}
const requirementCoverage = [
  { requirement: "Wardrobe + sliding doors", paths: ["productSubtypes", "specifications.wardrobe.doorType"], matches: (record) => record.productSubtypes.includes("wardrobe") && record.specifications.wardrobe?.doorType.includes("sliding") },
  { requirement: "Bed + 180 × 200 cm", paths: ["productSubtypes", "specifications.bed.sleepingSizes"], matches: (record) => record.productSubtypes.some((subtype) => ["bed", "upholstered-bed", "boxspring-bed"].includes(subtype)) && record.specifications.bed?.sleepingSizes.some((size) => size.widthMm === 1800 && size.lengthMm === 2000) },
  { requirement: "Sofa + 4 seats", paths: ["productSubtypes", "specifications.seating.seatCapacityMax"], matches: (record) => record.productSubtypes.some((subtype) => ["sofa", "sectional-sofa", "recliner-sofa", "sofa-bed"].includes(subtype)) && record.specifications.seating?.seatCapacityMax >= 4 },
  { requirement: "Table + extendable rectangular", paths: ["productSubtypes", "specifications.table.extendable", "specifications.table.tabletopShape"], matches: (record) => record.productSubtypes.includes("dining-table") && record.specifications.table?.extendable === true && record.specifications.table.tabletopShape.includes("rectangular") }
].map((scenario) => ({
  ...scenario,
  exactCandidates: records.filter((record) => scenario.paths.every((path) => record.dataQuality.verifiedFields.includes(path)) && scenario.matches(record)).length,
  closestCandidates: records.filter((record) => scenario.matches(record)).length
}));
for (const scenario of requirementCoverage) {
  if (scenario.exactCandidates < 3) issueRows.push({ product: `Requirement: ${scenario.requirement}`, issue: `Only ${scenario.exactCandidates} field-verified candidates`, severity: "Medium", fix: `Keep this requirement in closest mode until at least 3 official products verify: ${scenario.paths.join(", ")}.` });
}

const quality = `# Musterring Product Data Quality Report\n\nGenerated: ${generatedAt}\n\nThis report audits the immutable authorised catalogue import. It does not silently rewrite source values.\n\n| Product | Issue | Severity | Recommended fix |\n|---|---|---|---|\n${issueRows.map((row) => `| ${row.product.replaceAll("|", "\\|")} | ${row.issue} | ${row.severity} | ${row.fix} |`).join("\n") || "| Catalogue | No automated issues found | Info | Continue PIM validation |"}\n`;
await writeFile(path.join(root, "docs/product-data-quality-report.md"), quality);

const important = {
  dimensions: (record) => Boolean(record.dimensions), materials: (record) => record.materialTypes.length > 0,
  functions: (record) => record.manualFunctions.length + record.electricFunctions.length + record.comfortFunctions.length > 0,
  categorySpecificSpecs: (record) => Object.keys(record.specifications).length > 0, images: (record) => record.media.images.length > 0,
  officialSourceUrl: (record) => record.sourceUrl?.startsWith("https://www.musterring.com/"), structuredMedia: (record) => record.media.images.every((image) => image.alt && image.role),
  productGroupIdentity: (record) => Boolean(record.productGroupId && record.entityLevel), provenance: (record) => Boolean(record.dataQuality),
  verifiedDimensions: (record) => record.dataQuality.verifiedFields.includes("dimensions"),
  verifiedOrAuthorisedFacts: (record) => record.dataQuality.verifiedFields.length > 0,
  productSubtypes: (record) => record.productSubtypes.length > 0,
  verifiedProductSubtypes: (record) => record.dataQuality.verifiedFields.includes("productSubtypes"),
  structuredConfigurations: (record) => record.configurations?.length > 0,
  seriesSpecifications: (record) => Boolean(record.seriesSpecifications)
};
const coverageRows = Object.entries(important).map(([field, predicate]) => [field, records.filter(predicate).length, Math.round(records.filter(predicate).length / records.length * 100)]);
const levels = records.reduce((result, record) => (result[record.dataQuality.level] = (result[record.dataQuality.level] ?? 0) + 1, result), {});
const usingDemo = records.filter((record) => record.dataQuality.demoFields.length > 0).length;
const missingCritical = records.filter((record) => !record.description?.trim() || !record.sourceUrl || !record.media.images.length || !record.category).length;
const categoryRows = Object.entries(records.reduce((result, record) => { const entry = result[record.category] ?? { total: 0, verified: 0, mixed: 0, demo: 0 }; entry.total += 1; entry[record.dataQuality.level] += 1; result[record.category] = entry; return result; }, {})).sort();
const geo = `# GEO Product Data Coverage\n\nGenerated: ${generatedAt}\n\n## Summary\n\n- Total real Musterring products: ${records.length}\n- Products with verified batch enrichment: ${verifiedBatch.products.length - unmatchedVerified.length}\n- Additional official pilot records: ${pilotVerified.products.length}\n- Verified-only products: ${levels.verified ?? 0}\n- Mixed authorised/verified + demo products: ${levels.mixed ?? 0}\n- Demo-only products: ${levels.demo ?? 0}\n- Products using one or more demo-enriched fields: ${usingDemo}\n- Products missing critical public information (description, source, image or category): ${missingCritical}\n- Unmatched verified records: ${unmatchedVerified.length}\n\n## Field coverage\n\n| Field | Products | Coverage |\n|---|---:|---:|\n${coverageRows.map(([field, count, percent]) => `| ${field} | ${count} | ${percent}% |`).join("\n")}\n\n## Exact-capable target gate\n\nA single-product target needs at least 3 candidates with the relevant exact field paths verified. Set slots need at least 2. Unknown and demo values remain searchable for closest-match ranking but cannot satisfy hard filters.\n\n| Product subtype | Verified candidates | Single-product exact capable | Set-slot capable |\n|---|---:|---|---|\n${Object.entries(subtypeCoverage).map(([subtype, count]) => `| ${subtype} | ${count} | ${count >= 3 ? "yes" : "no"} | ${count >= 2 ? "yes" : "no"} |`).join("\n")}\n\n## Category coverage\n\n| Category | Total | Verified | Mixed | Demo |\n|---|---:|---:|---:|---:|\n${categoryRows.map(([category, value]) => `| ${category} | ${value.total} | ${value.verified} | ${value.mixed} | ${value.demo} |`).join("\n")}\n\n## Implemented attributes\n\nIdentity and ProductGroup fields; productSubtypes; room/use/style/colour/material metadata; field-level quality buckets; configuration dimensions; SeriesSpecifications and explicit compatibility; category-specific seating, bedroom, dining, storage, outdoor, carpet and lamp specifications; source documents; safe commerce placeholders; structured search and exact/closest recommendation contracts. Text evidence may improve scoring but does not satisfy a structured hard filter. GTIN, EAN, SKU, MPN, certifications, official prices, legal ratings and real dealer inventory remain null unless supplied by an authorised source.\n\n## Recommended future PIM fields\n\nPersist sellable variants and module IDs, exact variant dimensions, verified capacities, GTIN/EAN/MPN/SKU, cover and finish codes, composition and care tests, package units, configuration rules, lifecycle dates, market-specific dealer offers, verified availability, approved technical documents and variant-specific DAM relationships.\n`;
const requirementCoverageSection = `## Field-level requirement coverage

Exact capability is measured for the target and every hard requirement together, never from subtype coverage alone.

| Target + requirement | Required verified field paths | Exact candidates | Closest candidates | Single-product exact capable | Set-slot capable |
|---|---|---:|---:|---|---|
${requirementCoverage.map((scenario) => `| ${scenario.requirement} | ${scenario.paths.join("<br>")} | ${scenario.exactCandidates} | ${scenario.closestCandidates} | ${scenario.exactCandidates >= 3 ? "yes" : "no"} | ${scenario.exactCandidates >= 2 ? "yes" : "no"} |`).join("\n")}

`;
await writeFile(path.join(root, "docs/geo-product-data-coverage.md"), geo.replace("## Category coverage", `${requirementCoverageSection}## Category coverage`));

console.log(`Generated ${records.length} GEO records; ${verifiedBatch.products.length - unmatchedVerified.length} verified batch matches; ${issueRows.length} quality issues.`);
