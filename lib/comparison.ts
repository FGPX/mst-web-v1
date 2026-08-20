import type { Product } from "./types";

export type ComparisonAward = {
  productId: string;
  labels: string[];
};

export function comparisonAwards(products: Product[]): ComparisonAward[] {
  if (!products.length) return [];
  const verifiedWidths = products.filter((product) => product.verifiedFacts.dimensions).map((product) => product.widthMm);
  const narrowest = verifiedWidths.length ? Math.min(...verifiedWidths) : null;
  const hasWidthDifference = new Set(verifiedWidths).size > 1;
  const comfortScore = (product: Product) => product.verifiedFacts.comfort ? product.comfortOptions.length + product.verifiedFacts.functions.length : 0;
  const flexibilityScore = (product: Product) => Number(product.verifiedFacts.modular) * 10 + product.verifiedFacts.materialTypes.length;
  const technologyScore = (product: Product) => product.verifiedFacts.functions.filter((value) => /electric|motor/i.test(value)).length;
  const mostComfort = Math.max(0, ...products.map(comfortScore));
  const mostFlexible = Math.max(0, ...products.map(flexibilityScore));
  const mostTechnology = Math.max(0, ...products.map(technologyScore));
  return products.map((product) => ({
    productId: product.id,
    labels: [
      hasWidthDifference && narrowest !== null && product.verifiedFacts.dimensions && product.widthMm === narrowest ? "Best for Small Spaces" : "",
      product.verifiedComparisonFacts?.find((fact) => fact.label === "Dining level")?.value.startsWith("Counter-height") ? "Best for Counter-Height Dining" : "",
      product.verifiedComparisonFacts?.find((fact) => fact.label === "Dining level")?.value.startsWith("Standard-height") ? "Best for Standard Dining" : "",
      mostComfort > 0 && comfortScore(product) === mostComfort ? "Best for Comfort" : "",
      mostFlexible > 0 && flexibilityScore(product) === mostFlexible ? "Best for Modular Flexibility" : "",
      mostTechnology > 0 && technologyScore(product) === mostTechnology ? "Best for Technology" : ""
    ].filter(Boolean)
  }));
}
