"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { useState } from "react";
import { products, roomScenes } from "@/lib/data";
import { storage } from "@/lib/persistence";

export function ShoppableRoomsClient() {
  const [sceneProducts, setSceneProducts] = useState<Record<string, string[]>>(() => Object.fromEntries(roomScenes.map((scene) => [scene.id, scene.productIds])));
  const [notice, setNotice] = useState("");
  const replace = (sceneId: string, index: number, productId: string) => setSceneProducts((current) => ({
    ...current,
    [sceneId]: current[sceneId].map((id, itemIndex) => itemIndex === index ? productId : id)
  }));
  return <section className="section"><div className="container">
    <p className="eyebrow">Shoppable Rooms</p><h1 className="h2">Curated editorial room scenes.</h1>
    <p className="lead">Open hotspots, save individual pieces, replace a selection, or create a complete local project from the room.</p>
    {notice ? <p role="status" className="card card-body">{notice}</p> : null}
    <div className="grid grid-3">{roomScenes.map((scene) => {
      const ids = sceneProducts[scene.id];
      return <article className="card" key={scene.id}>
        <div className="shoppable-room-image">
          <Image src={scene.image} alt={`${scene.name} room scene`} width={900} height={560} />
          {ids.map((id, index) => {
            const product = products.find((item) => item.id === id);
            return product ? <Link className={`room-hotspot hotspot-${index + 1}`} aria-label={`View ${product.modelCode} in ${scene.name}`} href={`/furniture/${product.slug}`} key={`${id}-${index}`}>{index + 1}</Link> : null;
          })}
        </div>
        <div className="card-body"><h2>{scene.name}</h2>
          {ids.map((id, index) => {
            const product = products.find((item) => item.id === id);
            if (!product) return null;
            return <div className="shoppable-room-product" key={`${id}-${index}`}>
              <strong>{index + 1}. {product.modelCode}</strong><span>{product.subtitle}</span>
              <div className="chips"><button onClick={() => { storage.toggleProduct(product.id); setNotice(`${product.modelCode} saved to project.`); }}><Star size={14} /> Save</button><Link href={`/configurator/${product.slug}`}>Configure</Link><Link href="/materials">Materials</Link></div>
              <label>Replace<select value={id} onChange={(event) => replace(scene.id, index, event.target.value)}>{products.filter((item) => item.active && item.category === product.category).slice(0, 8).map((item) => <option value={item.id} key={item.id}>{item.modelCode}</option>)}</select></label>
            </div>;
          })}
          <div className="chips" style={{ marginTop: 14 }}>
            <button className="button ghost" onClick={() => {
              storage.saveRoomScene({ id: `curated-${scene.id}-${Date.now()}`, name: scene.name, productIds: ids, sourceSceneId: scene.id, createdAt: new Date().toISOString() });
              ids.forEach((id) => { if (!storage.savedProducts().includes(id)) storage.toggleProduct(id); });
              setNotice(`${scene.name} saved as a room project.`);
            }}><Plus size={15} /> Save complete room</button>
            <Link className="button primary" href="/my-musterring">Create project from scene</Link>
            <Link className="button consult" href="/handover">Continue with retailer</Link>
          </div>
        </div>
      </article>;
    })}</div>
  </div></section>;
}
