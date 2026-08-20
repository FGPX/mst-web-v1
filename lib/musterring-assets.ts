import authorizedCatalog from "./generated/musterring-catalog.json";
import { demoFactsFor } from "./demo-search-metadata";

const authorizedProductImages = Object.fromEntries(
  authorizedCatalog.products.map((product) => [product.appProductId, product.images])
) as Record<string, string[]>;

const verifiedColourImages: Record<string, Record<string, string>> = {
  "musterring-justb-pm100": {
    beige: "/musterring-catalog/justb-pm100/image-01.jpg",
    cream: "/musterring-catalog/justb-pm100/image-01.jpg",
    white: "/musterring-catalog/justb-pm100/image-01.jpg"
  },
  "musterring-justb-pm200": {
    beige: "/musterring-catalog/justb-pm200/image-01.jpg",
    cream: "/musterring-catalog/justb-pm200/image-01.jpg",
    white: "/musterring-catalog/justb-pm200/image-01.jpg"
  },
  "musterring-mr-285": {
    black: "/musterring-catalog/mr-285/image-01.jpg"
  },
  "musterring-mr-260": {
    red: "/musterring-catalog/mr-260/image-08-hq.jpg",
    burgundy: "/musterring-catalog/mr-260/image-08-hq.jpg"
  }
};

const legacyProductImages: Record<string, string[]> = {
  p1: [
    "/test-assets/musterring/mr-2875/image-03.jpg",
    "/test-assets/musterring/mr-2875/image-04.jpg",
    "/test-assets/musterring/mr-2875/image-05.jpg",
    "/test-assets/musterring/mr-2875/image-07.jpg"
  ],
  p2: [
    "/test-assets/musterring/mr-1370/image-03.jpg",
    "/test-assets/musterring/mr-1370/image-05.jpg",
    "/test-assets/musterring/mr-1370/image-07.jpg"
  ],
  p3: [
    "/test-assets/musterring/mr-9420/image-03.jpg",
    "/test-assets/musterring/mr-9420/image-05.jpg",
    "/test-assets/musterring/mr-9420/image-08.jpg"
  ],
  p4: [
    "/test-assets/musterring/mr-2490/image-04.jpg",
    "/test-assets/musterring/mr-2490/image-07.jpg"
  ],
  p5: [
    "/test-assets/musterring/sofas-armchairs/image-04.jpg",
    "/test-assets/musterring/sofas-armchairs/image-05.jpg"
  ],
  p6: [
    "/test-assets/musterring/mr-270/image-03.jpg",
    "/test-assets/musterring/mr-270/image-05.jpg",
    "/test-assets/musterring/mr-270/image-08.jpg"
  ],
  p7: [
    "/test-assets/musterring/mr-2490/image-07.jpg",
    "/test-assets/musterring/mr-2490/image-08.jpg"
  ],
  p8: [
    "/test-assets/musterring/sofas-armchairs/image-05.jpg",
    "/test-assets/musterring/sofas-armchairs/image-03.jpg"
  ],
  p9: [
    "/test-assets/musterring/mr-1370/image-05.jpg",
    "/test-assets/musterring/mr-1370/image-08.jpg"
  ],
  p10: [
    "/test-assets/musterring/furniture/image-03.jpg",
    "/test-assets/musterring/sofas-armchairs/image-04.jpg"
  ],
  p11: [
    "/test-assets/musterring/mr-9420/image-05.jpg",
    "/test-assets/musterring/mr-9420/image-07.jpg"
  ],
  p12: [
    "/test-assets/musterring/furniture/image-05.jpg",
    "/test-assets/musterring/furniture/image-07.jpg"
  ]
};

export function productImages(productId: string) {
  return authorizedProductImages[productId] ?? legacyProductImages[productId] ?? authorizedProductImages.p1;
}

export function hasVerifiedColourPresentation(productId: string, color: string) {
  return Boolean(verifiedColourImages[productId]?.[color.toLowerCase()]);
}

export function hasDemoColourPresentation(productId: string, color: string) {
  return Boolean(demoFactsFor(productId)?.colorImages?.[color.toLowerCase()]);
}

export function productImageForColors(productId: string, requestedColors: string[]) {
  const verified = verifiedColourImages[productId];
  const demo = demoFactsFor(productId)?.colorImages;
  const matchedColor = requestedColors.find((color) => verified?.[color.toLowerCase()] || demo?.[color.toLowerCase()]);
  return {
    src: matchedColor ? verified?.[matchedColor.toLowerCase()] ?? demo![matchedColor.toLowerCase()] : productImages(productId)[0],
    matchedColor
  };
}
