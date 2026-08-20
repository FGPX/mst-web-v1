export const catalogueCategories = [
  "sofa", "armchair", "sectional", "storage", "coffee-table", "bedroom-series", "bed", "wardrobe",
  "dining-chair", "dining-table", "bathroom", "kitchen", "outdoor", "small-furniture", "carpet", "lamp", "home-textile"
] as const;

export type Category = (typeof catalogueCategories)[number];
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
  colorFamily: string;
  texture: string;
  composition: string;
  durability: number;
  easyCare: boolean;
  petFriendly: boolean;
  familyFriendly: boolean;
  lightSensitivity: "low" | "medium" | "high";
    care: string;
    cleaningMethods: string[];
    maintenance: string;
    recommendedUses: string[];
    cautions: string[];
    demoData: boolean;
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
  materialId: string;
  color: string;
  indicativePriceCents: number;
  active: boolean;
  demoData: boolean;
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
