import { materials, products } from "../data";
import { retailerProjectDataSchema, type RetailerProjectData } from "./schemas";

export function groundProjectData(input: unknown) {
  const project = retailerProjectDataSchema.parse(input);
  const productMap = new Map(products.map((product) => [product.id, product]));
  const materialMap = new Map(materials.map((material) => [material.id, material]));
  const safe: RetailerProjectData = {
    ...project,
    productIds: project.productIds.filter((id) => productMap.has(id)),
    materialIds: project.materialIds.filter((id) => materialMap.has(id))
  };
  const groundedFacts = [
    safe.productIds.length ? `Products: ${safe.productIds.map((id) => {
      const product = productMap.get(id)!;
      return `${product.modelCode} (${product.name})`;
    }).join(", ")}` : "No products selected",
    safe.materialIds.length ? `Materials: ${safe.materialIds.map((id) => materialMap.get(id)!.name).join(", ")}` : "No materials selected",
    safe.configurationIds.length ? `Configuration IDs: ${safe.configurationIds.join(", ")}` : "No saved configurations"
  ].join(". ");
  return { project: safe, groundedFacts };
}

