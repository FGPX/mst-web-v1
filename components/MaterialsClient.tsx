"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, GitCompare, Heart, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { materials, products } from "@/lib/data";
import { materialImages } from "@/lib/material-assets";
import { storage } from "@/lib/persistence";
import { MaterialAdvisor } from "./MaterialAdvisor";

type Filter = "all" | "easyCare" | "familyFriendly" | "petFriendly";
type AdvisorResult = { materialIds: string[]; requestText: string };

export function MaterialsClient() {
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [advisorResult, setAdvisorResult] = useState<AdvisorResult | null>(null);

  useEffect(() => setSaved(storage.savedMaterials()), []);

  const visibleMaterials = useMemo(
    () => materials.filter((material) => {
      const matchesAdvice = !advisorResult || advisorResult.materialIds.includes(material.id);
      const matchesFilter = filter === "all" || material[filter];
      return matchesAdvice && matchesFilter;
    }),
    [advisorResult, filter]
  );

  const toggleCompare = (id: string) => {
    setNotice("");
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) {
        setNotice("Compare up to three materials.");
        return current;
      }
      return [...current, id];
    });
  };

  const toggleSaved = (id: string, name: string, isSaved: boolean) => {
    const action = isSaved ? "remove" : "save";
    if (!window.confirm(`Confirm you want to ${action} ${name}${isSaved ? " from" : " to"} your project?`)) return;
    setSaved(storage.toggleMaterial(id));
  };

  const compared = materials.filter((material) => selected.includes(material.id));

  return (
    <main className="materials-page">
      <section className="materials-hero">
        <div className="container">
          <p className="materials-kicker">Materials &amp; finishes</p>
          <h1>Compare textures, care and<br />compatibility</h1>
          <p>Explore our curated selection of planning materials and their recorded care attributes.<br />Find a suitable match for your home and everyday needs.</p>
        </div>
      </section>

      <div className="container materials-content">
        <MaterialAdvisor hideMaterialCards onRecommendationsChange={setAdvisorResult} />

        <section className="materials-catalogue" aria-labelledby="materials-catalogue-title">
          <header className="materials-catalogue-head">
            <div className="materials-catalogue-label">
              <p id="materials-catalogue-title">{advisorResult ? "Recommended materials" : "Curated selection"}</p>
              {advisorResult ? <span className="materials-catalogue-result">
                <strong>{visibleMaterials.length}</strong>
                <span><b>{visibleMaterials.length === 1 ? "Match" : "Matches"} found</b><small>for “{advisorResult.requestText}”</small></span>
              </span> : null}
            </div>
            <div className="materials-catalogue-actions">
              {advisorResult ? <button type="button" className="materials-clear-results" onClick={() => setAdvisorResult(null)}>Show all materials</button> : null}
              <Link href="/my-musterring#saved-materials"><Heart size={14} fill={saved.length ? "currentColor" : "none"} /> Saved materials ({saved.length})</Link>
              <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}><SlidersHorizontal size={14} /> Filter</button>
            </div>
          </header>

          {filtersOpen ? (
            <div className="materials-filters" aria-label="Material filters">
              {([
                ["all", "All materials"],
                ["easyCare", "Easy care"],
                ["familyFriendly", "Family friendly"],
                ["petFriendly", "Pet friendly"]
              ] as const).map(([value, label]) => (
                <button key={value} type="button" className={filter === value ? "is-active" : ""} onClick={() => setFilter(value)}>{label}</button>
              ))}
            </div>
          ) : null}

          {notice ? <p role="alert" className="materials-notice">{notice}</p> : null}

          <div className="materials-grid">
            {visibleMaterials.map((material) => {
              const isSaved = saved.includes(material.id);
              const isSelected = selected.includes(material.id);
              const compatibleCount = products.filter((product) => product.active && product.materials.includes(material.id)).length;
              const badges = [material.easyCare ? "Easy care" : null, material.familyFriendly ? "Family friendly" : null, material.petFriendly ? "Pet friendly" : null].filter(Boolean) as string[];

              return (
                <article className={`material-card${isSelected ? " is-selected" : ""}`} key={material.id}>
                  <div className="material-card-media">
                    <Image src={materialImages[material.id]} alt={`${material.name} material texture`} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                    <div className="material-card-badges">{badges.slice(0, 2).map((badge) => <span key={badge}>{badge}</span>)}</div>
                  </div>

                  <div className="material-card-body">
                    <div className="material-card-title">
                      <div><p>{material.type} · {material.colorFamily}</p><h2>{material.name}</h2></div>
                      <button type="button" aria-label={isSaved ? `Remove ${material.name} from saved materials` : `Save ${material.name}`} onClick={() => toggleSaved(material.id, material.name, isSaved)}><Heart size={20} fill={isSaved ? "currentColor" : "none"} /></button>
                    </div>

                    <div className="material-summary">
                      <p><strong>Composition</strong>{material.composition} · {material.texture}</p>
                      <p><strong>Care</strong>{material.maintenance}</p>
                      <p><strong>Suitable for</strong>{material.recommendedUses.join(" · ")}</p>
                      <p><strong>Consider</strong>{material.cautions.join(" · ")}</p>
                    </div>

                    <div className="material-metrics">
                      <div><span>Durability <em>{material.durability}/5</em></span><i><b style={{ width: `${material.durability * 20}%` }} /></i></div>
                      <div><span>Care <em>{material.easyCare ? "Easy care" : "Follow guidance"}</em></span><i><b className="care-bar" style={{ width: material.easyCare ? "82%" : "48%" }} /></i></div>
                    </div>

                    <div className="material-card-actions">
                      <Link href={`/handover?request=material&material=${encodeURIComponent(material.id)}`}>Request sample <span aria-hidden="true">◎</span></Link>
                      <button type="button" onClick={() => toggleCompare(material.id)} aria-pressed={isSelected}><GitCompare size={14} /> {isSelected ? "Selected" : "Compare"}</button>
                    </div>
                    <small>{compatibleCount ? `${compatibleCount} compatible products recorded` : "No compatible products recorded"}</small>
                  </div>
                </article>
              );
            })}
            {!visibleMaterials.length ? <div className="materials-empty-results"><h2>No matching materials</h2><p>No available catalogue material matched this request and the active filter.</p><button type="button" onClick={() => { setAdvisorResult(null); setFilter("all"); }}>Show all materials</button></div> : null}
          </div>
        </section>

        {compared.length ? (
          <section className="materials-comparison" aria-label="Material comparison">
            <p className="materials-kicker">Selected comparison</p><h2>Material characteristics</h2>
            <div className="stitch-compare-rows">{["type", "colorFamily", "texture", "composition", "durability", "lightSensitivity", "care"].map((field) => <div key={field}><b>{field}</b>{compared.map((material) => <span key={material.id}>{String(material[field as keyof typeof material])}</span>)}</div>)}</div>
            <p role="status"><Check size={16} /> {compared.length} material{compared.length === 1 ? "" : "s"} selected.</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
