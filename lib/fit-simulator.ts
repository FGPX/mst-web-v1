import type { Product } from "./types";

export type Point = { x: number; y: number };
export type Placement = Point & { rotation: number };
export type RoomItemKind = "radiator" | "column" | "obstacle" | "furniture" | "restricted";
export type RoomItem = {
  id: string;
  kind: RoomItemKind;
  name: string;
  x: number;
  y: number;
  width: number;
  depth: number;
  locked?: boolean;
};
export type Door = {
  id: string;
  wall: "north" | "east" | "south" | "west";
  position: number;
  width: number;
  height: number;
  hinge: "left" | "right";
  opens: "inward" | "outward";
};
export type ProductComponent = {
  id: string;
  name: string;
  width: number;
  depth: number;
  height: number;
  removable: boolean;
};
export type GeometryIssue = {
  id: string;
  severity: "tight" | "conflict";
  message: string;
};

const EPSILON = 0.001;

export function calculateScale(roomWidth: number, roomLength: number, viewportWidth: number, viewportHeight: number, padding = 64) {
  const drawableWidth = Math.max(1, viewportWidth - padding * 2);
  const drawableHeight = Math.max(1, viewportHeight - padding * 2);
  return Math.min(drawableWidth / roomWidth, drawableHeight / roomLength);
}

export function normalizeRotation(rotation: number) {
  return ((rotation % 360) + 360) % 360;
}

export function rotatedCorners(placement: Placement, width: number, depth: number): Point[] {
  const radians = normalizeRotation(placement.rotation) * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  return [
    { x: -halfWidth, y: -halfDepth },
    { x: halfWidth, y: -halfDepth },
    { x: halfWidth, y: halfDepth },
    { x: -halfWidth, y: halfDepth }
  ].map((point) => ({
    x: placement.x + point.x * cos - point.y * sin,
    y: placement.y + point.x * sin + point.y * cos
  }));
}

function project(points: Point[], axis: Point) {
  const values = points.map((point) => point.x * axis.x + point.y * axis.y);
  return { min: Math.min(...values), max: Math.max(...values) };
}

export function polygonsOverlap(a: Point[], b: Point[]) {
  const polygons = [a, b];
  for (const polygon of polygons) {
    for (let index = 0; index < polygon.length; index += 1) {
      const next = polygon[(index + 1) % polygon.length];
      const edge = { x: next.x - polygon[index].x, y: next.y - polygon[index].y };
      const axis = { x: -edge.y, y: edge.x };
      const pa = project(a, axis);
      const pb = project(b, axis);
      if (pa.max <= pb.min + EPSILON || pb.max <= pa.min + EPSILON) return false;
    }
  }
  return true;
}

export function wallDistances(roomWidth: number, roomLength: number, placement: Placement, width: number, depth: number) {
  const corners = rotatedCorners(placement, width, depth);
  const xs = corners.map((point) => point.x);
  const ys = corners.map((point) => point.y);
  return {
    left: Math.min(...xs),
    right: roomWidth - Math.max(...xs),
    top: Math.min(...ys),
    bottom: roomLength - Math.max(...ys)
  };
}

export function collidesWithWall(roomWidth: number, roomLength: number, placement: Placement, width: number, depth: number) {
  return Object.values(wallDistances(roomWidth, roomLength, placement, width, depth)).some((distance) => distance < -EPSILON);
}

export function collidesWithItem(placement: Placement, width: number, depth: number, item: RoomItem) {
  const product = rotatedCorners(placement, width, depth);
  const obstacle = [
    { x: item.x, y: item.y },
    { x: item.x + item.width, y: item.y },
    { x: item.x + item.width, y: item.y + item.depth },
    { x: item.x, y: item.y + item.depth }
  ];
  return polygonsOverlap(product, obstacle);
}

function distanceToSegment(point: Point, a: Point, b: Point) {
  const lengthSquared = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  if (!lengthSquared) return Math.hypot(point.x - a.x, point.y - a.y);
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * (b.x - a.x) + (point.y - a.y) * (b.y - a.y)) / lengthSquared));
  return Math.hypot(point.x - (a.x + t * (b.x - a.x)), point.y - (a.y + t * (b.y - a.y)));
}

export function doorHingePoint(door: Door, roomWidth: number, roomLength: number): Point {
  const along = door.hinge === "left" ? door.position : door.position + door.width;
  if (door.wall === "north") return { x: along, y: 0 };
  if (door.wall === "south") return { x: along, y: roomLength };
  if (door.wall === "west") return { x: 0, y: along };
  return { x: roomWidth, y: along };
}

export function collidesWithDoorSwing(roomWidth: number, roomLength: number, placement: Placement, width: number, depth: number, door: Door) {
  if (door.opens === "outward") return false;
  const hinge = doorHingePoint(door, roomWidth, roomLength);
  const corners = rotatedCorners(placement, width, depth);
  const edges = corners.map((point, index) => [point, corners[(index + 1) % corners.length]] as const);
  return corners.some((point) => Math.hypot(point.x - hinge.x, point.y - hinge.y) <= door.width) ||
    edges.some(([a, b]) => distanceToSegment(hinge, a, b) <= door.width);
}

export function buildComponents(product: Product, removedParts: string[] = []): ProductComponent[] {
  const moduleCount = product.modular ? Math.max(2, Math.min(4, product.numberOfSeats || 3)) : 1;
  const components: ProductComponent[] = Array.from({ length: moduleCount }, (_, index) => ({
    id: `${product.id}-module-${index + 1}`,
    name: moduleCount === 1 ? "Assembled product" : `Module ${index + 1}`,
    width: Math.ceil(product.widthMm / moduleCount),
    depth: product.packageDimensions.depthMm,
    height: product.packageDimensions.heightMm,
    removable: moduleCount > 1
  }));
  if (!removedParts.includes("legs")) components.push({ id: "legs", name: "Attached legs", width: 180, depth: 180, height: 120, removable: true });
  if (!removedParts.includes("armrests")) components[0] = { ...components[0], width: components[0].width + 160, name: `${components[0].name} + armrest` };
  if (!removedParts.includes("backrests")) components[0] = { ...components[0], height: components[0].height + 140, name: `${components[0].name} + backrest` };
  return components;
}

export function largestComponent(components: ProductComponent[]) {
  return [...components].sort((a, b) => (b.width * b.depth * b.height) - (a.width * a.depth * a.height))[0];
}

export type DeliveryInputs = {
  entranceWidth: number;
  entranceHeight: number;
  hallwayWidth: number;
  turnWidth: number;
  staircaseWidth: number;
  elevatorWidth: number;
  elevatorDepth: number;
  elevatorHeight: number;
  roomDoorWidth: number;
  roomDoorHeight: number;
};

export function evaluateDelivery(components: ProductComponent[], input: DeliveryInputs) {
  const component = largestComponent(components);
  const minOpening = Math.min(component.width, component.depth);
  const passages = [
    { id: "entrance", name: "Entrance door", available: input.entranceWidth, required: minOpening, height: input.entranceHeight },
    { id: "hallway", name: "Hallway", available: input.hallwayWidth, required: minOpening },
    { id: "turn", name: "Tightest turn", available: input.turnWidth, required: Math.min(component.width, Math.hypot(component.depth, component.height)) },
    { id: "stairs", name: "Staircase", available: input.staircaseWidth, required: minOpening },
    { id: "room-door", name: "Room door", available: input.roomDoorWidth, required: minOpening, height: input.roomDoorHeight }
  ].map((passage) => {
    const heightConflict = passage.height !== undefined && passage.height > 0 && passage.height < Math.min(component.height, component.width);
    const delta = passage.available - passage.required;
    return {
      ...passage,
      status: (passage.available <= 0 || delta < 0 || heightConflict ? "conflict" : delta < 50 ? "tight" : "safe") as "safe" | "tight" | "conflict",
      message: passage.available <= 0 ? "Measurement missing" : heightConflict ? "Height may be insufficient" : delta < 0 ? `${Math.ceil(Math.abs(delta) / 10)} cm more width may be needed` : `${Math.floor(delta / 10)} cm spare width`
    };
  });
  if (input.elevatorWidth || input.elevatorDepth || input.elevatorHeight) {
    const orientations = [
      [component.width, component.depth, component.height],
      [component.depth, component.height, component.width],
      [component.height, component.width, component.depth]
    ];
    const fits = orientations.some(([width, depth, height]) => width <= input.elevatorWidth && depth <= input.elevatorDepth && height <= input.elevatorHeight);
    passages.push({
      id: "elevator",
      name: "Elevator",
      available: Math.min(input.elevatorWidth, input.elevatorDepth),
      required: minOpening,
      height: input.elevatorHeight,
      status: fits ? "safe" : "conflict",
      message: fits ? "Largest component fits in a tested orientation" : "No tested orientation clears all elevator dimensions"
    });
  }
  return {
    component,
    passages,
    narrowest: passages.filter((item) => item.available > 0).sort((a, b) => a.available - b.available)[0],
    status: passages.some((item) => item.status === "conflict") ? "conflict" as const : passages.some((item) => item.status === "tight") ? "tight" as const : "safe" as const
  };
}

export function analyzePlacement(roomWidth: number, roomLength: number, product: Product, placement: Placement, items: RoomItem[], doors: Door[]) {
  const issues: GeometryIssue[] = [];
  const distances = wallDistances(roomWidth, roomLength, placement, product.widthMm, product.depthMm);
  if (collidesWithWall(roomWidth, roomLength, placement, product.widthMm, product.depthMm)) {
    issues.push({ id: "wall", severity: "conflict", message: "The product crosses a room boundary." });
  } else if (Math.min(...Object.values(distances)) < 50) {
    issues.push({ id: "wall-clearance", severity: "tight", message: "Less than 5 cm remains between the product and a wall." });
  }
  for (const item of items) {
    if (collidesWithItem(placement, product.widthMm, product.depthMm, item)) {
      issues.push({ id: `item-${item.id}`, severity: "conflict", message: `${item.name} overlaps the product footprint.` });
    }
  }
  for (const door of doors) {
    if (collidesWithDoorSwing(roomWidth, roomLength, placement, product.widthMm, product.depthMm, door)) {
      issues.push({ id: `door-${door.id}`, severity: "conflict", message: "The product obstructs a door swing." });
    }
  }
  const frontClearance = distances.bottom;
  if (frontClearance < 600) issues.push({ id: "walking", severity: frontClearance < 300 ? "conflict" : "tight", message: `${Math.max(0, Math.round(frontClearance / 10))} cm walking clearance remains in front.` });
  if (product.functions.some((value) => /relax|reclin/i.test(value)) && distances.top < 250) {
    issues.push({ id: "recline", severity: "tight", message: "The backrest may need 25 cm clearance to recline." });
  }
  return {
    status: issues.some((item) => item.severity === "conflict") ? "conflict" as const : issues.length ? "tight" as const : "safe" as const,
    issues,
    distances
  };
}

export function suggestPlacements(roomWidth: number, roomLength: number, product: Product, items: RoomItem[], doors: Door[]) {
  const margin = 100;
  const candidates: Placement[] = [
    { x: roomWidth / 2, y: product.depthMm / 2 + margin, rotation: 0 },
    { x: roomWidth / 2, y: roomLength - product.depthMm / 2 - 700, rotation: 0 },
    { x: product.depthMm / 2 + margin, y: roomLength / 2, rotation: 90 },
    { x: roomWidth - product.depthMm / 2 - margin, y: roomLength / 2, rotation: 90 },
    { x: roomWidth / 2, y: roomLength / 2, rotation: 0 }
  ];
  return candidates
    .map((placement) => ({ placement, analysis: analyzePlacement(roomWidth, roomLength, product, placement, items, doors) }))
    .sort((a, b) => {
      const score = (value: typeof a) => value.analysis.issues.reduce((total, issue) => total + (issue.severity === "conflict" ? 10 : 1), 0);
      return score(a) - score(b);
    })
    .slice(0, 3);
}
