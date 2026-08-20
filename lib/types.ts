export const catalogueCategories = [
  "sofa", "armchair", "sectional", "storage", "coffee-table", "bedroom-series", "bed", "wardrobe",
  "dining-chair", "dining-table", "bathroom", "kitchen", "outdoor", "small-furniture", "carpet", "lamp", "home-textile"
] as const;

export type Category = (typeof catalogueCategories)[number];
export type FactStatus = "verified" | "authorized-source" | "derived" | "demo" | "unknown";
export type DataQualityLevel = "verified" | "mixed" | "demo";
export type EntityLevel = "programme" | "product" | "variant" | "module" | "set";
export const productSubtypes = [
  "sofa", "sectional-sofa", "recliner-sofa", "sofa-bed", "armchair", "recliner-armchair", "swivel-armchair",
  "coffee-table", "side-table", "wall-unit", "sideboard", "media-unit", "display-cabinet",
  "bed", "upholstered-bed", "boxspring-bed", "wardrobe", "bedside-table", "dresser", "bedroom-series",
  "dining-table", "dining-chair", "dining-armchair", "dining-bench", "bar-stool",
  "hallway-bench", "shoe-storage", "bathroom-storage", "outdoor-seating", "outdoor-table",
  "carpet", "lamp", "home-textile", "small-furniture"
] as const;
export type ProductSubtype = (typeof productSubtypes)[number];

export type ProductFact<T> = {
  value: T | null;
  status: FactStatus;
  sourceUrl?: string;
  sourceDocumentUrl?: string;
  verifiedAt?: string;
  note?: string;
};

export type DataQuality = {
  level: DataQualityLevel;
  verifiedFields: string[];
  authorizedSourceFields: string[];
  derivedFields: string[];
  demoFields: string[];
  unknownFields?: string[];
  lastVerifiedAt?: string;
};

export type Dimensions = { widthMm: number; depthMm: number; heightMm: number };
export type ProductConfiguration = {
  id: string;
  name: string;
  subtype?: ProductSubtype;
  dimensions: Dimensions | null;
  seatCapacityMin?: number | null;
  seatCapacityMax?: number | null;
  sleepingSize?: { widthMm: number; lengthMm: number } | null;
  layoutShape?: string | null;
  dataQuality: DataQuality;
};
export type SeriesSpecifications = {
  seriesId: string;
  availablePieceTypes: ProductSubtype[];
  memberProductIds: string[];
  compatibleProductIds: string[];
  coordinatedFinishIds: string[];
  includedProductIds: string[];
  optionalProductIds: string[];
};
export type DimensionRange = {
  minWidthMm?: number | null; maxWidthMm?: number | null;
  minDepthMm?: number | null; maxDepthMm?: number | null;
  minHeightMm?: number | null; maxHeightMm?: number | null;
};
export type ProductMediaImage = {
  url: string;
  alt: string;
  role: "hero" | "gallery" | "front" | "side" | "rear" | "perspective" | "detail" | "roomset" | "material-swatch" | "technical";
  variantId?: string;
};
export type ProductMedia = { primaryImage: string; images: ProductMediaImage[]; videos: string[]; model3dUrl?: string };
export type ProductDocuments = {
  technicalDataSheetUrl?: string; priceListUrl?: string; planningGuideUrl?: string;
  assemblyInstructionsUrl?: string; careInstructionsUrl?: string; warrantyUrl?: string;
};

export type SeatingSpecifications = {
  seatingSubtype?: "standard" | "recliner" | "swivel" | "electric-relax" | "sofa-bed" | null;
  seatCapacityMin?: number | null; seatCapacityMax?: number | null;
  configurationIds?: string[]; upholsteryOptions?: string[];
  seatWidthMm?: number | null; seatDepthMm?: number | null; seatHeightMm?: number | null;
  backrestHeightMm?: number | null; armrestHeightMm?: number | null; armrestWidthMm?: number | null;
  comfortLevel?: string; seatFirmnessOptions: string[]; seatQualityOptions: string[];
  seatHeightOptionsMm: number[]; seatDepthOptionsMm: number[]; ergonomicSizes: string[];
  headrestAdjustable: boolean; seatDepthAdjustable: boolean; backrestAdjustable: boolean; armrestAdjustable: boolean;
  recliner: boolean; manualRecliner: boolean; electricRecliner: boolean; liftAssist: boolean;
  swivel: boolean; swivelDegrees?: number | null; sofaBed: boolean; sleepingArea?: { widthMm: number; lengthMm: number } | null;
  integratedStorage: boolean; chaiseAvailable: boolean; footstoolAvailable: boolean;
  leftHandAvailable: boolean; rightHandAvailable: boolean; reversible: boolean;
};
export type BedSpecifications = {
  bedType: Array<"bed-frame" | "upholstered-bed" | "boxspring-bed" | "sofa-bed" | "mattress" | "slatted-base">;
  sleepingWidthsMm: number[]; sleepingLengthsMm: number[]; sleepingSizes: Array<{ widthMm: number; lengthMm: number }>;
  outerDimensions: Dimensions[]; lyingHeightMm?: number | null; headboardHeightMm?: number | null;
  mattressIncluded: boolean; mattressTypes: string[]; mattressFirmnessOptions: string[];
  slattedBaseIncluded: boolean; slattedBaseCompatible: boolean; bedStorage: boolean;
  storageVolumeLitres?: number | null; motorised: boolean;
  outerDimensionsBySleepingSize?: Array<{ sleepingSize: { widthMm: number; lengthMm: number }; dimensions: Dimensions }>;
  underBedStorage?: boolean | null;
};
export type WardrobeSpecifications = {
  wardrobeType: string[]; doorType: Array<"hinged" | "sliding" | "folding" | "corner">; doorCountOptions: number[];
  widthOptionsMm: number[]; heightOptionsMm: number[]; depthOptionsMm: number[]; interiorModules: string[];
  shelves?: number | null; drawers?: number | null; clothesRails?: number | null;
  adjustableShelves: boolean; shoeStorage: boolean; trouserRack: boolean; tieRack: boolean; clothesLift: boolean;
  mirrorOption: boolean; lightingOption: boolean; cornerConfiguration: boolean;
  capacityBand?: "compact" | "medium" | "large" | "extra-large" | "configuration-dependent" | null;
  recommendedUserMin?: number | null; recommendedUserMax?: number | null;
};
export type TableSpecifications = {
  tableSubtype?: "coffee-table" | "side-table" | "dining-table" | null;
  tabletopShape: string[]; tabletopMaterials: string[]; tabletopThicknessMm?: number | null;
  widthOptionsMm: number[]; depthOptionsMm: number[]; diameterOptionsMm: number[]; heightMm?: number | null;
  extendable: boolean; extensionMechanism?: string | null; minLengthMm?: number | null; maxLengthMm?: number | null;
  capacityMin?: number | null; capacityMax?: number | null; capacityVerified: boolean;
  demoEstimatedCapacity?: number | null; edgeProfiles: string[]; baseVariants: string[];
};
export type DiningChairSpecifications = {
  chairSubtype?: "dining-chair" | "dining-armchair" | "dining-bench" | "bar-stool" | null;
  seatCapacityMin?: number | null; seatCapacityMax?: number | null;
  chairType: string; seatHeightMm?: number | null; seatWidthMm?: number | null; seatDepthMm?: number | null;
  armrests: boolean; swivel: boolean; swivelDegrees?: number | null; baseType: string[]; frameMaterial: string[];
  upholsteryAvailable: boolean; maxLoadKg?: number | null; stackable: boolean;
  comfortProfile?: string | null; easyCare?: boolean | null;
};
export type StorageSpecifications = {
  storageSubtype?: "wall-unit" | "sideboard" | "media-unit" | "display-cabinet" | "bedside-table" | "dresser" | null;
  purposes?: Array<"media" | "display" | "closed-storage">;
  storageType: string[]; doors?: number | null; drawers?: number | null; shelves?: number | null; compartments?: number | null;
  wallMounted: boolean; floorStanding: boolean; mountingType: string[]; mediaCompatible: boolean; cableManagement: boolean;
  lightingAvailable: boolean; qiChargingAvailable: boolean; internalLayout: string[]; maximumShelfLoadKg?: number | null;
};
export type OutdoorSpecifications = {
  weatherResistant: boolean; uvResistant: boolean; waterResistant: boolean; frostResistant: boolean; corrosionResistant: boolean;
  outdoorMaterial: string[]; frameMaterial?: string | null; surfaceTreatment?: string | null;
  protectiveCoverIncluded: boolean; protectiveCoverAvailable: boolean; drainage: boolean; indoorOutdoorUse: boolean; careInstructions: string;
};
export type CarpetSpecifications = {
  carpetShape: string[]; dimensionsAvailable: Array<{ widthMm: number; lengthMm: number }>;
  widthMm?: number | null; lengthMm?: number | null; diameterMm?: number | null; pileHeightMm?: number | null;
  composition?: string | null; construction?: string | null; backing?: string | null;
  underfloorHeatingSuitable: boolean; easyCare: boolean; outdoorSuitable: boolean; colorOptions: string[]; designOptions: string[];
};
export type LampSpecifications = {
  lampType: string[]; dimensions?: Partial<Dimensions> & { diameterMm?: number };
  material?: string | null; lightSourceType?: string | null; wattageW?: number | null; lumens?: number | null;
  colourTemperatureKelvin?: number | null; colourTemperatureMinKelvin?: number | null; colourTemperatureMaxKelvin?: number | null;
  cri?: number | null; dimmable: boolean; dimmingType?: string | null; integratedLed: boolean;
  batteryPowered: boolean; batteryRuntimeHours?: number | null; usbCharging: boolean; usbC: boolean;
  protectionRating?: string | null; energyEfficiencyClass?: string | null;
};
export type ProductSpecifications = {
  seating?: SeatingSpecifications; bed?: BedSpecifications; wardrobe?: WardrobeSpecifications;
  table?: TableSpecifications; diningChair?: DiningChairSpecifications; storage?: StorageSpecifications;
  outdoor?: OutdoorSpecifications; carpet?: CarpetSpecifications; lamp?: LampSpecifications;
};
export const stylistRoomTypes = ["living-room", "bedroom", "dining-room", "bathroom", "hallway", "kitchen", "outdoor", "home-accessories"] as const;
export type StylistRoomType = (typeof stylistRoomTypes)[number];
export const stylistStyles = [
  "modern-contemporary",
  "minimalist-scandinavian",
  "warm-natural-rustic",
  "classic-elegant-luxury",
  "industrial-urban",
  "retro-decorative"
] as const;
export type StylistStyle = (typeof stylistStyles)[number];
export const stylistStylePreferences = [...stylistStyles, "not-sure"] as const;
export type StylistStylePreference = (typeof stylistStylePreferences)[number];
export const stylistTargets = [
  "sofa", "armchair", "coffee-table", "side-table", "wall-unit", "sideboard", "complete-living-room",
  "bed", "wardrobe", "bedside-tables", "dresser", "bedroom-series", "complete-bedroom",
  "dining-table", "dining-chairs", "dining-bench", "dining-sideboard", "complete-dining-room",
  "vanity-unit", "washbasin-cabinet", "tall-cabinet", "mirror-cabinet", "bathroom-storage", "complete-bathroom-series",
  "hallway-wardrobe", "shoe-storage", "coat-storage", "hallway-bench", "mirror", "complete-hallway",
  "kitchen-storage", "kitchen-dining-area", "kitchen-seating", "kitchen-small-furniture", "complete-kitchen-concept",
  "outdoor-sofa", "outdoor-chairs", "outdoor-dining-table", "lounge-furniture", "lounger", "complete-outdoor-set",
  "small-furniture", "carpet", "lamp", "home-textiles", "several-accessories"
] as const;
export type StylistTarget = (typeof stylistTargets)[number];
export const stylistSpaceSizes = ["compact", "medium", "large", "known-dimensions"] as const;
export type StylistSpaceSize = (typeof stylistSpaceSizes)[number];
export const stylistPalettes = ["light-neutral", "warm-natural", "dark-tones", "colour-accents", "no-preference"] as const;
export type StylistPalette = (typeof stylistPalettes)[number];
export const stylistMaterialPreferences = ["fabric", "leather", "wood", "mixed", "no-preference"] as const;
export type StylistMaterialPreference = (typeof stylistMaterialPreferences)[number];
export const stylistPriorities = ["comfort", "easy-care", "flexible-modular", "compact-footprint", "relax-functions", "premium-materials"] as const;
export type StylistPriority = (typeof stylistPriorities)[number];
export type StylistQuizAnswer = string | string[];
export type StylistQuizInput = {
  roomType: StylistRoomType;
  answers: Record<string, StylistQuizAnswer>;
  notes: Record<string, string>;
  selectedProductIds: string[];
  maxWidthMm: number | null;
  maxDepthMm: number | null;
  styleDirection?: StylistStylePreference | null;
};
export type StylistPreferences = StylistQuizInput & {
  target: StylistTarget;
  style: StylistStylePreference;
  palette: StylistPalette;
  material: StylistMaterialPreference | null;
  spaceSize: StylistSpaceSize;
  priorities: StylistPriority[];
};
export const stylistStyleLabels: Record<StylistStyle, string> = {
  "modern-contemporary": "Modern / Contemporary",
  "minimalist-scandinavian": "Minimalist / Scandinavian",
  "warm-natural-rustic": "Warm Natural / Rustic",
  "classic-elegant-luxury": "Classic / Elegant Luxury",
  "industrial-urban": "Industrial / Urban",
  "retro-decorative": "Retro / Decorative"
};

export function stylistStyleLabel(style: StylistStyle | string) {
  return stylistStyleLabels[style as StylistStyle] ?? style.replaceAll("-", " ");
}

export type SavedStylistSet = {
  id: string;
  name: string;
  roomType: StylistRoomType;
  style: StylistStylePreference;
  productIds: string[];
  alternativeProductIds: Record<string, string[]>;
  preferences?: StylistPreferences;
  summary: string;
  createdAt: string;
};
export type ProjectStatus =
  | "Ideas Saved"
  | "Configuration in Progress"
  | "Ready for Consultation"
  | "Sent to Retailer"
  | "Consultation Booked"
  | "Retailer Responded";

  export type Material = {
  id: string;
  name: string;
  type: "fabric" | "leather";
  materialCode?: string | null;
  commercialName?: string;
  materialType?: string;
  colorFamily: string;
  colorName?: string;
  texture: string;
  composition: string;
  durability: number;
  martindaleCycles?: number | null;
  pillingRating?: number | null;
  lightFastnessRating?: number | null;
  easyCare: boolean;
  easyCareReason?: string[];
  petFriendly: boolean;
  familyFriendly: boolean;
  removableCover?: boolean;
  washableCover?: boolean;
  washableTemperatureC?: number | null;
  lightSensitivity: "low" | "medium" | "high";
    care: string;
    cleaningMethods: string[];
    maintenance: string;
    recommendedUses: string[];
    cautions: string[];
    certifications?: string[];
    materialImageUrl?: string;
    dataQuality?: DataQuality;
    demoData: boolean;
};
export type RecommendationMode = "alternatives" | "set";
export type RecommendationMatchLevel = "exact" | "closest";
export type RecommendationMatchContract = {
  recommendationMode: RecommendationMode;
  matchLevel: RecommendationMatchLevel;
  matchedPreferences: string[];
  unmetPreferences: string[];
};

export type Product = {
  id: string;
  slug: string;
  modelCode: string;
  name: string;
  subtitle: string;
  description: string;
  category: Category;
  /** All official memberships when a programme contains multiple product types. */
  categories?: Category[];
  collection: string;
  brand?: string;
  manufacturer?: string;
  entityLevel?: EntityLevel;
  productGroupId?: string;
  sku?: string | null;
  mpn?: string | null;
  gtin?: string | null;
  ean?: string | null;
  canonicalUrl?: string;
  productSubtypes?: ProductSubtype[];
  seriesId?: string | null;
  seriesSpecifications?: SeriesSpecifications;
  configurations?: ProductConfiguration[];
  tagline?: string;
  shortDescription?: string;
  productHighlights?: string[];
  roomTypes?: string[];
  useCases?: string[];
  bestFor?: string[];
  notIdealFor?: string[];
  styleTags?: string[];
  keywords?: string[];
  synonyms?: string[];
  dimensions?: Dimensions;
  dimensionRange?: DimensionRange;
  referenceConfiguration?: { name: string; dimensions: Dimensions; note?: string };
  weightKg?: number | null;
  maxLoadKg?: number | null;
  minDoorOpeningMm?: number | null;
  requiredWallClearanceMm?: number | null;
  floorClearanceMm?: number | null;
  primaryMaterial?: string | null;
  materialTypes?: string[];
  materialComposition?: string | null;
  upholsteryMaterial?: string | null;
  frameMaterial?: string | null;
  tabletopMaterial?: string | null;
  legMaterial?: string | null;
  finish?: string | null;
  surfaceTreatment?: string | null;
  colorFamilies?: string[];
  configurable?: boolean;
  availableComponents?: string[];
  includedItems?: string[];
  orientationOptions?: string[];
  seatQualityOptions?: string[];
  seatHeightOptions?: number[];
  seatDepthOptions?: number[];
  manualFunctions?: string[];
  comfortFunctions?: string[];
  accessories?: string[];
  optionalAccessories?: string[];
  compatibilityRules?: string[];
  incompatibilityRules?: string[];
  requirements?: string[];
  spaceProfile?: "compact" | "medium" | "large" | "configuration-dependent";
  smallSpaceReason?: string[];
  comfortProfile?: string;
  easyCare?: boolean | null;
  specifications?: ProductSpecifications;
  media?: ProductMedia;
  documents?: ProductDocuments;
  sourceDocumentUrl?: string;
  sourceDocumentId?: string;
  lastVerifiedAt?: string;
  validFrom?: string;
  validTo?: string;
  verificationStatus?: string;
  dataQuality?: DataQuality;
  variants?: ProductVariant[];
  widthMm: number;
  depthMm: number;
  heightMm: number;
  seatHeightMm: number;
  seatDepthMm: number;
  numberOfSeats: number;
  /** True only when the connected catalogue verifies the seat count. */
  numberOfSeatsVerified: boolean;
  verifiedFacts: {
    dimensions: boolean;
    seatHeight: boolean;
    seatDepth: boolean;
    colors: string[];
    materialTypes: Array<"fabric" | "leather">;
    styles: string[];
    functions: string[];
    modular: boolean;
    smallSpaceSuitable: boolean;
    comfort: boolean;
    easyCare: boolean;
  };
  /** Additional catalogue-verified facts shown in comparisons and supplied to AI summaries. */
  verifiedComparisonFacts?: Array<{
    label: string;
    value: string;
  }>;
  modular: boolean;
  styles: string[];
  colors: string[];
  materials: string[];
  functions: string[];
  electricFunctions: string[];
  armrestOptions: string[];
  feetOptions: string[];
  comfortOptions: string[];
  imageAssets: string[];
  model3dUrl?: string;
  sourceUrl?: string;
  authorizedContent?: boolean;
  specificationNote?: string;
  active: boolean;
  demoData: boolean;
  showroomEligible: boolean;
  smallSpaceSuitable: boolean;
  /** Catalogue-verified plan shapes only; never infer these from an image. */
  layoutShapes?: Array<"straight" | "l-shaped" | "u-shaped" | "corner" | "island">;
  /** Catalogue-verified tabletop shapes only; never infer these from an image. */
  tabletopShapes?: Array<"oval" | "round" | "square" | "rectangular">;
  indicativePriceCents: number;
  packageDimensions: { widthMm: number; depthMm: number; heightMm: number; minOpeningMm: number };
};

export function productHasCategory(product: Pick<Product, "category" | "categories">, category: Category) {
  return (product.categories ?? [product.category]).includes(category);
}

export type ProductVariant = {
  id: string;
  productId: string;
  productGroupId?: string;
  sku?: string | null;
  gtin?: string | null;
  mpn?: string | null;
  configurationName?: string;
  materialId?: string;
  color: string | { name: string; family: string; code?: string };
  dimensions?: Dimensions;
  layoutShape?: string;
  price?: number | null;
  currency?: string | null;
  imageAssets?: string[];
  indicativePriceCents?: number;
  active: boolean;
  demoData: boolean;
  dataQuality?: DataQuality;
};

export type ProductModule = {
  id: string;
  productId: string;
  name: string;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  packageDimensions: Product["packageDimensions"];
  demoData: boolean;
};

export type ProductRule = {
  id: string;
  productId: string;
  ruleType: "incompatibility" | "requirement" | "maximum" | "restriction";
  message: string;
  demoData: boolean;
};

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  alt: string;
  type: "gallery" | "hero" | "texture" | "scene";
  demoData: boolean;
};

export type ProductDocument = {
  id: string;
  productId: string;
  title: string;
  url: string;
  type: "technical" | "care" | "guarantee";
  demoData: boolean;
};

export type Dealer = {
  id: string;
  name: string;
  city: string;
  postcode: string;
  address: string;
  distanceKm: number;
  openingHours: string;
  languages: string[];
  services: string[];
  categories: Category[];
  displayProductIds: string[];
  demoData: boolean;
};

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  coverImage: string;
  savedProductIds: string[];
  savedConfigurationIds: string[];
  savedComparisonIds: string[];
  notes: string;
  preferredDealerId?: string;
  savedMaterialIds?: string[];
  archived?: boolean;
  updatedAt: string;
  demoData: boolean;
};

export type SearchFilters = {
  q?: string;
  category?: Category;
  productSubtypes?: ProductSubtype[];
  modelCode?: string;
  colors?: string[];
  materials?: string[];
  styles?: string[];
  maxWidthMm?: number;
  minWidthMm?: number;
  targetWidthMm?: number;
  maxDepthMm?: number;
  minSeatHeightMm?: number;
  maxSeatDepthMm?: number;
  seatCount?: number;
  collections?: string[];
  modular?: boolean;
  relaxFunction?: boolean;
  electricFunctions?: boolean;
  smallSpaceSuitable?: boolean;
  layoutShapes?: Array<"straight" | "l-shaped" | "u-shaped" | "corner" | "island">;
  tabletopShapes?: Array<"oval" | "round" | "square" | "rectangular">;
  extendable?: boolean;
  slidingDoors?: boolean;
  bedWidthMm?: number;
  easyCare?: boolean;
  weatherResistant?: boolean;
  sofaBed?: boolean;
  integratedStorage?: boolean;
  minLumens?: number;
  maxLumens?: number;
};

export type Configuration = {
  id: string;
  productId: string;
  modules: string[];
  armrest: string;
  feet: string;
  seatHeightMm: number;
  materialId: string;
  color: string;
  relax: boolean;
  electric: boolean;
  dimensions: { widthMm: number; depthMm: number; heightMm: number };
  indicativePriceCents: number;
  dataQuality?: DataQuality;
  updatedAt: string;
};

export type ConfigurationItem = {
  id: string;
  configurationId: string;
  productModuleId: string;
  quantity: number;
  position: number;
  demoData: boolean;
};

export type SavedProduct = {
  id: string;
  projectId: string;
  productId: string;
  savedAt: string;
  demoData: boolean;
};

export type SavedConfiguration = {
  id: string;
  projectId: string;
  configurationId: string;
  savedAt: string;
  demoData: boolean;
};

export type Comparison = {
  id: string;
  productIds: string[];
  savedAt: string;
  demoData: boolean;
};

export type RoomScene = {
  id: string;
  name: string;
  image: string;
  productIds: string[];
  demoData: boolean;
};

export type RoomSceneItem = {
  id: string;
  roomSceneId: string;
  productId: string;
  variantId?: string;
  configurationId?: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  materialId?: string;
  demoData: boolean;
};

export type RoomMeasurement = {
  id: string;
  projectId: string;
  roomWidthMm: number;
  roomLengthMm: number;
  roomHeightMm: number;
  savedAt: string;
  demoData: boolean;
};

export type FitCheck = {
  id: string;
  projectId?: string;
  productId: string;
  status: "likely" | "potential-conflict" | "insufficient-information" | "unlikely";
  reasons: string[];
  savedAt: string;
  demoData: boolean;
};

export type DealerDisplayProduct = {
  id: string;
  dealerId: string;
  productId: string;
  showroomEligible: boolean;
  demoData: boolean;
};

export type Lead = {
  id: string;
  reference: string;
  requestType: string;
  dealerId: string;
  customerName: string;
  customerEmail: string;
  projectId?: string;
  consentRecordId: string;
  submittedAt: string;
  demoData: boolean;
};

export type Appointment = {
  id: string;
  leadId: string;
  mode: "in-store" | "video" | "telephone";
  preferredSlot: string;
  confirmed: boolean;
  demoData: boolean;
};

export type ConsentRecord = {
  id: string;
  scope: "analytics" | "retailer-handover" | "photo-ai-processing";
  granted: boolean;
  timestamp: string;
  demoData: boolean;
};

export type AnalyticsEvent = {
  id: string;
  name: string;
  sessionId: string;
  userId?: string;
  productId?: string;
  configurationId?: string;
  projectId?: string;
  dealerId?: string;
  materialId?: string;
  actionType?: string;
  route?: string;
  locale: string;
  timestamp: string;
  consent: boolean;
};
