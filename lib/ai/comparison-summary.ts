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
  const differencePriority = ["Seat construction", "Motorised function", "Dining level", "Visual style", "Reference format", "Height options", "Tabletop shapes", "Tabletop materials", "Planning range", "Care profile", "Design detail", "Seat Height", "Seat Depth", "Reference configuration"];
  const distinctiveDetailFor = (product: (typeof parsed.products)[number]) => differencePriority
    .map((label) => product.verifiedDetails.find((item) => item.label === label))
    .find((item) => item && parsed.products.some((other) => other.productId !== product.productId
      && other.verifiedDetails.find((candidate) => candidate.label === item.label)?.value !== item.value));
  const isFeaturedDiningComparison = parsed.products.length === 2
    && parsed.products.some((product) => product.productId === "musterring-helana")
    && parsed.products.some((product) => product.productId === "musterring-justb-sp100");

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
    const comfortFact = detail("Seat construction") ?? detail("Upholstery choice")
      ?? detail("Dining level") ?? detail("Visual style") ?? detail("Reference format")
      ?? detail("Height options") ?? detail("Tabletop shapes") ?? detail("Tabletop materials")
      ?? detail("Planning range") ?? detail("Care profile") ?? detail("Design detail");
    const functionFact = detail("Motorised function")
      ?? (product.verifiedFunctions.length ? product.verifiedFunctions.join(", ") : "Functions vary by configuration");
    const keyFact = functionFact || comfortFact || specificationFact
      || (product.verifiedModular ? "Verified modular system" : "Other specifications vary by configuration");
    const distinctiveDetail = distinctiveDetailFor(product);
    const regularSummary = product.verifiedWidthCm !== null && distinctiveDetail
      ? `${product.verifiedWidthCm} cm wide — ${distinctiveDetail.value}.`
      : product.verifiedWidthCm !== null
        ? `${product.verifiedWidthCm} cm wide${product.verifiedModular ? " modular" : ""} ${product.category}.`
        : distinctiveDetail
          ? `${distinctiveDetail.label}: ${distinctiveDetail.value}.`
          : product.verifiedModular
            ? `Modular ${product.category}.${materialCopy}`
            : `Specifications depend on the selected configuration.${materialCopy}`;
    const conciseSummary = isFeaturedDiningComparison
      ? product.productId === "musterring-justb-sp100"
        ? "77 cm high standard-height reference with a clean concrete-look or solid-oak tabletop."
        : "96 cm high counter-height reference with coordinated bar seating and a warm oak-and-leather character."
      : regularSummary;

    return {
      productId: product.productId,
      summary: conciseSummary,
      bestFor: product.comparisonHighlights[0]
        ?? (product.verifiedSmallSpaceSuitable ? "Verified for compact room planning" : "Compare with your room requirements"),
      facts: [
        `${dimensionFact} · ${seatingFact}`,
        keyFact
      ].filter(Boolean).slice(0, 2)
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
    widths.length > 1 && new Set(widths).size > 1 ? `Verified width range: ${Math.min(...widths)}–${Math.max(...widths)} cm` : "",
    seats.length > 1 ? `Verified capacity range: ${Math.min(...seats)}–${Math.max(...seats)} seats` : "",
    detailComparison("Seat Height", "Seat heights"),
    detailComparison("Seat construction", "Seat construction"),
    detailComparison("Tabletop shapes", "Tabletop formats"),
    detailComparison("Tabletop materials", "Tabletop materials"),
    detailComparison("Dining level", "Dining concepts"),
    detailComparison("Reference format", "Reference formats"),
    modularCount ? `${modularCount} verified modular option${modularCount === 1 ? "" : "s"}` : "",
    `${parsed.products.filter((product) => product.verifiedFunctions.length).length} with verified function data`
  ].filter(Boolean).slice(0, 2);
  const recommendation = isFeaturedDiningComparison
    ? "Choose JUSTB! SP100 for a familiar dining posture, flexible everyday use and a crisp modern look. Choose HELANA when you want the table to become a more expressive social hub, with counter-height seating and a warmer, more atmospheric material palette. Because both reference tops are 200 × 100 cm, the deciding factor is dining experience and visual character—not footprint. Confirm the preferred height and final configuration with a Musterring retailer."
    : `${parsed.products.map((product) => {
    const distinctiveDetail = distinctiveDetailFor(product);
    const isMoreCompact = narrowest?.productId === product.productId
      && widthProducts.some((other) => other.verifiedWidthCm! > product.verifiedWidthCm!);
    if (isMoreCompact) return `Choose ${product.modelCode} when space is the priority (${product.verifiedWidthCm} cm wide).`;
    if (distinctiveDetail) return `Choose ${product.modelCode} for ${distinctiveDetail.value.replace(/[.!?]+$/, "").replace(/^./, (character) => character.toLowerCase())}.`;
    if (product.verifiedSeatCount !== null && highestCapacity?.productId === product.productId) return `Choose ${product.modelCode} when verified seating capacity is the priority.`;
    if (product.verifiedModular) return `Choose ${product.modelCode} for modular planning.`;
    return `Consider ${product.modelCode} after confirming its exact configuration.`;
    }).join(" ")} Confirm the final configuration and room fit with a Musterring retailer.`;

  return comparisonSummarySchema.parse({ products, glance, recommendation });
}

export function validateComparisonSummary(
  summary: ComparisonSummary,
  input: ComparisonSummaryInput
): ComparisonSummary {
  const parsed = comparisonSummarySchema.parse(summary);
  const baseline = deterministicComparisonSummary(input);
  const expectedIds = input.products.map((product) => product.productId);
  const receivedIds = parsed.products.map((product) => product.productId);
  if (receivedIds.length !== expectedIds.length || expectedIds.some((id) => !receivedIds.includes(id))) {
    throw new Error("Comparison summary returned products outside the grounded selection.");
  }
  const byId = new Map(parsed.products.map((product) => [product.productId, product]));
  const baselineById = new Map(baseline.products.map((product) => [product.productId, product]));
  const normalizedSummaries = parsed.products.map((product) => product.summary.trim().toLocaleLowerCase());
  const hasDuplicateSummaries = new Set(normalizedSummaries).size !== normalizedSummaries.length;
  const isFeaturedDiningComparison = input.products.length === 2
    && input.products.some((product) => product.productId === "musterring-helana")
    && input.products.some((product) => product.productId === "musterring-justb-sp100");
  const recommendationMentionsEveryProduct = input.products.every((product) =>
    parsed.recommendation.toLocaleLowerCase().includes(product.modelCode.toLocaleLowerCase())
  );
  const recommendation = !isFeaturedDiningComparison && recommendationMentionsEveryProduct && parsed.recommendation.trim().split(/\s+/).length <= 80
    ? parsed.recommendation
    : baseline.recommendation;
  return comparisonSummarySchema.parse({
    ...parsed,
    products: expectedIds.map((id) => ({
      ...byId.get(id)!,
      summary: !isFeaturedDiningComparison && !hasDuplicateSummaries && byId.get(id)!.summary.trim().split(/\s+/).length <= 20
        ? byId.get(id)!.summary
        : baselineById.get(id)!.summary,
      bestFor: baselineById.get(id)!.bestFor,
      facts: baselineById.get(id)!.facts
    })),
    glance: baseline.glance,
    recommendation
  });
}
