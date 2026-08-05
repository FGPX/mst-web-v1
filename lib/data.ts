import type { Dealer, Material, Product, Project, RoomScene } from "./types";
import { productImages } from "./musterring-assets";
import authorizedCatalog from "./generated/musterring-catalog.json";
import { categoryDetails } from "./catalog-taxonomy";

const image = (name: string) => `/stitch-assets/${name}.png`;

export const materials: Material[] = [
  ["mat-ivory-boucle", "Ivory Boucle", "fabric", "ivory", "soft loop", "polyester blend", 4, true, true, true, "medium", "Vacuum weekly, dab spills immediately."],
  ["mat-sand-weave", "Sand Structured Weave", "fabric", "beige", "woven", "recycled polyester blend", 5, true, true, true, "low", "Use a soft brush and pH-neutral cleaner."],
  ["mat-taupe-chenille", "Taupe Chenille", "fabric", "taupe", "velvet touch", "chenille blend", 4, true, false, true, "medium", "Brush with pile direction after cleaning."],
  ["mat-walnut-leather", "Walnut Leather", "leather", "brown", "natural grain", "leather", 5, false, false, true, "high", "Condition with leather care twice a year."],
  ["mat-charcoal-wool", "Charcoal Wool Blend", "fabric", "charcoal", "dry wool", "wool blend", 5, false, true, false, "low", "Professional cleaning recommended."],
  ["mat-stone-micro", "Stone Microfiber", "fabric", "stone", "fine matte", "microfiber", 5, true, true, true, "low", "Wipe with damp cloth."],
  ["mat-moss-weave", "Moss Performance Weave", "fabric", "green", "structured", "polyester", 4, true, true, true, "medium", "Spot clean with water-based cleaner."],
  ["mat-clay-linen", "Clay Linen Look", "fabric", "terracotta", "linen look", "linen-viscose blend", 3, false, false, false, "high", "Avoid direct sunlight."],
  ["mat-cream-leather", "Cream Smooth Leather", "leather", "cream", "smooth", "leather", 4, false, false, true, "high", "Clean with approved leather milk."],
  ["mat-smoke-velvet", "Smoke Velvet", "fabric", "grey", "velvet", "polyester velvet", 3, false, false, false, "medium", "Brush gently and avoid soaking."],
  ["mat-graphite-easy", "Graphite Easy-Care", "fabric", "graphite", "flat weave", "polyester", 5, true, true, true, "low", "Machine-clean removable covers when applicable."],
  ["mat-oat-performance", "Oat Performance Cloth", "fabric", "beige", "fine weave", "polyester blend", 5, true, true, true, "low", "Blot, do not rub."]
].map(([id, name, type, colorFamily, texture, composition, durability, easyCare, petFriendly, familyFriendly, lightSensitivity, care]) => ({
  id, name, type, colorFamily, texture, composition, durability, easyCare, petFriendly, familyFriendly, lightSensitivity, care, demoData: true
} as Material));

const base: Omit<Product, "id" | "slug" | "modelCode" | "name" | "subtitle" | "widthMm" | "depthMm" | "numberOfSeats" | "category" | "imageAssets" | "indicativePriceCents"> = {
  description: "Illustrative Musterring concept product for digital experience validation.",
  collection: "Modern Heritage",
  heightMm: 840,
  seatHeightMm: 460,
  seatDepthMm: 560,
  modular: true,
  styles: ["modern heritage", "editorial", "minimal"],
  colors: ["beige", "taupe", "stone", "charcoal"],
  materials: ["mat-sand-weave", "mat-taupe-chenille", "mat-stone-micro", "mat-graphite-easy"],
  functions: ["relax", "storage", "modular"],
  electricFunctions: ["electric relax"],
  armrestOptions: ["Slim", "Soft pillow", "Wide lounge"],
  feetOptions: ["Black metal", "Oak runner", "Hidden glide"],
  comfortOptions: ["soft", "balanced", "firm"],
  active: true,
  demoData: true,
  showroomEligible: true,
  smallSpaceSuitable: false,
  packageDimensions: { widthMm: 1100, depthMm: 900, heightMm: 760, minOpeningMm: 820 }
};

const conceptProducts: Product[] = [
  ["p1", "mr-2875-modular-comfort", "MR 2875", "MR 2875 Modular Comfort System", "A quiet modular sofa with generous comfort and refined proportions.", "sofa", 2380, 980, 3, image("musterring_product_detail"), 428000, true],
  ["p2", "mr-2710-compact-sofa", "MR 2710", "MR 2710 Compact Sofa", "Compact seating for apartments without sacrificing upright comfort.", "sofa", 2180, 920, 3, image("musterring_sofas_seating"), 318000, true],
  ["p3", "mr-4810-lounge-corner", "MR 4810", "MR 4810 Lounge Corner", "A sectional arrangement for open living spaces.", "sectional", 3020, 1860, 4, image("musterring_3d_configurator"), 574000, false],
  ["p4", "mr-6060-reading-chair", "MR 6060", "MR 6060 Reading Chair", "An armchair with high back support and tailored fabric options.", "armchair", 920, 940, 1, image("musterring_room_visualization"), 189000, true],
  ["p5", "mr-3200-soft-island", "MR 3200", "MR 3200 Soft Island", "Deep relaxed seating with configurable lounge modules.", "sectional", 2860, 1680, 4, image("musterring_homepage"), 512000, false],
  ["p6", "mr-2205-city-loveseat", "MR 2205", "MR 2205 City Loveseat", "A two-seat compact sofa for studies and smaller rooms.", "sofa", 1760, 880, 2, image("musterring_intelligent_search"), 249000, true],
  ["p7", "mr-7300-relax-armchair", "MR 7300", "MR 7300 Relax Armchair", "Electric relax comfort in a calm architectural silhouette.", "armchair", 980, 990, 1, image("musterring_will_it_fit"), 264000, false],
  ["p8", "mr-4110-family-sofa", "MR 4110", "MR 4110 Family Sofa", "Easy-care family sofa with broad material compatibility.", "sofa", 2620, 1020, 4, image("musterring_product_comparison"), 386000, false],
  ["p9", "mr-1980-atelier-sofa", "MR 1980", "MR 1980 Atelier Sofa", "Low-profile editorial sofa for curated rooms.", "sofa", 2420, 960, 3, image("musterring_visual_search_results"), 337000, true],
  ["p10", "mr-5150-high-seat-sofa", "MR 5150", "MR 5150 High Seat Sofa", "Higher seat geometry for easier standing and balanced support.", "sofa", 2320, 930, 3, image("musterring_my_project_hub"), 359000, true],
  ["p11", "mr-6600-chaise-module", "MR 6600", "MR 6600 Chaise Module", "Flexible chaise-led modular system for room planning.", "sectional", 2740, 1620, 3, image("musterring_room_visualization"), 472000, false],
  ["p12", "mr-2440-tailored-chair", "MR 2440", "MR 2440 Tailored Chair", "A compact accent chair for complete-the-room planning.", "armchair", 820, 860, 1, image("musterring_dealer_finder_handover"), 142000, true]
].map(([id, slug, modelCode, name, subtitle, category, widthMm, depthMm, numberOfSeats, img, indicativePriceCents, small]) => ({
  ...base,
  id, slug, modelCode, name, subtitle, category, widthMm, depthMm, numberOfSeats,
  imageAssets: productImages(id as string) ?? [img as string],
  indicativePriceCents,
  smallSpaceSuitable: Boolean(small),
  modular: category !== "armchair"
} as Product));

const conceptProductsById = new Map(conceptProducts.map((product) => [product.id, product]));
const sofaTemplates = conceptProducts.filter((product) => product.category !== "armchair");
const armchairTemplates = conceptProducts.filter((product) => product.category === "armchair");
const verifiedRedUpholstery = new Set(["mr-260", "mr-365", "mr-370", "mr-385", "mr-2875"]);
const catalogueDimensionOverrides: Record<string, { widthMm: number; depthMm: number; heightMm: number }> = {
  // Dimensions correspond to the specific catalogue variants used by the Room Composer cutouts.
  // PM100 corner configuration: approx. 232 x 268 cm, maximum back height 88 cm.
  "justb-pm100": { widthMm: 2680, depthMm: 2320, heightMm: 880 },
  // Armchair dimensions match the specific catalogue cutouts used in the composer.
  "mr-kleo": { widthMm: 970, depthMm: 880, heightMm: 950 },
  "mr-nils": { widthMm: 700, depthMm: 870, heightMm: 1120 },
  "mr-pamela": { widthMm: 930, depthMm: 1190, heightMm: 610 },
  "mr-281": { widthMm: 780, depthMm: 880, heightMm: 1100 },
  "mr-9445": { widthMm: 670, depthMm: 870, heightMm: 800 },
  // Storage dimensions match the pictured JANA and KANTO sideboard variants.
  "jana": { widthMm: 2560, depthMm: 530, heightMm: 770 },
  "kanto": { widthMm: 2100, depthMm: 490, heightMm: 940 },
  "justb-ct100": { widthMm: 600, depthMm: 600, heightMm: 360 },
  "nara": { widthMm: 890, depthMm: 780, heightMm: 440 }
};
const catalogueSearchOverrides: Record<string, Partial<Product>> = {
  "justb-pm100": { colors: ["beige", "cream", "ivory"], styles: ["modern", "minimal", "modular"], functions: ["modular"], modular: true },
  "justb-pm200": { colors: ["beige", "cream", "sand"], styles: ["modern", "soft modern", "modular"], functions: ["modular", "relax"], modular: true },
  "mr-lucia": { colors: ["light grey", "grey", "cream"], styles: ["soft modern", "casual", "minimal"], functions: ["modular"], modular: true },
  "mr-230": { colors: ["light grey", "grey", "beige"], styles: ["modern", "comfort"], functions: ["relax"], modular: false },
  "mr-260": { colors: ["light grey", "grey", "beige", "red", "burgundy"], styles: ["modern", "family"], functions: ["modular", "relax"], modular: true },
  "mr-270": { colors: ["yellow", "mustard", "cognac"], styles: ["modern", "contemporary"], functions: ["relax"], modular: false },
  "mr-280": { colors: ["beige", "taupe", "cream"], styles: ["classic modern", "comfort"], functions: ["relax"], modular: false },
  "mr-285": { colors: ["black", "charcoal"], styles: ["modern", "minimal"], functions: ["relax"], modular: false },
  "mr-nils": { colors: ["taupe", "beige"], styles: ["modern", "ergonomic"], functions: ["relax", "swivel"], modular: false },
  "mr-pamela": { colors: ["cream", "ivory", "beige"], styles: ["soft modern", "lounge"], functions: ["relax"], modular: false },
  "mr-231": { colors: ["light grey", "grey"], styles: ["modern", "ergonomic"], functions: ["relax", "swivel"], modular: false },
  "jana": { colors: ["charcoal", "brown", "oak"], styles: ["modern", "industrial", "wood"], functions: ["storage"], modular: false },
  "kanto": { colors: ["brown", "oak", "natural"], styles: ["natural", "modern", "wood"], functions: ["storage"], modular: false },
  "justb-ct100": { colors: ["natural oak", "black oak"], styles: ["modern", "minimal", "wood"], functions: [], modular: false },
  "nara": { colors: ["dark stone", "natural oak", "knotty oak"], styles: ["modern", "minimal", "metal", "wood"], functions: [], modular: false }
};

export const products: Product[] = [
  ...authorizedCatalog.products.map((official, index) => {
    const category = official.category as Product["category"];
    const chairLike = category === "armchair" || category === "dining-chair";
    const templates = chairLike ? armchairTemplates : sofaTemplates;
    const template = conceptProductsById.get(official.appProductId) ?? templates[index % templates.length];
    const searchableCopy = `${official.tagline} ${official.description}`.toLowerCase();
    const isSeating = ["sofa", "armchair", "sectional"].includes(category);
    const isStorage = ["storage", "wardrobe", "bedroom-series", "bathroom", "kitchen"].includes(category);

    const searchOverride = catalogueSearchOverrides[official.slug] ?? {};
    const dimensionOverride = catalogueDimensionOverrides[official.slug];
    return {
      ...template,
      id: official.appProductId,
      slug: official.slug,
      modelCode: official.modelCode,
      name: official.name,
      subtitle: official.tagline,
      description: official.description,
      category,
      imageAssets: official.images,
      sourceUrl: official.sourceUrl,
      authorizedContent: true,
      specificationNote: "Dimensions, configuration options, availability and prices are confirmed by an authorized Musterring retailer.",
      active: true,
      demoData: false,
      widthMm: dimensionOverride?.widthMm ?? (isStorage ? 3000 : template.widthMm),
      depthMm: dimensionOverride?.depthMm ?? (isStorage ? 450 : template.depthMm),
      heightMm: dimensionOverride?.heightMm ?? (isStorage ? 2050 : template.heightMm),
      seatHeightMm: isSeating ? template.seatHeightMm : 0,
      seatDepthMm: isSeating ? template.seatDepthMm : 0,
      numberOfSeats: isSeating ? template.numberOfSeats : 0,
      materials: isSeating ? template.materials : [],
      colors: !isSeating
        ? template.colors
        : isStorage
          ? template.colors
          : [...new Set([...template.colors, ...(verifiedRedUpholstery.has(official.slug) ? ["red", "burgundy"] : [])])],
      functions: isStorage ? ["storage", "modular"] : isSeating ? template.functions : [],
      electricFunctions: isSeating ? template.electricFunctions : [],
      armrestOptions: isSeating ? template.armrestOptions : [],
      feetOptions: isSeating ? template.feetOptions : [],
      comfortOptions: isSeating ? template.comfortOptions : [],
      collection: categoryDetails[category]?.room ?? "Musterring",
      modular: isStorage || (isSeating && /modular|module|configur|system|programme|flexib/.test(searchableCopy)),
      smallSpaceSuitable: /compact|small|little floor space|any living room/.test(searchableCopy)
      , ...searchOverride
    } satisfies Product;
  }),
  ...conceptProducts
    .filter((product) => !authorizedCatalog.products.some((official) => official.appProductId === product.id))
    .map((product) => ({ ...product, active: false }))
];

export const dealers: Dealer[] = [
  ["d1", "Musterring Partner Hannover", "Hannover", "30159", "Georgstrasse 12", 4.2],
  ["d2", "Musterring Studio Berlin", "Berlin", "10115", "Invalidenstrasse 48", 7.8],
  ["d3", "Wohnforum Hamburg", "Hamburg", "20095", "Ballindamm 5", 12.1],
  ["d4", "Musterring Partner Koeln", "Koeln", "50667", "Breite Strasse 21", 18.4],
  ["d5", "Einrichtungshaus Stuttgart", "Stuttgart", "70173", "Koenigstrasse 33", 21.7],
  ["d6", "Musterring Partner Muenchen", "Muenchen", "80331", "Sendlinger Strasse 8", 26.5],
  ["d7", "Designhaus Bremen", "Bremen", "28195", "Obernstrasse 40", 31.2],
  ["d8", "Musterring Partner Leipzig", "Leipzig", "04109", "Grimmaische Strasse 17", 36.9]
].map(([id, name, city, postcode, address, distanceKm]) => ({
  id, name, city, postcode, address, distanceKm, openingHours: "Mo-Sa 10:00-18:00",
  languages: ["Deutsch", "English"], services: ["Request a Quote", "Book a Consultation", "Check Showroom Availability", "Request a Technical Fit Check"],
  categories: ["sofa", "armchair", "sectional", "storage"], displayProductIds: ["p1", "p2", "p4", "p10"], demoData: true
} as Dealer));

export const roomScenes: RoomScene[] = [
  { id: "scene-1", name: "Natural Living Room", image: "/stitch-assets/original/room-living-clean.jpg", productIds: ["p2", "p4", "p12"], demoData: true },
  { id: "scene-2", name: "City Contrast Lounge", image: "/musterring-catalog/mr-2875/image-01.jpg", productIds: ["p8", "p11"], demoData: true },
  { id: "scene-3", name: "Soft Modular Retreat", image: "/musterring-catalog/mr-1370/image-01.jpg", productIds: ["p1", "p7"], demoData: true }
];

export const projects: Project[] = [
  { id: "project-living", name: "Living Room Project", status: "Configuration in Progress", coverImage: image("musterring_my_project_hub"), savedProductIds: ["p1", "p4"], savedConfigurationIds: [], savedComparisonIds: [], notes: "Prefers beige easy-care fabrics.", updatedAt: new Date().toISOString(), demoData: true },
  { id: "project-apartment", name: "Small Apartment", status: "Ideas Saved", coverImage: image("musterring_intelligent_search"), savedProductIds: ["p2", "p6"], savedConfigurationIds: [], savedComparisonIds: [], notes: "Maximum width 240 cm.", updatedAt: new Date().toISOString(), demoData: true },
  { id: "project-family", name: "Family Lounge", status: "Ready for Consultation", coverImage: image("musterring_product_comparison"), savedProductIds: ["p8", "p11"], savedConfigurationIds: [], savedComparisonIds: [], notes: "Pet-friendly material required.", updatedAt: new Date().toISOString(), demoData: true }
];

export const disclaimer = "Official Musterring product names, editorial descriptions and imagery are imported from the authorized source pages. Planning dimensions, configurations, prices and retailer availability remain illustrative until connected to validated Musterring PIM and retailer data.";
