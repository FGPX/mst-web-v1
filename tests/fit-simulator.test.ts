import { describe, expect, it } from "vitest";
import { products } from "@/lib/data";
import {
  analyzePlacement, buildComponents, calculateScale, collidesWithDoorSwing, collidesWithItem,
  collidesWithWall, evaluateDelivery, suggestPlacements, wallDistances, type Door, type RoomItem
} from "@/lib/fit-simulator";

const product = products.find((item) => item.slug === "mr-2875") ?? products[0];
const door: Door = { id: "d", wall: "south", position: 900, width: 850, height: 2000, hinge: "left", opens: "inward" };

describe("room simulator geometry", () => {
  it("calculates a contained scale for different room aspect ratios", () => {
    expect(calculateScale(4000, 5500, 800, 600)).toBeCloseTo(472 / 5500);
    expect(calculateScale(8000, 3000, 800, 600)).toBeCloseTo(672 / 8000);
  });

  it("detects and clears wall collisions", () => {
    expect(collidesWithWall(4000, 5500, { x: 200, y: 200, rotation: 0 }, product.widthMm, product.depthMm)).toBe(true);
    expect(collidesWithWall(4000, 5500, { x: 2000, y: 2750, rotation: 0 }, product.widthMm, product.depthMm)).toBe(false);
  });

  it("reports exact wall distances for an unrotated product", () => {
    const distances = wallDistances(4000, 5500, { x: 2000, y: 2750, rotation: 0 }, 2000, 1000);
    expect(distances).toEqual({ left: 1000, right: 1000, top: 2250, bottom: 2250 });
  });

  it("detects overlap with room objects", () => {
    const item: RoomItem = { id: "c", kind: "column", name: "Column", x: 1800, y: 2500, width: 400, depth: 400 };
    expect(collidesWithItem({ x: 2000, y: 2750, rotation: 15 }, 2000, 1000, item)).toBe(true);
  });

  it("checks inward door swing but ignores outward swing", () => {
    const placement = { x: 1400, y: 4800, rotation: 0 };
    expect(collidesWithDoorSwing(4000, 5500, placement, 1200, 800, door)).toBe(true);
    expect(collidesWithDoorSwing(4000, 5500, placement, 1200, 800, { ...door, opens: "outward" })).toBe(false);
  });

  it("surfaces walking-clearance warnings independently of wall overlap", () => {
    const result = analyzePlacement(4000, 3000, { ...product, widthMm: 1800, depthMm: 900 }, { x: 2000, y: 2000, rotation: 0 }, [], []);
    expect(result.issues.some((issue) => issue.id === "walking")).toBe(true);
  });
});

describe("module and delivery path checks", () => {
  it("splits modular products and identifies removable parts", () => {
    const components = buildComponents({ ...product, modular: true, numberOfSeats: 3 });
    expect(components.filter((item) => item.id.includes("module"))).toHaveLength(3);
    expect(components.some((item) => item.removable)).toBe(true);
  });

  it("uses the largest delivery component rather than assembled dimensions", () => {
    const components = buildComponents({ ...product, modular: true, numberOfSeats: 3 }, ["legs", "armrests", "backrests"]);
    const result = evaluateDelivery(components, { entranceWidth: 900, entranceHeight: 2200, hallwayWidth: 900, turnWidth: 1300, staircaseWidth: 900, elevatorWidth: 0, elevatorDepth: 0, elevatorHeight: 0, roomDoorWidth: 900, roomDoorHeight: 2200 });
    expect(result.component.width).toBeLessThan(product.widthMm);
    expect(result.passages.find((item) => item.id === "entrance")?.status).not.toBe("conflict");
  });

  it("fails an elevator when no component orientation clears all dimensions", () => {
    const result = evaluateDelivery(buildComponents(product), { entranceWidth: 2000, entranceHeight: 2500, hallwayWidth: 2000, turnWidth: 2500, staircaseWidth: 2000, elevatorWidth: 500, elevatorDepth: 500, elevatorHeight: 500, roomDoorWidth: 2000, roomDoorHeight: 2500 });
    expect(result.passages.find((item) => item.id === "elevator")?.status).toBe("conflict");
  });

  it("returns at most three deterministic placement suggestions sorted by quality", () => {
    const results = suggestPlacements(5000, 6000, product, [], [door]);
    expect(results).toHaveLength(3);
    const weight = (status: string) => status === "safe" ? 0 : status === "tight" ? 1 : 10;
    expect(weight(results[0].analysis.status)).toBeLessThanOrEqual(weight(results[2].analysis.status));
  });
});
