"use client";

import Link from "next/link";
import { Copy, Download, Share2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { dealers, materials, products } from "@/lib/data";
import { storage } from "@/lib/persistence";
import type { Project } from "@/lib/types";

export function ProjectDetailClient({ seedProject }: { seedProject: Project }) {
  const [project, setProject] = useState(seedProject);
  const [notice, setNotice] = useState("");
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setProject(storage.projects().find((item) => item.id === seedProject.id) ?? seedProject);
    setHydrated(true);
  }, [seedProject]);
  const savedProducts = products.filter((item) => (hydrated ? storage.savedProducts() : project.savedProductIds).includes(item.id) || project.savedProductIds.includes(item.id));
  const configurations = hydrated ? storage.configurations() : [];
  const comparison = hydrated ? storage.savedComparisons() : [];
  const roomScenes = hydrated ? storage.roomScenes() : [];
  const fitReports = hydrated ? storage.fitReports() : [];
  const savedMaterials = materials.filter((material) => hydrated && storage.savedMaterials().includes(material.id));
  const lead = hydrated ? storage.lastLead() : null;
  const dealer = dealers.find((item) => item.id === (lead?.dealerId ?? (hydrated ? storage.selectedDealer() : project.preferredDealerId)));
  const persist = (next: Project) => {
    storage.saveProject(next);
    setProject(next);
  };
  const summary = useMemo(() => ({
    products: savedProducts.length,
    configurations: configurations.length,
    comparisons: comparison.length,
    scenes: roomScenes.length,
    fitReports: fitReports.length,
    materials: savedMaterials.length
  }), [savedProducts.length, configurations.length, comparison.length, roomScenes.length, fitReports.length, savedMaterials.length]);
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">{project.archived ? "Archived" : project.status}</p>
        <h1 className="h2">{project.name}</h1>
        <p className="lead">{project.notes || "Your locally saved Musterring planning resources."}</p>
        <div className="grid grid-3">
          {Object.entries(summary).map(([name, count]) => <div className="card card-body" key={name}><strong>{count}</strong><span>{name}</span></div>)}
          <div className="card card-body"><strong>{dealer?.name ?? "Not selected"}</strong><span>Preferred retailer</span></div>
          <div className="card card-body"><strong>{String(lead?.requestType ?? "No request")}</strong><span>{String(lead?.reference ?? "Retailer request")}</span></div>
          <div className="card card-body"><strong>{String(lead?.appointment ?? "Not booked")}</strong><span>Appointment</span></div>
        </div>
        {configurations.length ? <div className="section"><h2>Saved configurations</h2><div className="chips">{configurations.map((configuration) => {
          const product = products.find((item) => item.id === configuration.productId);
          return product ? <Link className="button ghost" key={configuration.id} href="/handover">Continue {configuration.id} with a retailer</Link> : null;
        })}</div></div> : <div className="card card-body"><h2>No configurations yet</h2><Link href="/furniture">Explore furniture</Link></div>}
        <div className="chips" style={{ marginTop: 24 }}>
          <button className="button ghost" onClick={() => {
            const name = window.prompt("Project name", project.name)?.trim();
            if (name) persist({ ...project, name, updatedAt: new Date().toISOString() });
          }}>Rename</button>
          <button className="button ghost" onClick={() => {
            const copy = { ...project, id: `project-${Date.now()}`, name: `${project.name} Copy`, updatedAt: new Date().toISOString() };
            storage.saveProject(copy);
            setNotice("Project duplicated.");
          }}><Copy size={16} /> Duplicate</button>
          <button className="button ghost" onClick={() => persist({ ...project, archived: !project.archived, updatedAt: new Date().toISOString() })}>{project.archived ? "Restore" : "Archive"}</button>
          <button className="button ghost" onClick={async () => {
            await navigator.clipboard?.writeText(`${location.origin}/my-musterring/projects/${project.id}`);
            setNotice("Project link copied.");
          }}><Share2 size={16} /> Share</button>
          <button className="button ghost" onClick={() => window.print()}><Download size={16} /> Export Summary</button>
          <button className="button ghost" onClick={() => {
            if (!window.confirm(`Delete ${project.name}?`)) return;
            storage.deleteProject(project.id);
            setNotice("Project deleted from this browser.");
          }}><Trash2 size={16} /> Delete</button>
          <Link className="button consult" href="/handover">Continue with a Musterring Retailer</Link>
        </div>
        {notice ? <p role="status" className="card card-body">{notice}</p> : null}
      </div>
    </section>
  );
}
