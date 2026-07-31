"use client";

import Link from "next/link";
import { ArrowRight, FolderKanban, PackageCheck, Ruler, Sofa } from "lucide-react";
import { useEffect, useState } from "react";
import { storage } from "@/lib/persistence";
import type { Project } from "@/lib/types";

export function PartnerProjectsWorkspace() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [savedProducts, setSavedProducts] = useState(0);
  const [configurations, setConfigurations] = useState(0);
  const [fitReports, setFitReports] = useState(0);

  useEffect(() => {
    setProjects(storage.projects());
    setSavedProducts(storage.savedProducts().length);
    setConfigurations(storage.configurations().length);
    setFitReports(storage.fitReports().length);
  }, []);

  return (
    <>
      <div className="partner-metric-grid">
        <article><FolderKanban /><span>Projects</span><strong>{projects.length}</strong></article>
        <article><Sofa /><span>Saved products</span><strong>{savedProducts}</strong></article>
        <article><PackageCheck /><span>Configurations</span><strong>{configurations}</strong></article>
        <article><Ruler /><span>Fit reports</span><strong>{fitReports}</strong></article>
      </div>
      <section className="partner-panel">
        <header><div><p>Customer workspace</p><h2>Recent projects</h2></div><Link href="/my-musterring">Open full project manager <ArrowRight size={16} /></Link></header>
        <div className="partner-project-list">
          {projects.length ? projects.map((project) => (
            <Link href={`/my-musterring/projects/${project.id}`} key={project.id}>
              <span className="partner-project-initial">{project.name.slice(0, 1)}</span>
              <div><strong>{project.name}</strong><small>Updated {new Date(project.updatedAt).toLocaleDateString()}</small></div>
              <em>{project.status}</em><ArrowRight size={17} />
            </Link>
          )) : <div className="partner-empty-state"><FolderKanban /><h3>No customer projects yet</h3><p>Start with a product or configuration, then save it to a customer project.</p><Link href="/partner/products">Browse products</Link></div>}
        </div>
      </section>
    </>
  );
}
