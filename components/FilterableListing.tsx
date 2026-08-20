"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpDown,
  Award,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  DraftingCompass,
  Eye,
  Grid2X2,
  List
} from "lucide-react";
import { products } from "@/lib/data";
import { productImages } from "@/lib/musterring-assets";
import { productMatches } from "@/lib/search";
import { productHasCategory, type Category, type Product, type SearchFilters } from "@/lib/types";
import { storage } from "@/lib/persistence";
import { categoryDetails, categoryGroups } from "@/lib/catalog-taxonomy";
import { CompareSelectionBar } from "./CompareSelectionBar";

const initialVisibleProducts = 4;

export function FilterableListing() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialFilters = useMemo(() => filtersFromParams(searchParams), [searchParams]);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [visibleCount, setVisibleCount] = useState(initialVisibleProducts);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"recommended" | "width" | "name">("recommended");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [openFilterMenu, setOpenFilterMenu] = useState<"width" | "material" | "more" | null>(null);
  const selectedCategory = filters.category ? categoryDetails[filters.category] : null;

  const results = useMemo(
    () => products.filter((product) =>
      product.active &&
      (!filters.category || productHasCategory(product, filters.category)) &&
      productMatches(product, filters)
    ).sort((left, right) =>
      sort === "width" ? left.widthMm - right.widthMm : sort === "name" ? left.modelCode.localeCompare(right.modelCode) : 0
    ),
    [filters, sort]
  );

  useEffect(() => setFilters(initialFilters), [initialFilters]);
  useEffect(() => setVisibleCount(initialVisibleProducts), [filters]);

  const syncUrl = (nextFilters: SearchFilters) => {
    const params = new URLSearchParams();
    if (nextFilters.category) params.set("category", nextFilters.category);
    if (nextFilters.maxWidthMm) params.set("maxWidthCm", String(Math.round(nextFilters.maxWidthMm / 10)));
    if (nextFilters.maxDepthMm) params.set("maxDepthCm", String(Math.round(nextFilters.maxDepthMm / 10)));
    if (nextFilters.minSeatHeightMm) params.set("minSeatHeightCm", String(Math.round(nextFilters.minSeatHeightMm / 10)));
    if (nextFilters.maxSeatDepthMm) params.set("maxSeatDepthCm", String(Math.round(nextFilters.maxSeatDepthMm / 10)));
    if (nextFilters.seatCount) params.set("seats", String(nextFilters.seatCount));
    if (nextFilters.modular) params.set("modular", "true");
    if (nextFilters.smallSpaceSuitable) params.set("smallSpaceSuitable", "true");
    if (nextFilters.relaxFunction) params.set("relax", "true");
    if (nextFilters.electricFunctions) params.set("electric", "true");
    if (nextFilters.materials?.length) params.set("materials", nextFilters.materials.join(","));
    if (nextFilters.colors?.length) params.set("colors", nextFilters.colors.join(","));
    if (nextFilters.styles?.length) params.set("styles", nextFilters.styles.join(","));
    if (nextFilters.collections?.length) params.set("collections", nextFilters.collections.join(","));
    router.replace(params.size ? `${pathname}?${params.toString()}` : pathname, { scroll: false });
  };

  const set = (patch: SearchFilters) => {
    storage.track({ name: "filter_applied" });
    const next = { ...filters, ...patch };
    setFilters(next);
    syncUrl(next);
  };

  const clear = () => {
    const next: SearchFilters = filters.category ? { category: filters.category } : {};
    setFilters(next);
    syncUrl(next);
  };

  const toggleMaterial = (materialId: string, checked: boolean) => {
    const current = filters.materials ?? [];
    const materials = checked
      ? Array.from(new Set([...current, materialId]))
      : current.filter((id) => id !== materialId);
    set({ materials: materials.length ? materials : undefined });
  };

  const toggleFilterMenu = (menu: "width" | "material" | "more", open: boolean) => {
    setOpenFilterMenu((current) => open ? menu : current === menu ? null : current);
  };

  return (
    <div className="stitch-catalog">
      <section className="stitch-catalog-hero">
        <div className="stitch-catalog-hero-copy">
          <nav className="stitch-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/furniture">Furniture</Link><span>/</span>
            <span>{selectedCategory?.label ?? "All Furniture"}</span>
          </nav>
          <h1>
            {selectedCategory?.label ?? "Furniture Collections"} -
            <span>{selectedCategory?.headline ?? "Designed for every room."}</span>
          </h1>
          <p>
            {selectedCategory?.description ?? "Choose a room and product category to explore the connected Musterring catalogue."}
          </p>
        </div>
        <div className="stitch-view-toggle" aria-label="Product view">
          <button
            className={view === "grid" ? "is-active" : ""}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            <Grid2X2 size={21} />
          </button>
          <button
            className={view === "list" ? "is-active" : ""}
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <List size={22} />
          </button>
        </div>
      </section>

      <section className="stitch-filter-bar" aria-label="Product filters">
        <button className="stitch-mobile-filter-trigger" aria-expanded={filterOpen} aria-controls="catalog-filter-controls" onClick={() => setFilterOpen(true)}>Open filters</button>
        <div className="stitch-filter-inner">
          <div className={`stitch-filter-controls ${filterOpen ? "is-open" : ""}`} id="catalog-filter-controls">
            <button className="stitch-mobile-filter-close" onClick={() => setFilterOpen(false)}>Close filters</button>
            <span className="stitch-filter-label">Filter by</span>
            <details className="stitch-filter-menu" open={openFilterMenu === "width"} onToggle={(event) => toggleFilterMenu("width", event.currentTarget.open)}>
              <summary>
                Width{filters.maxWidthMm ? ` · ≤ ${Math.round(filters.maxWidthMm / 10)} cm` : ""}
                <ChevronDown size={15} />
              </summary>
              <div className="stitch-filter-popover">
                <label htmlFor="catalog-width">Maximum width in cm</label>
                <input
                  id="catalog-width"
                  min="80"
                  max="400"
                  placeholder="e.g. 240"
                  type="number"
                  value={filters.maxWidthMm ? filters.maxWidthMm / 10 : ""}
                  onChange={(event) => set({
                    maxWidthMm: event.target.value ? Number(event.target.value) * 10 : undefined
                  })}
                />
              </div>
            </details>
            <details className="stitch-filter-menu" open={openFilterMenu === "material"} onToggle={(event) => toggleFilterMenu("material", event.currentTarget.open)}>
              <summary>
                Material{filters.materials?.length ? ` · ${filters.materials.length}` : ""}
                <ChevronDown size={15} />
              </summary>
              <div className="stitch-filter-popover stitch-filter-options">
                {[
                  ["mat-sand-weave", "Sand weave"],
                  ["mat-taupe-chenille", "Taupe chenille"],
                  ["mat-stone-micro", "Stone microfiber"],
                  ["mat-graphite-easy", "Graphite easy-care"]
                ].map(([id, label]) => (
                  <label key={id}>
                    <input
                      checked={filters.materials?.includes(id) ?? false}
                      type="checkbox"
                      onChange={(event) => toggleMaterial(id, event.target.checked)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </details>
            <label className={`stitch-filter-pill ${filters.relaxFunction ? "is-active" : ""}`}>
              <input
                checked={Boolean(filters.relaxFunction)}
                type="checkbox"
                onChange={(event) => set({ relaxFunction: event.target.checked || undefined })}
              />
              Relax function
            </label>
            <label className={`stitch-filter-pill ${filters.modular ? "is-active" : ""}`}>
              <input
                checked={Boolean(filters.modular)}
                type="checkbox"
                onChange={(event) => set({ modular: event.target.checked || undefined })}
              />
              Modular
            </label>
            <details className="stitch-filter-menu" open={openFilterMenu === "more"} onToggle={(event) => toggleFilterMenu("more", event.currentTarget.open)}>
              <summary>More filters <ChevronDown size={15} /></summary>
              <div className="stitch-filter-popover stitch-filter-options stitch-advanced-filters">
                <label>Category<select value={filters.category ?? ""} onChange={(event) => set({ category: event.target.value ? event.target.value as Category : undefined })}><option value="">All furniture</option>{categoryGroups.flatMap((group) => group.categories).map((item) => <option value={item} key={item}>{categoryDetails[item].label}</option>)}</select></label>
                <label>Maximum depth cm<input type="number" value={filters.maxDepthMm ? filters.maxDepthMm / 10 : ""} onChange={(event) => set({ maxDepthMm: event.target.value ? Number(event.target.value) * 10 : undefined })} /></label>
                <label>Minimum seat height cm<input type="number" value={filters.minSeatHeightMm ? filters.minSeatHeightMm / 10 : ""} onChange={(event) => set({ minSeatHeightMm: event.target.value ? Number(event.target.value) * 10 : undefined })} /></label>
                <label>Maximum seat depth cm<input type="number" value={filters.maxSeatDepthMm ? filters.maxSeatDepthMm / 10 : ""} onChange={(event) => set({ maxSeatDepthMm: event.target.value ? Number(event.target.value) * 10 : undefined })} /></label>
                <label>Seats<select value={filters.seatCount ?? ""} onChange={(event) => set({ seatCount: event.target.value ? Number(event.target.value) : undefined })}><option value="">Any</option>{[1, 2, 3, 4].map((count) => <option key={count}>{count}</option>)}</select></label>
                <label>Color<select value={filters.colors?.[0] ?? ""} onChange={(event) => set({ colors: event.target.value ? [event.target.value] : undefined })}><option value="">Any</option>{[...new Set(products.flatMap((product) => product.verifiedFacts.colors))].map((color) => <option key={color}>{color}</option>)}</select></label>
                <label>Style<select value={filters.styles?.[0] ?? ""} onChange={(event) => set({ styles: event.target.value ? [event.target.value] : undefined })}><option value="">Any</option>{[...new Set(products.flatMap((product) => product.verifiedFacts.styles))].map((style) => <option key={style}>{style}</option>)}</select></label>
                <label>Collection<select value={filters.collections?.[0] ?? ""} onChange={(event) => set({ collections: event.target.value ? [event.target.value] : undefined })}><option value="">Any</option>{[...new Set(products.map((product) => product.collection))].map((collection) => <option key={collection}>{collection}</option>)}</select></label>
                <label><input type="checkbox" checked={Boolean(filters.electricFunctions)} onChange={(event) => set({ electricFunctions: event.target.checked || undefined })} /> Electric function</label>
                <label><input type="checkbox" checked={Boolean(filters.smallSpaceSuitable)} onChange={(event) => set({ smallSpaceSuitable: event.target.checked || undefined })} /> Small-space suitable</label>
              </div>
            </details>
          </div>
          <div className="stitch-filter-status">
            <span className="stitch-results-count"><strong>{results.length}</strong> collections</span>
            <label className="stitch-sort-control">
              <ArrowUpDown size={15} aria-hidden="true" />
              <span>Sort by</span>
              <select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
                <option value="recommended">Recommended</option>
                <option value="width">Narrowest first</option>
                <option value="name">Model name</option>
              </select>
            </label>
            <button className="stitch-clear-filters" onClick={clear}>Clear all</button>
          </div>
        </div>
      </section>

      <section className="stitch-catalog-products">
        {results.length ? (
          <>
            <div className={`stitch-catalog-grid ${view === "list" ? "is-list" : ""}`}>
              {results.slice(0, visibleCount).map((product) => (
                <CatalogProductCard key={product.id} product={product} compareSelected={compareIds.includes(product.id)} onCompare={() => setCompareIds((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : current.length < 3 ? [...current, product.id] : current)} />
              ))}
            </div>
            {visibleCount < results.length ? (
              <div className="stitch-load-more">
                <button onClick={() => setVisibleCount((count) => count + 4)}>Load More Collections</button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="stitch-catalog-empty">
            <h2>No {selectedCategory?.label.toLowerCase() ?? "furniture"} are connected yet.</h2>
            <p>{filters.category ? "Import this Musterring category to add its official products." : "Clear the filters to return to the complete collection."}</p>
            <button onClick={clear}>Clear all filters</button>
          </div>
        )}
      </section>
      <CompareSelectionBar ids={compareIds} onClear={() => setCompareIds([])} />

      <section className="stitch-consultation">
        <div className="stitch-consultation-inner">
          <div className="stitch-consultation-copy">
            <h2>Expert planning for your interior.</h2>
            <p>
              Our furniture is as unique as your home. Let our interior design experts help you
              configure the perfect sofa system for your space.
            </p>
            <div>
              <Link className="stitch-consultation-primary" href="/dealers">
                <CalendarDays size={20} /> Book a Consultation
              </Link>
              <Link className="stitch-consultation-secondary" href="/room-composer">
                Virtual Showroom
              </Link>
            </div>
          </div>
          <div className="stitch-service-cards">
            <article>
              <Award size={42} />
              <h3>5-Year Guarantee</h3>
              <p>Quality Assurance</p>
            </article>
            <article>
              <DraftingCompass size={42} />
              <h3>3D Planning</h3>
              <p>Millimeter Precise</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

function CatalogProductCard({ product, compareSelected, onCompare }: { product: Product; compareSelected: boolean; onCompare: () => void }) {
  const image = productImages(product.id)[0];
  const configurable = ["sofa", "armchair", "sectional"].includes(product.category);
  const availableColors = product.verifiedFacts.colors;
  const [selectedColor, setSelectedColor] = useState(availableColors[0] ?? "");
  const [showAllColors, setShowAllColors] = useState(false);
  const colorStyle = (color: string) => {
    const value = color.toLowerCase();
    if (value.includes("beige") || value.includes("sand")) return "#dfceb7";
    if (value.includes("grey") || value.includes("gray") || value.includes("graphite")) return "#55575b";
    if (value.includes("cognac") || value.includes("brown")) return "#8b553b";
    if (value.includes("green") || value.includes("olive")) return "#74745a";
    if (value.includes("blue")) return "#667784";
    if (value.includes("black")) return "#252525";
    if (value.includes("white") || value.includes("cream")) return "#eee9df";
    return "#b9afa2";
  };
  return (
    <article className="stitch-catalog-card">
      <div className="stitch-catalog-image">
        <Link href={`/furniture/${product.slug}`} aria-label={`View ${product.name}`}>
          <Image
            src={image}
            alt={`${product.name} ${(product.categories ?? [product.category]).map((category) => categoryDetails[category].label.toLowerCase()).join(" and ")}`}
            fill
            unoptimized
            sizes="(max-width: 760px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </Link>
        <div className="stitch-config-preview stitch-config-preview-compact">
          <div>
            <p>Quick Configuration</p>
            {availableColors.length ? <div className="stitch-config-swatches" aria-label="Verified material colours">
              {availableColors.slice(0, 3).map((color) => <button type="button" key={color} className={selectedColor === color ? "is-selected" : ""} style={{ background: colorStyle(color) }} title={color} aria-label={`Select ${color}`} onClick={() => setSelectedColor(color)} />)}
              {availableColors.length > 3 ? <button type="button" className="is-more" aria-expanded={showAllColors} onClick={() => setShowAllColors((value) => !value)}>+{availableColors.length - 3}</button> : null}
            </div> : <small>Colour options are configuration dependent.</small>}
            {showAllColors ? <div className="stitch-config-color-menu">{availableColors.map((color) => <button type="button" key={color} onClick={() => { setSelectedColor(color); setShowAllColors(false); }}><i style={{ background: colorStyle(color) }} />{color}</button>)}</div> : null}
            {selectedColor ? <small className="stitch-selected-color">Selected: {selectedColor}</small> : null}
            <div className="stitch-config-action">
              <span>Review verified product information</span>
              <div>
                <Link className="stitch-view-product-action" href={`/furniture/${product.slug}`}>
                  <Eye size={16} /> View Product
                </Link>
                {configurable ? <Link className="stitch-configure-action" href="/handover">Plan with Retailer</Link> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="stitch-catalog-card-copy">
        <div>
          <Link className="stitch-catalog-title" href={`/furniture/${product.slug}`}>
            <h2>{product.modelCode}</h2>
          </Link>
          <p>{product.subtitle}</p>
        </div>
        <div className="stitch-catalog-card-links">
          <label className={`stitch-card-compare${compareSelected ? " is-selected" : ""}`}><input type="checkbox" checked={compareSelected} onChange={onCompare} /> {compareSelected ? "Selected" : "Compare"}</label>
          <Link className="stitch-card-view-link" href={`/furniture/${product.slug}`}>
            <Eye size={17} /> View product
          </Link>
          <Link href="/dealers">Find near you <ChevronRight size={18} /></Link>
        </div>
      </div>
      <details className="stitch-catalog-more">
        <summary>More details <ChevronDown size={15} /></summary>
        <dl>
          <div><dt>Collection</dt><dd>{product.collection}</dd></div>
          <div><dt>Dimensions</dt><dd>{product.verifiedFacts.dimensions ? `${Math.round(product.widthMm / 10)} × ${Math.round(product.depthMm / 10)} × ${Math.round(product.heightMm / 10)} cm` : "Configuration dependent"}</dd></div>
          <div><dt>Seats</dt><dd>{product.numberOfSeatsVerified ? product.numberOfSeats : "Configuration dependent"}</dd></div>
          <div><dt>Materials</dt><dd>{product.verifiedFacts.materialTypes.join(", ") || "Configuration dependent"}</dd></div>
          <div><dt>Configuration</dt><dd>{product.verifiedFacts.modular ? "Modular" : product.verifiedFacts.functions[0] ?? "Configuration dependent"}</dd></div>
        </dl>
      </details>
    </article>
  );
}

function filtersFromParams(params: URLSearchParams): SearchFilters {
  return {
    category: params.get("category") as Category || undefined,
    maxWidthMm: params.get("maxWidthCm") ? Number(params.get("maxWidthCm")) * 10 : undefined,
    maxDepthMm: params.get("maxDepthCm") ? Number(params.get("maxDepthCm")) * 10 : undefined,
    minSeatHeightMm: params.get("minSeatHeightCm") ? Number(params.get("minSeatHeightCm")) * 10 : undefined,
    maxSeatDepthMm: params.get("maxSeatDepthCm") ? Number(params.get("maxSeatDepthCm")) * 10 : undefined,
    seatCount: params.get("seats") ? Number(params.get("seats")) : undefined,
    modular: params.get("modular") === "true" ? true : undefined,
    smallSpaceSuitable: params.get("smallSpaceSuitable") === "true" ? true : undefined,
    relaxFunction: params.get("relax") === "true" ? true : undefined,
    electricFunctions: params.get("electric") === "true" ? true : undefined,
    materials: params.get("materials")?.split(",").filter(Boolean),
    colors: params.get("colors")?.split(",").filter(Boolean),
    styles: params.get("styles")?.split(",").filter(Boolean),
    collections: params.get("collections")?.split(",").filter(Boolean)
  };
}
