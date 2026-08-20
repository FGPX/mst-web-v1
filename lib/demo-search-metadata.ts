import type { Product } from "./types";

/**
 * Curated concept metadata used only to demonstrate the future PIM-connected
 * advisor. These values must always be labelled as illustrative in customer UI.
 */
export type DemoSearchMetadata = {
  colors?: string[];
  colorImages?: Record<string, string>;
  widthMm?: number;
  seatHeightMm?: number;
  numberOfSeats?: number;
  materialTypes?: Array<"fabric" | "leather">;
  styles?: string[];
  functions?: string[];
  layoutShapes?: NonNullable<Product["layoutShapes"]>;
  easyCare?: boolean;
};

export const demoSearchMetadata: Record<string, DemoSearchMetadata> = {
  "musterring-mr-230": {
    colors: ["light grey", "grey", "beige"],
    colorImages: {
      "light grey": "/musterring-catalog/mr-230/image-01.jpg",
      grey: "/musterring-catalog/mr-230/image-01.jpg"
    },
    widthMm: 2380, seatHeightMm: 460, numberOfSeats: 3,
    materialTypes: ["fabric"], styles: ["modern", "comfort"], functions: ["relax"], layoutShapes: ["straight"]
  },
  "musterring-mr-260": {
    colors: ["light grey", "grey", "beige", "red", "burgundy"], widthMm: 2320, seatHeightMm: 460, numberOfSeats: 4,
    materialTypes: ["fabric", "leather"], styles: ["modern", "family"], functions: ["modular", "relax"], layoutShapes: ["straight"]
  },
  "musterring-mr-280": {
    colors: ["beige", "taupe", "cream"], colorImages: { beige: "/musterring-catalog/mr-280/image-01.jpg" },
    widthMm: 2420, seatHeightMm: 460, numberOfSeats: 3, materialTypes: ["fabric", "leather"],
    styles: ["classic modern", "comfort"], functions: ["relax"], layoutShapes: ["straight"]
  },
  "musterring-mr-285": {
    colors: ["black", "charcoal"], colorImages: { black: "/musterring-catalog/mr-285/image-01.jpg" },
    widthMm: 2740, seatHeightMm: 460, numberOfSeats: 3, materialTypes: ["leather", "fabric"],
    styles: ["modern", "minimal"], functions: ["relax"], layoutShapes: ["straight", "l-shaped"]
  },
  "musterring-mr-9450": {
    colors: ["beige", "taupe", "stone", "charcoal"],
    colorImages: {
      beige: "/musterring-catalog/mr-9450/image-05.jpg",
      taupe: "/musterring-catalog/mr-9450/image-05.jpg",
      stone: "/musterring-catalog/mr-9450/image-05.jpg",
      charcoal: "/musterring-catalog/mr-9450/image-concept-charcoal.png"
    },
    widthMm: 3020, seatHeightMm: 460, numberOfSeats: 4,
    materialTypes: ["fabric", "leather"], styles: ["modern heritage", "editorial", "minimal"],
    functions: ["relax", "electric", "modular"], layoutShapes: ["straight", "l-shaped", "corner", "u-shaped"]
  }
};

export const demoSearchDisclaimer = "Illustrative concept metadata demonstrates the future PIM-connected experience and requires retailer confirmation.";

export function demoFactsFor(productId: string) {
  return demoSearchMetadata[productId];
}
