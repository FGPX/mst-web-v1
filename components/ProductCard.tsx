import type { Product } from "@/lib/types";
import { StitchProductCard } from "./stitch/StitchProductCard";

export function ProductCard({ product, explanation, imageOverride, imageNote, showMeta }: { product: Product; explanation?: string; imageOverride?: string; imageNote?: string; showMeta?: boolean }) {
  return <StitchProductCard product={product} explanation={explanation} imageOverride={imageOverride} imageNote={imageNote} showMeta={showMeta} />;
}
