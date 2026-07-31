import { products } from "./data";
import type { Product } from "./types";

// Editorial relationships are explicit and take precedence over similarity scoring.
const curatedRelationships: Record<string, string[]> = {
  "justb-pm100": ["kara-frame", "mr-710"],
  "mr-2875": ["kara-frame", "mr-710"],
  "mr-260": ["kira-system", "mr-1391"]
};

export function completeTheRoom(selected: Product, limit = 3) {
  const curated = curatedRelationships[selected.slug] ?? [];
  const complementary = selected.category === "storage" ? ["sofa", "armchair", "sectional"] : ["armchair", "storage"];
  return products.filter((product) => product.active && product.id !== selected.id).map((product) => {
    let score = 0;
    const reasons: string[] = [];
    const curatedIndex = curated.indexOf(product.slug);
    if (curatedIndex >= 0) { score += 100 - curatedIndex; reasons.push("curated Musterring room relationship"); }
    if (complementary.includes(product.category)) { score += 30; reasons.push(`complementary ${product.category} category`); }
    const sharedStyles = product.styles.filter((style) => selected.styles.includes(style));
    if (sharedStyles.length) { score += 12; reasons.push(`shared ${sharedStyles[0]} style`); }
    const sharedColors = product.colors.filter((color) => selected.colors.includes(color));
    if (sharedColors.length) { score += 8; reasons.push(`compatible ${sharedColors.slice(0, 2).join("/")} palette`); }
    const sharedMaterials = product.materials.filter((material) => selected.materials.includes(material));
    if (sharedMaterials.length) { score += 5; reasons.push("compatible cover family"); }
    return { product, score, reasons };
  }).filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

