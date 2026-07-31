"use client";

import Image from "next/image";
import Link from "next/link";
import { Maximize2, MessageSquare, Plus, Send, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { dealers, materials, products } from "@/lib/data";
import { productImages } from "@/lib/musterring-assets";
import type { Project } from "@/lib/types";
import { storage } from "@/lib/persistence";
import { AlternativeFinderButton } from "./AlternativeFinderButton";

export function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [lead, setLead] = useState<Record<string, unknown> | null>(null);
  const [resourceCounts, setResourceCounts] = useState({ fitReports: 0, roomScenes: 0, comparisons: 0, configurations: 0, materials: 0, requests: 0 });
  const [dealerId, setDealerId] = useState<string | null>(null);
  const [savedMaterialIds, setSavedMaterialIds] = useState<string[]>([]);
  useEffect(() => {
    setProjects(storage.projects());
    setSavedIds(storage.savedProducts());
    setLead(storage.lastLead());
    setResourceCounts({ fitReports: storage.fitReports().length, roomScenes: storage.roomScenes().length, comparisons: storage.comparisons().length, configurations: storage.configurations().length, materials: storage.savedMaterials().length, requests: storage.leads().length });
    setDealerId(storage.selectedDealer());
    setSavedMaterialIds(storage.savedMaterials());
  }, []);
  const project = projects[0];
  const featured = products.filter((product) => savedIds.includes(product.id));
  const displayed = featured.length ? featured.slice(0, 3) : products.filter((product) => product.active).slice(0, 3);
  const preferredDealer = dealers.find((dealer) => dealer.id === dealerId);
  const savedMaterialNames = materials.filter((material) => savedMaterialIds.includes(material.id)).map((material) => material.name);
  const create = () => {
    const next: Project = { id: `project-${Date.now()}`, name: "New Room Project", status: "Ideas Saved", coverImage: "/stitch-assets/original/room-living.jpg", savedProductIds: storage.savedProducts(), savedConfigurationIds: storage.configurations().map((configuration) => configuration.id), savedComparisonIds: [], notes: "", updatedAt: new Date().toISOString(), demoData: true };
    storage.saveProject(next); setProjects(storage.projects()); storage.track({ name: "project_created", projectId: next.id });
  };
  return (
    <div className="stitch-project">
      <header className="container stitch-project-head">
        <div><p className="eyebrow">My Musterring · {project?.status ?? "Ideas Saved"}</p><h1>{project?.name ?? "Living Room Project"}</h1><p>{project?.notes || "Your saved planning journey from product discovery to retailer consultation."}</p></div>
        <div><button><Share2 size={16} /> Share with designer</button><Link href="/handover"><Send size={16} /> Send to retailer</Link></div>
      </header>
      <div className="container">
        <section className="stitch-project-hero">
          <div><Image src="/stitch-assets/original/room-living.jpg" alt="Integrated living room project" fill sizes="(max-width: 700px) 100vw, 66vw" /><Maximize2 /><span><small>Inspirational room visualization</small><strong>Living Room Project</strong></span></div>
          <aside><p className="eyebrow">Will It Fit Tool</p><h2>Project resources</h2><dl><div><dt>Fit reports</dt><dd>{resourceCounts.fitReports}</dd></div><div><dt>Room scenes</dt><dd>{resourceCounts.roomScenes}</dd></div><div><dt>Comparisons</dt><dd>{resourceCounts.comparisons}</dd></div></dl><Link href={`/will-it-fit/${displayed[0]?.slug}`}>Adjust measurements →</Link></aside>
        </section>
        <section className="stitch-project-resource-index" aria-label="Saved journey resources">
          <Link href="/furniture"><strong>{savedIds.length}</strong><span>Saved products</span></Link>
          <Link href={project ? `/my-musterring/projects/${project.id}` : "/my-musterring"}><strong>{resourceCounts.configurations}</strong><span>Configurations</span></Link>
          <Link href="/compare"><strong>{resourceCounts.comparisons}</strong><span>Comparisons</span></Link>
          <Link href="/room-composer"><strong>{resourceCounts.roomScenes}</strong><span>Room scenes</span></Link>
          <Link href="/materials"><strong>{resourceCounts.materials}</strong><span>Materials</span></Link>
          <Link href={`/will-it-fit/${displayed[0]?.slug}`}><strong>{resourceCounts.fitReports}</strong><span>Fit reports</span></Link>
          <Link href="/dealers"><strong>{preferredDealer?.name ?? "Select"}</strong><span>Preferred retailer</span></Link>
          <Link href="/handover"><strong>{resourceCounts.requests}</strong><span>Retailer requests</span></Link>
        </section>
        <div className="stitch-project-title"><h2>Saved Configurations</h2><Link href="/handover"><MessageSquare size={16} /> Expert consultation</Link></div>
        <section className="stitch-project-products">
          {displayed.map((product) => <article key={product.id}><Link href={`/furniture/${product.slug}`}><Image src={productImages(product.id)[0]} alt={product.name} width={520} height={360} /><small>{product.modelCode}</small><strong>{product.name}</strong><span>{featured.some((item) => item.id === product.id) ? "Saved to this browser" : "Suggested starting point"}</span></Link><AlternativeFinderButton productId={product.id} label="Find a Better Match" className="" /></article>)}
        </section>
        <section className="stitch-project-bottom">
          <div><h2>Material Palette</h2><div className="stitch-palette">{(savedMaterialNames.length ? savedMaterialNames : ["No saved material yet"]).map((item, index) => <span key={item}><i className={`palette-${index + 1}`} /><small>{item}</small></span>)}</div></div>
          <aside><small>Notes</small><p>{project?.notes || "Add planning notes before continuing with a retailer."}</p><Link href={project ? `/my-musterring/projects/${project.id}` : "/my-musterring"}>Open project details <Plus size={16} /></Link></aside>
        </section>
        {lead ? <section className="card card-body" aria-label="Latest retailer request"><p className="eyebrow">Latest retailer request</p><h2>{String(lead.requestType)}</h2><p>Reference {String(lead.reference)} · {String(lead.appointment)}</p></section> : null}
        <button className="stitch-create-project" onClick={create}><Plus size={16} /> Create another project</button>
      </div>
    </div>
  );
}
