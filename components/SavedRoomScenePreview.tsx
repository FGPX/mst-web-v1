import Image from "@/components/HighQualityImage";
import { products } from "@/lib/data";
import { roomSceneProductImage } from "@/lib/room-scene-assets";

export type PreviewSceneItem = {
  id: string;
  productId: string;
  x: number;
  y: number;
  rotation: number;
  viewIndex?: number;
  materialId?: string;
  color?: string;
  zIndex?: number;
  dimensions?: { widthMm: number; depthMm: number; heightMm: number };
};

export type PreviewScene = {
  backgroundId?: string;
  backgroundSrc?: string;
  hasLocalRoomPhoto?: boolean;
  sceneScale?: number;
  roomSize?: { widthMm?: number; lengthMm?: number };
  items?: PreviewSceneItem[];
};

export function SavedRoomScenePreview({ scene, compact = false }: { scene: PreviewScene; compact?: boolean }) {
  return <div className={`saved-room-scene-preview${compact ? " is-compact" : ""}`}>
    {scene.backgroundSrc ? <Image className="saved-room-scene-background" src={scene.backgroundSrc} alt="Saved room background" fill sizes={compact ? "33vw" : "80vw"} /> : <div className="saved-room-scene-neutral"><span /><i /></div>}
    <div className="saved-room-scene-shade" />
    {scene.items?.map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      if (!product) return null;
      const sceneScale = scene.sceneScale ?? 1;
      const relativeWidth = item.dimensions && scene.roomSize?.widthMm
        ? (item.dimensions.widthMm / scene.roomSize.widthMm) * 100 * sceneScale
        : (["sofa", "sectional"].includes(product.category) ? 42 : 22) * sceneScale;
      const aspectRatio = item.dimensions
        ? `${item.dimensions.widthMm} / ${item.dimensions.heightMm}`
        : (["sofa", "sectional"].includes(product.category) ? "16 / 7" : "1 / 1");
      const productImage = roomSceneProductImage(product.id, item);
      const isCutoutImage = productImage.toLowerCase().split("?")[0].endsWith(".png");
      return <div className="saved-room-scene-item" key={item.id} style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${relativeWidth}%`, aspectRatio, zIndex: item.zIndex ?? 2, transform: `translate(-50%, -100%) rotate(${item.rotation}deg)` }}>
        <Image src={productImage} alt={product.name} fill sizes={compact ? "20vw" : "45vw"} style={{ objectFit: isCutoutImage ? "contain" : "cover" }} />
      </div>;
    })}
    {scene.hasLocalRoomPhoto && !scene.backgroundSrc ? <small>Local room photo is not stored; products are shown on the neutral studio.</small> : null}
  </div>;
}
