"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { materials, products } from "@/lib/data";
import { storage } from "@/lib/persistence";
import { roomSceneProductImage } from "@/lib/room-scene-assets";
import { SavedRoomScenePreview, type PreviewScene, type PreviewSceneItem } from "./SavedRoomScenePreview";

type SceneItem = PreviewSceneItem & { scale?: number };

type SavedRoomScene = PreviewScene & {
  id?: string;
  name?: string;
  version?: number;
  planningMode?: string;
  createdAt?: string;
  items?: SceneItem[];
};

export function RoomSceneDetailClient({ sceneKey }: { sceneKey: string }) {
  const router = useRouter();
  const [scene, setScene] = useState<SavedRoomScene | null | undefined>(undefined);

  useEffect(() => {
    const scenes = storage.roomScenes() as SavedRoomScene[];
    const indexMatch = /^index-(\d+)$/.exec(sceneKey);
    setScene(indexMatch ? scenes[Number(indexMatch[1])] ?? null : scenes.find((item) => item.id === sceneKey) ?? null);
  }, [sceneKey]);

  const deleteScene = () => {
    if (!scene) return;
    const sceneName = scene.name ?? `Room view ${scene.version ?? ""}`.trim();
    if (!window.confirm(`Delete "${sceneName}"? This saved room plan cannot be restored.`)) return;
    storage.deleteRoomScene(sceneKey);
    router.push("/my-musterring");
  };

  if (scene === undefined) return <main className="container stitch-room-view-detail"><p>Loading saved room view…</p></main>;
  if (!scene) return <main className="container stitch-room-view-detail"><p className="eyebrow">Saved room view</p><h1>View not found</h1><Link href="/my-musterring">Back to My Project</Link></main>;

  return (
    <main className="container stitch-room-view-detail">
      <div className="stitch-room-view-detail-head">
        <div><p className="eyebrow">Saved Room View · Version {scene.version ?? "—"}</p><h1>{scene.name ?? "Living Room Concept"}</h1><p>{scene.items?.length ?? 0} saved items · {scene.planningMode === "accurate" ? "Accurate planning" : "Inspiration mode"} · Visual scale {Math.round((scene.sceneScale ?? 1) * 100)}%</p></div>
        <div><Link href="/my-musterring">Back to My Project</Link><Link href="/room-composer">Open Plan a Room</Link><button className="stitch-room-view-delete" type="button" onClick={deleteScene}>Delete plan</button></div>
      </div>
      <SavedRoomScenePreview scene={scene} />
      {scene.roomSize?.widthMm && scene.roomSize.lengthMm ? <p className="stitch-room-view-room-size">Saved room: {Math.round(scene.roomSize.widthMm / 10)} × {Math.round(scene.roomSize.lengthMm / 10)} cm</p> : null}
      <section className="stitch-room-view-products" aria-label="Products in this saved room view">
        {scene.items?.length ? scene.items.map((item, index) => {
          const product = products.find((candidate) => candidate.id === item.productId);
          if (!product) return null;
          const material = materials.find((candidate) => candidate.id === item.materialId);
          return <article key={item.id || `${item.productId}-${index}`}>
            <Image src={roomSceneProductImage(product.id, item)} alt={product.name} width={520} height={380} />
            <div><small>{product.modelCode}</small><h2>{product.name}</h2><p>{product.subtitle}</p><dl>
              <div><dt>Dimensions</dt><dd>{item.dimensions ? `${Math.round(item.dimensions.widthMm / 10)} × ${Math.round(item.dimensions.depthMm / 10)} × ${Math.round(item.dimensions.heightMm / 10)} cm` : "Retailer confirmation required"}</dd></div>
              <div><dt>Material</dt><dd>{material?.name ?? item.materialId ?? "Not selected"}</dd></div>
              <div><dt>Color</dt><dd>{item.color ?? "Not selected"}</dd></div>
              <div><dt>Category</dt><dd>{product.category.replaceAll("-", " ")}</dd></div>
              <div><dt>Functions</dt><dd>{product.functions.length ? product.functions.join(", ") : "No functions recorded"}</dd></div>
            </dl><Link href={`/furniture/${product.slug}`}>View product details</Link></div>
          </article>;
        }) : <div className="stitch-project-empty"><h2>No products in this view</h2></div>}
      </section>
    </main>
  );
}
