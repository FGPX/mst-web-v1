import { materials, products } from "../data";
import { createConfiguration, priceConfiguration, validateConfiguration } from "../configurator";
import type { Configuration } from "../types";
import type { ConfigurationRequirements } from "./schemas";

export function buildGroundedConfiguration(requirements: ConfigurationRequirements) {
  const candidates = products.filter((product) =>
    product.active &&
    product.category !== "storage" &&
    (!requirements.category || product.category === requirements.category) &&
    (!requirements.maxWidthMm || product.widthMm <= requirements.maxWidthMm) &&
    (!requirements.numberOfSeats || product.numberOfSeats === requirements.numberOfSeats) &&
    (!requirements.modular || product.modular) &&
    (!requirements.relaxFunction || product.functions.includes("relax")) &&
    (!requirements.colorFamily || product.colors.includes(requirements.colorFamily))
  );
  const product = candidates[0] ?? products.find((candidate) => candidate.active && candidate.category !== "storage");
  if (!product) throw new Error("No configurable catalogue product is available.");
  const configuration: Configuration = createConfiguration(product);
  const correctionNotes: string[] = [];
  const targetSeats = requirements.numberOfSeats ?? product.numberOfSeats;
  if (product.category !== "armchair") {
    configuration.modules = targetSeats >= 4
      ? ["left seat", "centre seat", "centre seat", "right seat"]
      : targetSeats === 3 ? ["left seat", "centre seat", "right seat"] : ["left seat", "right seat"];
  }
  configuration.relax = Boolean(requirements.relaxFunction);
  if (requirements.electricFunction) {
    configuration.modules = ["left seat", "power module", "chaise"];
    configuration.electric = true;
    correctionNotes.push("A power module and chaise layout were selected because electric operation is rule-bound.");
  }
  if (requirements.comfort && product.comfortOptions.includes(requirements.comfort)) {
    // Comfort is a product capability; the stored configuration has no separate comfort field.
  }
  const suitableMaterials = materials.filter((material) =>
    product.materials.includes(material.id) &&
    (!requirements.materialType || material.type === requirements.materialType) &&
    (!requirements.easyCare || material.easyCare)
  );
  if (suitableMaterials[0]) configuration.materialId = suitableMaterials[0].id;
  else if (requirements.easyCare || requirements.materialType) correctionNotes.push("The requested cover type was unavailable on the selected model; the default valid cover remains selected.");
  if (requirements.colorFamily && product.colors.includes(requirements.colorFamily)) configuration.color = requirements.colorFamily;
  const moduleFactor = product.category === "armchair" ? 1 : configuration.modules.length / Math.max(2, product.numberOfSeats);
  configuration.dimensions = {
    widthMm: Math.round(product.widthMm * moduleFactor),
    depthMm: configuration.modules.includes("chaise") ? Math.round(product.depthMm * 1.45) : product.depthMm,
    heightMm: product.heightMm
  };
  configuration.id = `CFG-${product.modelCode.replace(/\W/g, "")}-${Date.now().toString(36).toUpperCase()}`;
  configuration.indicativePriceCents = priceConfiguration(configuration);
  const validation = validateConfiguration(configuration);
  return { product, configuration, validation, correctionNotes };
}

