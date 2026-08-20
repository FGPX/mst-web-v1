import { products } from "./data";
import { productImages } from "./musterring-assets";

const physicalSceneSlugs = new Set(["justb-pm100", "justb-pm200", "mr-kleo", "mr-nils", "mr-pamela", "mr-281", "mr-9445", "jana", "kanto"]);
const generatedSceneSlugs = new Set(["mr-alena", "mr-lia", "mr-2665", "mr-4100", "mr-5100", "mr-5111", "mr-720", "mr-lucia", "mr-230", "mr-260", "mr-270", "mr-280", "mr-285", "mr-231", "justb-ct100", "nara"]);

const savedFinishes: Record<string, Array<{ materialId: string; color: string; image: string }>> = {
  "justb-ct100": [
    { materialId: "ct100-light-wild-oak", color: "natural oak", image: "/generated-product-views/justb-ct100/official-front.png?v=4" },
    { materialId: "ct100-black-oak", color: "black oak", image: "/generated-product-views/justb-ct100/physical-black-oak.png?v=1" }
  ],
  "nara": [
    { materialId: "nara-dekton-sirius", color: "dark stone", image: "/generated-product-views/nara/physical-dark-stone.png?v=1" },
    { materialId: "nara-natural-oak", color: "natural oak", image: "/generated-product-views/nara/physical-natural-oak.png?v=1" },
    { materialId: "nara-knotty-oak", color: "knotty oak", image: "/generated-product-views/nara/physical-knotty-oak.png?v=1" }
  ]
};

export function roomSceneProductFinish(productId: string, options?: { materialId?: string; color?: string }) {
  const product = products.find((item) => item.id === productId);
  if (!product) return undefined;
  return savedFinishes[product.slug]?.find((item) => item.materialId === options?.materialId)
    ?? savedFinishes[product.slug]?.find((item) => item.color === options?.color)
    ?? savedFinishes[product.slug]?.[0];
}

export function roomSceneProductImage(productId: string, options?: { viewIndex?: number; materialId?: string; color?: string }) {
  const product = products.find((item) => item.id === productId);
  const images = productImages(productId);
  const fallback = images.find((image) => image.toLowerCase().endsWith(".png")) ?? images[0];
  if (!product) return fallback;
  if (product.slug === "justb-pm100") {
    const views = [
      "/generated-product-views/justb-pm100/physical-front.png?v=1",
      "/generated-product-views/justb-pm100/illustrative-right-v2.png?v=1",
      "/generated-product-views/justb-pm100/physical-back-v3.png?v=1",
      "/generated-product-views/justb-pm100/illustrative-left-v2.png?v=1"
    ];
    return views[(options?.viewIndex ?? 0) % views.length];
  }
  const finish = roomSceneProductFinish(productId, options);
  if (finish) return finish.image;
  if (physicalSceneSlugs.has(product.slug)) return `/generated-product-views/${product.slug}/physical-front.png?v=1`;
  if (generatedSceneSlugs.has(product.slug)) return `/generated-product-views/${product.slug}/official-front.png?v=4`;
  return fallback;
}
