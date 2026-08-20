import type { Product } from "./types";

type JsonLd = Record<string, unknown>;

function verified(product: Product, field: string) {
  return product.dataQuality?.verifiedFields.some((candidate) => candidate === field || candidate.startsWith(`${field}.`)) ?? false;
}

function dimensionsProperties(product: Product) {
  if (!product.verifiedFacts.dimensions) return [];
  return [
    { "@type": "PropertyValue", name: "Width", value: product.widthMm, unitCode: "MMT" },
    { "@type": "PropertyValue", name: "Depth", value: product.depthMm, unitCode: "MMT" },
    { "@type": "PropertyValue", name: "Height", value: product.heightMm, unitCode: "MMT" }
  ];
}

function variantJsonLd(product: Product) {
  return (product.variants ?? []).filter((variant) => !variant.demoData).map((variant) => ({
    "@type": "Product",
    "@id": `${product.canonicalUrl ?? product.sourceUrl}#${variant.id}`,
    name: variant.configurationName ?? variant.id,
    isVariantOf: { "@id": `${product.canonicalUrl ?? product.sourceUrl}#product-group` },
    ...(variant.sku ? { sku: variant.sku } : {}),
    ...(variant.mpn ? { mpn: variant.mpn } : {}),
    ...(variant.gtin ? { gtin: variant.gtin } : {}),
    ...(typeof variant.color === "object" && variant.color.family !== "unspecified" ? { color: variant.color.name } : {}),
    image: variant.imageAssets ?? product.imageAssets
  }));
}

/**
 * Produces public structured data from authorised or verified facts only.
 * Demo price, availability, reviews, identifiers and dimensions are deliberately excluded.
 */
export function productStructuredData(product: Product): JsonLd {
  const url = product.canonicalUrl ?? product.sourceUrl;
  const variants = variantJsonLd(product);
  const common: JsonLd = {
    "@context": "https://schema.org",
    "@type": product.entityLevel === "programme" ? "ProductGroup" : "Product",
    "@id": `${url}#${product.entityLevel === "programme" ? "product-group" : "product"}`,
    name: product.name,
    model: product.modelCode,
    description: product.description,
    url,
    image: product.media?.images.map((image) => image.url) ?? product.imageAssets,
    category: product.categories?.join(", ") ?? product.category,
    brand: { "@type": "Brand", name: product.brand ?? "Musterring" },
    manufacturer: { "@type": "Organization", name: product.manufacturer ?? "Musterring" },
    ...(product.entityLevel === "programme" ? { productGroupID: product.productGroupId } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.mpn ? { mpn: product.mpn } : {}),
    ...(product.gtin ? { gtin: product.gtin } : {}),
    ...(product.verifiedFacts.materialTypes.length ? { material: product.verifiedFacts.materialTypes.join(", ") } : {}),
    ...(product.verifiedFacts.colors.length ? { color: product.verifiedFacts.colors.join(", ") } : {}),
    additionalProperty: [
      ...dimensionsProperties(product),
      ...(product.verifiedFacts.seatHeight ? [{ "@type": "PropertyValue", name: "Seat height", value: product.seatHeightMm, unitCode: "MMT" }] : []),
      ...(product.verifiedFacts.seatDepth ? [{ "@type": "PropertyValue", name: "Seat depth", value: product.seatDepthMm, unitCode: "MMT" }] : []),
      ...(verified(product, "availableComponents") && product.availableComponents?.length ? [{ "@type": "PropertyValue", name: "Available components", value: product.availableComponents.join(", ") }] : [])
    ],
    ...(variants.length ? { hasVariant: variants } : {})
  };
  return common;
}

export function productBreadcrumbStructuredData(product: Product): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Furniture", item: "/furniture" },
      { "@type": "ListItem", position: 2, name: product.name, item: `/furniture/${product.slug}` }
    ]
  };
}
