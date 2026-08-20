import type { Product } from "@/lib/types";
import { StitchProductCard } from "./stitch/StitchProductCard";

export function ProductCard({ product, explanation, imageOverride, imageNote, showMeta, showCompare, compareSelected, onCompare }: { product: Product; explanation?: string; imageOverride?: string; imageNote?: string; showMeta?: boolean; showCompare?: boolean; compareSelected?: boolean; onCompare?: () => void }) {
  return <StitchProductCard product={product} explanation={explanation} imageOverride={imageOverride} imageNote={imageNote} showMeta={showMeta} showCompare={showCompare} compareSelected={compareSelected} onCompare={onCompare} />;
}
