"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { ArrowRight, Check, Layers3, Plus } from "lucide-react";
import { useState } from "react";
import { products, roomScenes } from "@/lib/data";
import { storage } from "@/lib/persistence";

const sceneCopy: Record<string, { eyebrow: string; description: string }> = {
  "scene-1": {
    eyebrow: "Warm and natural",
    description: "A calm living room built around soft neutrals, warm timber and comfortable everyday seating."
  },
  "scene-2": {
    eyebrow: "Graphic city living",
    description: "A confident urban look with clean lines, strong contrast and flexible seating choices."
  },
  "scene-3": {
    eyebrow: "Soft modular comfort",
    description: "A light, relaxed setting with generous comfort and a layout that can adapt to the room."
  }
};

const hotspotPositions: Record<string, Array<{ left: string; top: string }>> = {
  "scene-1": [{ left: "77%", top: "63%" }, { left: "25%", top: "68%" }, { left: "54%", top: "57%" }],
  "scene-2": [{ left: "51%", top: "66%" }, { left: "72%", top: "69%" }],
  "scene-3": [{ left: "53%", top: "62%" }, { left: "20%", top: "58%" }]
};

export function ShoppableRoomsClient() {
  const [notice, setNotice] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const saveRoom = (sceneId: string, sceneName: string, ids: string[]) => {
    if (!window.confirm(`Save the complete ${sceneName} selection as a room project?`)) return;
    storage.saveRoomScene({
      id: `curated-${sceneId}-${Date.now()}`,
      name: sceneName,
      productIds: ids,
      sourceSceneId: sceneId,
      createdAt: new Date().toISOString()
    });
    ids.forEach((id) => {
      if (!storage.savedProducts().includes(id)) storage.toggleProduct(id);
    });
    setNotice(`${sceneName} was saved as a room project.`);
  };

  return (
    <section className="shoppable-showcase" aria-labelledby="shoppable-heading">
      <div className="simple-container">
        <header className="shoppable-heading">
          <div>
            <span className="simple-kicker">Shoppable rooms</span>
            <h2 id="shoppable-heading">Start with a complete room.</h2>
          </div>
          <p>Choose a completed room, use the numbered markers to identify each product, then save the complete room to your project.</p>
        </header>

        {notice ? <p role="status" className="shoppable-notice"><Check size={17} /> {notice}</p> : null}

        <div className="shoppable-scene-grid">
          {roomScenes.map((scene) => {
            const ids = scene.productIds;
            const copy = sceneCopy[scene.id];
            return (
              <article className="shoppable-scene" key={scene.id}>
                <div className="shoppable-room-image">
                  <Image
                    src={scene.image}
                    alt={`${scene.name} interior inspiration`}
                    fill
                    sizes="(max-width: 820px) 100vw, 50vw"
                    style={{ objectFit: "contain" }}
                  />
                  <div className="shoppable-image-shade" />
                  <span className="shoppable-scene-count"><Layers3 size={15} /> {ids.length} suggestions</span>
                  <div className="shoppable-image-title">
                    <small>{copy?.eyebrow ?? "Room inspiration"}</small>
                    <h3>{scene.name}</h3>
                  </div>
                  {ids.map((id, index) => {
                    const product = products.find((item) => item.id === id);
                    const position = hotspotPositions[scene.id]?.[index];
                    return product && position ? (
                      <button
                        className={`shoppable-room-hotspot ${selectedSlot === `${scene.id}-${index}` ? "is-selected" : ""}`}
                        style={position}
                        aria-label={`Show product ${index + 1}`}
                        onClick={() => setSelectedSlot(`${scene.id}-${index}`)}
                        key={`${scene.id}-${index}-${id}`}
                      >
                        {index + 1}
                        {selectedSlot === `${scene.id}-${index}` ? <span>{product.modelCode}<small>{product.name}</small></span> : null}
                      </button>
                    ) : null;
                  })}
                </div>

                <div className="shoppable-scene-body">
                  <p className="shoppable-scene-description">{copy?.description}</p>
                  <div className="shoppable-product-list">
                    {ids.map((id, index) => {
                      const product = products.find((item) => item.id === id);
                      if (!product) return null;
                      return (
                        <article id={`${scene.id}-product-${index}`} className={`shoppable-room-product ${selectedSlot === `${scene.id}-${index}` ? "is-selected" : ""}`} key={`${id}-${index}`} onClick={() => setSelectedSlot(`${scene.id}-${index}`)}>
                          <span className="shoppable-product-number">{String(index + 1).padStart(2, "0")}</span>
                          <div className="shoppable-product-copy">
                            <small>{product.category.replace("-", " ")}</small>
                            <strong>{product.modelCode} — {product.name}</strong>
                            <span>{product.subtitle}</span>
                          </div>
                          <Link className="shoppable-view-product" href={`/furniture/${product.slug}`}>View product <ArrowRight size={14} /></Link>
                        </article>
                      );
                    })}
                  </div>

                  <div className="shoppable-scene-actions">
                    <button className="shoppable-save-room" onClick={() => saveRoom(scene.id, scene.name, ids)}>
                      <Plus size={16} /> Save complete room
                    </button>
                    <Link href="/my-musterring">Open My Project <ArrowRight size={16} /></Link>
                    <Link href="/handover">Continue with retailer</Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
