import type { Product } from "@/lib/types";
import { StitchProductCard } from "./stitch/StitchProductCard";

export function ProductCard({ product, explanation, imageOverride }: { product: Product; explanation?: string; imageOverride?: string }) {
  return <StitchProductCard product={product} explanation={explanation} imageOverride={imageOverride} />;
}
