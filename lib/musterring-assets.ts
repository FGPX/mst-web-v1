import authorizedCatalog from "./generated/musterring-catalog.json";

const authorizedProductImages = Object.fromEntries(
  authorizedCatalog.products.map((product) => [product.appProductId, product.images])
) as Record<string, string[]>;

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
