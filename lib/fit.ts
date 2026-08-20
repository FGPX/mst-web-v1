import type { Product } from "./types";

export type FitInputs = {
  roomWidthMm: number;
  roomLengthMm: number;
  roomHeightMm: number;
  doorWidthMm: number;
  doorHeightMm: number;
  hallwayWidthMm: number;
  staircaseWidthMm: number;
  staircaseTurningMm: number;
  elevatorWidthMm: number;
  elevatorDepthMm: number;
  elevatorHeightMm: number;
};

export function checkFit(product: Product, input: FitInputs) {
  const reasons: string[] = [];
  if (input.roomWidthMm < product.widthMm || input.roomLengthMm < product.depthMm) reasons.push("Room placement may be too tight for the assembled dimensions.");
  if (input.doorWidthMm < product.packageDimensions.minOpeningMm) reasons.push("Door opening is below the minimum package clearance.");
  if (input.doorHeightMm < product.packageDimensions.heightMm) reasons.push("Door height may not clear the packaged module.");
  if (input.hallwayWidthMm < product.packageDimensions.minOpeningMm) reasons.push("Hallway width is a potential delivery path conflict.");
  if (input.staircaseWidthMm && input.staircaseWidthMm < product.packageDimensions.minOpeningMm) reasons.push("Staircase width is below the recommended clearance.");
  if (input.elevatorWidthMm && (input.elevatorWidthMm < product.packageDimensions.widthMm || input.elevatorDepthMm < product.packageDimensions.depthMm)) reasons.push("Elevator dimensions may not accept the largest package.");
  const status = reasons.length === 0 ? "likely" : reasons.length <= 2 ? "potential-conflict" : "unlikely";
  return {
    status,
    headline: status === "likely" ? "Likely to fit based on the measurements provided." : status === "potential-conflict" ? "Potential conflict based on the measurements provided." : "Unlikely to fit based on the measurements provided.",
    reasons,
    minimumRequiredClearanceMm: product.packageDimensions.minOpeningMm,
    dimensionStatus: product.verifiedFacts.dimensions ? "verified" as const : "demo-reference" as const,
    referenceConfiguration: product.referenceConfiguration?.name ?? null,
    requiresRetailerConfirmation: !product.verifiedFacts.dimensions || product.entityLevel === "programme"
  };
}
