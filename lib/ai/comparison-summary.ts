import type { Product } from "../types";
import { comparisonAwards } from "../comparison";
import {
  comparisonSummaryInputSchema,
  comparisonSummarySchema,
  type ComparisonSummary,
  type ComparisonSummaryInput
} from "./schemas";

export function comparisonSummaryInput(selected: Product[]): ComparisonSummaryInput {
  const awards = comparisonAwards(selected);
  return comparisonSummaryInputSchema.parse({
    products: selected.map((product) => ({
      productId: product.id,
      modelCode: product.modelCode,
      category: product.category.replace("-", " "),
      verifiedWidthCm: product.verifiedFacts.dimensions ? Math.round(product.widthMm / 10) : null,
      verifiedSeatCount: product.numberOfSeatsVerified ? product.numberOfSeats : null,
      verifiedMaterialTypes: product.verifiedFacts.materialTypes,
      verifiedFunctions: product.verifiedFacts.functions,
      verifiedModular: product.verifiedFacts.modular,
      verifiedSmallSpaceSuitable: product.verifiedFacts.smallSpaceSuitable,
      verifiedDetails: product.verifiedComparisonFacts ?? [],
      comparisonHighlights: awards.find((award) => award.productId === product.id)?.labels ?? []
    }))
  });
}

export function deterministicComparisonSummary(input: ComparisonSummaryInput): ComparisonSummary {
  const parsed = comparisonSummaryInputSchema.parse(input);
  const widthProducts = parsed.products.filter((product) => product.verifiedWidthCm !== null);
  const seatingProducts = parsed.products.filter((product) => product.verifiedSeatCount !== null);
  const narrowest = widthProducts.reduce<(typeof widthProducts)[number] | null>(
    (best, product) => !best || product.verifiedWidthCm! < best.verifiedWidthCm! ? product : best,
    null
  );
  const highestCapacity = seatingProducts.reduce<(typeof seatingProducts)[number] | null>(
    (best, product) => !best || product.verifiedSeatCount! > best.verifiedSeatCount! ? product : best,
    null
  );

  const products = parsed.products.map((product) => {
    const detail = (label: string) => product.verifiedDetails.find((item) => item.label === label)?.value;
    const materialCopy = product.verifiedMaterialTypes.length
      ? ` Verified material types: ${product.verifiedMaterialTypes.join(", ")}.`
      : "";
    const dimensionFact = product.verifiedWidthCm !== null
      ? `${product.verifiedWidthCm} cm verified width`
      : "Dimensions vary by configuration";
    const seatingFact = product.verifiedSeatCount !== null
      ? `${product.verifiedSeatCount} ${product.verifiedSeatCount === 1 ? "seat" : "seats"}`
      : "Seat count varies by configuration";
    const specificationFact = [
      detail("Height") ? `height ${detail("Height")}` : "",
      detail("Seat Height") ? `seat height ${detail("Seat Height")}` : "",
      detail("Seat Depth") ? `seat depth ${detail("Seat Depth")}` : ""
    ].filter(Boolean).join(" · ");
    const comfortFact = detail("Seat construction") ?? detail("Upholstery choice");
    const functionFact = detail("Motorised function")
      ?? (product.verifiedFunctions.length ? product.verifiedFunctions.join(", ") : "Functions vary by configuration");

    return {
      productId: product.productId,
      summary: product.verifiedModular
        ? `A verified modular ${product.category}.${materialCopy}`
        : `A ${product.category} whose exact specification depends on the selected configuration.${materialCopy}`,
      bestFor: product.comparisonHighlights[0]
        ?? (product.verifiedSmallSpaceSuitable ? "Verified for compact room planning" : "Compare with your room requirements"),
      facts: [
        `${dimensionFact} · ${seatingFact}`,
        specificationFact,
        comfortFact ?? (product.verifiedModular ? "Verified modular system" : "Modularity varies by configuration"),
        functionFact
      ].filter(Boolean).slice(0, 4)
    };
  });

  const widths = widthProducts.map((product) => product.verifiedWidthCm!);
  const seats = seatingProducts.map((product) => product.verifiedSeatCount!);
  const modularCount = parsed.products.filter((product) => product.verifiedModular).length;
  const detailComparison = (label: string, heading: string) => {
    const values = parsed.products.map((product) => ({
      modelCode: product.modelCode,
      value: product.verifiedDetails.find((item) => item.label === label)?.value
    })).filter((item): item is { modelCode: string; value: string } => Boolean(item.value));
    return values.length > 1 && new Set(values.map((item) => item.value)).size > 1
      ? `${heading}: ${values.map((item) => `${item.modelCode} ${item.value}`).join("; ")}`
      : "";
  };
  const glance = [
    widths.length > 1 ? `Verified width range: ${Math.min(...widths)}–${Math.max(...widths)} cm` : "",
    seats.length > 1 ? `Verified capacity range: ${Math.min(...seats)}–${Math.max(...seats)} seats` : "",
    detailComparison("Seat Height", "Seat heights"),
    detailComparison("Seat construction", "Seat construction"),
    modularCount ? `${modularCount} verified modular option${modularCount === 1 ? "" : "s"}` : "",
    `${parsed.products.filter((product) => product.verifiedFunctions.length).length} with verified function data`
  ].filter(Boolean).slice(0, 5);
  const recommendation = narrowest && highestCapacity && narrowest.productId === highestCapacity.productId
    ? `${narrowest.modelCode} combines the smallest verified width with the highest verified seating capacity in this selection. Confirm the exact configuration and room fit with a retailer.`
    : narrowest && highestCapacity
      ? `For a tighter room, ${narrowest.modelCode} has the smallest verified width. For maximum verified seating capacity, ${highestCapacity.modelCode} provides ${highestCapacity.verifiedSeatCount} seats. Refine the recommendation using your room and comfort priorities.`
      : narrowest && widthProducts.length > 1
        ? `${narrowest.modelCode} has the smallest verified reference width in this selection. The models also differ in seat height and seat construction, so choose according to your preferred sitting position and comfort, then confirm the exact configuration and room fit with a Musterring retailer.`
      : "There is not enough verified catalogue data to identify a single best option. Refine the recommendation and confirm the configuration with a Musterring retailer.";

  return comparisonSummarySchema.parse({ products, glance, recommendation });
}

export function validateComparisonSummary(
  summary: ComparisonSummary,
  input: ComparisonSummaryInput
): ComparisonSummary {
  const parsed = comparisonSummarySchema.parse(summary);
  const expectedIds = input.products.map((product) => product.productId);
  const receivedIds = parsed.products.map((product) => product.productId);
  if (receivedIds.length !== expectedIds.length || expectedIds.some((id) => !receivedIds.includes(id))) {
    throw new Error("Comparison summary returned products outside the grounded selection.");
  }
  const byId = new Map(parsed.products.map((product) => [product.productId, product]));
  return comparisonSummarySchema.parse({
    ...parsed,
    products: expectedIds.map((id) => byId.get(id))
  });
}
