import type { Product } from "./types";

export type ComparisonAward = {
  productId: string;
  labels: string[];
};

export function comparisonAwards(products: Product[]): ComparisonAward[] {
  if (!products.length) return [];
  const narrowest = Math.min(...products.map((product) => product.widthMm));
  const mostComfort = Math.max(...products.map((product) => product.comfortOptions.length + product.functions.length));
  const mostFlexible = Math.max(...products.map((product) => Number(product.modular) * 10 + product.materials.length));
  const mostTechnology = Math.max(...products.map((product) => product.electricFunctions.length));
  return products.map((product) => ({
    productId: product.id,
    labels: [
      product.widthMm === narrowest ? "Best for Small Spaces" : "",
      product.comfortOptions.length + product.functions.length === mostComfort ? "Best for Comfort" : "",
      Number(product.modular) * 10 + product.materials.length === mostFlexible ? "Best for Modular Flexibility" : "",
      mostTechnology > 0 && product.electricFunctions.length === mostTechnology ? "Best for Technology" : ""
    ].filter(Boolean)
  }));
}
