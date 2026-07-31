import { products } from "./data";
import type { Configuration, Product } from "./types";

export function createConfiguration(product: Product): Configuration {
  return {
    id: `CFG-${product.modelCode.replace(/\W/g, "")}-2027`,
    productId: product.id,
    modules: product.category === "armchair" ? ["chair"] : ["left seat", "right seat"],
    armrest: product.armrestOptions[0],
    feet: product.feetOptions[0],
    seatHeightMm: product.seatHeightMm,
    materialId: product.materials[0],
    color: product.colors[0],
    relax: false,
    electric: false,
    dimensions: { widthMm: product.widthMm, depthMm: product.depthMm, heightMm: product.heightMm },
    indicativePriceCents: product.indicativePriceCents,
    updatedAt: new Date().toISOString()
  };
}

export function validateConfiguration(configuration: Configuration) {
  const product = products.find((item) => item.id === configuration.productId);
  const issues: string[] = [];
  if (!product) return { valid: false, issues: ["Unknown product."], alternatives: [] };
  if (configuration.modules.length > 5) issues.push("Maximum module count is five in demo mode.");
  if (configuration.electric && !configuration.modules.some((module) => /power/.test(module))) issues.push("Electric function requires a power module.");
  if (configuration.modules.includes("corner") && (!configuration.modules.includes("left seat") || !configuration.modules.includes("right seat"))) issues.push("Corner layouts require both left and right seat modules.");
  if (configuration.armrest === "Wide lounge" && product.category === "armchair") issues.push("Wide lounge armrests are unavailable for armchairs.");
  if (configuration.seatHeightMm > 480 && configuration.feet === "Hidden glide") issues.push("Hidden glide feet are restricted to standard seat heights.");
  return { valid: issues.length === 0, issues, alternatives: ["Choose the Chaise layout for electric power", "Use Slim armrests", "Use Black metal feet at raised seat height"] };
}

export function priceConfiguration(configuration: Configuration) {
  const product = products.find((item) => item.id === configuration.productId);
  if (!product) return configuration.indicativePriceCents;
  return product.indicativePriceCents + configuration.modules.length * 18000 + (configuration.relax ? 42000 : 0) + (configuration.electric ? 76000 : 0);
}
