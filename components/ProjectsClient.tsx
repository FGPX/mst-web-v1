"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { MessageSquare, Send, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { dealers, products } from "@/lib/data";
import type { Project } from "@/lib/types";
import { storage } from "@/lib/persistence";
import { roomSceneProductImage } from "@/lib/room-scene-assets";
import { AlternativeFinderButton } from "./AlternativeFinderButton";
import { SavedRoomScenePreview, type PreviewScene } from "./SavedRoomScenePreview";

type SavedRoomScene = PreviewScene & {
  id?: string;
  name?: string;
  version?: number;
  planningMode?: string;
  createdAt?: string;
};

function readSavedContent() {
  const scenes = storage.roomScenes() as SavedRoomScene[];
  const productIds = [...new Set([
    ...storage.savedProducts(),
    ...scenes.flatMap((scene) => scene.items?.map((item) => item.productId) ?? [])
  ])];
  return { scenes, productIds };
}

export function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [lead, setLead] = useState<Record<string, unknown> | null>(null);
  const [resourceCounts, setResourceCounts] = useState({ fitReports: 0, roomScenes: 0, comparisons: 0, configurations: 0, materials: 0, requests: 0 });
  const [dealerId, setDealerId] = useState<string | null>(null);
  const [savedScenes, setSavedScenes] = useState<SavedRoomScene[]>([]);

  const syncSavedContent = () => {
    const { scenes, productIds } = readSavedContent();
    setSavedScenes(scenes);
    setSavedIds(productIds);
    setResourceCounts({ fitReports: storage.fitReports().length, roomScenes: scenes.length, comparisons: storage.comparisons().length, configurations: storage.configurations().length, materials: storage.savedMaterials().length, requests: storage.leads().length });
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

  const project = projects.find((item) => item.id === "project-room-composer") ?? projects.at(-1);
  const displayed = products.filter((product) => savedIds.includes(product.id));
  const preferredDealer = dealers.find((dealer) => dealer.id === dealerId);
  const fitHref = displayed[0] ? `/will-it-fit/${displayed[0].slug}` : "/room-composer";

  return (
    <div className="stitch-project">
      <header className="container stitch-project-head">
        <div><p className="eyebrow">My Musterring · {project?.status ?? "Ideas Saved"}</p><h1>{project?.name ?? "Living Room Project"}</h1><p>{savedIds.length} saved products · {savedScenes.length} saved room views</p></div>
        <div><button><Share2 size={16} /> Share with designer</button><Link href="/handover"><Send size={16} /> Send to retailer</Link></div>
      </header>
      <div className="container">
        <div className="stitch-project-title"><h2>Saved Room Views</h2><Link href="/room-composer">Create another view</Link></div>
        <section className="stitch-room-view-grid">
          {savedScenes.length ? savedScenes.map((scene, index) => {
            const sceneKey = scene.id ?? `index-${index}`;
            const sceneProducts = [...new Set(scene.items?.map((item) => item.productId) ?? [])];
            const sceneName = scene.name ?? `Room view ${scene.version ?? index + 1}`;
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
              <div className="stitch-room-view-actions"><Link href={href}>Open plan</Link><button type="button" onClick={() => deleteScene(sceneKey, sceneName)}>Delete plan</button></div>
            </article>;
          }) : <div className="stitch-project-empty"><h3>No room views saved yet</h3><p>Save a view from Plan a Room and it will appear here.</p><Link href="/room-composer">Open Plan a Room</Link></div>}
        </section>
        <div className="stitch-project-title"><h2>Saved Products</h2><Link href="/handover"><MessageSquare size={16} /> Expert consultation</Link></div>
        <section className="stitch-project-products">
          {displayed.length ? displayed.map((product) => <article key={product.id}><Link href={`/furniture/${product.slug}`}><Image src={roomSceneProductImage(product.id)} alt={product.name} width={520} height={360} /><small>{product.modelCode}</small><strong>{product.name}</strong><span>Saved by you</span></Link><AlternativeFinderButton productId={product.id} label="Find a Better Match" className="" /></article>) : <div className="stitch-project-empty"><h3>No products saved yet</h3><p>Only products you explicitly save will appear here.</p><Link href="/furniture">Explore furniture</Link></div>}
        </section>
        <section className="stitch-project-resource-index" aria-label="Saved journey resources">
          <Link href="/furniture"><strong>{savedIds.length}</strong><span>Saved products</span></Link>
          <Link href={project ? `/my-musterring/projects/${project.id}` : "/my-musterring"}><strong>{resourceCounts.configurations}</strong><span>Configurations</span></Link>
          <Link href="/compare"><strong>{resourceCounts.comparisons}</strong><span>Comparisons</span></Link>
          <Link href="/room-composer"><strong>{resourceCounts.roomScenes}</strong><span>Room scenes</span></Link>
          <Link href="/materials"><strong>{resourceCounts.materials}</strong><span>Materials</span></Link>
          <Link href={fitHref}><strong>{resourceCounts.fitReports}</strong><span>Fit reports</span></Link>
          <Link href="/dealers"><strong>{preferredDealer?.name ?? "Select"}</strong><span>Preferred retailer</span></Link>
          <Link href="/handover"><strong>{resourceCounts.requests}</strong><span>Retailer requests</span></Link>
          <Link href="/analytics"><strong>View</strong><span>Website analytics</span></Link>
        </section>
        {lead ? <section className="card card-body" aria-label="Latest retailer request"><p className="eyebrow">Latest retailer request</p><h2>{String(lead.requestType)}</h2><p>Reference {String(lead.reference)} · {String(lead.appointment)}</p></section> : null}
      </div>
    </div>
  );
}
