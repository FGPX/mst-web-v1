"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { Heart, Send, Share2, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { dealers, materials, products } from "@/lib/data";
import { materialImages } from "@/lib/material-assets";
import { stylistStyleLabel, type Project, type SavedRoomScene, type SavedStylistSet } from "@/lib/types";
import { storage } from "@/lib/persistence";
import { roomSceneProductImage } from "@/lib/room-scene-assets";
import { AlternativeFinderButton } from "./AlternativeFinderButton";
import { SavedRoomScenePreview } from "./SavedRoomScenePreview";

function readSavedContent() {
  const scenes = storage.roomScenes();
  const stylistSets = storage.stylistSets();
  const productIds = storage.savedProducts();
  return { scenes, stylistSets, productIds };
}

export function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [lead, setLead] = useState<Record<string, unknown> | null>(null);
  const [resourceCounts, setResourceCounts] = useState({ fitReports: 0, roomScenes: 0, stylistSets: 0, comparisons: 0, configurations: 0, materials: 0, requests: 0 });
  const [dealerId, setDealerId] = useState<string | null>(null);
  const [savedScenes, setSavedScenes] = useState<SavedRoomScene[]>([]);
  const [savedStylistSets, setSavedStylistSets] = useState<SavedStylistSet[]>([]);
  const [savedMaterialIds, setSavedMaterialIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const syncSavedContent = () => {
    const { scenes, stylistSets, productIds } = readSavedContent();
    setSavedScenes(scenes);
    setSavedStylistSets(stylistSets);
    setSavedIds(productIds);
    const materialIds = storage.savedMaterials();
    setSavedMaterialIds(materialIds);
    setResourceCounts({ fitReports: storage.fitReports().length, roomScenes: scenes.length, stylistSets: stylistSets.length, comparisons: storage.savedComparisons().length, configurations: storage.configurations().length, materials: materialIds.length, requests: storage.leads().length });
  };

  useEffect(() => {
    setProjects(storage.projects());
    syncSavedContent();
    setLead(storage.lastLead());
    setDealerId(storage.selectedDealer());
  }, []);

  const deleteScene = (sceneKey: string, sceneName: string) => {
    if (!window.confirm(`Delete "${sceneName}"? This saved room plan cannot be restored.`)) return;
    storage.deleteRoomScene(sceneKey);
    syncSavedContent();
  };

  const duplicateScene = (scene: SavedRoomScene) => {
    if (!window.confirm(`Create a copy of "${scene.name}"?`)) return;
    const timestamp = new Date().toISOString();
    const id = `room-view-${Date.now()}`;
    storage.saveRoomScene({ ...scene, id: `${id}-v1`, rootSceneId: id, parentVersionId: undefined, name: `${scene.name} Copy`, version: 1, createdAt: timestamp, updatedAt: timestamp });
    syncSavedContent();
  };

  const project = projects.find((item) => item.id === "project-room-composer") ?? projects.at(-1);
  const displayed = products.filter((product) => savedIds.includes(product.id));
  const preferredDealer = dealers.find((dealer) => dealer.id === dealerId);
  const savedMaterials = materials.filter((material) => savedMaterialIds.includes(material.id));
  const latestScenes = [...savedScenes.reduce((groups, scene) => {
    const key = scene.rootSceneId || scene.id;
    const current = groups.get(key);
    if (!current || scene.version > current.version) groups.set(key, scene);
    return groups;
  }, new Map<string, SavedRoomScene>()).values()];
  const createRoomHref = selectedProductIds.length
    ? `/room-composer?project=${encodeURIComponent(project?.id ?? "project-room-composer")}&${selectedProductIds.map((id) => `product=${encodeURIComponent(id)}`).join("&")}`
    : "";

  const removeMaterial = (materialId: string, materialName: string) => {
    if (!window.confirm(`Remove ${materialName} from your saved materials?`)) return;
    storage.toggleMaterial(materialId);
    syncSavedContent();
  };

  const removeProduct = (productId: string, productName: string) => {
    if (!window.confirm(`Remove ${productName} from your saved products?`)) return;
    if (storage.savedProducts().includes(productId)) storage.toggleProduct(productId);
    syncSavedContent();
  };

  return (
    <div className="stitch-project">
      <header className="container stitch-project-head">
        <div><p className="eyebrow">My Musterring · {project?.status ?? "Ideas Saved"}</p><h1>{project?.name ?? "Living Room Project"}</h1><p>{savedIds.length} saved products · {savedScenes.length} saved room views</p></div>
        <div><button><Share2 size={16} /> Share with designer</button><Link href="/handover"><Send size={16} /> Send to retailer</Link></div>
      </header>
      <div className="container">
        <div className="stitch-project-title"><h2>Saved Room Views</h2><Link href={`/room-composer?project=${encodeURIComponent(project?.id ?? "project-room-composer")}`}>Create another view</Link></div>
        <section className="stitch-room-view-grid">
          {latestScenes.length ? latestScenes.map((scene, index) => {
            const sceneKey = scene.id;
            const sceneProducts = [...new Set(scene.items.map((item) => item.productId))];
            const sceneName = scene.name || `Room view ${scene.version || index + 1}`;
            const href = `/my-musterring/room-scenes/${encodeURIComponent(sceneKey)}`;
            return <article className="stitch-room-view-card" key={sceneKey}>
              <Link href={href} aria-label={`Open ${sceneName}`}>
                <SavedRoomScenePreview scene={scene} compact />
                <div className="stitch-room-view-card-copy">
                  <small>Room view {scene.version ?? index + 1}</small>
                  <strong>{sceneName}</strong>
                  <span>{sceneProducts.length} product{sceneProducts.length === 1 ? "" : "s"} · {scene.planningMode === "accurate" ? "Accurate planning" : "Inspiration"}</span>
                </div>
              </Link>
              <div className="stitch-room-view-actions"><Link href={`/room-composer?scene=${encodeURIComponent(sceneKey)}&project=${encodeURIComponent(scene.projectId)}`}>Edit</Link><button type="button" onClick={() => duplicateScene(scene)}>Copy</button><Link href={`/handover?scene=${encodeURIComponent(sceneKey)}`}>Send</Link><button type="button" onClick={() => deleteScene(sceneKey, sceneName)}>Delete</button></div>
            </article>;
          }) : <div className="stitch-project-empty"><h3>No room views saved yet</h3><p>Save a view from Plan a Room and it will appear here.</p><Link href="/room-composer">Open Plan a Room</Link></div>}
        </section>
        <div className="stitch-project-title"><h2>Style Finder Sets</h2><Link href="/ai-stylist"><Sparkles size={16} /> Create another set</Link></div>
        <section className="stylist-saved-grid">
          {savedStylistSets.length ? savedStylistSets.map((set) => <article key={set.id}>
            <header><small>{set.roomType.replaceAll("-", " ")} · {stylistStyleLabel(set.style)}{set.preferences ? ` · ${set.preferences.spaceSize}` : ""}</small><h3>{set.name}</h3><p>{set.summary}</p></header>
            <div>{set.productIds.map((productId) => {
              const product = products.find((item) => item.id === productId);
              return product ? <Link href={`/furniture/${product.slug}`} key={product.id}><Image src={roomSceneProductImage(product.id)} alt={product.name} width={260} height={190} /><span><small>{product.modelCode}</small><strong>{product.name}</strong></span></Link> : null;
            })}</div>
          </article>) : <div className="stitch-project-empty"><h3>No Style Finder sets saved yet</h3><p>Answer the style quiz and save a coordinated set of catalogue products.</p><Link href="/ai-stylist">Open Style Finder</Link></div>}
        </section>
        <div className="stitch-project-title"><div><h2>Saved Products</h2><p>Select products, then create a room view with them already placed.</p></div>{createRoomHref ? <Link href={createRoomHref}>Create Room View ({selectedProductIds.length})</Link> : <span className="stitch-project-selection-hint">Select at least one product</span>}</div>
        <section className="stitch-project-products">
          {displayed.length ? displayed.map((product) => <article className={selectedProductIds.includes(product.id) ? "is-selected" : ""} key={product.id}>
            <label className="stitch-project-product-select"><input type="checkbox" checked={selectedProductIds.includes(product.id)} onChange={(event) => setSelectedProductIds((current) => event.target.checked ? [...new Set([...current, product.id])] : current.filter((id) => id !== product.id))} /><span>{selectedProductIds.includes(product.id) ? "Selected" : "Select for room"}</span></label>
            <Link href={`/furniture/${product.slug}`}><Image src={roomSceneProductImage(product.id)} alt={product.name} width={520} height={360} /><small>{product.modelCode}</small><strong>{product.name}</strong><span>Saved by you</span></Link>
            <button className="stitch-project-product-delete" type="button" aria-label={`Remove ${product.name} from saved products`} onClick={() => removeProduct(product.id, product.name)}><Trash2 aria-hidden="true" size={19} /></button>
            <AlternativeFinderButton productId={product.id} label="Discover More Like This" className="" />
          </article>) : <div className="stitch-project-empty"><h3>No products saved yet</h3><p>Only products you explicitly save will appear here.</p><Link href="/furniture">Explore furniture</Link></div>}
        </section>
        <div className="stitch-project-title" id="saved-materials"><h2>Saved Materials</h2><Link href="/materials"><Heart size={16} /> Explore materials</Link></div>
        <section className="stitch-saved-materials">
          {savedMaterials.length ? savedMaterials.map((material) => (
            <article key={material.id}>
              <div className="stitch-saved-material-image"><Image src={materialImages[material.id]} alt={`${material.name} material texture`} width={520} height={360} /></div>
              <div className="stitch-saved-material-copy">
                <small>{material.type} · {material.colorFamily}</small>
                <strong>{material.name}</strong>
                <p>{material.texture} · {material.composition}</p>
                <div className="stitch-saved-material-tags">{material.easyCare ? <span>Easy care</span> : null}{material.familyFriendly ? <span>Family friendly</span> : null}{material.petFriendly ? <span>Pet friendly</span> : null}</div>
                <div className="stitch-saved-material-actions"><Link href={`/handover?request=material&material=${encodeURIComponent(material.id)}`}>Request sample</Link><button type="button" onClick={() => removeMaterial(material.id, material.name)}><Trash2 size={14} /> Remove</button></div>
              </div>
            </article>
          )) : <div className="stitch-project-empty"><h3>No materials saved yet</h3><p>Use the heart on any material to keep it here for your project.</p><Link href="/materials">Explore materials</Link></div>}
        </section>
        <section className="stitch-project-resource-index" aria-label="Saved journey resources">
          <Link href="/furniture"><strong>{savedIds.length}</strong><span>Saved products</span></Link>
          <Link href={project ? `/my-musterring/projects/${project.id}` : "/my-musterring"}><strong>{resourceCounts.configurations}</strong><span>Configurations</span></Link>
          <Link href="/compare"><strong>{resourceCounts.comparisons}</strong><span>Comparisons</span></Link>
          <Link href="/room-composer"><strong>{resourceCounts.roomScenes}</strong><span>Room scenes</span></Link>
          <Link href="/ai-stylist"><strong>{resourceCounts.stylistSets}</strong><span>Style Finder sets</span></Link>
          <Link href="/materials"><strong>{resourceCounts.materials}</strong><span>Materials</span></Link>
          <Link href="/dealers"><strong>{preferredDealer?.name ?? "Select"}</strong><span>Preferred retailer</span></Link>
          <Link href="/handover"><strong>{resourceCounts.requests}</strong><span>Retailer requests</span></Link>
          <Link href="/analytics"><strong>View</strong><span>Website analytics</span></Link>
        </section>
        {lead ? <section className="card card-body" aria-label="Latest retailer request"><p className="eyebrow">Latest retailer request</p><h2>{String(lead.requestType)}</h2><p>Reference {String(lead.reference)} · {String(lead.appointment)}</p></section> : null}
      </div>
    </div>
  );
}
