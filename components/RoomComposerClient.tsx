"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { Box, Check, ChevronLeft, ChevronRight, Copy, Grid3X3, Layers, Lock, Plus, Printer, Redo2, RotateCw, Save, Send, Share2, Trash2, Unlock, Upload } from "lucide-react";
import { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { products } from "@/lib/data";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import type { RoomAnalysis } from "@/lib/ai/schemas";
import type { Project } from "@/lib/types";

type ComposerCategory = "seating" | "armchair" | "storage" | "tables";

const roomBackgrounds = [
  { id: "neutral", name: "Neutral studio", src: "" },
  { id: "natural", name: "Natural living", src: "/stitch-assets/original/room-living-clean.jpg" },
  { id: "city", name: "City lounge", src: "/musterring-catalog/mr-2875/image-01.jpg" },
  { id: "soft", name: "Soft retreat", src: "/musterring-catalog/mr-1370/image-01.jpg" }
] as const;

const generatedTurntableSlugs = new Set(["mr-alena", "mr-lia", "mr-281", "mr-2665", "mr-4100", "mr-5100", "mr-kleo", "mr-5111", "mr-720", "mr-9445"]);
const generatedRearViewSlugs = new Set(["justb-pm100", "justb-pm200"]);
const physicalFrontSlugs = new Set(["justb-pm100", "justb-pm200", "mr-kleo", "mr-nils", "mr-pamela", "mr-281", "mr-9445", "jana", "kanto"]);
const verifiedComposerSlugs = new Set(["justb-pm100", "justb-ct100", "nara", "mr-260", "mr-270", "mr-kleo", "mr-nils", "mr-pamela", "mr-281", "mr-9445", "jana", "kanto"]);
const composerDimensionLabels: Record<string, string> = {
  "mr-260": "3-seat catalogue reference",
  "mr-270": "3-seat catalogue reference"
};
const generatedCutoutSlugs = new Set([
  ...generatedTurntableSlugs,
  "justb-pm100",
  "justb-pm200",
  "mr-lucia",
  "mr-230",
  "mr-260",
  "mr-270",
  "mr-280",
  "mr-285",
  "mr-nils",
  "mr-pamela",
  "mr-231",
  "jana",
  "kanto",
  "justb-ct100",
  "nara"
]);
const generatedViews = (slug: string) => {
  if (generatedTurntableSlugs.has(slug)) {
    // Only the catalogue-grounded front cutout is exposed. Generated rotations
    // can introduce modules or geometry that are not present in the product.
    const filename = physicalFrontSlugs.has(slug) ? "physical-front.png" : "official-front.png";
    return [`/generated-product-views/${slug}/${filename}?v=1`];
  }
  if (generatedRearViewSlugs.has(slug)) {
    if (slug === "justb-pm100") {
      return [
        "/generated-product-views/justb-pm100/physical-front.png?v=1",
        "/generated-product-views/justb-pm100/physical-back-v3.png?v=1"
      ];
    }
    return [`/generated-product-views/${slug}/physical-front.png?v=1`];
  }
  return [];
};

type ComposerFinish = {
  materialId: string;
  materialLabel: string;
  color: string;
  image: string;
};

// Only finishes documented for these catalogue models are offered here. Each
// option has its own cutout so the room preview follows the selected finish.
const composerFinishes: Record<string, ComposerFinish[]> = {
  "justb-ct100": [
    { materialId: "ct100-light-wild-oak", materialLabel: "Light wild oak veneer", color: "natural oak", image: "/generated-product-views/justb-ct100/official-front.png?v=4" },
    { materialId: "ct100-black-oak", materialLabel: "Black oak veneer, lacquered", color: "black oak", image: "/generated-product-views/justb-ct100/physical-black-oak.png?v=1" }
  ],
  "nara": [
    { materialId: "nara-dekton-sirius", materialLabel: "Dekton Sirius", color: "dark stone", image: "/generated-product-views/nara/physical-dark-stone.png?v=1" },
    { materialId: "nara-natural-oak", materialLabel: "Natural oak", color: "natural oak", image: "/generated-product-views/nara/physical-natural-oak.png?v=1" },
    { materialId: "nara-knotty-oak", materialLabel: "Knotty oak", color: "knotty oak", image: "/generated-product-views/nara/physical-knotty-oak.png?v=1" }
  ]
};

type SceneItem = {
  id: string;
  productId: string;
  x: number;
  y: number;
  rotation: number;
  viewIndex?: number;
  scale: number;
  materialId?: string;
  color?: string;
  locked?: boolean;
  zIndex?: number;
};

type SavedScene = {
  id?: string;
  version?: number;
  sceneScale?: number;
  items?: SceneItem[];
};

export function RoomComposerClient({ upload = false, openPresentationScene = false }: { upload?: boolean; openPresentationScene?: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const roomInputRef = useRef<HTMLInputElement>(null);
  const activeProducts = useMemo(
    () => products
      .filter((product) => product.active)
      .sort((left, right) => Number(!generatedCutoutSlugs.has(left.slug)) - Number(!generatedCutoutSlugs.has(right.slug))),
    []
  );
  const [category, setCategory] = useState<ComposerCategory>("seating");
  const [productQuery, setProductQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [roomBackgroundId, setRoomBackgroundId] = useState<(typeof roomBackgrounds)[number]["id"]>("neutral");
  const [items, setItems] = useState<SceneItem[]>([
    { id: "scene-product-1", productId: activeProducts[0].id, x: 50, y: 86, rotation: 0, scale: 1, materialId: activeProducts[0].materials[0], color: activeProducts[0].colors[0], zIndex: 1 }
  ]);
  const [history, setHistory] = useState<SceneItem[][]>([]);
  const [future, setFuture] = useState<SceneItem[][]>([]);
  const [selectedId, setSelectedId] = useState(items[0].id);
  const [grid, setGrid] = useState(true);
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [roomPreview, setRoomPreview] = useState("");
  const [uploadConsent, setUploadConsent] = useState(!upload);
  const [uploadError, setUploadError] = useState("");
  const [planningMode, setPlanningMode] = useState<"inspiration" | "accurate">("inspiration");
  const [showBefore, setShowBefore] = useState(false);
  const [versions, setVersions] = useState(0);
  const [savedVersions, setSavedVersions] = useState<SavedScene[]>([]);
  const [sceneScale, setSceneScale] = useState(1);
  const [roomSize, setRoomSize] = useState({ widthMm: 5600, lengthMm: 4200 });
  const [roomAnalysis, setRoomAnalysis] = useState<RoomAnalysis | null>(null);
  const [composerNotice, setComposerNotice] = useState("");
  useEffect(() => {
    storage.track({ name: "room_composer_started" });
    const scenes = storage.roomScenes() as SavedScene[];
    setVersions(scenes.length);
    setSavedVersions(scenes);
    if (openPresentationScene) {
      const presentation = scenes.find((scene) => scene.id === "scene-presentation-living");
      if (presentation?.items?.length) {
        setItems(presentation.items);
        setSelectedId(presentation.items[0].id);
        setSaved(true);
      }
    }
  }, [openPresentationScene]);

  const categoryMatches = (productCategory: string) => {
    if (category === "seating") return productCategory === "sofa" || productCategory === "sectional";
    if (category === "armchair") return productCategory === "armchair";
    if (category === "storage") return ["storage", "wardrobe", "bedroom-series"].includes(productCategory);
    return ["coffee-table", "dining-table", "small-furniture"].includes(productCategory);
  };
  const catalog = activeProducts.filter((product) => categoryMatches(product.category)
    && generatedCutoutSlugs.has(product.slug)
    && `${product.modelCode} ${product.name} ${product.subtitle}`.toLowerCase().includes(productQuery.toLowerCase()));
  const visibleCatalog = catalog.slice(0, visibleCount);
  const selectedBackground = roomBackgrounds.find((background) => background.id === roomBackgroundId) ?? roomBackgrounds[0];
  const composerImage = (productId: string) => {
    const product = activeProducts.find((item) => item.id === productId);
    if (product && physicalFrontSlugs.has(product.slug)) return `/generated-product-views/${product.slug}/physical-front.png?v=1`;
    if (product && generatedCutoutSlugs.has(product.slug)) return `/generated-product-views/${product.slug}/official-front.png?v=4`;
    const images = productImages(productId);
    return images.find((image) => image.toLowerCase().endsWith(".png")) ?? images[0];
  };
  const sceneItemImage = (productId: string, viewIndex = 0, materialId?: string, color?: string) => {
    const product = activeProducts.find((item) => item.id === productId);
    const views = product ? generatedViews(product.slug) : [];
    if (views.length) return views[viewIndex % views.length];
    const finishes = product ? composerFinishes[product.slug] : undefined;
    const finish = finishes?.find((option) => option.materialId === materialId)
      ?? finishes?.find((option) => option.color === color)
      ?? finishes?.[0];
    if (finish) return finish.image;
    if (product && generatedCutoutSlugs.has(product.slug) && !generatedTurntableSlugs.has(product.slug)) return composerImage(productId);
    if (viewIndex === 0) return composerImage(productId);
    const images = productImages(productId);
    return images[viewIndex % images.length] ?? composerImage(productId);
  };
  const productViewCount = (productId: string) => {
    const product = activeProducts.find((item) => item.id === productId);
    if (!product) return 1;
    const views = generatedViews(product.slug);
    if (views.length) return views.length;
    if (generatedCutoutSlugs.has(product.slug)) return 1;
    return productImages(productId).length;
  };
  const selected = items.find((item) => item.id === selectedId);
  const pushHistory = () => {
    setHistory((current) => [...current.slice(-9), items]);
    setFuture([]);
  };
  const updateSelected = (patch: Partial<SceneItem>) => {
    if (!selected) return;
    pushHistory();
    setItems((current) => current.map((item) => item.id === selected.id ? { ...item, ...patch } : item));
  };
  const addProduct = (productId: string) => {
    pushHistory();
    const id = `scene-${Date.now()}`;
    const product = activeProducts.find((item) => item.id === productId) ?? activeProducts[0];
    const finish = composerFinishes[product.slug]?.[0];
    setItems((current) => {
      const topLayer = Math.max(0, ...current.map((item) => item.zIndex ?? 0)) + 1;
      return [...current, { id, productId, x: 44 + ((current.length * 8) % 24), y: 86, rotation: 0, scale: 1, materialId: finish?.materialId ?? product.materials[0], color: finish?.color ?? product.colors[0], zIndex: topLayer }];
    });
    setSelectedId(id);
    setShowBefore(false);
    setSaved(false);
    setComposerNotice(verifiedComposerSlugs.has(product.slug)
      ? `${product.modelCode} was added to the room at catalogue scale.`
      : `${product.modelCode} was added as a visual preview; placement dimensions require retailer confirmation.`);
    requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };
  const replaceSelectedProduct = (productId: string) => {
    if (!selected) return addProduct(productId);
    const product = activeProducts.find((item) => item.id === productId) ?? activeProducts[0];
    const finish = composerFinishes[product.slug]?.[0];
    const topLayer = Math.max(0, ...items.map((item) => item.zIndex ?? 0)) + 1;
    pushHistory();
    setItems((current) => current.map((item) => item.id === selected.id ? { ...item, productId, viewIndex: 0, x: 50, y: 86, scale: 1, zIndex: topLayer, materialId: finish?.materialId ?? product.materials[0], color: finish?.color ?? product.colors[0] } : item));
    setSelectedId(selected.id);
    setShowBefore(false);
    setSaved(false);
    setComposerNotice(verifiedComposerSlugs.has(product.slug)
      ? `${product.modelCode} is now selected at catalogue scale.`
      : `${product.modelCode} is now shown as a visual preview; placement dimensions require retailer confirmation.`);
    requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };
  const chooseBackground = (backgroundId: (typeof roomBackgrounds)[number]["id"]) => {
    if (roomPreview) URL.revokeObjectURL(roomPreview);
    setRoomPreview("");
    setRoomAnalysis(null);
    setRoomBackgroundId(backgroundId);
    if (roomInputRef.current) roomInputRef.current.value = "";
    setSaved(false);
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setItems(previous);
    setHistory((current) => current.slice(0, -1));
    setFuture((current) => [items, ...current]);
    setSelectedId(previous.at(-1)?.id ?? "");
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setHistory((current) => [...current, items]);
    setItems(next);
    setFuture((current) => current.slice(1));
  };
  const move = (event: ReactPointerEvent<HTMLButtonElement>, item: SceneItem) => {
    if (!dragging || dragging !== item.id || !stageRef.current) return;
    const bounds = stageRef.current.getBoundingClientRect();
    if (item.locked) return;
    const rawX = Math.max(8, Math.min(92, ((event.clientX - bounds.left) / bounds.width) * 100));
    const rawY = Math.max(20, Math.min(88, ((event.clientY - bounds.top) / bounds.height) * 100));
    const x = grid ? Math.round(rawX / 2) * 2 : rawX;
    const y = grid ? Math.round(rawY / 2) * 2 : rawY;
    setItems((current) => current.map((candidate) => candidate.id === item.id ? { ...candidate, x, y } : candidate));
  };

  const moveSelectedWithKeyboard = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!selected || selected.locked || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    const target = event.target as HTMLElement;
    if (target.closest(".stitch-composer-properties, .stitch-composer-controls, .stitch-composer-summary")) return;
    event.preventDefault();
    const stepMm = event.shiftKey ? 500 : grid ? 100 : 50;
    const stepX = (stepMm / Math.max(roomSize.widthMm, 1)) * 100;
    const stepY = (stepMm / Math.max(roomSize.lengthMm, 1)) * 100;
    const xDelta = event.key === "ArrowLeft" ? -stepX : event.key === "ArrowRight" ? stepX : 0;
    const yDelta = event.key === "ArrowUp" ? -stepY : event.key === "ArrowDown" ? stepY : 0;
    pushHistory();
    setItems((current) => current.map((item) => item.id === selected.id ? {
      ...item,
      x: Math.max(8, Math.min(92, item.x + xDelta)),
      y: Math.max(20, Math.min(88, item.y + yDelta))
    } : item));
    setSaved(false);
  };

  return (
    <div className="stitch-room-composer">
      <section className="stitch-composer-intro">
        <div className="container">
          <p className="eyebrow">Room planning</p>
          <div>
            <div>
              <h1>Room Composer</h1>
              <p>Visualize Musterring furniture in a premium room scene. Add products, drag them into place, rotate and scale the composition, then save or hand it to a retailer.</p>
            </div>
            <div className="chips">
              <Link className="button ghost" href="/room-planner"><Box size={18} /> Open 3D Room Planner</Link>
              <button className="button consult" disabled={!uploadConsent} onClick={() => roomInputRef.current?.click()}><Upload size={18} /> {upload ? "Choose room photo" : "Upload room photo"}</button>
              <input
                ref={roomInputRef}
                hidden
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  setUploadError("");
                  if (!file) return;
                  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                    setUploadError("Choose a JPG, PNG or WebP image.");
                    return;
                  }
                  if (file.size > 10 * 1024 * 1024) {
                    setUploadError("Choose an image smaller than 10 MB.");
                    return;
                  }
                  const form = new FormData();
                  form.append("image", file);
                  form.append("consent", String(uploadConsent));
                  const validation = await fetch("/api/ai/room", { method: "POST", body: form }).catch(() => null);
                  const payload = validation ? await validation.json().catch(() => null) : null;
                  if (!validation?.ok || !payload?.analysis) {
                    setUploadError(payload?.error ?? "The room analysis could not be completed.");
                    return;
                  }
                  if (roomPreview) URL.revokeObjectURL(roomPreview);
                  setRoomPreview(URL.createObjectURL(file));
                  setRoomAnalysis(payload.analysis);
                  storage.track({ name: "room_analysis_completed" });
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section stitch-composer-workspace">
        <div className="container stitch-composer-layout">
          {upload ? (
            <div className="card card-body" style={{ gridColumn: "1 / -1" }}>
              <p className="eyebrow">Private room upload</p>
              <p>Your photo is processed temporarily for room analysis. It is not saved by this application and can be removed from the preview at any time.</p>
              <label className="chip"><input type="checkbox" checked={uploadConsent} onChange={(event) => {
                setUploadConsent(event.target.checked);
                storage.recordConsent("photo-ai-processing", event.target.checked);
              }} /> I consent to temporary AI processing of this room photo.</label>
              {uploadError ? <p className="form-error" role="alert">{uploadError}</p> : null}
            </div>
          ) : null}
          {upload && roomAnalysis ? (
            <div className="card card-body room-analysis-editor" style={{ gridColumn: "1 / -1" }}>
              <p className="eyebrow">Room analysis</p>
              <p><strong>This analysis supports inspiration. Confirm dimensions with “Will It Fit?” or a Musterring retailer.</strong></p>
              <div className="grid grid-3">
                <label>Room type<input value={roomAnalysis.roomType} onChange={(event) => setRoomAnalysis({ ...roomAnalysis, roomType: event.target.value })} /></label>
                <label>Visible floor region<input value={roomAnalysis.visibleFloorRegion} onChange={(event) => setRoomAnalysis({ ...roomAnalysis, visibleFloorRegion: event.target.value })} /></label>
                <label>Lighting description<input value={roomAnalysis.lightingDescription} onChange={(event) => setRoomAnalysis({ ...roomAnalysis, lightingDescription: event.target.value })} /></label>
                {([
                  ["approximateWallAreas", "Approximate wall areas"],
                  ["windows", "Windows"],
                  ["doors", "Doors"],
                  ["existingMajorFurniture", "Existing major furniture"],
                  ["dominantColors", "Dominant colours"],
                  ["styleTags", "Style tags"]
                ] as const).map(([key, label]) => (
                  <label key={key}>{label}<input value={roomAnalysis[key].join(", ")} onChange={(event) => setRoomAnalysis({ ...roomAnalysis, [key]: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} /></label>
                ))}
              </div>
            </div>
          ) : null}
          <aside className="stitch-composer-library">
            <div className="stitch-composer-library-heading">
              <div><p className="eyebrow">Room background</p><strong>Choose your space</strong></div>
              <button type="button" className="stitch-composer-upload" disabled={!uploadConsent} onClick={() => roomInputRef.current?.click()}><Upload size={15} /> Import</button>
            </div>
            <div className="stitch-composer-backgrounds">
              {roomBackgrounds.map((background) => (
                <button type="button" key={background.id} className={roomBackgroundId === background.id && !roomPreview ? "is-active" : ""} onClick={() => chooseBackground(background.id)}>
                  {background.src ? <Image src={background.src} alt="" width={128} height={82} /> : <span className="stitch-neutral-swatch" />}
                  <small>{background.name}</small>
                </button>
              ))}
              {roomPreview ? <button type="button" className="is-active"><span className="stitch-uploaded-swatch"><Upload size={18} /></span><small>Imported photo</small></button> : null}
            </div>
            <p className="eyebrow">Module categories</p>
            <div className="stitch-composer-tabs">
              <button className={category === "seating" ? "is-active" : ""} onClick={() => { setCategory("seating"); setVisibleCount(12); }}>Seating</button>
              <button className={category === "armchair" ? "is-active" : ""} onClick={() => setCategory("armchair")}>Armchairs</button>
              <button className={category === "storage" ? "is-active" : ""} onClick={() => setCategory("storage")}>Storage</button>
              <button className={category === "tables" ? "is-active" : ""} onClick={() => setCategory("tables")}>Tables</button>
            </div>
            <div className="stitch-composer-catalog-heading"><p className="eyebrow">Available products</p><span>{catalog.length} models</span></div>
            <input className="stitch-composer-search" type="search" value={productQuery} onChange={(event) => { setProductQuery(event.target.value); setVisibleCount(12); }} placeholder="Search model or product" aria-label="Search products" />
            <div className="stitch-composer-products">
              {visibleCatalog.map((product) => {
                const hasVerifiedDimensions = verifiedComposerSlugs.has(product.slug);
                return (
                  <article key={product.id}>
                    <div className={`stitch-composer-product-media ${composerImage(product.id).toLowerCase().endsWith(".png") ? "is-cutout" : "is-scene"}`}><Image src={composerImage(product.id)} alt={`${product.modelCode} product crop`} width={280} height={200} /><span>Product focus</span></div>
                    <div className="stitch-composer-product-copy">
                      <span>{product.modelCode}</span>
                      <strong>{product.name}</strong>
                      <small>{product.subtitle}</small>
                      {hasVerifiedDimensions ? <small>{composerDimensionLabels[product.slug] ?? "Catalogue dimensions ready for room placement"}</small> : <small>Visual preview only · dimensions require retailer confirmation</small>}
                      {product.authorizedContent && product.sourceUrl ? <a href={product.sourceUrl} target="_blank" rel="noreferrer">Official Musterring product</a> : null}
                    </div>
                    <div className="stitch-composer-product-actions">
                      <button type="button" onClick={() => addProduct(product.id)}><Plus size={14} /> {hasVerifiedDimensions ? "Add to room" : "Add visual preview"}</button>
                      {selected ? <button type="button" className="ghost replace" onClick={() => replaceSelectedProduct(product.id)}>Replace selected</button> : null}
                    </div>
                  </article>
                );
              })}
            </div>
            {visibleCount < catalog.length ? <button type="button" className="stitch-composer-show-more" onClick={() => setVisibleCount((count) => count + 12)}>Show 12 more</button> : null}
          </aside>

          <div>
            {composerNotice ? <p className="stitch-composer-feedback" role="status"><Check size={16} /> {composerNotice}</p> : null}
            <div className="stitch-composer-toolbar">
              <button className={planningMode === "accurate" ? "is-active" : ""} onClick={() => setPlanningMode((mode) => mode === "accurate" ? "inspiration" : "accurate")}>{planningMode === "accurate" ? "Accurate Planning Mode" : "Inspiration Mode"}</button>
              <button onClick={undo} disabled={!history.length}>Undo</button>
              <button onClick={redo} disabled={!future.length}><Redo2 size={15} /> Redo</button>
              <label className="stitch-composer-global-scale">
                <span>All items</span>
                <input aria-label="Scale all room items together" type="range" min="55" max="145" step="5" value={Math.round(sceneScale * 100)} onChange={(event) => { setSceneScale(Number(event.target.value) / 100); setSaved(false); }} />
                <strong>{Math.round(sceneScale * 100)}%</strong>
              </label>
              <details className="stitch-composer-more-tools">
                <summary>More tools</summary>
                <div>
                  <button className={grid ? "is-active" : ""} onClick={() => setGrid((value) => !value)}><Grid3X3 size={16} /> Grid: {grid ? "on" : "off"}</button>
                  <span>Snap: 10 cm</span>
                  {roomPreview ? <button onClick={() => setShowBefore((value) => !value)}>{showBefore ? "Show designed room" : "Show before"}</button> : null}
                  <button onClick={() => window.print()}><Printer size={15} /> Print</button>
                  <button onClick={async () => { await navigator.clipboard?.writeText(`${location.origin}/room-composer`); }}><Share2 size={15} /> Share</button>
                  <button onClick={() => { setItems([]); setSelectedId(""); }}>Clear room</button>
                  {roomPreview ? <button onClick={() => {
                    URL.revokeObjectURL(roomPreview);
                    setRoomPreview("");
                    setRoomAnalysis(null);
                    if (roomInputRef.current) roomInputRef.current.value = "";
                  }}>Remove room photo</button> : null}
                </div>
              </details>
            </div>
            {planningMode === "accurate" ? <div className="chips" aria-label="Room dimensions"><label className="chip">Room width mm<input type="number" value={roomSize.widthMm} onChange={(event) => setRoomSize({ ...roomSize, widthMm: Number(event.target.value) })} /></label><label className="chip">Room length mm<input type="number" value={roomSize.lengthMm} onChange={(event) => setRoomSize({ ...roomSize, lengthMm: Number(event.target.value) })} /></label></div> : null}
            <div className="stitch-composer-stage-with-sidebar">
              <div ref={stageRef} className={`stitch-composer-stage ${grid ? "has-grid" : ""}`} tabIndex={0} aria-label="Room scene. Select a product and use the arrow keys to move it." onKeyDown={moveSelectedWithKeyboard}>
              {roomPreview ? (
                // Blob URLs are local room previews and cannot use the Next image optimizer.
                // eslint-disable-next-line @next/next/no-img-element
                <img className="stitch-composer-room" src={roomPreview} alt="Uploaded room scene" />
              ) : selectedBackground.src ? (
                <Image className="stitch-composer-room" src={selectedBackground.src} alt={selectedBackground.name} fill priority sizes="(max-width: 900px) 100vw, 75vw" />
              ) : (
                <div className="stitch-composer-neutral-room" aria-label="Neutral studio background"><span /><i /></div>
              )}
              <div className="stitch-composer-shade" />
              {!showBefore ? items.map((item) => {
                const product = activeProducts.find((candidate) => candidate.id === item.productId) ?? activeProducts[0];
                const turntableViews = generatedViews(product.slug);
                const generatedTurntable = turntableViews.length
                  ? turntableViews[(item.viewIndex ?? 0) % turntableViews.length]
                  : undefined;
                const hasVerifiedDimensions = verifiedComposerSlugs.has(product.slug);
                const relativeWidth = hasVerifiedDimensions
                  ? (product.widthMm / Math.max(roomSize.widthMm, 1)) * 100 * sceneScale
                  : (["sofa", "sectional"].includes(product.category) ? 42 : 22) * sceneScale;
                return (
                  <button
                    key={item.id}
                    className={`stitch-composer-item has-physical-aspect ${["sofa", "sectional"].includes(product.category) ? "is-sofa" : ""} ${selectedId === item.id ? "is-selected" : ""} ${generatedCutoutSlugs.has(product.slug) || sceneItemImage(product.id, item.viewIndex, item.materialId, item.color).toLowerCase().split("?")[0].endsWith(".png") ? "is-cutout" : "is-scene-crop"}`}
                    style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${relativeWidth}%`, aspectRatio: hasVerifiedDimensions ? `${product.widthMm} / ${product.heightMm}` : (["sofa", "sectional"].includes(product.category) ? "16 / 7" : "1 / 1"), zIndex: item.zIndex, transform: `translate(-50%, -100%) rotate(${item.rotation}deg)` }}
                    onPointerDown={(event) => {
                      pushHistory();
                      setSelectedId(item.id);
                      setDragging(item.id);
                      event.currentTarget.setPointerCapture(event.pointerId);
                    }}
                    onPointerMove={(event) => move(event, item)}
                    onPointerUp={() => setDragging(null)}
                  >
                    {generatedTurntable ? <Image className="stitch-composer-turntable" src={generatedTurntable} alt={`${product.name}, catalogue view`} width={520} height={360} draggable={false} style={{ objectFit: product.slug === "mr-kleo" ? "contain" : "fill" }} /> : <Image src={sceneItemImage(product.id, item.viewIndex, item.materialId, item.color)} alt={`${product.name}, catalogue view`} width={420} height={240} draggable={false} style={{ objectFit: "fill" }} />}
                  </button>
                );
              }) : null}

              {selected ? (
                <div className="stitch-composer-controls">
                  <button aria-label="Rotate selected product" onClick={() => updateSelected({ rotation: selected.rotation + 15 })}><RotateCw /></button>
                  <button aria-label="Duplicate selected product" onClick={() => {
                    pushHistory();
                    const topLayer = Math.max(0, ...items.map((item) => item.zIndex ?? 0)) + 1;
                    const copy = { ...selected, id: `scene-${Date.now()}`, x: Math.min(92, selected.x + 4), y: Math.min(88, selected.y + 4), zIndex: topLayer };
                    setItems((current) => [...current, copy]);
                    setSelectedId(copy.id);
                  }}><Copy /></button>
                  <button aria-label={selected.locked ? "Unlock selected product" : "Lock selected product"} onClick={() => updateSelected({ locked: !selected.locked })}>{selected.locked ? <Unlock /> : <Lock />}</button>
                  <button aria-label="Bring selected product forward" onClick={() => updateSelected({ zIndex: Math.max(...items.map((item) => item.zIndex ?? 1)) + 1 })}><Layers /></button>
                  <button aria-label="Remove selected product" onClick={() => { pushHistory(); setItems((current) => current.filter((item) => item.id !== selected.id)); setSelectedId(""); }}><Trash2 /></button>
                </div>
              ) : null}
            </div>

              {selected ? (
                <div className="stitch-composer-properties">
                  <div className="stitch-composer-angle-control">
                    <span>Product views</span>
                    <strong>{productViewCount(selected.productId) > 1 ? ((selected.viewIndex ?? 0) % productViewCount(selected.productId)) + 1 : 1} / {productViewCount(selected.productId)}</strong>
                    <button type="button" aria-label="Previous product view" disabled={productViewCount(selected.productId) < 2} onClick={() => {
                      const count = productViewCount(selected.productId);
                      updateSelected({ viewIndex: ((selected.viewIndex ?? 0) - 1 + count) % count });
                    }}><ChevronLeft size={16} /></button>
                    <button type="button" aria-label="Next product view" disabled={productViewCount(selected.productId) < 2} onClick={() => {
                      const count = productViewCount(selected.productId);
                      updateSelected({ viewIndex: ((selected.viewIndex ?? 0) + 1) % count });
                    }}><ChevronRight size={16} /></button>
                  </div>
                  <div className="stitch-composer-relative-size"><span>{(() => { const product = activeProducts.find((item) => item.id === selected.productId); return product && verifiedComposerSlugs.has(product.slug) ? composerDimensionLabels[product.slug] ?? "Dimension-proportional size" : "Visual preview only"; })()}</span><strong>{(() => { const product = activeProducts.find((item) => item.id === selected.productId); return product && verifiedComposerSlugs.has(product.slug) ? `W ${Math.round(product.widthMm / 10)} × D ${Math.round(product.depthMm / 10)} × H ${Math.round(product.heightMm / 10)} cm` : "Dimensions require retailer confirmation"; })()}</strong></div>
                  <small className="stitch-composer-keyboard-hint">Move with arrow keys · hold Shift for 50 cm</small>
                  {(() => {
                    const product = activeProducts.find((item) => item.id === selected.productId);
                    const finishes = product ? composerFinishes[product.slug] : undefined;
                    const materialOptions = finishes ?? (product?.materials ?? []).map((id) => ({ materialId: id, materialLabel: id, color: "", image: "" }));
                    const colorOptions = finishes?.map((finish) => finish.color) ?? product?.colors ?? [];
                    return <>
                      <label>Material<select value={selected.materialId ?? ""} onChange={(event) => {
                        const finish = finishes?.find((option) => option.materialId === event.target.value);
                        updateSelected({ materialId: event.target.value, color: finish?.color ?? selected.color });
                      }}>{materialOptions.map((option) => <option value={option.materialId} key={option.materialId}>{option.materialLabel}</option>)}</select></label>
                      <label>Color<select value={selected.color ?? ""} onChange={(event) => {
                        const finish = finishes?.find((option) => option.color === event.target.value);
                        updateSelected({ color: event.target.value, materialId: finish?.materialId ?? selected.materialId });
                      }}>{colorOptions.map((color) => <option value={color} key={color}>{color}</option>)}</select></label>
                    </>;
                  })()}
                </div>
              ) : <div className="stitch-composer-properties is-empty"><strong>Select a product</strong><span>Choose an item in the room to view its dimensions, material, color, and available views.</span></div>}
            </div>

            <div className="stitch-composer-summary">
                <div><small>Total items</small><strong>{String(items.length).padStart(2, "0")} Modules</strong></div>
                <button onClick={() => {
                  if (!window.confirm("Save this room concept to My Musterring?")) return;
                  const version = storage.roomScenes().length + 1;
                  const sceneId = `scene-${Date.now()}`;
                  const savedItems = items.map((item) => {
                    const product = activeProducts.find((candidate) => candidate.id === item.productId);
                    return { ...item, dimensions: product && verifiedComposerSlugs.has(product.slug) ? { widthMm: product.widthMm, depthMm: product.depthMm, heightMm: product.heightMm } : undefined };
                  });
                  storage.saveRoomScene({ id: sceneId, name: "Living Room Concept", version, planningMode, roomSize, sceneScale, backgroundId: roomBackgroundId, backgroundSrc: roomPreview ? undefined : selectedBackground.src, items: savedItems, hasLocalRoomPhoto: Boolean(roomPreview), createdAt: new Date().toISOString() });
                  const existingProject = storage.projects().find((project) => project.id === "project-room-composer");
                  const savedProductIds = [...new Set(items.map((item) => item.productId))];
                  const project: Project = {
                    id: "project-room-composer",
                    name: "Room Composer Project",
                    status: "Ideas Saved",
                    coverImage: roomPreview ? "/stitch-assets/original/room-living-clean.jpg" : selectedBackground.src || "/stitch-assets/original/room-living-clean.jpg",
                    savedProductIds,
                    savedConfigurationIds: existingProject?.savedConfigurationIds ?? [],
                    savedComparisonIds: existingProject?.savedComparisonIds ?? [],
                    notes: `${savedProductIds.length} products saved from Room Composer · Version ${version}`,
                    updatedAt: new Date().toISOString(),
                    demoData: false
                  };
                  storage.saveProject(project);
                  storage.track({ name: "room_scene_saved" });
                  setVersions(version);
                  setSavedVersions(storage.roomScenes() as SavedScene[]);
                  setSaved(true);
                }}><Save size={18} /> {saved ? "Saved to project" : "Save concept"}</button>
                <Link href="/handover"><Send size={18} /> Send concept to retailer</Link>
            </div>
            <p className="stitch-composer-note">{planningMode === "accurate" ? "Accurate Planning Mode preserves entered room and product dimensions, but delivery feasibility must still be confirmed with a Musterring retailer." : "Inspirational visualization — product proportions and colors may vary. Never use this visualization for fit confirmation."} Saved versions: {versions}.</p>
            {savedVersions.length ? <div className="chips" aria-label="Saved room versions">{savedVersions.slice(-4).map((version, index) => <button className="chip" key={version.id ?? index} onClick={() => {
              if (!version.items) return;
              pushHistory();
              setItems(version.items);
              setSceneScale(version.sceneScale ?? 1);
              setSelectedId(version.items[0]?.id ?? "");
            }}>Open version {version.version ?? index + 1}</button>)}</div> : null}
          </div>
        </div>
      </section>

      <section className="section band stitch-engineering-specs">
        <div className="container">
          <div><h2>Planning summary</h2><p>Your room concept stays organized and ready for the next consultation step.</p></div>
          <dl>
            <div><dt>Planning mode</dt><dd>Interactive local composition</dd></div>
            <div><dt>Products</dt><dd>{activeProducts.length} available models</dd></div>
            <div><dt>Privacy</dt><dd>Room state stays in this browser</dd></div>
            <div><dt>Handover</dt><dd>Retailer-ready project summary</dd></div>
          </dl>
        </div>
      </section>
    </div>
  );
}
